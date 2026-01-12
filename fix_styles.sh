#!/bin/bash
# fix_styles.sh

echo "==================================="
echo "   Fixing Magento Styles..."
echo "==================================="

# 1. Fix Permissions (Crucial for Nginx to read CSS)
echo "[1/4] Fixing Permissions..."
chmod -R 777 src/var src/pub src/generated

# 2. Upgrade (Ensures Theme is Registered)
echo "[2/4] Registering Theme..."
docker compose run --rm app bin/magento setup:upgrade

# 3. Deploy Static Content (Forcefully)
echo "[3/4] Compiling CSS/JS (This takes a moment)..."
docker compose run --rm app bin/magento setup:static-content:deploy -f

# 4. Flush Caches
echo "[4/4] Flushing Cache..."
docker compose run --rm app bin/magento cache:flush

echo "==================================="
echo "   DONE! Refresh your page."
echo "==================================="
