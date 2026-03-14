const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const uploadsDir = path.join(__dirname, 'public', 'uploads');

async function audit() {
    console.log('--- Image Audit Started ---');
    console.log(`Checking directory: ${uploadsDir}\n`);

    const products = await prisma.product.findMany({
        select: { id: true, name: true, images: true }
    });

    console.log('Available Prisma models:', Object.keys(prisma).filter(k => k[0] !== '$'));

    const news = await prisma.news.findMany({
        select: { id: true, title: true, imageUrl: true }
    });

    let brokenProducts = 0;
    let totalProductImages = 0;

    console.log(`Auditing ${products.length} Products...`);
    for (const p of products) {
        if (!p.images || p.images.length === 0) continue;
        
        for (const imgPath of p.images) {
            totalProductImages++;
            // Normalize path for check
            let checkPath = imgPath;
            if (imgPath.startsWith('/api/uploads/')) checkPath = imgPath.replace('/api/uploads/', '');
            else if (imgPath.startsWith('/uploads/')) checkPath = imgPath.replace('/uploads/', '');
            else if (imgPath.startsWith('http')) {
                console.log(`  [EXTERNAL] Product: ${p.name} -> ${imgPath}`);
                continue;
            }

            const fullPath = path.join(uploadsDir, checkPath);
            if (!fs.existsSync(fullPath)) {
                console.error(`  [BROKEN] Product: ${p.id} (${p.name}) -> ${imgPath}`);
                brokenProducts++;
            }
        }
    }

    let brokenNews = 0;
    console.log(`\nAuditing ${news.length} News items...`);
    for (const n of news) {
        if (!n.imageUrl) continue;
        
        let checkPath = n.imageUrl;
        if (n.imageUrl.startsWith('/api/uploads/')) checkPath = n.imageUrl.replace('/api/uploads/', '');
        else if (n.imageUrl.startsWith('/uploads/')) checkPath = n.imageUrl.replace('/uploads/', '');
        else if (n.imageUrl.startsWith('http')) {
            console.log(`  [EXTERNAL] News: ${n.title} -> ${n.imageUrl}`);
            continue;
        }

        const fullPath = path.join(uploadsDir, checkPath);
        if (!fs.existsSync(fullPath)) {
            console.error(`  [BROKEN] News: ${n.id} (${n.title}) -> ${n.imageUrl}`);
            brokenNews++;
        }
    }

    console.log('\n--- Summary ---');
    console.log(`Total Product Images: ${totalProductImages}`);
    console.log(`Broken Product Images: ${brokenProducts}`);
    console.log(`Broken News Images: ${brokenNews}`);
}

audit()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
