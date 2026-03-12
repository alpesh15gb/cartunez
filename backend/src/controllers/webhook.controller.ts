import { Request, Response } from 'express';
import crypto from 'crypto';
import prisma from '../utils/prisma';

export const handleRazorpayWebhook = async (req: Request, res: Response) => {
    const signature = req.headers['x-razorpay-signature'] as string;
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || '';

    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(JSON.stringify(req.body))
        .digest('hex');

    if (signature !== expectedSignature) {
        return res.status(400).send('Invalid signature');
    }

    const { event, payload } = req.body;

    if (event === 'payment.captured') {
        const payment = payload.payment.entity;
        const orderId = payment.notes.orderId; // We passed this in receipt or notes

        await prisma.order.update({
            where: { id: orderId },
            data: {
                status: 'PROCESSING',
                razorpayPaymentId: payment.id,
            },
        });
    }

    res.json({ status: 'ok' });
};
