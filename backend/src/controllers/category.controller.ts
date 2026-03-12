import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const createCategory = async (req: Request, res: Response) => {
    const { name } = req.body;
    try {
        const category = await prisma.category.create({ data: { name } });
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Error creating category', error });
    }
};

export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await prisma.category.findMany();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error });
    }
};
