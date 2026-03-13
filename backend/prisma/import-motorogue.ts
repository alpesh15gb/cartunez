import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
    const productsPath = path.join(__dirname, '../../motorogue_products.json');
    if (!fs.existsSync(productsPath)) {
        console.error('motorogue_products.json not found. Run the scraper first.');
        return;
    }

    const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
    console.log(`Found ${products.length} products to import.`);

    for (const product of products) {
        try {
            // Find or create category
            const category = await prisma.category.upsert({
                where: { name: product.category },
                update: {},
                create: { name: product.category },
            });

            // Check if product exists (by name in that category)
            const existingProduct = await prisma.product.findFirst({
                where: {
                    name: product.name,
                    categoryId: category.id
                }
            });

            // Scraped data: mrp = original price, price = discounted/special price
            const displayPrice = product.mrp || product.price || 0;
            const salePrice = product.price && product.price < displayPrice ? product.price : null;

            if (existingProduct) {
                // Update price/discount
                await prisma.product.update({
                    where: { id: existingProduct.id },
                    data: {
                        price: displayPrice,
                        discountPrice: salePrice,
                        images: product.imageUrl ? [product.imageUrl] : existingProduct.images
                    }
                });
                console.log(`Updated: ${product.name}`);
            } else {
                // Create new product
                await prisma.product.create({
                    data: {
                        name: product.name,
                        description: `${product.name} - Premium ${product.category} available at Cartunez. High-quality automotive audio component designed for durability and performance.`,
                        price: displayPrice,
                        discountPrice: salePrice,
                        stockQuantity: 50,
                        images: product.imageUrl ? [product.imageUrl] : [],
                        categoryId: category.id
                    }
                });
                console.log(`Created: ${product.name}`);
            }
        } catch (error: any) {
            console.error(`Error importing ${product.name}:`, error.message);
        }
    }
    console.log('\nImport complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
