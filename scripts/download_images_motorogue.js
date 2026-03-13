const fs = require('fs');
const path = require('path');
const axios = require('axios');

const productsPath = path.join(__dirname, '..', 'motorogue_products.json');
if (!fs.existsSync(productsPath)) {
    console.error('motorogue_products.json not found. Run the scraper first.');
    process.exit(1);
}

const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
const uploadDir = path.join(__dirname, '..', 'backend', 'public', 'uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

async function downloadImage(url, filename) {
    const filePath = path.join(uploadDir, filename);
    if (fs.existsSync(filePath)) {
        return `/api/uploads/${filename}`;
    }

    try {
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream',
            timeout: 10000
        });

        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => resolve(`/api/uploads/${filename}`));
            writer.on('error', reject);
        });
    } catch (error) {
        console.error(`Failed to download ${url}: ${error.message}`);
        return url; 
    }
}

async function main() {
    let count = 0;
    console.log(`Starting localization of images for ${products.length} products...`);
    
    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        if (product.imageUrl) {
            process.stdout.write(`\r[${i + 1}/${products.length}] Downloading: ${product.name.substring(0, 30)}...`);
            
            const ext = path.extname(new URL(product.imageUrl).pathname) || '.jpg';
            const safeName = `motorogue-${product.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}${ext}`;
            
            const localPath = await downloadImage(product.imageUrl, safeName);
            product.imageUrl = localPath;
            count++;
        }
    }

    fs.writeFileSync(path.join(__dirname, '..', 'motorogue_products_local.json'), JSON.stringify(products, null, 2));
    console.log(`\nLocalized ${count} images. Updated JSON saved to motorogue_products_local.json`);
}

main();
