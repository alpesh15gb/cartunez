import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
                _count: {
                    select: { orders: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

export const getUserDetails = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    try {
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                orders: {
                    include: { items: { include: { product: true } } },
                    orderBy: { createdAt: 'desc' }
                }
            }
        });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user details', error });
    }
};
