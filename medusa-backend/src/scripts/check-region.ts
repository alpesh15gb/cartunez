import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function checkRegion({ container }) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  
  const { data: regions } = await query.graph({
    entity: "region",
    fields: ["id", "name", "currency_code", "countries.*", "payment_providers.*"]
  })
  
  // In v2, the relationship between Region and Sales Channel is often through the Store or just inferred.
  // Actually, Sales Channels aren't strictly limited by Region in v2 usually, but let's check.
  
  console.log("REGIONS:", JSON.stringify(regions, null, 2))
}
