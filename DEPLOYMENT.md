# Car Tunez Deployment Guide

This project is set up to run **Magento 2** using **Docker**. Use this guide to deploy the application to your VPS.

## Prerequisites on VPS
1.  **Docker** & **Docker Compose** installed.
2.  **Git** (optional, to transfer files).
3.  **Magento Marketplace Keys** (Public & Private keys).

## Installation Steps

1.  **Transfer Files**: Copy the entire `CarTunez` folder to your VPS.
    ```bash
    scp -r c:\CarTunez user@your-vps-ip:/var/www/cartunez
    ```

2.  **Environment Setup**:
    - SSH into your VPS: `ssh user@your-vps-ip`
    - Navigate to the folder: `cd /var/www/cartunez`
    - Check the `.env` file and change passwords if needed.

3.  **Build and Start Containers**:
    ```bash
    docker compose build
    docker compose up -d
    ```
    *Note: The first time usually takes a while to initialize the database.*

4.  **Install Magento**:
    Run the following command to download and install Magento. You will be prompted for your Magento Marketplace keys.
    ```bash
    docker compose run --rm app composer create-project --repository-url=https://repo.magento.com/ magento/project-community-edition .
    ```

5.  **Install the Car Tunez Theme**:
    Once Magento is installed, Register your theme and apply it.
    ```bash
    # Enable the theme
    docker compose run --rm app bin/magento theme:uninstall --clear-static-content frontend/Magento/luma
    docker compose run --rm app bin/magento setup:upgrade
    docker compose run --rm app bin/magento setup:static-content:deploy -f
    ```

6.  **Configure Admin**:
    - Login to the Admin Panel (`http://your-ip/admin_xxxx`).
    - Go to **Content > Configuration**.
    - Edit the Global Scope.
    - Set "Applied Theme" to **Car Tunez**.
    - Save.

7.  **Setup Homepage**:
    - Go to **Content > Elements > Pages**.
    - Edit **Home Page**.
    - In the **Content** tab, delete the default content.
    - Click "Show / Hide Editor" (ensure you are in raw HTML mode).
    - Paste the content from `homepage_content.html` (provided in the root folder).
    - Save.

## Troubleshooting
- **Permission Issues**: Run `docker compose run --rm app chown -R magento:magento .`
- **Recompile**: If you change LESS files, run `bin/magento setup:static-content:deploy -f`.
