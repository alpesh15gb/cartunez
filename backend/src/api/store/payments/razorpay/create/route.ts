// @ts-nocheck
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import RazorpayService from "../../../../../services/razorpay"

const razorpay = new RazorpayService()

/**
 * POST /store/payments/razorpay/create
 * Create a Razorpay order for payment
 * 
 * Body: { amount: number, orderId: string }
 */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const { amount, orderId } = req.body as {
        amount: number // Amount in INR (will be converted to paisa)
        orderId: string
    }

    if (!amount || !orderId) {
        return res.status(400).json({ message: "amount and orderId are required" })
    }

    if (!razorpay.isConfigured()) {
        return res.status(503).json({
            message: "Payment service not configured",
            configured: false,
        })
    }

    try {
        const order = await razorpay.createOrder({
            amount: Math.round(amount * 100), // Convert to paisa
            currency: "INR",
            receipt: orderId,
            notes: {
                order_id: orderId,
            },
        })

        res.json({
            success: true,
            order: {
                id: order.id,
                amount: order.amount,
                currency: order.currency,
                receipt: order.receipt,
            },
            key: razorpay.getPublicKey(),
        })
    } catch (error) {
        res.status(500).json({
            message: "Failed to create payment order",
            error: error.message,
        })
    }
}
