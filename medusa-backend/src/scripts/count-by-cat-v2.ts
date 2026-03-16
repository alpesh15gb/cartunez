import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import fs from "fs"

export default async function countByCategory({ container }) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  
  const { data: categories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name", "products.id"],
  })

  let output = "CATEGORY_COUNTS:\n"
  categories.forEach(c => {
    output += `- ${c.name}: ${c.products?.length || 0}\n`
  })
  
  fs.writeFileSync("cat_counts.json", JSON.stringify(categories, null, 2))
  fs.writeFileSync("cat_counts_summary.txt", output)
  console.log("DONE_SAVED_TO_cat_counts_summary.txt")
}
