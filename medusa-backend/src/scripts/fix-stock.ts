import { Modules } from "@medusajs/framework/utils"

export default async function fixStock({ container }) {
  const productModuleService = container.resolve(Modules.PRODUCT)
  const query = container.resolve("query")
  const { data: variants } = await query.graph({
    entity: "variant",
    fields: ["id"],
  })
  
  if (variants.length) {
  console.log("PRODUCT_SERVICE_KEYS:", Object.keys(productModuleService).filter(k => k.toLowerCase().includes("variant")))
  } else {
    console.log("No variants found to update.")
  }
}
