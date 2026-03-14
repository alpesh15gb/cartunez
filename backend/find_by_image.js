const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const brokenPath = '/uploads/formula_1_615026_carnauba_paste_wax_polish_230_g___high_gloss_paint_protection___long_lasting_shine-6.jpg';
  const products = await prisma.product.findMany({
    where: {
      images: {
        has: brokenPath
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
