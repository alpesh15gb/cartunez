import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function debugDiesel({ container }) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  
  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "title", "handle", "categories.*"],
    filters: {
      handle: { $like: "dieseltronic%" }
    }
  })
  
  if (products.length > 0) {
    products.forEach(p => {
      console.log(`PRODUCT: ${p.title} (${p.id})`)
      console.log(`CATEGORIES: ${JSON.stringify(p.categories || [])}`)
    })
  } else {
    console.log("NO PRODUCTS FOUND with handle dieseltronic%")
  }

  const { data: categories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name", "handle"],
    filters: {
      handle: "dieseltronic"
    }
  })
  console.log(`CATEGORY dieseltronic: ${JSON.stringify(categories)}`)
}
