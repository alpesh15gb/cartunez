const fs = require('fs');
const path = require('path');
const axios = require('axios');

const productsData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'nhone_products.json'), 'utf8'));
const uploadDir = path.join(__dirname, '..', 'backend', 'public', 'uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

async function downloadImage(url, filename) {
    const filePath = path.join(uploadDir, filename);
    if (fs.existsSync(filePath)) {
        // console.log(`Skipping already downloaded: ${filename}`);
        return `/uploads/${filename}`;
    }

    try {
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream'
        });

        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => resolve(`/uploads/${filename}`));
            writer.on('error', reject);
        });
    } catch (error) {
        console.error(`Failed to download ${url}: ${error.message}`);
        return url; // Fallback to original URL if download fails
    }
}

async function main() {
    let count = 0;
    const totalCategories = Object.keys(productsData).length;
    let catIdx = 0;

    for (const [categoryName, products] of Object.entries(productsData)) {
        catIdx++;
        console.log(`[${catIdx}/${totalCategories}] Downloading images for category: ${categoryName}`);
        
        for (const product of products) {
            if (product.images && product.images.length > 0) {
                const newImagePaths = [];
                for (let i = 0; i < product.images.length; i++) {
                    const url = product.images[i];
                    // Create a safe filename
                    const ext = path.extname(new URL(url).pathname) || '.jpg';
                    const safeName = `${product.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${i}${ext}`;
                    
                    const localPath = await downloadImage(url, safeName);
                    newImagePaths.push(localPath);
                    count++;
                }
                product.images = newImagePaths;
            }
        }
    }

    // Save the updated JSON with local paths
    fs.writeFileSync(path.join(__dirname, '..', 'nhone_products_local.json'), JSON.stringify(productsData, null, 2));
    console.log(`Downloaded ${count} images. Updated JSON saved to nhone_products_local.json`);
}

main();
