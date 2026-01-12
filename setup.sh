#!/bin/bash
# setup.sh

# Exit on error
set -e

echo "==========================================="
echo "   Car Tunez - Magento 2 Auto Setup"
echo "==========================================="

# 1. Check/Backup src directory
if [ -d "src" ] && [ "$(ls -A src)" ]; then
    if [ -f "src/bin/magento" ]; then
        echo "[INFO] Magento seems to be already installed. Skipping backup/clean."
    else
        echo "[ACTION] Backing up Custom Theme files..."
        rm -rf src_backup
        mv src src_backup
        mkdir src
    fi
else
    mkdir -p src
fi

# Fix permissions for Docker (since host is root)
echo "[ACTION] Fixing permissions for src directory..."
chmod 777 src

# 2. Ensure Docker is up
echo "[ACTION] Ensuring Docker containers are running..."
docker compose up -d

# 3. Install Magento
if [ ! -f "src/bin/magento" ]; then
    echo "[ACTION] Starting Magento Installation..."
    echo "-----------------------------------------------------"
    echo "PLEASE NOTE: You will be asked for your Magento Keys."
    echo "             Public Key = Username"
    echo "             Private Key = Password"
    echo "-----------------------------------------------------"
    
    set +e
    docker compose run --rm app composer create-project --repository-url=https://repo.magento.com/ magento/project-community-edition .
    INSTALL_CODE=$?
    set -e

    if [ $INSTALL_CODE -ne 0 ]; then
        echo "[ERROR] Installation failed or was cancelled."
        echo "[ACTION] Restoring backup..."
        if [ -d "src_backup" ]; then
            rm -rf src
            mv src_backup src
        fi
        exit 1
    fi
else
    echo "[INFO] Magento core files found. Skipping download."
fi

# 4. Restore Theme
if [ -d "src_backup" ]; then
    echo "[ACTION] Restoring 'Car Tunez' Theme files..."
    cp -r src_backup/* src/
    # Don't delete backup just yet, safety first
    # rm -rf src_backup
    echo "[INFO] Theme files restored."
fi

# ALWAYS wait for OpenSearch (needed for upgrade too)
echo "[ACTION] Waiting for OpenSearch to be ready..."
until docker compose exec -T search curl -s http://localhost:9200/_cluster/health > /dev/null; do
    echo "Waiting for OpenSearch..."
    sleep 5
done
echo "[INFO] OpenSearch is ready!"

# 5. Database Installation (if needed)
if [ ! -f "src/app/etc/env.php" ]; then
    echo "[ACTION] Running Magento Initial Installation (setup:install)..."
    # We use sh -c to access the container's environment variables
    docker compose run --rm app sh -c 'bin/magento setup:install \
        --base-url="http://localhost:8082/" \
        --db-host="db" \
        --db-name="$DB_NAME" \
        --db-user="$DB_USER" \
        --db-password="$DB_PASSWORD" \
        --admin-firstname="Admin" \
        --admin-lastname="User" \
        --admin-email="admin@example.com" \
        --admin-user="admin" \
        --admin-password="Password123" \
        --language="en_US" \
        --currency="USD" \
        --timezone="America/New_York" \
        --use-rewrites=1 \
        --backend-frontname="admin" \
        --search-engine="opensearch" \
        --opensearch-host="search" \
        --opensearch-port="9200" \
        --opensearch-index-prefix="cartunez" \
        --opensearch-enable-auth="0" \
        --opensearch-timeout="15"'
else
    echo "[INFO] env.php found, forcing OpenSearch configuration..."
    docker compose run --rm app bin/magento setup:config:set \
        --opensearch-host="search" \
        --opensearch-port="9200" \
        --opensearch-index-prefix="cartunez" \
        --opensearch-enable-auth="0" \
        --opensearch-timeout="15"
fi

# 6. Setup & Upgrade
echo "[ACTION] Running Magento Setup & Upgrade..."
docker compose run --rm app bin/magento setup:upgrade
docker compose run --rm app bin/magento setup:di:compile
echo "[ACTION] Deploying Static Content..."
docker compose run --rm app bin/magento setup:static-content:deploy -f

echo "==========================================="
echo "   SETUP COMPLETE!"
echo "==========================================="
echo "Access your site at: http://<your-vps-ip>:8083"
echo "Admin URI:"
docker compose logs app | grep "Admin URI" | tail -n 1
