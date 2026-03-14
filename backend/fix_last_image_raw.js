const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fix() {
  const productId = '9178ab5d-6adf-414c-b55f-a88c1293f101';
  
  // Get current images
  const products = await prisma.$queryRaw`SELECT images FROM "Product" WHERE id = ${productId}`;
  if (products.length > 0) {
    const images = products[0].images;
    const newImages = images.map(img => img.includes('-6.jpg') ? img.replace('-6.jpg', '-5.jpg') : img);
    
    // Update using raw SQL
    await prisma.$executeRaw`UPDATE "Product" SET images = ${newImages} WHERE id = ${productId}`;
    console.log('Successfully updated images using Raw SQL');
  } else {
    console.error('Product not found via raw SQL');
  }
}

fix()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
