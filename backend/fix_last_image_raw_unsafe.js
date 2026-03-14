const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fix() {
  const productId = '9178ab5d-6adf-414c-b55f-a88c1293f101';
  
  // Use raw SQL to update the images array
  // In Postgres, updating an array element can be tricky, so we'll fetch, modify, and update the whole array.
  
  try {
    const products = await prisma.$queryRawUnsafe('SELECT id, images FROM "Product" WHERE id = $1', productId);
    
    if (products.length > 0) {
      const images = products[0].images;
      const newImages = images.map(img => img.includes('-6.jpg') ? img.replace('-6.jpg', '-5.jpg') : img);
      
      // Update using raw SQL unsafe
      // We need to convert the array to a Postgres array format or use a JSON-like update if it's stored as JSON
      // But based on the schema, it's a String[] (Postgres Array)
      
      // Constructing a PG array literal: ARRAY['val1', 'val2']
      const arrayLiteral = `ARRAY['${newImages.join("','")}']`;
      await prisma.$executeRawUnsafe(`UPDATE "Product" SET images = ${arrayLiteral} WHERE id = $1`, productId);
      
      console.log('Successfully updated images via Raw SQL Unsafe');
    } else {
      console.error('Product ID not found via Raw SQL Unsafe:', productId);
    }
  } catch (err) {
    console.error('Raw SQL Fix Failed:', err);
  }
}

fix()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
