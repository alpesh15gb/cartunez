"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Start seeding...');
    const productsData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'tmp', 'extracted_products.json'), 'utf8'));
    // Clear existing data to avoid conflicts (Optional, but good for fresh seed)
    // await prisma.orderItem.deleteMany();
    // await prisma.review.deleteMany();
    // await prisma.product.deleteMany();
    // await prisma.category.deleteMany();
    for (const item of productsData) {
        // 1. Ensure Category exists
        const categoryName = item.category || 'Uncategorized';
        let category = await prisma.category.findUnique({
            where: { name: categoryName },
        });
        if (!category) {
            category = await prisma.category.create({
                data: { name: categoryName },
            });
            console.log(`Created category: ${categoryName}`);
        }
        // 2. Create Product
        // We'll use a unique identifier or just rely on the name for now if we want to avoid duplicates
        const product = await prisma.product.upsert({
            where: { id: item.id }, // We'll try to use the Shopify ID as our ID
            update: {
                name: item.name,
                description: item.description,
                price: item.price,
                stockQuantity: 10, // Default stock
                images: item.image ? [item.image] : [],
                categoryId: category.id,
            },
            create: {
                id: item.id,
                name: item.name,
                description: item.description,
                price: item.price,
                stockQuantity: 10,
                images: item.image ? [item.image] : [],
                categoryId: category.id,
            },
        });
        console.log(`Upserted product: ${product.name}`);
    }
    console.log('Seeding finished.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map