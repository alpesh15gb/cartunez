import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function listSomeProducts({ container }) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  
  const { data: products } = await query.graph({
    entity: "product",
    fields: ["title", "handle"],
  })

  console.log("TITLES:")
  products.slice(0, 10).forEach(p => console.log(`- ${p.title} (${p.handle})`))
}
