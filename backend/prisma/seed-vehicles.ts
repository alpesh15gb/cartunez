import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding comprehensive vehicle data...');

    const vehicleData = [
        {
            make: 'Maruti Suzuki',
            models: ['Swift', 'Baleno', 'Brezza', 'Ertiga', 'Dzire', 'Alto K10']
        },
        {
            make: 'Hyundai',
            models: ['Creta', 'Venue', 'i20', 'Verna', 'Alcazar', 'Exter']
        },
        {
            make: 'Tata',
            models: ['Nexon', 'Harrier', 'Safari', 'Punch', 'Altroz', 'Tiago']
        },
        {
            make: 'Mahindra',
            models: ['Scorpio-N', 'XUV700', 'Thar', 'Bolero', 'XUV300']
        },
        {
            make: 'Toyota',
            models: ['Innova Hycross', 'Fortuner', 'Glanza', 'Urban Cruiser Hyryder', 'Camry']
        },
        {
            make: 'Honda',
            models: ['City', 'Amaze', 'Elevate', 'Civic']
        },
        {
            make: 'Kia',
            models: ['Seltos', 'Sonet', 'Carens']
        }
    ];

    const products = await prisma.product.findMany();
    if (products.length === 0) {
        console.log('No products found. Please seed products first.');
        return;
    }

    let compatibilityCount = 0;

    for (const data of vehicleData) {
        const make = await prisma.vehicleMake.upsert({
            where: { name: data.make },
            update: {},
            create: { name: data.make },
        });

        for (const modelName of data.models) {
            const model = await prisma.vehicleModel.upsert({
                where: { name_makeId: { name: modelName, makeId: make.id } },
                update: {},
                create: { name: modelName, makeId: make.id },
            });

            // Randomly link some products to this model for testing
            const randomProducts = products.sort(() => 0.5 - Math.random()).slice(0, 10);
            
            for (const product of randomProducts) {
                await prisma.vehicleCompatibility.upsert({
                    where: {
                        productId_modelId_startYear: {
                            productId: product.id,
                            modelId: model.id,
                            startYear: 2015
                        }
                    },
                    update: {},
                    create: {
                        productId: product.id,
                        modelId: model.id,
                        startYear: 2015,
                        endYear: 2025
                    }
                });
                compatibilityCount++;
            }
        }
    }

    console.log(`Seeding completed. Created/Updated compatibility for ${compatibilityCount} mappings.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
