import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Looking for motorogue.in products to delete...");
    
    // We identify motorogue products by their description or image path
    const productsToDelete = await prisma.product.findMany({
        where: {
            OR: [
                { description: { contains: 'available at Motorogue' } },
                { description: { contains: 'Premium CAR STEREOS available at Cartunez' } }, // Some were imported with this generic string
                { description: { contains: 'Premium CAR AMPLIFIERS available at Cartunez' } },
                { description: { contains: 'Premium CAR SPEAKERS available at Cartunez' } },
                // Also catch any products that have a motorogue image URL
                { images: { hasSome: ['/api/uploads/motorogue-'] } } 
            ]
        }
    });

    console.log(`Found ${productsToDelete.length} products to delete.`);
    
    if (productsToDelete.length === 0) {
        console.log("No products found.");
        return;
    }

    const idsToDelete = productsToDelete.map(p => p.id);

    // First delete any relations if needed (like order items, though there shouldn't be any for new products)
    try {
        const result = await prisma.product.deleteMany({
            where: {
                id: { in: idsToDelete }
            }
        });
        
        console.log(`\nSuccessfully deleted ${result.count} products.`);
    } catch (e: any) {
        console.error("Error deleting products:", e.message);
        console.log("Attempting one-by-one deletion...");
        
        let deleted = 0;
        for (const id of idsToDelete) {
            try {
                await prisma.product.delete({ where: { id } });
                deleted++;
            } catch (err) {}
        }
        console.log(`Successfully deleted ${deleted} products natively.`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
