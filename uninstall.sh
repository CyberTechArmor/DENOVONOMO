#!/usr/bin/env bash
# =============================================================================
# De Novo NoMo — Uninstaller
# Tears down the De Novo NoMo application, containers, and configuration.
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
NC='\033[0m'

info()    { echo -e "${CYAN}[INFO]${NC}  $*"; }
success() { echo -e "${GREEN}[OK]${NC}    $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC}  $*"; }
error()   { echo -e "${RED}[ERROR]${NC} $*"; }

# ---------------------------------------------------------------------------
# Banner
# ---------------------------------------------------------------------------
echo -e "${BOLD}${RED}"
echo "======================================================"
echo "       De Novo NoMo — Uninstaller"
echo "======================================================"
echo -e "${NC}"
echo -e "${YELLOW}${BOLD}  WARNING: This will stop the application and remove${NC}"
echo -e "${YELLOW}${BOLD}  its containers, configuration, and optionally all data.${NC}"
echo ""

# ---------------------------------------------------------------------------
# Root check
# ---------------------------------------------------------------------------
if [[ $EUID -ne 0 ]]; then
    error "This script must be run as root (use sudo)."
    exit 1
fi

# ---------------------------------------------------------------------------
# Determine project directory
# ---------------------------------------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# ---------------------------------------------------------------------------
# Initial confirmation
# ---------------------------------------------------------------------------
read -rp "This will delete all data. Are you sure? [y/N]: " CONFIRM
if [[ "${CONFIRM,,}" != "y" && "${CONFIRM,,}" != "yes" ]]; then
    info "Uninstall cancelled."
    exit 0
fi

echo ""

# ---------------------------------------------------------------------------
# 1. Stop and remove containers
# ---------------------------------------------------------------------------
info "Stopping and removing containers..."
if docker compose ps -q &>/dev/null; then
    docker compose down
    success "Containers stopped and removed."
else
    warn "No running containers found (or docker compose not available)."
fi

# ---------------------------------------------------------------------------
# 2. Optionally remove volumes (database data)
# ---------------------------------------------------------------------------
echo ""
read -rp "Remove Docker volumes (deletes all database data)? [y/N]: " REMOVE_VOLUMES
if [[ "${REMOVE_VOLUMES,,}" == "y" || "${REMOVE_VOLUMES,,}" == "yes" ]]; then
    info "Removing volumes..."
    docker compose down -v 2>/dev/null || true
    success "Volumes removed."
else
    warn "Volumes preserved. Data can be reused on reinstall."
fi

# ---------------------------------------------------------------------------
# 3. Remove Docker images
# ---------------------------------------------------------------------------
info "Removing Docker images built for this project..."
IMAGE_IDS="$(docker compose images -q 2>/dev/null || true)"
if [[ -n "$IMAGE_IDS" ]]; then
    docker rmi $IMAGE_IDS 2>/dev/null || true
    success "Docker images removed."
else
    warn "No project images found to remove."
fi

# ---------------------------------------------------------------------------
# 4. Remove nginx configuration
# ---------------------------------------------------------------------------
info "Removing nginx configuration..."

REMOVED_NGINX=false
if [[ -f /etc/nginx/sites-available/denovonomo.conf ]]; then
    rm -f /etc/nginx/sites-available/denovonomo.conf
    REMOVED_NGINX=true
fi
if [[ -L /etc/nginx/sites-enabled/denovonomo.conf || -f /etc/nginx/sites-enabled/denovonomo.conf ]]; then
    rm -f /etc/nginx/sites-enabled/denovonomo.conf
    REMOVED_NGINX=true
fi

if $REMOVED_NGINX; then
    success "nginx configuration removed."
    # Reload nginx to apply the removal
    if command -v nginx &>/dev/null; then
        nginx -s reload 2>/dev/null || systemctl reload nginx 2>/dev/null || true
        success "nginx reloaded."
    fi
else
    warn "No nginx configuration found for denovonomo."
fi

# ---------------------------------------------------------------------------
# 5. Optionally remove TLS certificate
# ---------------------------------------------------------------------------
# Try to determine the domain from .env if it exists
DOMAIN=""
if [[ -f "${SCRIPT_DIR}/.env" ]]; then
    DOMAIN="$(grep -oP '(?<=APP_URL=https://).*' "${SCRIPT_DIR}/.env" 2>/dev/null || true)"
fi

if [[ -n "$DOMAIN" ]] && command -v certbot &>/dev/null; then
    echo ""
    read -rp "Remove Let's Encrypt TLS certificate for ${DOMAIN}? [y/N]: " REMOVE_CERT
    if [[ "${REMOVE_CERT,,}" == "y" || "${REMOVE_CERT,,}" == "yes" ]]; then
        info "Removing TLS certificate..."
        certbot delete --cert-name "$DOMAIN" --non-interactive 2>/dev/null || true
        success "TLS certificate removed."
    else
        warn "TLS certificate preserved."
    fi
fi

# ---------------------------------------------------------------------------
# 6. Remove .env file
# ---------------------------------------------------------------------------
if [[ -f "${SCRIPT_DIR}/.env" ]]; then
    info "Removing .env file..."
    rm -f "${SCRIPT_DIR}/.env"
    success ".env file removed."
fi

# ---------------------------------------------------------------------------
# 7. Optionally remove entire project directory
# ---------------------------------------------------------------------------
echo ""
read -rp "Remove entire project directory (${SCRIPT_DIR})? [y/N]: " REMOVE_PROJECT
if [[ "${REMOVE_PROJECT,,}" == "y" || "${REMOVE_PROJECT,,}" == "yes" ]]; then
    warn "Removing project directory: ${SCRIPT_DIR}"
    # Move out of the directory before deleting it
    cd /
    rm -rf "$SCRIPT_DIR"
    success "Project directory removed."
fi

# ---------------------------------------------------------------------------
# Done
# ---------------------------------------------------------------------------
echo ""
echo -e "${BOLD}${GREEN}======================================================"
echo "       Uninstall Complete"
echo "======================================================${NC}"
echo ""
