const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

// Directory to save images
const IMAGES_DIR = './public/images/products';

// Ensure images directory exists
if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

// Product data scraped from SahibaCar
const products = [
    { title: "ALPINE DM-65 6.5 INCH 2-WAY COAXIAL SPEAKER", img: "https://www.sahibacar.in/cdn/shop/files/DBFE35DC-2754-489C-A195-87728FB7D17B.jpg" },
    { title: "ALPINE DM-65C & DM-65 COMPONENTS COMBO", img: "https://www.sahibacar.in/cdn/shop/files/20437E73-CAB0-4C16-AAF1-7AD321E5ED9C.jpg" },
    { title: "ALPINE DM-65C COMPONENT SPEAKER", img: "https://www.sahibacar.in/cdn/shop/files/D942FDE4-2F27-4BF5-8243-E58EB324F2CD.png" },
    { title: "Alpine SPJ-161C2 Coaxial Speakers", img: "https://www.sahibacar.in/cdn/shop/files/0B5C1A2E-8A03-47E5-A44D-CBA1E52833EF.webp" },
    { title: "Alpine SPJ-161CS Component Speakers", img: "https://www.sahibacar.in/cdn/shop/files/AD30D24D-3AB9-4DCB-9C21-1D04E0F6FEC8.jpg" },
];

// Function to download a single image
function downloadImage(url, filename) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;
        const filePath = path.join(IMAGES_DIR, filename);

        // Skip if file already exists
        if (fs.existsSync(filePath)) {
            console.log(`  ✓ Skipped (exists): ${filename}`);
            resolve(filePath);
            return;
        }

        const file = fs.createWriteStream(filePath);

        protocol.get(url, (response) => {
            // Handle redirects
            if (response.statusCode === 301 || response.statusCode === 302) {
                downloadImage(response.headers.location, filename)
                    .then(resolve)
                    .catch(reject);
                return;
            }

            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download: ${response.statusCode}`));
                return;
            }

            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`  ✓ Downloaded: ${filename}`);
                resolve(filePath);
            });
        }).on('error', (err) => {
            fs.unlink(filePath, () => { }); // Delete partial file
            reject(err);
        });
    });
}

// Create filename from title
function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        .substring(0, 50);
}

// Main function
async function downloadAllImages() {
    console.log('🚀 Starting image download from SahibaCar...\n');
    console.log(`📁 Saving to: ${path.resolve(IMAGES_DIR)}\n`);

    let success = 0;
    let failed = 0;
    const results = [];

    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const ext = path.extname(new URL(product.img).pathname) || '.jpg';
        const filename = `${slugify(product.title)}${ext}`;

        console.log(`[${i + 1}/${products.length}] ${product.title.substring(0, 40)}...`);

        try {
            const localPath = await downloadImage(product.img, filename);
            results.push({
                title: product.title,
                original_url: product.img,
                local_path: `/images/products/${filename}`
            });
            success++;
        } catch (err) {
            console.log(`  ✗ Failed: ${err.message}`);
            failed++;
        }

        // Small delay to avoid rate limiting
        await new Promise(r => setTimeout(r, 200));
    }

    console.log('\n-----------------------------------');
    console.log(`✅ Downloaded: ${success}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📁 Total files: ${fs.readdirSync(IMAGES_DIR).length}`);

    // Save mapping file
    fs.writeFileSync(
        './public/data/image-mapping.json',
        JSON.stringify(results, null, 2)
    );
    console.log('\n📄 Image mapping saved to: public/data/image-mapping.json');
}

downloadAllImages().catch(console.error);
