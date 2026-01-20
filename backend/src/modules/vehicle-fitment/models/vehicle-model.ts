import { model } from "@medusajs/framework/utils"
import { VehicleMake } from "./vehicle-make"

/**
 * Vehicle Model (e.g., Swift, Creta, Nexon, City)
 */
export const VehicleModel = model.define("vehicle_model", {
    id: model.id().primaryKey(),
    name: model.text().searchable(),
    slug: model.text(),
    make: model.belongsTo(() => VehicleMake, { mappedBy: "models" }),
    body_type: model.text().nullable(), // Hatchback, Sedan, SUV, etc.
    is_active: model.boolean().default(true),
    display_order: model.number().default(0),
})
