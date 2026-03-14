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
        // Check for existing product by name first to prevent duplicates if IDs changed
        const existingByName = await prisma.product.findFirst({
            where: { name: item.name }
        });

        const commonData = {
            name: item.name,
            description: item.description,
            price: item.price,
            stockQuantity: 10,
            images: item.image ? [item.image] : [],
            categoryId: category.id,
        };

        let product;
        if (existingByName) {
            product = await prisma.product.update({
                where: { id: existingByName.id },
                data: commonData
            });
            console.log(`Updated product (matched by name): ${product.name}`);
        } else {
            product = await prisma.product.upsert({
                where: { id: item.id },
                update: commonData,
                create: {
                    id: item.id,
                    ...commonData
                },
            });
            console.log(`Upserted product (matched by ID): ${product.name}`);
        }
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
