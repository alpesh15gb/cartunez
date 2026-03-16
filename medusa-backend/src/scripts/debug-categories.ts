import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function debugCategories({ container }) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  
  const { data: categories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name", "handle"],
  })

  console.log("CATEGORIES_DEBUG:", JSON.stringify(categories, null, 2))
}
