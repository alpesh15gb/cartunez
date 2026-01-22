// @ts-nocheck
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import CODService from "../../../../../services/cod"

const codService = new CODService()

/**
 * POST /store/payments/cod-check
 * Check COD eligibility for an order
 * 
 * Body: { pincode: string, orderAmount: number }
 */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const { pincode, orderAmount } = req.body as {
        pincode: string
        orderAmount: number
    }

    if (!pincode || orderAmount === undefined) {
        return res.status(400).json({ message: "pincode and orderAmount are required" })
    }

    try {
        const eligibility = codService.checkCODEligibility({
            pincode,
            orderAmount,
            paymentMethod: "cod",
        })

        const delivery = codService.getEstimatedDelivery(pincode)

        res.json({
            cod: {
                eligible: eligibility.eligible,
                reason: eligibility.reason,
                fee: eligibility.codFee || 0,
                maxAmount: eligibility.maxCodAmount,
            },
            delivery: {
                days: delivery.days,
                estimate: delivery.message,
                tier: codService.getServiceTier(pincode),
            },
        })
    } catch (error) {
        res.status(500).json({
            message: "Failed to check COD eligibility",
            error: error.message,
        })
    }
}
