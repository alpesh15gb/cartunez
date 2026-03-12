import { Router } from 'express';
import prisma from '../utils/prisma';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const productCount = await prisma.product.count();
        const categoryCount = await prisma.category.count();
        const orderCount = await prisma.order.count();
        const userCount = await prisma.user.count();

        // Mocking some sales data if none exists
        const totalSales = await prisma.order.aggregate({
            _sum: {
                totalAmount: true
            }
        });

        res.json({
            products: productCount,
            categories: categoryCount,
            orders: orderCount,
            customers: userCount,
            totalSales: totalSales._sum.totalAmount || 0
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error });
    }
});

export default router;
