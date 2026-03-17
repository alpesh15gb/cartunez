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

  logger.info(`Downloading image from ${url} to ${localPath}...`);
  return new Promise((resolve) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(localPath);
        res.pipe(fileStream);
        fileStream.on('finish', () => { fileStream.close(); resolve(true); });
        fileStream.on('error', (err) => { logger.error(`Error writing file ${localPath}: ${err.message}`); resolve(false); });
      } else { logger.error(`Failed to download ${url}: ${res.statusCode}`); resolve(false); }
    }).on('error', (err) => { logger.error(`Error downloading ${url}: ${err.message}`); resolve(false); });
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

  logger.info(`Checking for JSON at: ${JSON_PATH}`)
  if (!fs.existsSync(JSON_PATH)) {
    logger.error(`JSON file not found. Ensure you copied it: docker cp /opt/cartunez/autoform_products.json cartunez-medusa:/app/autoform_products.json`)
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
    
    // Check existing by handle
    let { data: existingProducts } = await query.graph({ entity: "product", fields: ["id"], filters: { handle: series.handle } })
    if (existingProducts.length > 0) {
      logger.info(`  Handle ${series.handle} already exists, skipping.`)
      continue
    }

    // Images
    const localImages: any[] = []
    for (const color of series.colors) {
      const filename = `${series.handle}-${color.name.toLowerCase().replace(/\//g, '-')}.webp`
      const localPath = path.join(UPLOADS_DIR, filename)
      await downloadImage(color.image, localPath, logger)
      const finalUrl = `${UPLOADS_BASE_URL}/${filename}`
      localImages.push({ url: finalUrl })
      color.processedUrl = finalUrl
    }

    const variants: any[] = []
    // To be absolutely sure, let's limit to 10 variants initially to verify images
    const testLimit = 10;
    let count = 0;

    for (const brand of template.brands) {
      if (count >= testLimit) break;
      for (const model of brand.models) {
        if (count >= testLimit) break;
        for (const color of series.colors) {
          if (count >= testLimit) break;
          variants.push({
            title: `${brand.name} ${model} - ${color.name}`,
            sku: `AF-${series.handle.slice(-4)}-${count}-${Math.random().toString(36).substring(2, 5)}`,
            manage_inventory: false,
            options: { 
              "Vehicle Model": `${brand.name} ${model}`, 
              "Color": color.name 
            },
            prices: [{ region_id: region.id, amount: series.basePrice * 100, currency_code: "inr" }],
            thumbnail: color.processedUrl,
            metadata: { make: brand.name, model: model, color: color.name }
          })
          count++
        }
      }
    }

    try {
      await createProductsWorkflow(container).run({
        input: { 
          products: [{
            title: series.name + " Universal Custom Pattern Seat Covers",
            handle: series.handle,
            description: series.description,
            status: ProductStatus.PUBLISHED,
            images: localImages,
            thumbnail: localImages[0]?.url,
            category_ids: [categoryId],
            shipping_profile_id: shippingProfile.id,
            sales_channels: [{ id: salesChannel.id }],
            options: [
              { title: "Vehicle Model" },
              { title: "Color" }
            ],
            variants
          }]
        }
      })
      logger.info(`  Successfully created product: ${series.name} with ${variants.length} test variants.`)
    } catch (err) {
      logger.error(`  Error creating product ${series.name}`)
      console.error(err)
    }
  }
}
