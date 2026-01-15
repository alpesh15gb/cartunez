#!/bin/bash
# fix_install.sh

echo "[ACTION] Stopping Containers..."
docker compose down

echo "[ACTION] Backing up current 'src' (Mixed Content)..."
# We move the dirty src out of the way
if [ -d "src" ]; then
    timestamp=$(date +%Y%m%d_%H%M%S)
    mv src "src_mixed_$timestamp"
    echo "[INFO] Moved 'src' to 'src_mixed_$timestamp'"
fi

echo "[ACTION] Creating fresh 'src' directory..."
mkdir src

echo "[ACTION] Starting WordPress to populate files..."
docker compose up -d

echo "[INFO] Waiting for WordPress to initialize..."
sleep 20

echo "[ACTION] Fixing Permissions..."
docker compose exec -T wordpress chown -R www-data:www-data /var/www/html

echo "==========================================="
echo "   FIX COMPLETE!"
echo "==========================================="
echo "You now have a clean WordPress installation."
echo "Please wait a minute, then access https://cartunez.in to finish the setup wizard."
