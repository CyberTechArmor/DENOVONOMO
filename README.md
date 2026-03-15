# De Novo NoMo

A self-hosted, Dockerized web application for healthcare primary care practice IT infrastructure planning, decision tracking, costing, and operational checklist management.

## Quick Start

```bash
# Clone the repository
git clone https://github.com/CyberTechArmor/DENOVONOMO.git
cd DENOVONOMO

# Run the installer (requires root/sudo on Ubuntu/Debian)
sudo bash install.sh
```

The installer will:
1. Install Docker and Docker Compose (if not present)
2. Install and configure nginx as a reverse proxy
3. Prompt for your domain name, admin email, and app port
4. Generate secure secrets and a `.env` file
5. Optionally set up TLS with Let's Encrypt (certbot)
6. Build and start the application containers
7. Print your admin credentials on completion

## Manual Setup (without installer)

```bash
git clone https://github.com/CyberTechArmor/DENOVONOMO.git
cd DENOVONOMO

# Copy and edit environment variables
cp .env.example .env
# Edit .env with your database credentials, admin email/password, session secret, etc.

# Build and start with Docker Compose
docker compose up -d --build

# The app will be available at http://localhost:3000
```

## Uninstall

```bash
sudo bash uninstall.sh
```

## Useful Commands

```bash
docker compose logs -f        # Follow application logs
docker compose ps              # List running containers
docker compose restart         # Restart the stack
docker compose down            # Stop containers
docker compose down -v         # Stop containers and delete database volume
```

## Tech Stack

- **Backend:** Node.js / Express, PostgreSQL 16
- **Frontend:** Vanilla HTML/CSS/JS (no frameworks)
- **Real-time:** WebSocket (ws)
- **Auth:** Session-based with TOTP MFA
- **Deployment:** Docker, nginx reverse proxy, Let's Encrypt TLS