#!/bin/sh
echo "🏁 Starting Image Localization Process..."

echo "📦 1/4: Downloading 846+ product images (This may take a few minutes)..."
# We use a temporary node container to run this so you don't need npm installed on your VPS.
docker run --rm -v $(pwd):/work -w /work node:20-alpine sh -c "npm install axios && node scripts/download_images.js"

echo "📥 2/4: Copying generated data mapping to backend container..."
docker cp nhone_products_local.json docker-backend-1:/nhone_products_local.json

echo "⚙️ 3/4: Updating production database with new local image URLs..."
docker exec docker-backend-1 npx ts-node --transpile-only prisma/import-nhone.ts

echo "🚀 4/4: Rebuilding containers to securely mount the localized images..."
docker-compose -f docker/docker-compose.yml up -d --build

echo "✅ All done! The Admin Panel and Web Storefront are now fully isolated and localized."
