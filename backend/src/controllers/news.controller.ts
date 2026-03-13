import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const createNews = async (req: Request, res: Response) => {
    const { title, content, imageUrl, externalUrl } = req.body;
    try {
        const news = await prisma.news.create({
            data: { title, content, imageUrl, externalUrl }
        });
        res.status(201).json(news);
    } catch (error) {
        res.status(500).json({ message: 'Error creating news post', error });
    }
};

export const getAllNews = async (req: Request, res: Response) => {
    try {
        const news = await prisma.news.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json(news);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching news', error });
    }
};

export const deleteNews = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.news.delete({ where: { id: String(id) } });
        res.json({ message: 'News post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting news post', error });
    }
};

export const updateNews = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, content, imageUrl, externalUrl, isActive } = req.body;
    try {
        const news = await prisma.news.update({
            where: { id: String(id) },
            data: { title, content, imageUrl, externalUrl, isActive }
        });
        res.json(news);
    } catch (error) {
        res.status(500).json({ message: 'Error updating news post', error });
    }
};
