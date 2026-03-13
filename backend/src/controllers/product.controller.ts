import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const createProduct = async (req: Request, res: Response) => {
    const { name, description, price, discountPrice, stockQuantity, images, categoryId } = req.body;
    try {
        const product = await prisma.product.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                discountPrice: discountPrice ? parseFloat(discountPrice) : null,
                stockQuantity: parseInt(stockQuantity),
                images,
                categoryId,
            },
        });
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error creating product', error });
    }
};

export const getProducts = async (req: Request, res: Response) => {
    const { categoryId, search, modelId, year, page } = req.query;
    try {
        const whereClause = {
            AND: [
                categoryId ? { categoryId: categoryId as string } : {},
                search ? {
                    OR: [
                        { name: { contains: search as string, mode: 'insensitive' as any } },
                        { description: { contains: search as string, mode: 'insensitive' as any } },
                    ]
                } : {},
                modelId ? {
                    compatibilities: {
                        some: {
                            modelId: modelId as string,
                            AND: [
                                year ? { startYear: { lte: parseInt(year as string) } } : {},
                                year ? {
                                    OR: [
                                        { endYear: null },
                                        { endYear: { gte: parseInt(year as string) } }
                                    ]
                                } : {}
                            ]
                        }
                    }
                } : {}
            ]
        };

        const pageNum = parseInt(page as string) || 1;
        const limit = 20;
        const skip = (pageNum - 1) * limit;

        const [products, total] = await Promise.all([
            (prisma as any).product.findMany({
                where: whereClause,
                include: { category: true },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.product.count({ where: whereClause })
        ]);

        res.json({
            products,
            pagination: {
                total,
                page: pageNum,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
    }
};

export const getProductById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const product = await prisma.product.findUnique({
            where: { id: id as string },
            include: { category: true },
        });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product', error });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, price, discountPrice, stockQuantity, images, categoryId } = req.body;
    try {
        const product = await prisma.product.update({
            where: { id: id as string },
            data: {
                name,
                description,
                price: price ? parseFloat(price) : undefined,
                discountPrice: discountPrice !== undefined ? (discountPrice ? parseFloat(discountPrice) : null) : undefined,
                stockQuantity: stockQuantity !== undefined ? parseInt(stockQuantity) : undefined,
                images,
                categoryId,
            },
        });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        // First delete dependent records if not handled by Cascade
        await (prisma as any).vehicleCompatibility.deleteMany({ where: { productId: id } });
        await (prisma as any).review.deleteMany({ where: { productId: id } });
        
        await prisma.product.delete({
            where: { id: id as string },
        });
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error });
    }
};
