/**
 * SahibaCar Image Downloader
 * Downloads product images from sahibacar.in product pages
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, '../public/images/products');
const OUTPUT_CSV = path.join(__dirname, '../public/data/sahibacar-products-local.csv');

// Ensure directories exist
if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
}
if (!fs.existsSync(path.dirname(OUTPUT_CSV))) {
    fs.mkdirSync(path.dirname(OUTPUT_CSV), { recursive: true });
}

// Product data from SahibaCar (first 50 products to start)
const products = [
    { title: "ALPINE DM-65 6.5 INCH 2-WAY COAXIAL SPEAKER 50W RMS 200W PEAK", slug: "alpine-dm-65-6-5-inch-2-way-coaxial-speaker-50w-rms-200w-peak", price: 7799 },
    { title: "ALPINE DM-65C & DM-65 COMPONENTS AND COAXIAL COMBO", slug: "alpine-dm-65c-dm-65-components-and-coaxial-combo", price: 17499 },
    { title: "ALPINE DM-65C 6.5 INCH 2-WAY COMPONENT SPEAKER 50W RMS 200W PEAK", slug: "alpine-dm-65-c-dm-6-5-inch-2-way-component-speaker", price: 10199 },
    { title: "Alpine SPJ-161C2 6.5 Coaxial Speakers", slug: "alpine-spj-161c2-6-5-coaxial-speakers-50w-rms-250w-peak", price: 3200 },
    { title: "Alpine SPJ-161CS 6.5 Component Speakers", slug: "alpine-spj-161cs-6-5-component-speakers-50w-rms-250w-peak", price: 4899 },
    { title: "Alto K10 android stereo 4/64 GB", slug: "alto-k10-android-stereo-4-64-gb-with-android-frame", price: 14999 },
    { title: "Conpex Ai box 4/64GB", slug: "copy-android-box-to-convert-oem-stereo-to-android-unplug-ai-box-4-64gb-octacore-processor-unplug-unp-p400-picasou-android-box", price: 12999 },
    { title: "Glider Ai box 4/64GB", slug: "android-box-to-convert-oem-stereo-to-android-glider-ai-box-4-64gb-octacore-processor", price: 11999 },
    { title: "Unplug Ai box 4/64GB", slug: "android-box-to-convert-oem-stereo-to-android-unplug-ai-box-4-64gb-octacore-processor-unplug-unp-p400-picasou-android-box", price: 13999 },
    { title: "Yuemi P8 Android Box", slug: "android-box-to-convert-oem-stereo-to-android-unplug-ai-box-4-64gb-octacore-processor-yuemi-p8-picasou-android-box", price: 12999 },
    { title: "Baleno 2022 Screen Activator", slug: "baleno-2022-onwards-screen-activator-video-in-motion", price: 2499 },
    { title: "Baleno 9 inches Android Frame", slug: "baleno-9-inches-android-frame-with-coupler", price: 1999 },
    { title: "Baleno Auto folding ORVM", slug: "baleno-auto-folding-mirrors-orvm-for-base-model-with-wiring-and-switch", price: 7999 },
    { title: "Baleno conversion kit", slug: "baleno-base-model-to-top-model-conversion-kit", price: 24999 },
    { title: "Baleno Camera Activator Aftermarket", slug: "baleno-camera-activator-to-turn-on-aftermarket-camera-in-orignal-stereo", price: 1499 },
    { title: "Baleno Camera Activator Android", slug: "baleno-camera-activator-to-turn-on-orignal-camera-in-android-stereo", price: 1499 },
    { title: "Baleno Height adjustment seat", slug: "baleno-height-adjustment-seat", price: 4999 },
    { title: "Baleno Orignal MSGA armrest", slug: "baleno-orignal-msga-armrest", price: 5999 },
    { title: "Baleno Top Model Steering", slug: "baleno-top-model-steering-leather-upholstery-wrapped-with-all-controls", price: 8999 },
    { title: "Batman Car Perfume Spray", slug: "batman-car-perfume-spray-50ml-dc-comics-official-merchandise", price: 599 },
];

function slugify(text) {
    return text.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        .substring(0, 50);
}

function downloadFile(url, filepath) {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(filepath)) {
            console.log(`  ✓ Exists: ${path.basename(filepath)}`);
            resolve(filepath);
            return;
        }

        const file = fs.createWriteStream(filepath);
        const request = https.get(url, (response) => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                file.close();
                fs.unlinkSync(filepath);
                downloadFile(response.headers.location, filepath).then(resolve).catch(reject);
                return;
            }
            if (response.statusCode !== 200) {
                file.close();
                fs.unlinkSync(filepath);
                reject(new Error(`HTTP ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`  ✓ Downloaded: ${path.basename(filepath)}`);
                resolve(filepath);
            });
        });
        request.on('error', (err) => {
            file.close();
            if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
            reject(err);
        });
        request.setTimeout(30000, () => {
            request.destroy();
            reject(new Error('Timeout'));
        });
    });
}

async function getProductImage(slug) {
    return new Promise((resolve) => {
        const url = `https://www.sahibacar.in/products/${slug}.json`;
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    const imageUrl = json.product?.images?.[0]?.src ||
                        json.product?.image?.src || null;
                    resolve(imageUrl);
                } catch (e) {
                    resolve(null);
                }
            });
        }).on('error', () => resolve(null));
    });
}

async function downloadAllImages() {
    console.log('🚀 SahibaCar Image Downloader');
    console.log(`📁 Output: ${IMAGES_DIR}\n`);

    let success = 0, failed = 0;
    const results = [];

    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        console.log(`[${i + 1}/${products.length}] ${product.title.substring(0, 40)}...`);

        try {
            // Get image URL from Shopify JSON API
            const imageUrl = await getProductImage(product.slug);

            if (imageUrl) {
                const ext = path.extname(new URL(imageUrl).pathname) || '.jpg';
                const filename = `${slugify(product.title)}${ext}`;
                const filepath = path.join(IMAGES_DIR, filename);

                await downloadFile(imageUrl, filepath);

                results.push({
                    title: product.title,
                    price: product.price,
                    image_path: `/images/products/${filename}`
                });
                success++;
            } else {
                console.log('  ✗ No image found');
                failed++;
            }
        } catch (err) {
            console.log(`  ✗ Error: ${err.message}`);
            failed++;
        }

        // Rate limiting
        await new Promise(r => setTimeout(r, 300));
    }

    // Write CSV
    const csv = ['title,price,image_path',
        ...results.map(r => `"${r.title}",${r.price},"${r.image_path}"`)
    ].join('\n');
    fs.writeFileSync(OUTPUT_CSV, csv);

    console.log('\n' + '='.repeat(40));
    console.log(`✅ Success: ${success}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📄 CSV: ${OUTPUT_CSV}`);
}

downloadAllImages();
