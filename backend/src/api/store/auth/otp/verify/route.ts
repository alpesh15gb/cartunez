import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { OTP_AUTH_MODULE } from "../../../../../modules/otp-auth"
import { Modules } from "@medusajs/framework/utils"

/**
 * POST /store/auth/otp/verify
 * Verify OTP and authenticate user
 * 
 * Body: { phone: string, otp: string }
 */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const { phone, otp } = req.body as { phone: string; otp: string }

    if (!phone || !otp) {
        return res.status(400).json({ message: "Phone and OTP are required" })
    }

    const otpAuthService = req.scope.resolve(OTP_AUTH_MODULE)
    const customerService = req.scope.resolve(Modules.CUSTOMER)

    try {
        // Verify OTP
        const result = await otpAuthService.verifyOtp(phone, otp)

        if (!result.success) {
            return res.status(400).json({ message: result.message })
        }

        // Find or create customer
        let customer
        const existingCustomers = await customerService.listCustomers({
            phone: result.phone,
        })

        if (existingCustomers.length > 0) {
            customer = existingCustomers[0]
        } else {
            // Create new customer
            customer = await customerService.createCustomers({
                phone: result.phone,
                has_account: true,
            })
        }

        // TODO: Generate JWT token using Medusa's auth system
        // For now, return customer data
        res.json({
            success: true,
            message: "Login successful",
            customer: {
                id: customer.id,
                phone: customer.phone,
                email: customer.email,
                first_name: customer.first_name,
                last_name: customer.last_name,
                has_account: customer.has_account,
            },
        })
    } catch (error) {
        res.status(500).json({
            message: "Failed to verify OTP",
            error: error.message,
        })
    }
}
