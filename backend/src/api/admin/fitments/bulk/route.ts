// @ts-nocheck
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { VEHICLE_FITMENT_MODULE } from "../../../../modules/vehicle-fitment"

/**
 * POST /admin/fitments/bulk
 * Bulk create fitment mappings from CSV-like data
 */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const { fitments } = req.body as {
        fitments: Array<{
            product_id: string
            variant_id: string
            fitment_type?: "direct" | "universal" | "with_adapter"
            fitment_notes?: string
        }>
    }

    if (!fitments || !Array.isArray(fitments) || fitments.length === 0) {
        return res.status(400).json({ message: "fitments array is required" })
    }

    const vehicleFitmentService = req.scope.resolve(VEHICLE_FITMENT_MODULE)

    try {
        const results = await vehicleFitmentService.bulkCreateFitments(fitments)

        res.status(201).json({
            message: `Successfully created ${results.length} fitments`,
            count: results.length,
            fitments: results,
        })
    } catch (error) {
        res.status(500).json({ message: "Failed to bulk create fitments", error: error.message })
    }
}
