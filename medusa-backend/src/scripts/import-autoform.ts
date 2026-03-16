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

export default async function importAutoform({ container }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  
  // 1. Resolve IDs dynamically
  const { data: salesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id", "name"]
  })
  const salesChannel = salesChannels.find(sc => sc.name === "Default Sales Channel") || salesChannels[0]
  
  const { data: regions } = await query.graph({
    entity: "region",
    fields: ["id", "name", "currency_code"]
  })
  const region = regions.find(r => r.currency_code === "inr") || regions[0]

  const { data: shippingProfiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id", "name"]
  })
  const shippingProfile = shippingProfiles.find(sp => sp.name === "Default Shipping Profile") || shippingProfiles[0]

  logger.info(`Using Sales Channel: ${salesChannel.name} (${salesChannel.id})`)
  logger.info(`Using Region: ${region.name} (${region.id})`)
  logger.info(`Using Shipping Profile: ${shippingProfile.name} (${shippingProfile.id})`)

  const JSON_PATH = path.join(process.cwd(), "..", "autoform_products.json")
  
  if (!fs.existsSync(JSON_PATH)) {
    logger.error(`JSON file not found at ${JSON_PATH}`)
    return
  }

  const data = JSON.parse(fs.readFileSync(JSON_PATH, "utf8"))

  logger.info("Starting Autoform data import...")

  for (const item of data) {
    logger.info(`Processing product: ${item.title}`)
    
    // 1. Ensure category exists
    let { data: existingCategories } = await query.graph({
      entity: "product_category",
      fields: ["id", "name"],
      filters: { name: item.category }
    })
    
    let categoryId
    if (existingCategories.length > 0) {
      categoryId = existingCategories[0].id
    } else {
      const { result } = await createProductCategoriesWorkflow(container).run({
        input: {
          product_categories: [{ name: item.category, is_active: true }]
        }
      })
      categoryId = result[0].id
    }

    // 2. Prepare images
    const images = item.images.map((url: string) => ({ url }))

    // 3. Prepare variants
    // Autoform usually has options like "Car Model" and "Color"
    const options = [
      { title: "Vehicle", values: item.variants.map(v => v.title) },
      { title: "Color", values: Array.from(new Set(item.variants.map(v => v.color))) }
    ]

    const variants = item.variants.map(v => ({
      title: v.title,
      sku: v.sku,
      manage_inventory: false,
      options: { 
        "Vehicle": v.title,
        "Color": v.color
      },
      metadata: {
        make: v.make,
        model: v.model,
        year: v.year,
        color: v.color
      },
      prices: [
        {
          region_id: region.id,
          amount: Math.round(v.price * 100),
          currency_code: region.currency_code
        }
      ]
    }))

    try {
      await createProductsWorkflow(container).run({
        input: { 
          products: [{
            title: item.title,
            handle: item.handle,
            description: item.description,
            status: ProductStatus.PUBLISHED,
            images,
            thumbnail: images[0]?.url,
            category_ids: [categoryId],
            shipping_profile_id: shippingProfile.id,
            sales_channels: [{ id: salesChannel.id }],
            options,
            variants
          }]
        }
      })
      logger.info(`  Successfully imported ${item.title}`)
    } catch (err) {
      logger.error(`  Error importing ${item.title}: ${err.message}`)
    }
  }

  logger.info("Autoform Import Complete!")
}
