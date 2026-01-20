/**
 * COD (Cash on Delivery) Rules Service
 * Handles eligibility checks and COD fee calculations for India
 */

interface CODCheckInput {
    pincode: string
    orderAmount: number
    paymentMethod: string
}

interface CODCheckResult {
    eligible: boolean
    reason?: string
    codFee?: number
    maxCodAmount?: number
}

// COD configuration
const COD_CONFIG = {
    minOrderAmount: 200, // Minimum order for COD in INR
    maxOrderAmount: 50000, // Maximum COD order in INR
    codFee: 40, // COD handling fee in INR
    codFeeThreshold: 1000, // Orders above this amount have no COD fee

    // Blocked pincodes (high-risk areas)
    blockedPincodes: [
        // Add pincodes as needed
    ] as string[],

    // Service tiers based on pincode prefix
    serviceTiers: {
        metro: ["110", "400", "600", "700", "560", "500"], // Delhi, Mumbai, Chennai, Kolkata, Bangalore, Hyderabad
        urban: ["411", "380", "641", "682", "226", "302"], // Pune, Ahmedabad, Coimbatore, Kochi, Lucknow, Jaipur
    },
}

class CODService {
    /**
     * Check if COD is available for an order
     */
    checkCODEligibility(input: CODCheckInput): CODCheckResult {
        const { pincode, orderAmount } = input

        // Validate pincode format
        if (!pincode || pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
            return {
                eligible: false,
                reason: "Invalid pincode format",
            }
        }

        // Check blocked pincodes
        if (COD_CONFIG.blockedPincodes.includes(pincode)) {
            return {
                eligible: false,
                reason: "COD not available in this area",
            }
        }

        // Check minimum order amount
        if (orderAmount < COD_CONFIG.minOrderAmount) {
            return {
                eligible: false,
                reason: `Minimum order amount for COD is ₹${COD_CONFIG.minOrderAmount}`,
            }
        }

        // Check maximum order amount
        if (orderAmount > COD_CONFIG.maxOrderAmount) {
            return {
                eligible: false,
                reason: `COD not available for orders above ₹${COD_CONFIG.maxOrderAmount}. Please use online payment.`,
                maxCodAmount: COD_CONFIG.maxOrderAmount,
            }
        }

        // Calculate COD fee
        const codFee = orderAmount >= COD_CONFIG.codFeeThreshold ? 0 : COD_CONFIG.codFee

        return {
            eligible: true,
            codFee,
            maxCodAmount: COD_CONFIG.maxOrderAmount,
        }
    }

    /**
     * Get service tier for pincode
     */
    getServiceTier(pincode: string): "metro" | "urban" | "standard" {
        const prefix = pincode.slice(0, 3)

        if (COD_CONFIG.serviceTiers.metro.includes(prefix)) {
            return "metro"
        }
        if (COD_CONFIG.serviceTiers.urban.includes(prefix)) {
            return "urban"
        }
        return "standard"
    }

    /**
     * Get estimated delivery time based on pincode
     */
    getEstimatedDelivery(pincode: string): { days: number; message: string } {
        const tier = this.getServiceTier(pincode)

        switch (tier) {
            case "metro":
                return { days: 2, message: "2-3 business days" }
            case "urban":
                return { days: 4, message: "4-5 business days" }
            default:
                return { days: 7, message: "5-7 business days" }
        }
    }

    /**
     * Validate shipping pincode
     */
    async validatePincode(pincode: string): Promise<{
        valid: boolean
        city?: string
        state?: string
        deliveryAvailable: boolean
        codAvailable: boolean
    }> {
        // In production, integrate with pincode API (India Post, logistics provider)
        // For now, basic validation
        if (!pincode || pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
            return {
                valid: false,
                deliveryAvailable: false,
                codAvailable: false,
            }
        }

        // Mock successful validation
        return {
            valid: true,
            city: "City", // Replace with actual lookup
            state: "State",
            deliveryAvailable: true,
            codAvailable: !COD_CONFIG.blockedPincodes.includes(pincode),
        }
    }
}

export default CODService
