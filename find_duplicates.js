
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function findDuplicates() {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true
    }
  });

  const nameMap = {};
  const duplicates = [];

  products.forEach(p => {
    if (nameMap[p.name]) {
      duplicates.push({ name: p.name, ids: [nameMap[p.name], p.id] });
    } else {
      nameMap[p.name] = p.id;
    }
  });

  console.log(JSON.stringify(duplicates, null, 2));
}

findDuplicates().then(() => prisma.$disconnect());
