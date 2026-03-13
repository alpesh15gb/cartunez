/**
 * This script rebuilds motorogue_products.json from the original scraped files,
 * fixes all image URLs (strip Magento cache hash), re-downloads every image,
 * and saves local paths.
 * 
 * Run from d:\CarTunez:  node scripts/rebuild_images.js
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');

const root = path.join(__dirname, '..');
const uploadDir = path.join(root, 'backend', 'public', 'uploads');

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Load original source files (not the processed/local versions)
const sourceFiles = [
  'motorogue_stereos.json',
  'motorogue_amplifiers.json',
  'motorogue_speakers_1.json',
];

let products = [];
for (const f of sourceFiles) {
  const fp = path.join(root, f);
  if (fs.existsSync(fp)) {
    const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
    products = products.concat(data);
    console.log(`Loaded ${data.length} from ${f}`);
  }
}

// Deduplicate
const seen = new Set();
products = products.filter(p => {
  const k = `${p.name}||${p.category}`;
  if (seen.has(k)) return false;
  seen.add(k);
  return true;
});
console.log(`\nTotal (deduped): ${products.length} products\n`);

/**
 * Strip Magento /cache/<hash>/ from URL to get real image path.
 * e.g.  /pub/media/catalog/product/cache/abc123/z/a/foo.jpg
 *    →  /pub/media/catalog/product/z/a/foo.jpg
 */
function fixImageUrl(url) {
  if (!url) return url;
  return url.replace(
    /\/(pub\/media|media)\/catalog\/product\/cache\/[a-f0-9]+\//,
    '/$1/catalog/product/'
  );
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
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        'Referer': 'https://www.motorogue.in/',
      }
    });

    const contentType = response.headers['content-type'] || '';
    if (!contentType.startsWith('image/')) {
      console.log(`  ⚠ Skipped (not image: ${contentType})`);
      return null;
    }

    // Check content length — placeholder is < 10 KB
    const contentLen = parseInt(response.headers['content-length'] || '0');
    if (contentLen > 0 && contentLen < 8000) {
      console.log(`  ⚠ Skipped (too small: ${contentLen}B — likely placeholder)`);
      return null;
    }

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        // Double check size on disk
        const stat = fs.statSync(filePath);
        if (stat.size < 8000) {
          fs.unlinkSync(filePath);
          console.log(`  ⚠ File too small on disk (${stat.size}B), deleted`);
          resolve(null);
        } else {
          resolve(`/api/uploads/${filename}`);
        }
      });
      writer.on('error', reject);
    });
  } catch (err) {
    console.log(`  ✗ Error: ${err.message}`);
    return null;
  }
}

async function main() {
  let ok = 0, failed = 0;

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const rawUrl = p.imageUrl;

    if (!rawUrl) {
      p.imageUrl = null;
      failed++;
      continue;
    }

    const fixedUrl = fixImageUrl(rawUrl);
    const urlPath = (() => { try { return new URL(fixedUrl).pathname; } catch { return fixedUrl; } })();
    const ext = path.extname(urlPath) || '.jpg';
    const safeName = `motorogue-${p.name.replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0, 60)}${ext}`;

    console.log(`[${i+1}/${products.length}] ${p.name.substring(0, 55)}`);
    console.log(`  → ${fixedUrl}`);

    const localPath = await downloadImage(fixedUrl, safeName);
    if (localPath) {
      p.imageUrl = localPath;
      ok++;
      console.log(`  ✓ ${safeName}`);
    } else {
      // Fall back to fixed URL (still better than placeholder/cache URL)
      p.imageUrl = fixedUrl;
      failed++;
    }

    // Polite delay
    await new Promise(r => setTimeout(r, 300));
  }

  const outPath = path.join(root, 'motorogue_products.json');
  fs.writeFileSync(outPath, JSON.stringify(products, null, 2));
  console.log(`\n✅ Done: ${ok} downloaded, ${failed} using direct URL.`);
  console.log(`Saved to motorogue_products.json`);
}

main().catch(console.error);
