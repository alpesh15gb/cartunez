#!/bin/sh
set -e

echo "Starting deployment script..."

# 1. Build the application
echo "Running medusa build..."
npm run build

# 2. Verify build output exists
if [ ! -d ".medusa/server/public/admin" ]; then
    echo "ERROR: Admin build directory .medusa/server/public/admin not found!"
    # Fallback check
    if [ -d ".medusa/admin" ]; then
        echo "Found admin in .medusa/admin instead."
        SOURCE_DIR=".medusa/admin"
    else
        echo "Listing .medusa recursively to debug:"
        ls -R .medusa
        exit 1
    fi
else
    SOURCE_DIR=".medusa/server/public/admin"
fi

echo "Admin build artifacts found in $SOURCE_DIR"

# 3. Copy artifacts to all potential locations where 'medusa start' might look
echo "Copying admin artifacts to fallback locations..."

# Location A: build/
mkdir -p build
cp -r "$SOURCE_DIR"/* build/

# Location B: .medusa/admin (if not source)
if [ "$SOURCE_DIR" != ".medusa/admin" ]; then
    mkdir -p .medusa/admin
    cp -r "$SOURCE_DIR"/* .medusa/admin/
fi

# Location C: public/admin
mkdir -p public/admin
cp -r "$SOURCE_DIR"/* public/admin/

echo "Artifacts copied. Starting server..."

# 4. Start
exec npm run start
