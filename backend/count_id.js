const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const count = await prisma.product.count({
    where: { id: '9178ab5d-6adf-414c-b55f-a88c1293f101' }
  });
  console.log('Count for ID: ' + count);
}

check()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
