/**
 * Razorpay Payment Service
 * Handles payment creation and verification for Razorpay integration
 */

import crypto from "crypto"

interface RazorpayOrder {
    id: string
    entity: string
    amount: number
    amount_paid: number
    amount_due: number
    currency: string
    receipt: string
    status: string
}

interface CreateOrderInput {
    amount: number // Amount in paisa (INR * 100)
    currency?: string
    receipt: string
    notes?: Record<string, string>
}

interface VerifyPaymentInput {
    razorpay_order_id: string
    razorpay_payment_id: string
    razorpay_signature: string
}

class RazorpayService {
    private keyId: string
    private keySecret: string
    private baseUrl = "https://api.razorpay.com/v1"

    constructor() {
        this.keyId = process.env.RAZORPAY_KEY_ID || ""
        this.keySecret = process.env.RAZORPAY_KEY_SECRET || ""
    }

    /**
     * Check if Razorpay is configured
     */
    isConfigured(): boolean {
        return !!(this.keyId && this.keySecret)
    }

    /**
     * Create a Razorpay order
     */
    async createOrder(input: CreateOrderInput): Promise<RazorpayOrder> {
        if (!this.isConfigured()) {
            throw new Error("Razorpay is not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET")
        }

        const auth = Buffer.from(`${this.keyId}:${this.keySecret}`).toString("base64")

        const response = await fetch(`${this.baseUrl}/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Basic ${auth}`,
            },
            body: JSON.stringify({
                amount: input.amount,
                currency: input.currency || "INR",
                receipt: input.receipt,
                notes: input.notes || {},
            }),
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(`Razorpay API error: ${error.error?.description || response.statusText}`)
        }

        return response.json()
    }

    /**
     * Verify Razorpay payment signature
     */
    verifyPayment(input: VerifyPaymentInput): boolean {
        if (!this.isConfigured()) {
            throw new Error("Razorpay is not configured")
        }

        const expectedSignature = crypto
            .createHmac("sha256", this.keySecret)
            .update(`${input.razorpay_order_id}|${input.razorpay_payment_id}`)
            .digest("hex")

        return expectedSignature === input.razorpay_signature
    }

    /**
     * Fetch payment details
     */
    async fetchPayment(paymentId: string): Promise<any> {
        if (!this.isConfigured()) {
            throw new Error("Razorpay is not configured")
        }

        const auth = Buffer.from(`${this.keyId}:${this.keySecret}`).toString("base64")

        const response = await fetch(`${this.baseUrl}/payments/${paymentId}`, {
            headers: {
                Authorization: `Basic ${auth}`,
            },
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch payment: ${response.statusText}`)
        }

        return response.json()
    }

    /**
     * Initiate refund
     */
    async createRefund(paymentId: string, amount?: number): Promise<any> {
        if (!this.isConfigured()) {
            throw new Error("Razorpay is not configured")
        }

        const auth = Buffer.from(`${this.keyId}:${this.keySecret}`).toString("base64")

        const body: Record<string, any> = {}
        if (amount) {
            body.amount = amount // Amount in paisa
        }

        const response = await fetch(`${this.baseUrl}/payments/${paymentId}/refund`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Basic ${auth}`,
            },
            body: JSON.stringify(body),
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(`Refund failed: ${error.error?.description || response.statusText}`)
        }

        return response.json()
    }

    /**
     * Get public key for frontend
     */
    getPublicKey(): string {
        return this.keyId
    }
}

export default RazorpayService
