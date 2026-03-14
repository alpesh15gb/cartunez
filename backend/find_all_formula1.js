const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function check() {
  const p = await prisma.$queryRawUnsafe('SELECT id, name, images FROM "Product" WHERE name LIKE $1', '%Formula 1%');
  fs.writeFileSync('all_formula1.json', JSON.stringify(p, null, 2));
}

check()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
