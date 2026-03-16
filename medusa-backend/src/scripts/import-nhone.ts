import { 
  ContainerRegistrationKeys, 
  Modules, 
  ProductStatus 
} from "@medusajs/framework/utils"
import { 
  createProductsWorkflow,
  createProductCategoriesWorkflow 
} from "@medusajs/medusa/core-flows"
import fs from "fs"
import path from "path"

export default async function importNhone({ container }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  
  // Configuration
  const SALES_CHANNEL_ID = "sc_01KKQ6RZAQG80TTY3A9B1M913K"
  const SHIPPING_PROFILE_ID = "sp_01KKQ6RD4APKTT6Q5GY38CCCC0"
  const REGION_ID = "reg_01KKQ6YF16H6APJYZ1XHDKCDA2"
  
  const JSON_PATH = path.join(process.cwd(), "..", "nhone_products.json")
  
  if (!fs.existsSync(JSON_PATH)) {
    logger.error(`JSON file not found at ${JSON_PATH}`)
    return
  }

  const rawData = fs.readFileSync(JSON_PATH, "utf8")
  const data = JSON.parse(rawData)

  logger.info("Starting NHone data import...")

  const processedHandles = new Set<string>()

  for (const [categoryName, products] of Object.entries(data)) {
    logger.info(`Processing category: ${categoryName} (${(products as any[]).length} products)`)
    
    // 1. Ensure category exists
    let { data: existingCategories } = await query.graph({
      entity: "product_category",
      fields: ["id", "name"],
      filters: { name: categoryName }
    })
    
    let categoryId
    if (existingCategories.length > 0) {
      categoryId = existingCategories[0].id
    } else {
      const { result } = await createProductCategoriesWorkflow(container).run({
        input: {
          product_categories: [{ name: categoryName, is_active: true }]
        }
      })
      categoryId = result[0].id
    }

    // 2. Prepare products for Medusa
    const medusaProducts: any[] = []
    
    for (const p of (products as any[])) {
        const handle = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        
        if (processedHandles.has(handle)) {
            continue
        }
        processedHandles.add(handle)

        // Handle images
        const images = p.images.map((url: string) => ({ url }))
        const priceAmount = Math.round(p.price * 100)
        
        medusaProducts.push({
            title: p.name,
            handle,
            description: p.description.replace(/<[^>]*>?/gm, '').substring(0, 500),
            status: ProductStatus.PUBLISHED,
            images,
            thumbnail: images[0]?.url,
            category_ids: [categoryId],
            shipping_profile_id: SHIPPING_PROFILE_ID,
            sales_channels: [{ id: SALES_CHANNEL_ID }],
            options: [{ title: "Default Option", values: ["Default Value"] }],
            variants: [
                {
                    title: "Default Value",
                    sku: `NH-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
                    manage_inventory: false,
                    options: { "Default Option": "Default Value" },
                    prices: [
                        {
                            region_id: REGION_ID,
                            amount: priceAmount,
                            currency_code: "inr"
                        }
                    ]
                }
            ]
        })
    }

    // Batch create products (Medusa handles this well)
    // We'll do chunks of 20 to avoid timeouts/overloading
    const chunkSize = 20
    for (let i = 0; i < medusaProducts.length; i += chunkSize) {
        const chunk = medusaProducts.slice(i, i + chunkSize)
        try {
            await createProductsWorkflow(container).run({
                input: { products: chunk }
            })
            logger.info(`  Imported ${i + chunk.length}/${medusaProducts.length} products in ${categoryName}`)
        } catch (err) {
            logger.error(`  Error importing chunk in ${categoryName}: ${err.message}`)
        }
    }
  }

  logger.info("NHone Import Complete!")
}
