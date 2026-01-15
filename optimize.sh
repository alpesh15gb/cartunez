#!/bin/bash
# optimize.sh

echo "[ACTION] Enabling PHP OpCache for Performance..."

# Append OpCache settings to php.conf.ini
echo "
opcache.enable=1
opcache.memory_consumption=128
opcache.interned_strings_buffer=8
opcache.max_accelerated_files=4000
opcache.revalidate_freq=60
opcache.fast_shutdown=1
opcache.enable_cli=1
" >> php.conf.ini

echo "[INFO] OpCache settings added."

echo "[ACTION] Restarting WordPress Container to apply changes..."
docker compose restart wordpress

echo "==========================================="
echo "   OPTIMIZATION COMPLETE!"
echo "==========================================="
echo "PHP OpCache is now enabled. This should significantly reduce initial load times."
