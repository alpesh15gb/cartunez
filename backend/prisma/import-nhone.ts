import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const data = JSON.parse(fs.readFileSync('nhone_products.json', 'utf8'));

  for (const [categoryName, products] of Object.entries(data)) {
    console.log(`Processing category: ${categoryName}`);

    // Find or create category
    let category = await prisma.category.findFirst({
      where: { name: { contains: categoryName, mode: 'insensitive' } }
    });

    if (!category) {
      console.log(`Creating new category: ${categoryName}`);
      category = await prisma.category.create({
        data: {
          name: categoryName,
        }
      });
    }

    const typedProducts = (products as any) as any[];
    // Use a Set to track names and avoid duplicates within the same import
    const seenNames = new Set();

    for (const productData of typedProducts) {
      if (seenNames.has(productData.name)) continue;
      seenNames.add(productData.name);

      console.log(`Importing product: ${productData.name}`);
      
      try {
        await prisma.product.create({
          data: {
            name: productData.name,
            description: productData.description,
            price: productData.price,
            discountPrice: productData.discountPrice,
            images: productData.images,
            stockQuantity: productData.stockQuantity,
            categoryId: category.id,
          }
        });
      } catch (error) {
        console.error(`Failed to import ${productData.name}:`, error);
      }
    }
  }

  console.log('Import complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
