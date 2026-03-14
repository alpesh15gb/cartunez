
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanup() {
  console.log('Starting cleanup of duplicate products...');

  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      createdAt: true
    },
    orderBy: {
      createdAt: 'asc'
    }
  });

  const nameMap = new Map();
  const toDelete = [];

  for (const product of products) {
    if (nameMap.has(product.name)) {
      toDelete.push(product.id);
    } else {
      nameMap.set(product.name, product.id);
    }
  }

  console.log(`Found ${toDelete.length} duplicates to remove.`);

  for (const duplicateId of toDelete) {
    const product = products.find(p => p.id === duplicateId);
    if (!product) continue;
    
    const keptId = nameMap.get(product.name);
    if (!keptId) continue;

    console.log(`Processing duplicate: ${product.name} (${duplicateId}) -> Keeping ${keptId}`);

    // Reassign relations
    await prisma.orderItem.updateMany({ where: { productId: duplicateId }, data: { productId: keptId } });
    await prisma.review.updateMany({ where: { productId: duplicateId }, data: { productId: keptId } });
    await prisma.wishlistItem.updateMany({ where: { productId: duplicateId }, data: { productId: keptId } });
    await prisma.vehicleCompatibility.updateMany({ where: { productId: duplicateId }, data: { productId: keptId } });

    // Delete the duplicate
    await prisma.product.delete({ where: { id: duplicateId } });
    console.log(`Deleted duplicate: ${duplicateId}`);
  }
  console.log('Cleanup finished.');
}

cleanup()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
