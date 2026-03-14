import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import prisma from '../utils/prisma';

export const getWishlist = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const wishlist = await prisma.wishlistItem.findMany({
            where: { userId },
            include: { product: true },
        });
        res.json(wishlist);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching wishlist', error });
    }
};

export const addToWishlist = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const { productId } = req.body;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const item = await prisma.wishlistItem.upsert({
            where: {
                userId_productId: {
                    userId,
                    productId
                }
            },
            create: {
                userId,
                productId,
            },
            update: {}, // No changes needed if already exists
            include: { product: true },
        });
        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ message: 'Error adding to wishlist', error });
    }
};

export const removeFromWishlist = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const { id } = req.params;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    try {
        await prisma.wishlistItem.deleteMany({
            where: {
                id: id as string,
                userId,
            },
        });
        res.json({ message: 'Removed from wishlist' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing from wishlist', error });
    }
};
