import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const data = JSON.parse(fs.readFileSync('../nhone_products_local.json', 'utf8'));

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
        const existingProduct = await prisma.product.findFirst({
          where: { name: productData.name }
        });

        const adjustedImages = productData.images.map((img: string) => img.startsWith('/uploads') ? `/api${img}` : img);

        if (existingProduct) {
          await prisma.product.update({
            where: { id: existingProduct.id },
            data: {
              description: productData.description,
              price: productData.price,
              discountPrice: productData.discountPrice,
              images: adjustedImages,
              stockQuantity: productData.stockQuantity,
              categoryId: category.id,
            }
          });
        } else {
          await prisma.product.create({
            data: {
              name: productData.name,
              description: productData.description,
              price: productData.price,
              discountPrice: productData.discountPrice,
              images: adjustedImages,
              stockQuantity: productData.stockQuantity,
              categoryId: category.id,
            }
          });
        }
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
