// @ts-nocheck
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { VEHICLE_FITMENT_MODULE } from "../../../../../../modules/vehicle-fitment"

/**
 * GET /store/vehicles/models/:modelId/variants
 * List all variants for a specific model
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const { modelId } = req.params
    const vehicleFitmentService = req.scope.resolve(VEHICLE_FITMENT_MODULE)

    try {
        const variants = await vehicleFitmentService.listVariantsByModel(modelId)

        res.json({
            variants,
            count: variants.length,
        })
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch vehicle variants",
            error: error.message,
        })
    }
}
