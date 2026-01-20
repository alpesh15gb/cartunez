import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { VEHICLE_FITMENT_MODULE } from "../../../modules/vehicle-fitment"

/**
 * POST /store/fitment/check
 * Check if a product fits a specific vehicle variant
 * 
 * Body: { productId: string, variantId: string }
 */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const { productId, variantId } = req.body as {
        productId: string
        variantId: string
    }

    if (!productId || !variantId) {
        return res.status(400).json({
            message: "productId and variantId are required",
        })
    }

    const vehicleFitmentService = req.scope.resolve(VEHICLE_FITMENT_MODULE)

    try {
        const result = await vehicleFitmentService.checkFitment(productId, variantId)

        res.json({
            fits: result.fits,
            fitment: result.fitment
                ? {
                    type: result.fitment.fitment_type,
                    notes: result.fitment.fitment_notes,
                    installationTime: result.fitment.installation_time_mins,
                    requiresProfessional: result.fitment.requires_professional,
                    isVerified: result.fitment.is_verified,
                }
                : null,
        })
    } catch (error) {
        res.status(500).json({
            message: "Failed to check fitment",
            error: error.message,
        })
    }
}

/**
 * GET /store/fitment
 * Get products for a vehicle or vehicles for a product
 * 
 * Query: ?variantId=xxx OR ?productId=xxx
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const { variantId, productId } = req.query as {
        variantId?: string
        productId?: string
    }

    if (!variantId && !productId) {
        return res.status(400).json({
            message: "Either variantId or productId query param is required",
        })
    }

    const vehicleFitmentService = req.scope.resolve(VEHICLE_FITMENT_MODULE)

    try {
        if (variantId) {
            // Get products compatible with this vehicle
            const products = await vehicleFitmentService.getProductsForVehicle(variantId)
            return res.json({
                type: "products_for_vehicle",
                variantId,
                products,
                count: products.length,
            })
        }

        if (productId) {
            // Get vehicles compatible with this product
            const fitments = await vehicleFitmentService.getVehiclesForProduct(productId)
            return res.json({
                type: "vehicles_for_product",
                productId,
                fitments: fitments.map((f) => ({
                    id: f.id,
                    vehicle: {
                        variant: f.variant?.name,
                        model: f.variant?.model?.name,
                        make: f.variant?.model?.make?.name,
                        yearStart: f.variant?.year_start,
                        yearEnd: f.variant?.year_end,
                    },
                    fitmentType: f.fitment_type,
                    notes: f.fitment_notes,
                })),
                count: fitments.length,
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to get fitment data",
            error: error.message,
        })
    }
}
