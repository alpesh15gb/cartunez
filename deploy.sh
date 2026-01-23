#!/bin/bash

# ===========================================
# Car Tunez VPS Deployment Script
# ===========================================
# Usage: ./deploy.sh [command]
# Commands: setup, deploy, logs, restart, backup, ssl

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="cartunez.in"
EMAIL="admin@cartunez.in"
APP_DIR="/docker/cartunez"
BACKUP_DIR="/opt/backups/cartunez"

echo_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

echo_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

echo_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Setup VPS (run once)
setup() {
    echo_info "Setting up VPS for Car Tunez..."
    
    # Update system
    apt update && apt upgrade -y
    
    # Install Docker
    if ! command -v docker &> /dev/null; then
        echo_info "Installing Docker..."
        curl -fsSL https://get.docker.com | sh
        systemctl enable docker
        systemctl start docker
    fi
    
    # Install Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        echo_info "Installing Docker Compose..."
        curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        chmod +x /usr/local/bin/docker-compose
    fi
    
    # Create directories
    mkdir -p $APP_DIR
    mkdir -p $BACKUP_DIR
    mkdir -p $APP_DIR/nginx/certs
    
    # Setup firewall
    echo_info "Configuring firewall..."
    ufw allow 22/tcp
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw --force enable
    
    # Setup swap (for low-memory VPS)
    if [ ! -f /swapfile ]; then
        echo_info "Setting up swap..."
        fallocate -l 2G /swapfile
        chmod 600 /swapfile
        mkswap /swapfile
        swapon /swapfile
        echo '/swapfile none swap sw 0 0' >> /etc/fstab
    fi
    
    echo_info "VPS setup complete!"
    echo_warn "Don't forget to:"
    echo "  1. Copy your project files to $APP_DIR"
    echo "  2. Create .env.prod with your secrets"
    echo "  3. Run: ./deploy.sh ssl"
    echo "  4. Run: ./deploy.sh deploy"
}

# Get SSL certificate
ssl() {
    echo_info "Obtaining SSL certificate for $DOMAIN..."
    
    # Ensure nginx is stopped
    docker-compose -f docker-compose.prod.yml down nginx 2>/dev/null || true
    
    # Run certbot standalone
    docker run -it --rm \
        -v "$APP_DIR/nginx/certs:/etc/letsencrypt" \
        -v "$APP_DIR/certbot:/var/www/certbot" \
        -p 80:80 \
        certbot/certbot certonly \
        --standalone \
        --preferred-challenges http \
        --email $EMAIL \
        --agree-tos \
        --no-eff-email \
        -d $DOMAIN \
        -d www.$DOMAIN
    
    echo_info "SSL certificate obtained!"
}

# Deploy application
deploy() {
    echo_info "Deploying Car Tunez..."
    
    cd $APP_DIR
    
    # Check for .env.prod
    if [ ! -f .env.prod ]; then
        echo_error ".env.prod not found! Copy .env.prod.example to .env.prod and fill in values."
        exit 1
    fi
    
    # Load environment
    export $(cat .env.prod | grep -v '^#' | xargs)
    
    # Pull latest changes (if using git)
    if [ -d .git ]; then
        echo_info "Pulling latest changes..."
        git pull origin main
    fi
    
    # Build and start containers
    echo_info "Building containers..."
    docker-compose -f docker-compose.prod.yml --env-file .env.prod build
    
    echo_info "Starting containers..."
    docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d
    
    # Wait for services
    echo_info "Waiting for services to start..."
    sleep 30
    
    # Run database migrations
    echo_info "Running database migrations..."
    docker-compose -f docker-compose.prod.yml exec backend npm run migrations:run || true
    
    # Health check
    echo_info "Checking health..."
    sleep 5
    if curl -sf https://$DOMAIN/health > /dev/null; then
        echo_info "Deployment successful! 🎉"
        echo_info "Site is live at: https://$DOMAIN"
    else
        echo_warn "Site may still be starting up..."
        echo "Check logs with: ./deploy.sh logs"
    fi
}

# View logs
logs() {
    cd $APP_DIR
    docker-compose -f docker-compose.prod.yml logs -f $1
}

# Restart services
restart() {
    echo_info "Restarting services..."
    cd $APP_DIR
    docker-compose -f docker-compose.prod.yml --env-file .env.prod restart $1
    echo_info "Services restarted!"
}

# Backup database
backup() {
    echo_info "Backing up database..."
    
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_FILE="$BACKUP_DIR/cartunez_backup_$TIMESTAMP.sql"
    
    cd $APP_DIR
    docker-compose -f docker-compose.prod.yml exec -T postgres pg_dump -U $POSTGRES_USER $POSTGRES_DB > $BACKUP_FILE
    gzip $BACKUP_FILE
    
    echo_info "Backup saved to: ${BACKUP_FILE}.gz"
    
    # Keep only last 7 backups
    ls -t $BACKUP_DIR/*.gz | tail -n +8 | xargs -r rm
}

# Restore database
restore() {
    if [ -z "$1" ]; then
        echo_error "Usage: ./deploy.sh restore <backup_file>"
        exit 1
    fi
    
    echo_warn "This will overwrite the current database! Are you sure? (y/N)"
    read confirm
    if [ "$confirm" != "y" ]; then
        exit 0
    fi
    
    echo_info "Restoring database from $1..."
    
    cd $APP_DIR
    gunzip -c $1 | docker-compose -f docker-compose.prod.yml exec -T postgres psql -U $POSTGRES_USER $POSTGRES_DB
    
    echo_info "Database restored!"
}

# Status check
status() {
    cd $APP_DIR
    docker-compose -f docker-compose.prod.yml ps
}

# Main
case "$1" in
    setup)
        setup
        ;;
    ssl)
        ssl
        ;;
    deploy)
        deploy
        ;;
    logs)
        logs $2
        ;;
    restart)
        restart $2
        ;;
    backup)
        backup
        ;;
    restore)
        restore $2
        ;;
    status)
        status
        ;;
    *)
        echo "Car Tunez Deployment Script"
        echo ""
        echo "Usage: ./deploy.sh [command]"
        echo ""
        echo "Commands:"
        echo "  setup    - Initial VPS setup (run once)"
        echo "  ssl      - Obtain SSL certificate"
        echo "  deploy   - Build and deploy application"
        echo "  logs     - View logs (optional: service name)"
        echo "  restart  - Restart services (optional: service name)"
        echo "  backup   - Backup database"
        echo "  restore  - Restore database from backup"
        echo "  status   - Show container status"
        ;;
esac
