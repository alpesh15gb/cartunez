const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const n = await prisma.news.findMany({
    where: {
      imageUrl: {
        contains: 'formula_1_615026'
      }
    }
  });
  console.log(JSON.stringify(n, null, 2));
}

check()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
