const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Image Path Normalization ---');

  const products = await prisma.product.findMany({
    select: { id: true, name: true, images: true }
  });

  console.log(`Auditing ${products.length} products...`);

  let fixCount = 0;
  let totalFixed = 0;

  for (const p of products) {
    if (!p.images || p.images.length === 0) continue;

    let updatedImages = [];
    let hasChanges = false;

    for (const img of p.images) {
      let newPath = img;

      // 1. Remove leading /api/uploads/ or /products/
      if (newPath.startsWith('/api/uploads/')) {
        newPath = newPath.replace('/api/uploads/', '/uploads/');
        hasChanges = true;
      }
      if (newPath.startsWith('/products/')) {
        newPath = newPath.replace('/products/', '/uploads/');
        hasChanges = true;
      }

      // 1.5 Ensure it starts with /uploads/
      if (!newPath.startsWith('/uploads/') && !newPath.startsWith('http')) {
          newPath = '/uploads/' + (newPath.startsWith('/') ? newPath.slice(1) : newPath);
          hasChanges = true;
      }

      // 2. Fix motorogue- prefix mismatch
      // Some files exist as 'onkyo.webp' but are referenced as 'motorogue-onkyo.webp'
      if (newPath.includes('motorogue-')) {
        const uploadsDir = path.join(__dirname, 'public', 'uploads');
        const fileName = newPath.split('/').pop();
        const cleanName = fileName.replace('motorogue-', '');
        
        // If the 'motorogue-' version DOES NOT exist, but the clean version DOES exist, swap it
        const prefixPath = path.join(uploadsDir, fileName);
        const cleanPath = path.join(uploadsDir, cleanName);

        if (!fs.existsSync(prefixPath) && fs.existsSync(cleanPath)) {
          console.log(`  [PREFIX FIX] ${p.name}: ${fileName} -> ${cleanName}`);
          newPath = newPath.replace(fileName, cleanName);
          hasChanges = true;
        }
      }

      updatedImages.push(newPath);
    }

    if (hasChanges) {
      await prisma.product.update({
        where: { id: p.id },
        data: { images: updatedImages }
      });
      totalFixed++;
      if (totalFixed % 50 === 0) console.log(`Fixed ${totalFixed} products...`);
    }
  }

  console.log(`\n--- Normalization Complete ---`);
  console.log(`Total products updated: ${totalFixed}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
