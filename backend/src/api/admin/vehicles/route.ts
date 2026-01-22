// @ts-nocheck
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { VEHICLE_FITMENT_MODULE } from "../../../modules/vehicle-fitment"

/**
 * GET /admin/vehicles
 * List all vehicle makes (admin view with all data)
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const vehicleFitmentService = req.scope.resolve(VEHICLE_FITMENT_MODULE)

    try {
        const makes = await vehicleFitmentService.listVehicleMakes(
            {},
            { relations: ["models"], order: { display_order: "ASC", name: "ASC" } }
        )

        res.json({ makes, count: makes.length })
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch makes", error: error.message })
    }
}

/**
 * POST /admin/vehicles
 * Create a new vehicle make
 */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const { name, slug, logo_url, country, is_active, display_order } = req.body as {
        name: string
        slug: string
        logo_url?: string
        country?: string
        is_active?: boolean
        display_order?: number
    }

    if (!name || !slug) {
        return res.status(400).json({ message: "name and slug are required" })
    }

    const vehicleFitmentService = req.scope.resolve(VEHICLE_FITMENT_MODULE)

    try {
        const make = await vehicleFitmentService.createVehicleMakes({
            name,
            slug,
            logo_url,
            country,
            is_active: is_active ?? true,
            display_order: display_order ?? 0,
        })

        res.status(201).json({ make })
    } catch (error) {
        res.status(500).json({ message: "Failed to create make", error: error.message })
    }
}
