// @ts-nocheck
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { VEHICLE_FITMENT_MODULE } from "../../../modules/vehicle-fitment"

/**
 * GET /store/vehicles/makes
 * List all vehicle makes with their models
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const vehicleFitmentService = req.scope.resolve(VEHICLE_FITMENT_MODULE)

    try {
        const makes = await vehicleFitmentService.listMakesWithModels()

        res.json({
            makes,
            count: makes.length,
        })
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch vehicle makes",
            error: error.message,
        })
    }
}
