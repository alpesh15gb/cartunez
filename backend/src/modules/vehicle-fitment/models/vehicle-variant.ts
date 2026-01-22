import { model } from "@medusajs/framework/utils"

/**
 * Vehicle Variant (e.g., Swift 2020 ZXi, Creta 2023 SX(O))
 * Represents specific year ranges and trim levels
 */
export const VehicleVariant = model.define("vehicle_variant", {
    id: model.id().primaryKey(),
    model_id: model.text(), // Foreign key to VehicleModel
    name: model.text().searchable(),
    year_start: model.number(),
    year_end: model.number().nullable(),
    engine_type: model.text().nullable(),
    engine_cc: model.number().nullable(),
    transmission: model.text().nullable(),
    fuel_type: model.text().nullable(),
    is_active: model.boolean().default(true),
})
