// @ts-nocheck
import { MedusaService } from "@medusajs/framework/utils"
import { OtpRequest } from "./models"

// OTP configuration
const OTP_EXPIRY_MINUTES = 5
const OTP_MAX_ATTEMPTS = 3
const OTP_LENGTH = 6

class OtpAuthModuleService extends MedusaService({
    OtpRequest,
}) {
    /**
     * Generate a random OTP code
     */
    private generateOtp(): string {
        const digits = "0123456789"
        let otp = ""
        for (let i = 0; i < OTP_LENGTH; i++) {
            otp += digits[Math.floor(Math.random() * 10)]
        }
        return otp
    }

    /**
     * Send OTP to phone number
     * In production, integrate with SMS gateway (MSG91, Twilio, etc.)
     */
    async sendOtp(phone: string): Promise<{ success: boolean; message: string; otp?: string }> {
        // Validate phone format (Indian 10-digit)
        const cleanPhone = phone.replace(/\D/g, "")
        if (cleanPhone.length !== 10) {
            return { success: false, message: "Invalid phone number. Please enter 10 digits." }
        }

        // Check for existing unexpired OTP
        const existingRequests = await this.listOtpRequests({
            phone: cleanPhone,
            is_verified: false,
        })

        // Delete old requests
        for (const req of existingRequests) {
            await this.deleteOtpRequests(req.id)
        }

        // Generate new OTP
        const otp = this.generateOtp()
        const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000)

        // Store OTP request
        await this.createOtpRequests({
            phone: cleanPhone,
            otp,
            is_verified: false,
            attempts: 0,
            expires_at: expiresAt,
        })

        // TODO: Integrate with SMS gateway
        // await this.sendSms(cleanPhone, `Your CarTunez OTP is: ${otp}`)

        // For development, return OTP (remove in production!)
        console.log(`📱 OTP for ${cleanPhone}: ${otp}`)

        return {
            success: true,
            message: `OTP sent to ${cleanPhone.slice(0, 2)}****${cleanPhone.slice(-2)}`,
            otp: process.env.NODE_ENV === "development" ? otp : undefined,
        }
    }

    /**
     * Verify OTP code
     */
    async verifyOtp(
        phone: string,
        otp: string
    ): Promise<{ success: boolean; message: string; phone?: string }> {
        const cleanPhone = phone.replace(/\D/g, "")

        // Find OTP request
        const requests = await this.listOtpRequests({
            phone: cleanPhone,
            is_verified: false,
        })

        if (requests.length === 0) {
            return { success: false, message: "No OTP request found. Please request a new OTP." }
        }

        const otpRequest = requests[0]

        // Check expiry
        if (new Date(otpRequest.expires_at) < new Date()) {
            await this.deleteOtpRequests(otpRequest.id)
            return { success: false, message: "OTP expired. Please request a new one." }
        }

        // Check attempts
        if (otpRequest.attempts >= OTP_MAX_ATTEMPTS) {
            await this.deleteOtpRequests(otpRequest.id)
            return { success: false, message: "Too many attempts. Please request a new OTP." }
        }

        // Verify OTP
        if (otpRequest.otp !== otp) {
            await this.updateOtpRequests({
                id: otpRequest.id,
                attempts: otpRequest.attempts + 1,
            })
            return {
                success: false,
                message: `Invalid OTP. ${OTP_MAX_ATTEMPTS - otpRequest.attempts - 1} attempts remaining.`,
            }
        }

        // Mark as verified
        await this.updateOtpRequests({
            id: otpRequest.id,
            is_verified: true,
        })

        return {
            success: true,
            message: "Phone verified successfully",
            phone: cleanPhone,
        }
    }

    /**
     * Send SMS via MSG91
     * Configure MSG91_AUTH_KEY, MSG91_SENDER_ID, MSG91_TEMPLATE_ID in env
     */
    private async sendSms(phone: string, message: string): Promise<void> {
        const authKey = process.env.MSG91_AUTH_KEY
        const senderId = process.env.MSG91_SENDER_ID
        const templateId = process.env.MSG91_TEMPLATE_ID

        if (!authKey) {
            console.log("⚠️ MSG91_AUTH_KEY not configured. SMS not sent.")
            return
        }

        try {
            const response = await fetch("https://api.msg91.com/api/v5/flow/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authkey: authKey,
                },
                body: JSON.stringify({
                    template_id: templateId,
                    sender: senderId,
                    short_url: "0",
                    mobiles: `91${phone}`,
                    VAR1: message,
                }),
            })

            if (!response.ok) {
                throw new Error(`SMS API error: ${response.statusText}`)
            }
        } catch (error) {
            console.error("Failed to send SMS:", error)
            throw error
        }
    }
}

export default OtpAuthModuleService
