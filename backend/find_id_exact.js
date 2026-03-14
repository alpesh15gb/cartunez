const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const p = await prisma.$queryRawUnsafe('SELECT id, name, images FROM "Product" WHERE id = $1', '9178ab5d-6adf-414c-b55f-a88c1293f101');
  console.log(JSON.stringify(p, null, 2));
}

check()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
