import { model } from "@medusajs/framework/utils"
import { VehicleVariant } from "./vehicle-variant"

/**
 * Product Fitment - Maps products to compatible vehicles
 * Links to Medusa's product system via product_id
 */
export const ProductFitment = model.define("product_fitment", {
    id: model.id().primaryKey(),
    product_id: model.text(), // Medusa product ID
    variant: model.belongsTo(() => VehicleVariant, { mappedBy: "fitments" }),
    fitment_type: model.enum(["direct", "universal", "with_adapter"]).default("direct"),
    fitment_notes: model.text().nullable(),
    installation_time_mins: model.number().nullable(),
    requires_professional: model.boolean().default(false),
    is_verified: model.boolean().default(false),
})
