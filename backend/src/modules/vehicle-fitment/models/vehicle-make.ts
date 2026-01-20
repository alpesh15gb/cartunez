import { model } from "@medusajs/framework/utils"

/**
 * Vehicle Make (e.g., Maruti, Hyundai, Tata, Honda)
 */
export const VehicleMake = model.define("vehicle_make", {
    id: model.id().primaryKey(),
    name: model.text().searchable(),
    slug: model.text().unique(),
    logo_url: model.text().nullable(),
    country: model.text().nullable(),
    is_active: model.boolean().default(true),
    display_order: model.number().default(0),
})
