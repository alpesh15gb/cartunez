// @ts-nocheck
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { VEHICLE_FITMENT_MODULE } from "../../../modules/vehicle-fitment"

/**
 * GET /admin/fitments
 * List all fitment mappings with optional filters
 * Query: ?productId=xxx, ?verified=true/false
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const { productId, verified, limit = "50", offset = "0" } = req.query as {
        productId?: string
        verified?: string
        limit?: string
        offset?: string
    }

    const vehicleFitmentService = req.scope.resolve(VEHICLE_FITMENT_MODULE)

    try {
        const filters: Record<string, any> = {}
        if (productId) filters.product_id = productId
        if (verified !== undefined) filters.is_verified = verified === "true"

        const fitments = await vehicleFitmentService.listProductFitments(filters, {
            relations: ["variant", "variant.model", "variant.model.make"],
            take: parseInt(limit),
            skip: parseInt(offset),
        })

        res.json({
            fitments,
            count: fitments.length,
            limit: parseInt(limit),
            offset: parseInt(offset),
        })
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch fitments", error: error.message })
    }
}

/**
 * POST /admin/fitments
 * Create a new product fitment mapping
 */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const {
        product_id,
        variant_id,
        fitment_type,
        fitment_notes,
        installation_time_mins,
        requires_professional,
    } = req.body as {
        product_id: string
        variant_id: string
        fitment_type?: "direct" | "universal" | "with_adapter"
        fitment_notes?: string
        installation_time_mins?: number
        requires_professional?: boolean
    }

    if (!product_id || !variant_id) {
        return res.status(400).json({ message: "product_id and variant_id are required" })
    }

    const vehicleFitmentService = req.scope.resolve(VEHICLE_FITMENT_MODULE)

    try {
        const fitment = await vehicleFitmentService.createProductFitments({
            product_id,
            variant_id,
            fitment_type: fitment_type || "direct",
            fitment_notes,
            installation_time_mins,
            requires_professional: requires_professional ?? false,
        })

        res.status(201).json({ fitment })
    } catch (error) {
        res.status(500).json({ message: "Failed to create fitment", error: error.message })
    }
}
