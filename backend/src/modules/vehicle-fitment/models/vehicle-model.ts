import { model } from "@medusajs/framework/utils"

/**
 * Vehicle Model (e.g., Swift, Creta, Nexon, City)
 */
export const VehicleModel = model.define("vehicle_model", {
    id: model.id().primaryKey(),
    name: model.text().searchable(),
    slug: model.text(),
    make_id: model.text(), // Foreign key to VehicleMake
    body_type: model.text().nullable(),
    is_active: model.boolean().default(true),
    display_order: model.number().default(0),
})
