const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, '..', 'nhone_products_local.json');
const targetFile = path.join(__dirname, '..', 'backend', 'prisma', 'seed_data.json');

try {
    const rawData = JSON.parse(fs.readFileSync(srcFile, 'utf8'));
    const combinedProducts = [];

    // Convert category-keyed object into flat array
    for (const [category, products] of Object.entries(rawData)) {
        if (Array.isArray(products)) {
            products.forEach((p, index) => {
                combinedProducts.push({
                    id: `seed-${category.replace(/\s+/g, '-').toLowerCase()}-${index}`,
                    name: p.name,
                    description: p.description || 'Premium automotive component.',
                    price: p.price,
                    image: p.images && p.images.length > 0 ? p.images[0] : null,
                    category: category
                });
            });
        }
    }

    fs.writeFileSync(targetFile, JSON.stringify(combinedProducts, null, 2));
    console.log(`Successfully generated seed data for ${combinedProducts.length} products.`);
} catch (error) {
    console.error('Error generating seed data:', error);
}
