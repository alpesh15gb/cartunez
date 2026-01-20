import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { VEHICLE_FITMENT_MODULE } from "../../../../../../modules/vehicle-fitment"

/**
 * GET /store/vehicles/models/:modelId/years
 * Get all available years for a specific model
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const { modelId } = req.params
    const vehicleFitmentService = req.scope.resolve(VEHICLE_FITMENT_MODULE)

    try {
        const years = await vehicleFitmentService.getYearsForModel(modelId)

        res.json({
            years,
            count: years.length,
        })
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch years for model",
            error: error.message,
        })
    }
}
