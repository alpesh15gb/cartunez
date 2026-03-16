import { exec } from "@medusajs/framework/utils"

export default async function findKey({ container }) {
  const query = container.resolve("query")
  const { data } = await query.graph({
    entity: "api_key",
    fields: ["id", "token", "title"],
    filters: { type: "publishable" },
  })
  console.log("PUBLISHABLE_KEYS:", JSON.stringify(data))
}
