import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import fs from "fs"

export default async function saveProductNames({ container }) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  
  const { data: products } = await query.graph({
    entity: "product",
    fields: ["title", "status", "sales_channels.id"],
  })

  fs.writeFileSync("prod_names.json", JSON.stringify(products, null, 2))
  console.log("SAVED_TO_prod_names.json")
}
