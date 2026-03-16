import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function countProducts({ container }) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  
  const { data: products, metadata } = await query.graph({
    entity: "product",
    fields: ["id"],
  })

  console.log("PRODUCT_COUNT:", products.length)
}
