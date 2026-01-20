import { MedusaService } from "@medusajs/framework/utils"
import { VehicleMake, VehicleModel, VehicleVariant, ProductFitment } from "./models"

class VehicleFitmentModuleService extends MedusaService({
    VehicleMake,
    VehicleModel,
    VehicleVariant,
    ProductFitment,
}) {
    /**
     * Get all active makes with their models
     */
    async listMakesWithModels() {
        return await this.listVehicleMakes(
            { is_active: true },
            {
                relations: ["models"],
                order: { display_order: "ASC", name: "ASC" },
            }
        )
    }

    /**
     * Get models for a specific make
     */
    async listModelsByMake(makeId: string) {
        return await this.listVehicleModels(
            { make_id: makeId, is_active: true },
            {
                order: { display_order: "ASC", name: "ASC" },
            }
        )
    }

    /**
     * Get variants for a specific model
     */
    async listVariantsByModel(modelId: string) {
        return await this.listVehicleVariants(
            { model_id: modelId, is_active: true },
            {
                order: { year_start: "DESC", name: "ASC" },
            }
        )
    }

    /**
     * Get years available for a model
     */
    async getYearsForModel(modelId: string) {
        const variants = await this.listVehicleVariants({
            model_id: modelId,
            is_active: true,
        })

        const years = new Set<number>()
        const currentYear = new Date().getFullYear()

        for (const variant of variants) {
            const endYear = variant.year_end || currentYear
            for (let year = variant.year_start; year <= endYear; year++) {
                years.add(year)
            }
        }

        return Array.from(years).sort((a, b) => b - a)
    }

    /**
     * Check if a product fits a specific vehicle variant
     */
    async checkFitment(productId: string, variantId: string) {
        const fitments = await this.listProductFitments({
            product_id: productId,
            variant_id: variantId,
        })

        if (fitments.length === 0) {
            return { fits: false, fitment: null }
        }

        return { fits: true, fitment: fitments[0] }
    }

    /**
     * Get all products compatible with a vehicle variant
     */
    async getProductsForVehicle(variantId: string) {
        const fitments = await this.listProductFitments(
            { variant_id: variantId },
            { select: ["product_id", "fitment_type", "fitment_notes"] }
        )

        return fitments.map((f) => ({
            productId: f.product_id,
            fitmentType: f.fitment_type,
            notes: f.fitment_notes,
        }))
    }

    /**
     * Get all compatible vehicles for a product
     */
    async getVehiclesForProduct(productId: string) {
        return await this.listProductFitments(
            { product_id: productId },
            {
                relations: ["variant", "variant.model", "variant.model.make"],
            }
        )
    }

    /**
     * Bulk create fitments from CSV data
     */
    async bulkCreateFitments(
        data: Array<{
            product_id: string
            variant_id: string
            fitment_type?: "direct" | "universal" | "with_adapter"
            fitment_notes?: string
        }>
    ) {
        const results = []
        for (const item of data) {
            const fitment = await this.createProductFitments({
                product_id: item.product_id,
                variant_id: item.variant_id,
                fitment_type: item.fitment_type || "direct",
                fitment_notes: item.fitment_notes,
            })
            results.push(fitment)
        }
        return results
    }
}

export default VehicleFitmentModuleService
