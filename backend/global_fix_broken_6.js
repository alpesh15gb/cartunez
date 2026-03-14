const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

const uploadsDir = path.join(__dirname, 'public', 'uploads');

async function fixAll() {
  const products = await prisma.product.findMany({
    select: { id: true, name: true, images: true }
  });
  
  let totalFixed = 0;
  
  for (const p of products) {
    if (!p.images) continue;
    
    let hasChanges = false;
    const newImages = p.images.map(img => {
      if (img.endsWith('-6.jpg')) {
        const checkPath = img.replace('/uploads/', '').replace('/api/uploads/', '');
        const fullPath = path.join(uploadsDir, checkPath);
        
        if (!fs.existsSync(fullPath)) {
          // If -6.jpg is missing, try -5.jpg
          const replacement = img.replace('-6.jpg', '-5.jpg');
          const checkReplacement = replacement.replace('/uploads/', '').replace('/api/uploads/', '');
          if (fs.existsSync(path.join(uploadsDir, checkReplacement))) {
            hasChanges = true;
            return replacement;
          }
        }
      }
      return img;
    });
    
    if (hasChanges) {
      await prisma.product.update({
        where: { id: p.id },
        data: { images: newImages },
        select: { id: true } // Avoid validation errors on other fields
      });
      console.log(`Fixed product: ${p.name} (${p.id})`);
      totalFixed++;
    }
  }
  
  console.log(`Total products fixed: ${totalFixed}`);
}

fixAll()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
