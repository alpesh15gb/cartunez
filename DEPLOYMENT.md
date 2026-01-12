# Car Tunez Deployment Guide

## Prerequisites
- **Docker** & **Docker Compose** installed.
- **Git** installed.
- **Magento Marketplace Keys** (Public & Private keys).

## Step-by-Step Installation

Run the following commands on your VPS terminal:

### 1. Get the Code
```bash
# Clone the repository
git clone https://github.com/alpesh15gb/Cartunez.git

# Enter the directory (CRITICAL: All commands must be run from here)
cd Cartunez
```

### 2. Prepare for Installation
Since we have a custom theme in the `src` folder, but Composer requires an empty folder to install Magento, we need to temporarily move the theme.

```bash
# Move theme files to a backup folder
mv src src_theme_temp

# Recreate an empty src folder for Magento to install into
mkdir src
```

### 3. Start Docker
```bash
# Start the containers
docker compose up -d
```

### 4. Install Magento
Now install the Magento software. You will be asked for your Marketplace User (Public Key) and Password (Private Key).

```bash
docker compose run --rm app composer create-project --repository-url=https://repo.magento.com/ magento/project-community-edition .
```

### 5. Restore Your Custom Theme
Now that Magento is installed, we put the "Car Tunez" theme back.

```bash
# Copy theme files back into the Magento structure
cp -r src_theme_temp/* src/

# Cleanup
rm -rf src_theme_temp
```

### 6. Enable the Theme & Configure
```bash
# Install the theme in Magento
docker compose run --rm app bin/magento module:enable --all
docker compose run --rm app bin/magento setup:upgrade
docker compose run --rm app bin/magento setup:di:compile
docker compose run --rm app bin/magento setup:static-content:deploy -f
```

### 7. Final Admin Setup
1.  **Get Admin URI**: Run `docker compose logs app` and look for the admin URI (e.g., `/admin_123`).
2.  **Login**: User/Pass are in your `.env` file (usually `magento`/`magento` or similar if you set them during install, otherwise use `bin/magento admin:user:create` to make one).
3.  **Go to Content > Configuration**.
4.  Edit the Global Store.
5.  Change **Applied Theme** to **Car Tunez**.
6.  **Save**.

## Troubleshooting
- **"No configuration file provided"**: You are not in the `Cartunez` folder. Run `cd Cartunez`.
- **"Permission denied"**: Run `docker compose run --rm app chown -R magento:magento .`
