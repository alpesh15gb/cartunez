import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function debugProducts({ container }) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  
  const { data: products } = await query.graph({
    entity: "product",
    fields: ["title", "status", "sales_channels.id"],
  })

  console.log(`TOTAL_PRODUCTS: ${products.length}`)
  
  const statusCounts = {}
  products.forEach(p => {
    statusCounts[p.status] = (statusCounts[p.status] || 0) + 1
  })
  console.log("STATUSES:", statusCounts)

  const scCounts = {}
  products.forEach(p => {
    const scs = p.sales_channels?.map(sc => sc.id) || []
    scs.forEach(scid => {
      scCounts[scid] = (scCounts[scid] || 0) + 1
    })
    if (scs.length === 0) scCounts["NONE"] = (scCounts["NONE"] || 0) + 1
  })
  console.log("SALES_CHANNELS:", scCounts)
}
