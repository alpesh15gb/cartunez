import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function checkKey({ container }) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  
  const { data: keys } = await query.graph({
    entity: "api_key",
    fields: ["id", "token", "title", "sales_channels.*"]
  })
  
  console.log("API_KEYS:", JSON.stringify(keys, null, 2))
}
