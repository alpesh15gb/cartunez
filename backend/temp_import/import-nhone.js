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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const fs = __importStar(require("fs"));
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const data = JSON.parse(fs.readFileSync('nhone_products.json', 'utf8'));
        for (const [categoryName, products] of Object.entries(data)) {
            console.log(`Processing category: ${categoryName}`);
            // Find or create category
            let category = yield prisma.category.findFirst({
                where: { name: { contains: categoryName, mode: 'insensitive' } }
            });
            if (!category) {
                console.log(`Creating new category: ${categoryName}`);
                category = yield prisma.category.create({
                    data: {
                        name: categoryName,
                        slug: categoryName.toLowerCase().replace(/ /g, '-'),
                        image: ((_a = products[0]) === null || _a === void 0 ? void 0 : _a.images[0]) || ''
                    }
                });
            }
            const typedProducts = products;
            // Use a Set to track names and avoid duplicates within the same import
            const seenNames = new Set();
            for (const productData of typedProducts) {
                if (seenNames.has(productData.name))
                    continue;
                seenNames.add(productData.name);
                console.log(`Importing product: ${productData.name}`);
                try {
                    yield prisma.product.create({
                        data: {
                            name: productData.name,
                            description: productData.description,
                            price: productData.price,
                            discountPrice: productData.discountPrice,
                            images: productData.images,
                            stockQuantity: productData.stockQuantity,
                            categoryId: category.id,
                            slug: productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 50) + '-' + Math.random().toString(36).substring(2, 5)
                        }
                    });
                }
                catch (error) {
                    console.error(`Failed to import ${productData.name}:`, error);
                }
            }
        }
        console.log('Import complete!');
    });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
