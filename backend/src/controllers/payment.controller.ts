import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { verifyRazorpaySignature } from '../services/razorpay.service';

export const verifyPayment = async (req: Request, res: Response) => {
    const { orderId, razorpayPaymentId, razorpaySignature } = req.body;

    try {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
        });

        if (!order || !order.razorpayOrderId) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const isValid = verifyRazorpaySignature(order.razorpayOrderId, razorpayPaymentId, razorpaySignature);

        if (isValid) {
            await prisma.order.update({
                where: { id: orderId },
                data: {
                    status: 'PROCESSING',
                    razorpayPaymentId,
                    razorpaySignature,
                },
            });
            res.json({ message: 'Payment verified successfully' });
        } else {
            res.status(400).json({ message: 'Invalid payment signature' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error verifying payment', error });
    }
};
