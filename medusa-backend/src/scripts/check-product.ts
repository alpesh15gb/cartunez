import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function checkProduct({ container }) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  
  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
    filters: { handle: "osram-led-headlight-for-car-h4-h19-12v-80w-cool-white-6000k-high-brightness-led-bulbs" }
  })

  console.log("MATCHING_PRODUCTS:", JSON.stringify(products))
}
