const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function check() {
  const products = await prisma.product.findMany({
    select: { id: true, name: true, images: true }
  });
  const brokenOnes = products.filter(p => p.images && p.images.some(img => img.endsWith('-6.jpg')));
  fs.writeFileSync('broken_6_links.json', JSON.stringify(brokenOnes, null, 2));
}

check()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
