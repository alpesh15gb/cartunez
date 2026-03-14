const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const products = await prisma.product.findMany({
    where: {
      name: {
        contains: 'Formula 1'
      }
    },
    select: {
      id: true,
      name: true,
      images: true
    }
  });
  console.log(JSON.stringify(products, null, 2));
}

check()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
