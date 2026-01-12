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

# 5. Setup & Upgrade
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
