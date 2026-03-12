import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const productsData = [
  {
    "id": "9140185170174",
    "name": "DD Audio REDLINE Combo – RL-CX6.5a + RL-CW6.5b 6.5” Component Speakers",
    "description": "Upgrade your complete car sound system with the powerful DD Audio REDLINE Series Speaker Combo. Designed for high clarity and powerful mid-bass.",
    "price": 9199,
    "category": "CAR SPEAKERS",
    "image": "/products/9140185170174.jpg"
  },
  {
    "id": "9140183499006",
    "name": "DD Audio RL-CX6.5a – 6.5” Coaxial Car Speaker",
    "description": "High rigid IMPP™ cone made for Indian climatic conditions. Clear vocals and balanced bass response.",
    "price": 2999,
    "category": "CAR SPEAKERS",
    "image": "/products/9140183499006.jpg"
  },
  {
    "id": "9140181598462",
    "name": "DD Audio RL-CW6.5b 6.5” Component Speakers",
    "description": "Part of the legendary DD Audio REDLINE Series. Exceptional clarity and strong mid-bass response.",
    "price": 6499,
    "category": "CAR SPEAKERS",
    "image": "/products/9140181598462.jpg"
  },
  {
    "id": "9140179632382",
    "name": "STEG LEO 650C II 6.5” Component Speakers",
    "description": "Premium Italian Sound Quality. Engineered for powerful bass and crystal-clear vocals.",
    "price": 9299,
    "category": "CAR SPEAKERS",
    "image": "/products/9140179632382.jpg"
  },
  {
    "id": "9139468632318",
    "name": "Infinity Alpha 753T Tweeters – 720W Peak",
    "description": "Silk Dome Tweeters engineered by Harman to deliver crystal-clear highs and detailed vocals.",
    "price": 2400,
    "category": "CAR SPEAKERS",
    "image": "/products/9139468632318.heic"
  },
  {
    "id": "9139276120318",
    "name": "Morel direct fit coaxial speaker for suzuki cars IP-SUZ6C",
    "description": "Perfect plug and play fitment for Suzuki cars. Powerful bass and crisp vocals.",
    "price": 8999,
    "category": "CAR SPEAKERS",
    "image": "/products/9139276120318.webp"
  },
  {
    "id": "9125406048510",
    "name": "Mtrax Android Stereo With 360 Camera Kit (4/64gb)",
    "description": "9 Inch IPS Display with Octa Core Processor. Includes 4 HD cameras for 360 degree view.",
    "price": 15899,
    "category": "CAR STEREOS",
    "image": "/products/9125406048510.jpg"
  },
  {
    "id": "9122161950974",
    "name": "Diamond Android Stereo 2K Touch Screen 4GB+64GB",
    "description": "10.1-inch 2K Display. Wireless CarPlay & Android Auto. Universal fit for all cars.",
    "price": 8999,
    "category": "CAR STEREOS",
    "image": "/products/9122161950974.jpg"
  }
];

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
