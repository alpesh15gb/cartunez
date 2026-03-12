import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getMakes = async (req: Request, res: Response) => {
    try {
        const makes = await (prisma as any).vehicleMake.findMany({
            orderBy: { name: 'asc' }
        });
        res.json(makes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching makes', error });
    }
};

export const getModelsByMake = async (req: Request, res: Response) => {
    const { makeId } = req.params;
    try {
        const models = await (prisma as any).vehicleModel.findMany({
            where: { makeId },
            orderBy: { name: 'asc' }
        });
        res.json(models);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching models', error });
    }
};

export const getYearsByModel = async (req: Request, res: Response) => {
    const { modelId } = req.params;
    try {
        const compatibilities = await (prisma as any).vehicleCompatibility.findMany({
            where: { modelId },
            select: { startYear: true, endYear: true }
        });
        
        // Extract unique years from ranges
        const years = new Set<number>();
        compatibilities.forEach((comp: { startYear: number; endYear: number | null }) => {
            const end = comp.endYear || new Date().getFullYear();
            for (let y = comp.startYear; y <= end; y++) {
                years.add(y);
            }
        });
        
        res.json(Array.from(years).sort((a, b) => b - a));
    } catch (error) {
        res.status(500).json({ message: 'Error fetching years', error });
    }
};
