"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding vehicle data...');
    // 1. Create Makes
    const toyota = await prisma.vehicleMake.upsert({
        where: { name: 'Toyota' },
        update: {},
        create: { name: 'Toyota' },
    });
    const honda = await prisma.vehicleMake.upsert({
        where: { name: 'Honda' },
        update: {},
        create: { name: 'Honda' },
    });
    // 2. Create Models
    const camry = await prisma.vehicleModel.upsert({
        where: { name_makeId: { name: 'Camry', makeId: toyota.id } },
        update: {},
        create: { name: 'Camry', makeId: toyota.id },
    });
    const civic = await prisma.vehicleModel.upsert({
        where: { name_makeId: { name: 'Civic', makeId: honda.id } },
        update: {},
        create: { name: 'Civic', makeId: honda.id },
    });
    // 3. Link some products to compatibility (assuming some products exist)
    const products = await prisma.product.findMany({ take: 5 });
    if (products.length > 0) {
        for (const product of products) {
            await prisma.vehicleCompatibility.upsert({
                where: {
                    productId_modelId_startYear: {
                        productId: product.id,
                        modelId: camry.id,
                        startYear: 2018
                    }
                },
                update: {},
                create: {
                    productId: product.id,
                    modelId: camry.id,
                    startYear: 2018,
                    endYear: 2024
                }
            });
        }
    }
    console.log('Seeding completed successfully.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed-vehicles.js.map