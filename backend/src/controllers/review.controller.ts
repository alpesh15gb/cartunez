import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middlewares/auth';

export const createReview = async (req: AuthRequest, res: Response) => {
    const { productId, rating, comment } = req.body;
    const userId = req.user.userId;

    try {
        const review = await prisma.review.create({
            data: {
                userId,
                productId,
                rating: parseInt(rating),
                comment,
            },
        });
        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: 'Error creating review', error });
    }
};

export const getProductReviews = async (req: AuthRequest, res: Response) => {
    const { productId } = req.params;
    try {
        const reviews = await prisma.review.findMany({
            where: { productId: productId as string },
            include: { user: { select: { email: true } } },
            orderBy: { createdAt: 'desc' },
        });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reviews', error });
    }
};
