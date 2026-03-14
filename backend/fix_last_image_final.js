const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fix() {
  const productId = '9178ab5d-6adf-414c-b55f-a88c1293f101';
  
  const p = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, images: true }
  });

  if (p) {
    const newImages = p.images.map(img => 
      img.includes('-6.jpg') ? img.replace('-6.jpg', '-5.jpg') : img
    );
    
    await prisma.product.update({
      where: { id: productId },
      data: { images: newImages }
    });
    console.log('Successfully updated product ID:', productId);
  } else {
    // If ID is not found, try to find by name and fix all matching
    const products = await prisma.product.findMany({
      where: { name: { contains: 'Formula 1' } },
      select: { id: true, images: true }
    });
    
    for (const prod of products) {
      if (prod.images.some(img => img.includes('-6.jpg'))) {
        const fixedImgs = prod.images.map(i => i.includes('-6.jpg') ? i.replace('-6.jpg', '-5.jpg') : i);
        await prisma.product.update({
          where: { id: prod.id },
          data: { images: fixedImgs }
        });
        console.log('Fixed product by name match:', prod.id);
      }
    }
  }
}

fix()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
