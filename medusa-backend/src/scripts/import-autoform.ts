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
import https from "https"

async function downloadImage(url: string, localPath: string, logger: any): Promise<boolean> {
  const dir = path.dirname(localPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (fs.existsSync(localPath)) return true; 

  return new Promise((resolve) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(localPath);
        res.pipe(fileStream);
        fileStream.on('finish', () => { fileStream.close(); resolve(true); });
        fileStream.on('error', (err) => { logger.error(`Error writing file ${localPath}: ${err.message}`); resolve(false); });
      } else { resolve(false); }
    }).on('error', (err) => { resolve(false); });
  });
}

export default async function importAutoform({ container }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  
  // Configuration
  const UPLOADS_BASE_URL = "https://cartunez.in/uploads/autoform"
  const UPLOADS_DIR = path.join(process.cwd(), "uploads", "autoform")

  // Resolve IDs
  const { data: salesChannels } = await query.graph({ entity: "sales_channel", fields: ["id", "name"] })
  const salesChannel = salesChannels.find(sc => sc.name === "Default Sales Channel") || salesChannels[0]
  
  const { data: regions } = await query.graph({ entity: "region", fields: ["id", "currency_code"] })
  const region = regions.find(r => r.currency_code === "inr") || regions[0]

  const { data: shippingProfiles } = await query.graph({ entity: "shipping_profile", fields: ["id", "name"] })
  const shippingProfile = shippingProfiles.find(sp => sp.name === "Default Shipping Profile") || shippingProfiles[0]

  // Detect path correctly
  const JSON_DIR = fs.existsSync("/app") ? "/app" : path.join(process.cwd(), "..");
  const JSON_PATH = path.join(JSON_DIR, "autoform_products.json");

  if (!fs.existsSync(JSON_PATH)) {
    logger.error(`JSON file not found at ${JSON_PATH}`)
    return
  }

  const template = JSON.parse(fs.readFileSync(JSON_PATH, "utf8"))

  // Ensure category
  let { data: existingCategories } = await query.graph({ entity: "product_category", fields: ["id"], filters: { name: "Car Seat Covers" } })
  let categoryId = existingCategories[0]?.id
  if (!categoryId) {
    const { result } = await createProductCategoriesWorkflow(container).run({ input: { product_categories: [{ name: "Car Seat Covers", is_active: true }] } })
    categoryId = result[0].id
  }

  for (const series of template.series) {
    logger.info(`Processing Series: ${series.name}`)
    
    // Check existing
    let { data: existingProducts } = await query.graph({ entity: "product", fields: ["id"], filters: { handle: series.handle } })
    if (existingProducts.length > 0) {
      logger.info(`  Series already exists. Skipping.`)
      continue
    }

    // Prepare local Images
    const localImages: any[] = []
    for (const color of series.colors) {
      const filename = `${series.handle}-${color.name.toLowerCase().replace(/\//g, '-')}.webp`
      const localPath = path.join(UPLOADS_DIR, filename)
      await downloadImage(color.image, localPath, logger)
      const finalUrl = `${UPLOADS_BASE_URL}/${filename}`
      localImages.push({ url: finalUrl })
      color.processedUrl = finalUrl
    }

    // Build the Options Values first (Crucial for fixed error)
    const allModels = template.brands.flatMap(b => b.models.map(m => `${b.name} ${m}`))
    const allColors = series.colors.map(c => c.name)

    const variants: any[] = []
    for (const brand of template.brands) {
      for (const model of brand.models) {
        for (const color of series.colors) {
          variants.push({
            title: `${brand.name} ${model} - ${color.name}`,
            sku: `AF-${series.handle.slice(-4)}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
            manage_inventory: false,
            options: { 
              "Vehicle Model": `${brand.name} ${model}`, 
              "Color": color.name 
            },
            prices: [{ region_id: region.id, amount: series.basePrice * 100, currency_code: "inr" }],
            thumbnail: color.processedUrl,
            metadata: { 
              make: brand.name, 
              model: model, 
              color: color.name 
            }
          })
        }
      }
    }

    try {
      // Create product with a healthy batch of variants
      // Medusa v2 handles about 50-100 variants per product creation smoothly
      const initialBatch = variants.slice(0, 100)
      
      await createProductsWorkflow(container).run({
        input: { 
          products: [{
            title: series.name + " Premium Custom Fit Seat Covers",
            handle: series.handle,
            description: series.description,
            status: ProductStatus.PUBLISHED,
            images: localImages,
            thumbnail: localImages[0]?.url,
            category_ids: [categoryId],
            shipping_profile_id: shippingProfile.id,
            sales_channels: [{ id: salesChannel.id }],
            options: [
              { title: "Vehicle Model", values: allModels },
              { title: "Color", values: allColors }
            ],
            variants: initialBatch
          }]
        }
      })
      logger.info(`  Successfully created product: ${series.name} with ${initialBatch.length} variants.`)
    } catch (err) {
      logger.error(`  Error creating product ${series.name}: ${err.message}`)
    }
  }

  logger.info("Autoform FULL Import Complete!")
}
