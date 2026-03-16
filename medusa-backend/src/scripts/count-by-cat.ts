import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function countByCategory({ container }) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  
  const { data: categories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name", "products.id"],
  })

  console.log("CATEGORY_COUNTS:")
  categories.forEach(c => {
    console.log(`- ${c.name}: ${c.products?.length || 0}`)
  })
}
