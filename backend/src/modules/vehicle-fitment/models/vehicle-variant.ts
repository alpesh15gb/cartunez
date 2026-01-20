import { model } from "@medusajs/framework/utils"
import { VehicleModel } from "./vehicle-model"

/**
 * Vehicle Variant (e.g., Swift 2020 ZXi, Creta 2023 SX(O))
 * Represents specific year ranges and trim levels
 */
export const VehicleVariant = model.define("vehicle_variant", {
    id: model.id().primaryKey(),
    model: model.belongsTo(() => VehicleModel, { mappedBy: "variants" }),
    name: model.text().searchable(), // ZXi, SX(O), etc.
    year_start: model.number(),
    year_end: model.number().nullable(), // null = current
    engine_type: model.text().nullable(), // Petrol, Diesel, CNG, Electric
    engine_cc: model.number().nullable(),
    transmission: model.text().nullable(), // Manual, Automatic, CVT, AMT
    fuel_type: model.text().nullable(),
    is_active: model.boolean().default(true),
})
