import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding...');

    const productsData = JSON.parse(
        fs.readFileSync(path.join(__dirname, 'seed_data.json'), 'utf8')
    );

    // Clear existing data to avoid conflicts (Optional, but good for fresh seed)
    // await prisma.orderItem.deleteMany();
    // await prisma.review.deleteMany();
    // await prisma.product.deleteMany();
    // await prisma.category.deleteMany();

    for (const item of productsData) {
        // 1. Ensure Category exists
        const categoryName = item.category || 'Uncategorized';
        let category = await prisma.category.findUnique({
            where: { name: categoryName },
        });

        if (!category) {
            category = await prisma.category.create({
                data: { name: categoryName },
            });
            console.log(`Created category: ${categoryName}`);
        }

        // 2. Create Product
        // We'll use a unique identifier or just rely on the name for now if we want to avoid duplicates
        const product = await prisma.product.upsert({
            where: { id: item.id }, // We'll try to use the Shopify ID as our ID
            update: {
                name: item.name,
                description: item.description,
                price: item.price,
                stockQuantity: 10, // Default stock
                images: item.image ? [item.image] : [],
                categoryId: category.id,
            },
            create: {
                id: item.id,
                name: item.name,
                description: item.description,
                price: item.price,
                stockQuantity: 10,
                images: item.image ? [item.image] : [],
                categoryId: category.id,
            },
        });

        console.log(`Upserted product: ${product.name}`);
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
