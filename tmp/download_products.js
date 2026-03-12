const fs = require('fs');
const path = require('path');
const https = require('https');

const PRODUCTS_JSON_URL = 'https://sahibacar.in/products.json?limit=100';
const DOWNLOAD_DIR = path.join(__dirname, '..', 'web', 'public', 'products');

if (!fs.existsSync(DOWNLOAD_DIR)) {
    fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
}

async function fetchJson(url) {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        };
        https.get(url, options, (res) => {
            let data = '';
            if (res.statusCode !== 200) {
                reject(new Error(`Failed to fetch JSON: ${res.statusCode}`));
                return;
            }
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    console.error('Data received:', data.substring(0, 100));
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

async function downloadImage(url, filename) {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        };
        const file = fs.createWriteStream(path.join(DOWNLOAD_DIR, filename));
        https.get(url, options, (res) => {
            if (res.statusCode !== 200) {
                reject(new Error(`Failed to download image: ${res.statusCode}`));
                return;
            }
            res.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(path.join(DOWNLOAD_DIR, filename), () => { });
            reject(err);
        });
    });
}

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

async function main() {
    try {
        const extractedProducts = [];
        const PAGES_TO_FETCH = 3; // 100 products per page, so 3 pages = 300 max
        const LIMIT = 100;

        for (let page = 1; page <= PAGES_TO_FETCH; page++) {
            const url = `https://sahibacar.in/products.json?limit=${LIMIT}&page=${page}`;
            console.log(`Fetching products JSON (Page ${page})...`);
            const { products } = await fetchJson(url);

            if (!products || products.length === 0) {
                console.log(`No more products found on page ${page}.`);
                break;
            }

            console.log(`Found ${products.length} products on page ${page}.`);

            for (const product of products) {
                // Check for duplicates (if any)
                if (extractedProducts.some(p => p.id === product.id.toString())) {
                    continue;
                }

                console.log(`Processing: ${product.title}`);

                const firstImage = product.images[0];
                let localImagePath = null;

                if (firstImage) {
                    const ext = path.extname(new URL(firstImage.src).pathname) || '.jpg';
                    const filename = `${product.id}${ext}`;
                    const fullPath = path.join(DOWNLOAD_DIR, filename);

                    // Skip if image already exists to save time/bandwidth
                    if (fs.existsSync(fullPath)) {
                        console.log(`  Image already exists: ${filename}`);
                        localImagePath = `/products/${filename}`;
                    } else {
                        console.log(`  Downloading image: ${filename}`);
                        try {
                            await downloadImage(firstImage.src, filename);
                            localImagePath = `/products/${filename}`;
                        } catch (err) {
                            console.error(`  Failed to download image for ${product.title}:`, err.message);
                        }
                    }
                }

                extractedProducts.push({
                    id: product.id.toString(),
                    name: product.title,
                    description: product.body_html,
                    price: parseFloat(product.variants[0].price),
                    category: product.product_type || 'Uncategorized',
                    image: localImagePath,
                    vendor: product.vendor,
                    handle: product.handle
                });
            }
        }

        const outputPath = path.join(__dirname, 'extracted_products.json');
        fs.writeFileSync(outputPath, JSON.stringify(extractedProducts, null, 2));
        console.log(`Extracted total of ${extractedProducts.length} products.`);
        console.log(`Data saved to ${outputPath}`);
        console.log('Done!');
    } catch (err) {
        console.error('Error:', err);
    }
}

main();
