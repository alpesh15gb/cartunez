import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { DiscountType } from '@prisma/client';

export const validateCoupon = async (req: Request, res: Response) => {
    const { code } = req.body;

    try {
        const coupon = await prisma.coupon.findUnique({
            where: { code, isActive: true },
        });

        if (!coupon) {
            return res.status(404).json({ message: 'Invalid or inactive coupon' });
        }

        if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
            return res.status(400).json({ message: 'Coupon has expired' });
        }

        res.json(coupon);
    } catch (error) {
        res.status(500).json({ message: 'Error validating coupon', error });
    }
};

export const getAllCoupons = async (req: Request, res: Response) => {
    try {
        const coupons = await prisma.coupon.findMany({
            orderBy: { createdAt: 'desc' },
        });
        res.json(coupons);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching coupons', error });
    }
};

export const createCoupon = async (req: Request, res: Response) => {
    const { code, discountType, discountAmount, expiryDate } = req.body;
    try {
        const coupon = await prisma.coupon.create({
            data: {
                code,
                discountType,
                discountAmount: parseFloat(discountAmount),
                expiryDate: expiryDate ? new Date(expiryDate) : null,
            },
        });
        res.status(201).json(coupon);
    } catch (error) {
        res.status(500).json({ message: 'Error creating coupon', error });
    }
};

export const deleteCoupon = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.coupon.delete({ where: { id: id as string } });
        res.json({ message: 'Coupon deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting coupon', error });
    }
};
