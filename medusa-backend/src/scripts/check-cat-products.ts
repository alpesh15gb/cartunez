import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function checkCategoryProducts({ container }) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  
  const { data: categories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name", "handle"],
  })

  for (const cat of categories) {
    const { data: products } = await query.graph({
      entity: "product",
      fields: ["id", "thumbnail"],
      filters: {
        categories: {
          id: [cat.id]
        }
      }
    })
    console.log(`CAT: ${cat.name} (${cat.id}) -> Products: ${products.length}`)
  }
}
