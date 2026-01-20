import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { VEHICLE_FITMENT_MODULE } from "../../../../../modules/vehicle-fitment"

/**
 * GET /store/vehicles/:makeId/models
 * List all models for a specific make
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const { makeId } = req.params
    const vehicleFitmentService = req.scope.resolve(VEHICLE_FITMENT_MODULE)

    try {
        const models = await vehicleFitmentService.listModelsByMake(makeId)

        res.json({
            models,
            count: models.length,
        })
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch vehicle models",
            error: error.message,
        })
    }
}
