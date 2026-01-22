import { model } from "@medusajs/framework/utils"

/**
 * Product Fitment - Maps products to compatible vehicles
 * Links to Medusa's product system via product_id
 */
export const ProductFitment = model.define("product_fitment", {
    id: model.id().primaryKey(),
    product_id: model.text(), // Medusa product ID
    variant_id: model.text(), // Foreign key to VehicleVariant
    fitment_type: model.enum(["direct", "universal", "with_adapter"]).default("direct"),
    fitment_notes: model.text().nullable(),
    installation_time_mins: model.number().nullable(),
    requires_professional: model.boolean().default(false),
    is_verified: model.boolean().default(false),
})
