import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import RazorpayService from "../../../../services/razorpay"

const razorpay = new RazorpayService()

/**
 * POST /store/payments/razorpay/verify
 * Verify Razorpay payment signature
 * 
 * Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body as {
        razorpay_order_id: string
        razorpay_payment_id: string
        razorpay_signature: string
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({
            message: "razorpay_order_id, razorpay_payment_id, and razorpay_signature are required",
        })
    }

    try {
        const isValid = razorpay.verifyPayment({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        })

        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed. Invalid signature.",
            })
        }

        // Fetch payment details
        const payment = await razorpay.fetchPayment(razorpay_payment_id)

        res.json({
            success: true,
            message: "Payment verified successfully",
            payment: {
                id: payment.id,
                amount: payment.amount / 100, // Convert back to INR
                currency: payment.currency,
                status: payment.status,
                method: payment.method,
                email: payment.email,
                contact: payment.contact,
            },
        })
    } catch (error) {
        res.status(500).json({
            message: "Payment verification failed",
            error: error.message,
        })
    }
}
