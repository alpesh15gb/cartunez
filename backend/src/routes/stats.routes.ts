import { Router } from 'express';
import prisma from '../utils/prisma';

import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

router.get('/', authenticate, authorize(['ADMIN']), async (req, res) => {
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

        const pendingOrderCount = await prisma.order.count({
            where: { status: 'PENDING' }
        });

        res.json({
            totalProducts: productCount,
            totalCategories: categoryCount,
            totalOrders: orderCount,
            totalUsers: userCount,
            totalSales: totalSales._sum.totalAmount || 0,
            pendingOrders: pendingOrderCount
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error });
    }
});

export default router;
