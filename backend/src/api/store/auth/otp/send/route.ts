import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { OTP_AUTH_MODULE } from "../../../../modules/otp-auth"

/**
 * POST /store/auth/otp/send
 * Request OTP for phone verification
 * 
 * Body: { phone: string }
 */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const { phone } = req.body as { phone: string }

    if (!phone) {
        return res.status(400).json({ message: "Phone number is required" })
    }

    const otpAuthService = req.scope.resolve(OTP_AUTH_MODULE)

    try {
        const result = await otpAuthService.sendOtp(phone)

        if (!result.success) {
            return res.status(400).json({ message: result.message })
        }

        res.json({
            success: true,
            message: result.message,
            // Only include OTP in development for testing
            ...(result.otp && { otp: result.otp }),
        })
    } catch (error) {
        res.status(500).json({
            message: "Failed to send OTP",
            error: error.message,
        })
    }
}
