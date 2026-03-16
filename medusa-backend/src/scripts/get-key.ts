import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function getKey({ container }) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const { data } = await query.graph({
    entity: "api_key",
    fields: ["id", "token", "title"],
    filters: { type: "publishable" },
  })
  console.log("VALID_KEYS_START")
  console.log(JSON.stringify(data, null, 2))
  console.log("VALID_KEYS_END")
}
