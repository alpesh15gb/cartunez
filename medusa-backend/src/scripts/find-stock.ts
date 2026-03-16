import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function findStockLocation({ container }) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  
  const { data: stockLocations } = await query.graph({
    entity: "stock_location",
    fields: ["id", "name"],
  })

  console.log("STOCK_LOCATIONS:", JSON.stringify(stockLocations))
}
