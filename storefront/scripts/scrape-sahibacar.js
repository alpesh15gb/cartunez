/**
 * SahibaCar Image Scraper & Downloader
 * Scrapes product images directly from HTML pages
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, '../public/images/products');
const OUTPUT_JSON = path.join(__dirname, '../public/data/sahibacar-all-products.json');
const OUTPUT_CSV = path.join(__dirname, '../public/data/sahibacar-products-local.csv');

// Ensure directories exist
if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
}
if (!fs.existsSync(path.dirname(OUTPUT_CSV))) {
    fs.mkdirSync(path.dirname(OUTPUT_CSV), { recursive: true });
}

function fetchPage(url) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;
        protocol.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

function downloadFile(url, filepath) {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(filepath)) {
            resolve(filepath);
            return;
        }

        // Fix URL if needed
        if (url.startsWith('//')) url = 'https:' + url;

        const protocol = url.startsWith('https') ? https : http;
        const file = fs.createWriteStream(filepath);

        protocol.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        }, (response) => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                file.close();
                fs.unlink(filepath, () => { });
                downloadFile(response.headers.location, filepath).then(resolve).catch(reject);
                return;
            }
            if (response.statusCode !== 200) {
                file.close();
                fs.unlink(filepath, () => { });
                reject(new Error(`HTTP ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve(filepath);
            });
        }).on('error', (err) => {
            file.close();
            fs.unlink(filepath, () => { });
            reject(err);
        });
    });
}

function extractProductsFromHTML(html) {
    const products = [];

    // Match product cards with their data
    const cardRegex = /<li[^>]*class="[^"]*grid__item[^"]*"[^>]*>[\s\S]*?<\/li>/gi;
    const cards = html.match(cardRegex) || [];

    for (const card of cards) {
        // Extract title
        const titleMatch = card.match(/<a[^>]*class="[^"]*full-unstyled-link[^"]*"[^>]*>([^<]+)<\/a>/i);
        const title = titleMatch ? titleMatch[1].trim() : null;

        // Extract image - look for srcset or src
        let imgUrl = null;
        const srcsetMatch = card.match(/srcset="([^"]+)"/i);
        if (srcsetMatch) {
            // Get highest resolution from srcset
            const srcset = srcsetMatch[1];
            const urls = srcset.split(',').map(u => u.trim().split(' ')[0]);
            imgUrl = urls[urls.length - 1] || urls[0];
        } else {
            const srcMatch = card.match(/src="(https?:\/\/[^"]+\.(jpg|jpeg|png|webp)[^"]*)"/i);
            imgUrl = srcMatch ? srcMatch[1] : null;
        }

        // Extract price
        const priceMatch = card.match(/Rs\.\s*([\d,]+)/i);
        const price = priceMatch ? priceMatch[1].replace(/,/g, '') : '0';

        // Extract product URL
        const urlMatch = card.match(/href="(\/products\/[^"]+)"/i);
        const productUrl = urlMatch ? 'https://www.sahibacar.in' + urlMatch[1] : null;

        if (title && imgUrl) {
            products.push({
                title,
                price: parseInt(price) || 0,
                imgUrl: imgUrl.startsWith('//') ? 'https:' + imgUrl : imgUrl,
                productUrl
            });
        }
    }

    return products;
}

function slugify(text) {
    return text.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        .substring(0, 60);
}

async function scrapeAllProducts() {
    console.log('🚀 SahibaCar Image Scraper');
    console.log('='.repeat(50));

    const allProducts = [];
    const totalPages = 14;

    // Scrape all pages
    for (let page = 1; page <= totalPages; page++) {
        const url = page === 1
            ? 'https://www.sahibacar.in/collections/all'
            : `https://www.sahibacar.in/collections/all?page=${page}`;

        console.log(`\n📄 Fetching page ${page}/${totalPages}...`);

        try {
            const html = await fetchPage(url);
            const products = extractProductsFromHTML(html);
            console.log(`   Found ${products.length} products`);
            allProducts.push(...products);
        } catch (err) {
            console.log(`   ✗ Error: ${err.message}`);
        }

        // Rate limiting
        await new Promise(r => setTimeout(r, 500));
    }

    console.log(`\n✅ Total products found: ${allProducts.length}`);

    // Save JSON
    fs.writeFileSync(OUTPUT_JSON, JSON.stringify(allProducts, null, 2));
    console.log(`📄 Saved to: ${OUTPUT_JSON}`);

    return allProducts;
}

async function downloadAllImages(products) {
    console.log('\n🖼️  Downloading Images');
    console.log('='.repeat(50));

    let success = 0, failed = 0;
    const results = [];

    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const filename = slugify(product.title) + '.jpg';
        const filepath = path.join(IMAGES_DIR, filename);

        process.stdout.write(`\r[${i + 1}/${products.length}] Downloading...`);

        try {
            await downloadFile(product.imgUrl, filepath);
            results.push({
                ...product,
                localImage: `/images/products/${filename}`
            });
            success++;
        } catch (err) {
            // Keep original URL if download fails
            results.push({
                ...product,
                localImage: product.imgUrl
            });
            failed++;
        }

        // Rate limiting
        await new Promise(r => setTimeout(r, 100));
    }

    console.log(`\n\n✅ Downloaded: ${success}`);
    console.log(`❌ Failed: ${failed}`);

    // Write CSV
    const csv = ['title,price,original_price,image_path,category,sku'];
    results.forEach((p, i) => {
        const category = guessCategory(p.title);
        const sku = `SC-${String(i + 1).padStart(4, '0')}`;
        csv.push(`"${p.title.replace(/"/g, '""')}",${p.price},${p.price},"${p.localImage}","${category}","${sku}"`);
    });
    fs.writeFileSync(OUTPUT_CSV, csv.join('\n'));
    console.log(`📄 CSV: ${OUTPUT_CSV}`);

    return results;
}

function guessCategory(title) {
    const t = title.toLowerCase();
    if (t.includes('speaker') || t.includes('coaxial') || t.includes('component')) return 'Car Speakers';
    if (t.includes('stereo') || t.includes('android')) return 'Car Stereos';
    if (t.includes('amplifier') || t.includes('amp')) return 'Car Amplifiers';
    if (t.includes('subwoofer') || t.includes('bass')) return 'Car Subwoofers';
    if (t.includes('camera') || t.includes('dash')) return 'Electronics';
    if (t.includes('led') || t.includes('fog') || t.includes('light')) return 'Lighting';
    if (t.includes('perfume') || t.includes('air')) return 'Car Perfumes';
    if (t.includes('mat') || t.includes('floor')) return 'Floor Mats';
    if (t.includes('steering') || t.includes('armrest') || t.includes('seat')) return 'Interior';
    if (t.includes('orvm') || t.includes('mirror') || t.includes('grill')) return 'Exterior';
    if (t.includes('frame') || t.includes('activator')) return 'Accessories';
    return 'Car Accessories';
}

async function main() {
    try {
        const products = await scrapeAllProducts();
        await downloadAllImages(products);
        console.log('\n✅ All done!');
    } catch (err) {
        console.error('Error:', err);
    }
}

main();
