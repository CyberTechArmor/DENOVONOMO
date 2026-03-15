#!/usr/bin/env bash
# =============================================================================
# De Novo NoMo — Installer
# Single-command deployment script for the De Novo NoMo application.
# Installs Docker, nginx, generates config, and launches the stack.
# =============================================================================
set -euo pipefail

# ---------------------------------------------------------------------------
# Color helpers
# ---------------------------------------------------------------------------
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

info()    { echo -e "${CYAN}[INFO]${NC}  $*"; }
success() { echo -e "${GREEN}[OK]${NC}    $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC}  $*"; }
error()   { echo -e "${RED}[ERROR]${NC} $*"; }
fatal()   { error "$*"; exit 1; }

# ---------------------------------------------------------------------------
# Banner
# ---------------------------------------------------------------------------
echo -e "${BOLD}${CYAN}"
echo "======================================================"
echo "       De Novo NoMo — Installer"
echo "======================================================"
echo -e "${NC}"

# ---------------------------------------------------------------------------
# Root check
# ---------------------------------------------------------------------------
if [[ $EUID -ne 0 ]]; then
    fatal "This script must be run as root (use sudo)."
fi

# ---------------------------------------------------------------------------
# Determine project directory (where this script lives)
# ---------------------------------------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"
info "Project directory: ${SCRIPT_DIR}"

# ---------------------------------------------------------------------------
# 1. Check / Install Docker
# ---------------------------------------------------------------------------
install_docker() {
    info "Installing Docker via official repository..."
    apt-get update -qq
    apt-get install -y -qq ca-certificates curl gnupg lsb-release >/dev/null

    # Add Docker GPG key
    install -m 0755 -d /etc/apt/keyrings
    if [[ ! -f /etc/apt/keyrings/docker.gpg ]]; then
        curl -fsSL https://download.docker.com/linux/$(. /etc/os-release && echo "$ID")/gpg \
            | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
        chmod a+r /etc/apt/keyrings/docker.gpg
    fi

    # Add Docker apt repository
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
      https://download.docker.com/linux/$(. /etc/os-release && echo "$ID") \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
      > /etc/apt/sources.list.d/docker.list

    apt-get update -qq
    apt-get install -y -qq docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin >/dev/null
    success "Docker installed successfully."
}

if command -v docker &>/dev/null; then
    success "Docker is already installed ($(docker --version))."
else
    warn "Docker not found."
    install_docker
fi

# Check Docker Compose (plugin or standalone)
if docker compose version &>/dev/null; then
    success "Docker Compose plugin detected."
elif command -v docker-compose &>/dev/null; then
    success "Docker Compose standalone detected."
    # Create a shim so we can consistently use 'docker compose'
    warn "Using standalone docker-compose. Consider upgrading to the Docker Compose plugin."
else
    warn "Docker Compose not found."
    install_docker
fi

# ---------------------------------------------------------------------------
# 2. Check / Install nginx on the host
# ---------------------------------------------------------------------------
if command -v nginx &>/dev/null; then
    success "nginx is already installed ($(nginx -v 2>&1))."
else
    info "Installing nginx..."
    apt-get update -qq
    apt-get install -y -qq nginx >/dev/null
    success "nginx installed."
fi

# Ensure nginx directories exist
mkdir -p /etc/nginx/sites-available /etc/nginx/sites-enabled

# ---------------------------------------------------------------------------
# 3. Prompt for configuration
# ---------------------------------------------------------------------------
echo ""
echo -e "${BOLD}Configuration${NC}"
echo "------------------------------"

read -rp "Domain name (e.g. denovonomo.example.com): " DOMAIN
while [[ -z "${DOMAIN:-}" ]]; do
    error "Domain name cannot be empty."
    read -rp "Domain name: " DOMAIN
done

read -rp "Admin email: " ADMIN_EMAIL
while [[ -z "${ADMIN_EMAIL:-}" ]]; do
    error "Admin email cannot be empty."
    read -rp "Admin email: " ADMIN_EMAIL
done

read -rp "Application port [3000]: " APP_PORT
APP_PORT="${APP_PORT:-3000}"

# Validate port is numeric
if ! [[ "$APP_PORT" =~ ^[0-9]+$ ]]; then
    fatal "Port must be a number."
fi

echo ""
info "Domain:     ${DOMAIN}"
info "Admin email: ${ADMIN_EMAIL}"
info "App port:    ${APP_PORT}"
echo ""

# ---------------------------------------------------------------------------
# 4. Generate secrets
# ---------------------------------------------------------------------------
info "Generating secure secrets..."

# 32-character admin password (alphanumeric + special chars)
ADMIN_PASSWORD="$(openssl rand -base64 48 | tr -dc 'A-Za-z0-9!@#$%&*' | head -c 32)"

# 64-character session secret
SESSION_SECRET="$(openssl rand -base64 96 | tr -dc 'A-Za-z0-9' | head -c 64)"

# 32-character database password (alphanumeric only for safety with connection strings)
DB_PASSWORD="$(openssl rand -base64 48 | tr -dc 'A-Za-z0-9' | head -c 32)"

success "Secrets generated."

# ---------------------------------------------------------------------------
# 5. Generate .env file
# ---------------------------------------------------------------------------
info "Writing .env file..."

cat > "${SCRIPT_DIR}/.env" <<ENVFILE
# =============================================================================
# De Novo NoMo — Environment Configuration
# Generated by install.sh on $(date -u +"%Y-%m-%dT%H:%M:%SZ")
# =============================================================================

# --- Application ---
NODE_ENV=production
APP_PORT=${APP_PORT}
APP_URL=https://${DOMAIN}

# --- Database ---
DB_HOST=db
DB_PORT=5432
DB_USER=denovonomo
DB_PASSWORD=${DB_PASSWORD}
DB_NAME=denovonomo

# --- Postgres container (must match DB vars above) ---
POSTGRES_USER=denovonomo
POSTGRES_PASSWORD=${DB_PASSWORD}
POSTGRES_DB=denovonomo

# --- Session ---
SESSION_SECRET=${SESSION_SECRET}

# --- Admin bootstrap ---
ADMIN_EMAIL=${ADMIN_EMAIL}
ADMIN_PASSWORD=${ADMIN_PASSWORD}
ENVFILE

# Lock down permissions on .env (contains secrets)
chmod 600 "${SCRIPT_DIR}/.env"
success ".env file created at ${SCRIPT_DIR}/.env"

# ---------------------------------------------------------------------------
# 6. Generate and install nginx configuration
# ---------------------------------------------------------------------------
info "Configuring nginx..."

NGINX_CONF_TEMPLATE="${SCRIPT_DIR}/nginx/denovonomo.conf.template"
NGINX_CONF_AVAILABLE="/etc/nginx/sites-available/denovonomo.conf"
NGINX_CONF_ENABLED="/etc/nginx/sites-enabled/denovonomo.conf"

if [[ ! -f "$NGINX_CONF_TEMPLATE" ]]; then
    fatal "nginx config template not found at ${NGINX_CONF_TEMPLATE}"
fi

# Check for existing TLS certificates
CERT_PATH="/etc/letsencrypt/live/${DOMAIN}/fullchain.pem"
KEY_PATH="/etc/letsencrypt/live/${DOMAIN}/privkey.pem"
HAS_EXISTING_CERTS=false

if [[ -f "$CERT_PATH" && -f "$KEY_PATH" ]]; then
    HAS_EXISTING_CERTS=true
    success "Found existing TLS certificates for ${DOMAIN}"
fi

# Generate nginx config from template
sed -e "s/__DOMAIN__/${DOMAIN}/g" \
    -e "s/__APP_PORT__/${APP_PORT}/g" \
    "$NGINX_CONF_TEMPLATE" > "$NGINX_CONF_AVAILABLE"

# If existing certs found, add SSL server block
if [[ "$HAS_EXISTING_CERTS" == true ]]; then
    cat >> "$NGINX_CONF_AVAILABLE" <<SSLBLOCK

server {
    listen 443 ssl http2;
    server_name ${DOMAIN};

    ssl_certificate ${CERT_PATH};
    ssl_certificate_key ${KEY_PATH};
    include /etc/nginx/snippets/ssl-params.conf;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_min_length 256;
    gzip_vary on;

    location / {
        proxy_pass http://127.0.0.1:${APP_PORT};
        proxy_http_version 1.1;

        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        # WebSocket support
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";

        proxy_read_timeout 86400;
    }
}
SSLBLOCK

    # Also add HTTP -> HTTPS redirect
    sed -i '/listen 80;/a\    # Redirect HTTP to HTTPS\n    return 301 https://$host$request_uri;' "$NGINX_CONF_AVAILABLE"
    # Remove the proxy block from the HTTP server since we're redirecting
    # We do this by replacing the HTTP server block entirely
    cat > "$NGINX_CONF_AVAILABLE" <<FULLCONF
server {
    listen 80;
    server_name ${DOMAIN};
    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ${DOMAIN};

    ssl_certificate ${CERT_PATH};
    ssl_certificate_key ${KEY_PATH};
    include /etc/nginx/snippets/ssl-params.conf;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_min_length 256;
    gzip_vary on;

    location / {
        proxy_pass http://127.0.0.1:${APP_PORT};
        proxy_http_version 1.1;

        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        # WebSocket support
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";

        proxy_read_timeout 86400;
    }
}
FULLCONF
    success "nginx config written with SSL (using existing certificates)"
else
    success "nginx config written (HTTP only)"
fi

# Symlink into sites-enabled
if [[ -L "$NGINX_CONF_ENABLED" || -f "$NGINX_CONF_ENABLED" ]]; then
    rm -f "$NGINX_CONF_ENABLED"
fi
ln -s "$NGINX_CONF_AVAILABLE" "$NGINX_CONF_ENABLED"
success "Symlinked to ${NGINX_CONF_ENABLED}"

# Remove default site if it exists (avoid port 80 conflict)
if [[ -L /etc/nginx/sites-enabled/default || -f /etc/nginx/sites-enabled/default ]]; then
    rm -f /etc/nginx/sites-enabled/default
    warn "Removed default nginx site."
fi

# Install ssl-params snippet if present in the project
if [[ -f "${SCRIPT_DIR}/nginx/ssl-params.conf" ]]; then
    mkdir -p /etc/nginx/snippets
    cp "${SCRIPT_DIR}/nginx/ssl-params.conf" /etc/nginx/snippets/ssl-params.conf
    success "SSL params snippet installed to /etc/nginx/snippets/ssl-params.conf"
fi

# Test and reload nginx
if nginx -t 2>/dev/null; then
    nginx -s reload 2>/dev/null || systemctl reload nginx 2>/dev/null || true
    success "nginx configuration tested and reloaded."
else
    warn "nginx config test failed. Check /etc/nginx/sites-available/denovonomo.conf"
fi

# ---------------------------------------------------------------------------
# 7. Optional TLS via Certbot (skip if certs already exist)
# ---------------------------------------------------------------------------
if [[ "$HAS_EXISTING_CERTS" == true ]]; then
    success "TLS already configured using existing certificates for ${DOMAIN}"
else
    echo ""
    read -rp "Set up TLS with Let's Encrypt (certbot)? [y/N]: " SETUP_TLS
    if [[ "${SETUP_TLS,,}" == "y" || "${SETUP_TLS,,}" == "yes" ]]; then
        # Install certbot if not present
        if ! command -v certbot &>/dev/null; then
            info "Installing certbot and nginx plugin..."
            apt-get update -qq
            apt-get install -y -qq certbot python3-certbot-nginx >/dev/null
            success "certbot installed."
        else
            success "certbot is already installed."
        fi

        info "Requesting TLS certificate for ${DOMAIN}..."
        certbot --nginx \
            -d "$DOMAIN" \
            --non-interactive \
            --agree-tos \
            -m "$ADMIN_EMAIL"

        success "TLS certificate obtained and nginx configured for HTTPS."

        # Add ssl-params snippet to the certbot-managed SSL block if available
        NGINX_CONF="/etc/nginx/sites-available/denovonomo.conf"
        if [[ -f /etc/nginx/snippets/ssl-params.conf ]] && ! grep -q "ssl-params.conf" "$NGINX_CONF"; then
            sed -i '/ssl_certificate_key/a\    include /etc/nginx/snippets/ssl-params.conf;' "$NGINX_CONF"
            success "SSL hardening params added to nginx config."
        fi

        # Reload nginx after modifications
        nginx -t && { nginx -s reload 2>/dev/null || systemctl reload nginx 2>/dev/null || true; }
        success "nginx reloaded with TLS."
    else
        warn "Skipping TLS setup. You can set it up later with: certbot --nginx -d ${DOMAIN}"
    fi
fi

# ---------------------------------------------------------------------------
# 8. Build and start containers
# ---------------------------------------------------------------------------
echo ""
info "Building and starting Docker containers..."
cd "$SCRIPT_DIR"
docker compose up -d --build

success "Containers started."

# ---------------------------------------------------------------------------
# 9. Wait for application to be healthy
# ---------------------------------------------------------------------------
info "Waiting for the application to become ready (up to 60 seconds)..."

HEALTH_URL="http://127.0.0.1:${APP_PORT}/health"
MAX_WAIT=60
ELAPSED=0

while [[ $ELAPSED -lt $MAX_WAIT ]]; do
    # Try to hit the health endpoint; accept any 2xx response
    if curl -sf -o /dev/null "$HEALTH_URL" 2>/dev/null; then
        success "Application is ready!"
        break
    fi
    sleep 2
    ELAPSED=$((ELAPSED + 2))
    echo -ne "\r  Waiting... ${ELAPSED}s / ${MAX_WAIT}s"
done
echo ""

if [[ $ELAPSED -ge $MAX_WAIT ]]; then
    warn "Health check timed out after ${MAX_WAIT}s."
    warn "The app may still be starting. Check logs with: docker compose logs -f app"
fi

# ---------------------------------------------------------------------------
# 10. Print summary
# ---------------------------------------------------------------------------
echo ""
echo -e "${BOLD}${GREEN}======================================================"
echo "       Installation Complete!"
echo "======================================================${NC}"
echo ""
echo -e "  ${BOLD}Access URL:${NC}    https://${DOMAIN}"
echo -e "  ${BOLD}Admin Email:${NC}   ${ADMIN_EMAIL}"
echo -e "  ${BOLD}Admin Password:${NC} ${ADMIN_PASSWORD}"
echo ""
echo -e "${YELLOW}${BOLD}  WARNING: Change the admin password on first login!${NC}"
echo ""
echo -e "  Useful commands:"
echo -e "    ${CYAN}docker compose logs -f${NC}       — Follow application logs"
echo -e "    ${CYAN}docker compose ps${NC}            — List running containers"
echo -e "    ${CYAN}docker compose restart${NC}        — Restart the stack"
echo ""
echo -e "${GREEN}======================================================${NC}"
