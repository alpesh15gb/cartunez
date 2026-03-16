import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function debugPrices({ container }) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  
  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "title", "variants.prices.amount", "variants.prices.currency_code", "variants.prices.region_id"],
    limit: 5
  })

  console.log("PRODUCT_PRICES_DEBUG:", JSON.stringify(products, null, 2))
}
