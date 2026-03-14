const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fix() {
  const productId = '9178ab5d-6adf-414c-b55f-a88c1293f101';
  const p = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (p) {
    console.log(`Current images for ${p.name}:`, p.images);
    const newImages = p.images.map(img => 
      img.includes('-6.jpg') ? img.replace('-6.jpg', '-5.jpg') : img
    );
    
    await prisma.product.update({
      where: { id: productId },
      data: { images: newImages }
    });
    console.log('Successfully updated images to:', newImages);
  } else {
    console.error('Product not found:', productId);
  }
}

fix()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
