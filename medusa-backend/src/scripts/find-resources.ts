import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function findResources({ container }) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  
  const { data: salesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id", "name"],
  })
  
  const { data: shippingProfiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id", "name"],
  })

  const { data: regions } = await query.graph({
    entity: "region",
    fields: ["id", "name", "currency_code"],
  })

  console.log("RESOURCES:", JSON.stringify({
    salesChannels,
    shippingProfiles,
    regions
  }))
}
