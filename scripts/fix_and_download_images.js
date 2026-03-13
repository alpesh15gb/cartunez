const fs = require('fs');
const path = require('path');
const axios = require('axios');

const productsPath = path.join(__dirname, '..', 'motorogue_products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

const uploadDir = path.join(__dirname, '..', 'backend', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * Magento stores images at:
 *   /pub/media/catalog/product/cache/<hash>/a/b/image.jpg   (cache, broken)
 * The real URL is:
 *   /pub/media/catalog/product/a/b/image.jpg                (direct, works)
 * Also handle:
 *   /media/catalog/product/cache/<hash>/a/b/image.jpg  → /media/catalog/product/a/b/image.jpg
 */
function fixImageUrl(url) {
    if (!url) return url;
    // Strip /cache/<hash>/ segment
    return url.replace(/\/(pub\/media|media)\/catalog\/product\/cache\/[a-f0-9]+\//, '/$1/catalog/product/');
}

async function downloadImage(url, filename) {
    const filePath = path.join(uploadDir, filename);

    try {
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream',
            timeout: 15000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://www.motorogue.in/'
            }
        });

        const contentType = response.headers['content-type'] || '';
        if (!contentType.includes('image')) {
            console.warn(`  ⚠ Not an image (${contentType}): ${url}`);
            return null;
        }

        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => resolve(`/api/uploads/${filename}`));
            writer.on('error', reject);
        });
    } catch (error) {
        console.error(`  ✗ Failed: ${error.message}`);
        return null;
    }
}

async function main() {
    console.log(`Fixing and downloading images for ${products.length} products...\n`);
    let ok = 0, failed = 0;

    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        if (!product.imageUrl || product.imageUrl.startsWith('/api/uploads/')) {
            // Already local OR no URL — try to fix from original scraped URL
            // Skip if already looks like a good local path
            if (product.imageUrl && product.imageUrl.startsWith('/api/uploads/')) {
                // Re-check: delete placeholder files and re-download using fixed URL
                // We need to use the original URL stored somewhere — skip this product
                ok++;
                continue;
            }
        }

        // Fix the URL
        const fixedUrl = fixImageUrl(product.imageUrl);
        const ext = path.extname(new URL(fixedUrl).pathname) || '.jpg';
        const safeName = `motorogue-${product.name.replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0, 60)}${ext}`;

        process.stdout.write(`[${i + 1}/${products.length}] ${product.name.substring(0, 50)}...\n  URL: ${fixedUrl}\n`);

        const localPath = await downloadImage(fixedUrl, safeName);
        if (localPath) {
            product.imageUrl = localPath;
            ok++;
            console.log(`  ✓ Saved: ${safeName}`);
        } else {
            failed++;
            // Keep the fixed URL as fallback (not placeholder)
            product.imageUrl = fixedUrl;
        }

        // Small delay to be polite to the server
        await new Promise(r => setTimeout(r, 200));
    }

    // Save updated products
    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
    console.log(`\n✅ Done! ${ok} ok, ${failed} failed.`);
    console.log(`Updated motorogue_products.json with local image paths.`);
}

main().catch(console.error);
