import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

const productsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'extracted_products.json'), 'utf8')
);

const vehicleData = [
  { make: 'Maruti Suzuki', models: ['Swift', 'Baleno', 'Brezza', 'Ertiga', 'Dzire'] },
  { make: 'Hyundai', models: ['Creta', 'Venue', 'i20', 'Verna'] },
  { make: 'Tata', models: ['Nexon', 'Harrier', 'Safari', 'Punch'] },
  { make: 'Mahindra', models: ['Scorpio-N', 'XUV700', 'Thar', 'Bolero'] },
  { make: 'Toyota', models: ['Innova Hycross', 'Fortuner', 'Glanza'] },
  { make: 'Honda', models: ['City', 'Amaze', 'Elevate'] },
  { make: 'Kia', models: ['Seltos', 'Sonet', 'Carens'] }
];

async function main() {
  console.log('Start seeding production data...');

  // 1. Seed Categories & Products
  for (const item of productsData) {
    const category = await prisma.category.upsert({
      where: { name: item.category },
      update: {},
      create: { name: item.category },
    });

    await prisma.product.upsert({
      where: { id: item.id },
      update: {
        name: item.name,
        description: item.description,
        price: item.price,
        stockQuantity: 10,
        images: [item.image],
        categoryId: category.id,
      },
      create: {
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        stockQuantity: 10,
        images: [item.image],
        categoryId: category.id,
      },
    });
    console.log(`Upserted product: ${item.name}`);
  }

  // 2. Seed Vehicle Makes & Models
  const products = await prisma.product.findMany();
  
  for (const data of vehicleData) {
    const make = await prisma.vehicleMake.upsert({
      where: { name: data.make },
      update: {},
      create: { name: data.make },
    });

    for (const modelName of data.models) {
      const model = await prisma.vehicleModel.upsert({
        where: { name_makeId: { name: modelName, makeId: make.id } },
        update: {},
        create: { name: modelName, makeId: make.id },
      });

      // Link some products to this model
      const randomProducts = products.slice(0, 3); // Just some samples
      for (const product of randomProducts) {
        await prisma.vehicleCompatibility.upsert({
          where: {
            productId_modelId_startYear: {
              productId: product.id,
              modelId: model.id,
              startYear: 2015
            }
          },
          update: {},
          create: {
            productId: product.id,
            modelId: model.id,
            startYear: 2015,
            endYear: 2025
          }
        });
      }
    }
  }

  console.log('Production seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
