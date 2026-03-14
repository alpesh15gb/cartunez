const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const p = await prisma.$queryRawUnsafe('SELECT id, name, images FROM "Product" WHERE name LIKE $1', '%Formula 1%');
  console.log(JSON.stringify(p, null, 2));
}

check()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
