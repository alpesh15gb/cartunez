import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middlewares/auth';
import { createRazorpayOrder } from '../services/razorpay.service';
import { createShiprocketOrder } from '../services/shiprocket.service';

export const createOrder = async (req: AuthRequest, res: Response) => {
    const { items, totalAmount, paymentMethod, shippingAddress, couponId } = req.body;
    const userId = req.user.userId;

    try {
        const order = await prisma.order.create({
            data: {
                userId,
                totalAmount: parseFloat(totalAmount),
                paymentMethod,
                shippingAddress,
                couponId,
                items: {
                    create: items.map((item: any) => ({
                        productId: item.productId,
                        quantity: parseInt(item.quantity),
                        price: parseFloat(item.price),
                    })),
                },
            },
            include: { items: { include: { product: true } } },
        });

        // If Razorpay, create a payment order
        if (paymentMethod === 'RAZORPAY') {
            const razorpayOrder = await createRazorpayOrder(order.totalAmount, 'INR', order.id);
            await prisma.order.update({
                where: { id: order.id },
                data: { razorpayOrderId: razorpayOrder.id }
            });
            return res.status(201).json({ ...order, razorpayOrderId: razorpayOrder.id });
        }

        // Simplified Shiprocket order creation (usually done after payment success)
        // For COD, we can create it immediately
        if (paymentMethod === 'CASH_ON_DELIVERY') {
            // Logic to format order for Shiprocket would go here
            // const shiprocketOrder = await createShiprocketOrder({...});
        }

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error creating order', error });
    }
};

export const getMyOrders = async (req: AuthRequest, res: Response) => {
    const userId = req.user.userId;
    try {
        const orders = await prisma.order.findMany({
            where: { userId },
            include: { items: { include: { product: true } } },
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error });
    }
};

export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const orders = await prisma.order.findMany({
            include: { user: { select: { email: true } }, items: true },
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching all orders', error });
    }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const order = await prisma.order.update({
            where: { id: id as string },
            data: { status },
        });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error updating order status', error });
    }
};

export const getOrderById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const order = await prisma.order.findUnique({
            where: { id: id as string },
            include: { items: { include: { product: true } } },
        });
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order', error });
    }
};
