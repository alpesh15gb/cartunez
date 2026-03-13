const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

const files = [
  'motorogue_stereos.json',
  'motorogue_amplifiers.json',
  'motorogue_speakers_1.json',
  'motorogue_speakers_2.json',
  'motorogue_lighting.json',
];

let combined = [];

for (const file of files) {
  const filePath = path.join(root, file);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log(`Loaded ${data.length} products from ${file}`);
    combined = combined.concat(data);
  } else {
    console.warn(`File not found (skipping): ${file}`);
  }
}

// Deduplicate by name + category
const seen = new Set();
const deduped = combined.filter(p => {
  const key = `${p.name}||${p.category}`;
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});

console.log(`\nTotal products: ${combined.length}`);
console.log(`After dedup: ${deduped.length}`);

const outputPath = path.join(root, 'motorogue_products.json');
fs.writeFileSync(outputPath, JSON.stringify(deduped, null, 2));
console.log(`\nSaved combined to: ${outputPath}`);
