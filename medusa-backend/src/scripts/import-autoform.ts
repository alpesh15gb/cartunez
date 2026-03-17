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
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (fs.existsSync(localPath)) {
    return true; 
  }

  return new Promise((resolve) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(localPath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve(true);
        });
        fileStream.on('error', (err) => {
          logger.error(`Error writing file ${localPath}: ${err.message}`);
          resolve(false);
        });
      } else {
        logger.error(`Failed to download ${url}: ${res.statusCode}`);
        resolve(false);
      }
    }).on('error', (err) => {
      logger.error(`Error downloading ${url}: ${err.message}`);
      resolve(false);
    });
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
  const JSON_PATH = fs.existsSync("/app/autoform_products.json") 
    ? "/app/autoform_products.json" 
    : path.join(process.cwd(), "..", "autoform_products.json");

  logger.info(`Checking for JSON at: ${JSON_PATH}`)
  if (!fs.existsSync(JSON_PATH)) {
    logger.error(`JSON file not found. Run: docker cp /opt/cartunez/autoform_products.json cartunez-medusa:/app/autoform_products.json`)
    return
  }

  const template = JSON.parse(fs.readFileSync(JSON_PATH, "utf8"))
  logger.info("Starting Autoform combinatorial import...")

  // Ensure category
  let { data: existingCategories } = await query.graph({ entity: "product_category", fields: ["id"], filters: { name: "Car Seat Covers" } })
  let categoryId = existingCategories[0]?.id
  if (!categoryId) {
    const { result } = await createProductCategoriesWorkflow(container).run({ input: { product_categories: [{ name: "Car Seat Covers", is_active: true }] } })
    categoryId = result[0].id
  }

  for (const series of template.series) {
    logger.info(`Processing Series: ${series.name}`)
    
    // Download images
    const localImages: any[] = []
    for (const color of series.colors) {
      const filename = `${series.handle}-${color.name.toLowerCase().replace(/\//g, '-')}.webp`
      const localPath = path.join(UPLOADS_DIR, filename)
      await downloadImage(color.image, localPath, logger)
      const finalUrl = `${UPLOADS_BASE_URL}/${filename}`
      color.localImageUrl = finalUrl
      localImages.push({ url: finalUrl })
    }

    // Check existing
    let { data: existingProducts } = await query.graph({ entity: "product", fields: ["id"], filters: { handle: series.handle } })
    if (existingProducts.length > 0) {
      logger.info(`  Series already exists. Skipping.`)
      continue
    }

    const variants: any[] = []
    for (const brand of template.brands) {
      for (const model of brand.models) {
        for (const color of series.colors) {
          variants.push({
            title: `${brand.name} ${model} - ${color.name}`,
            sku: `AF-${series.name.substring(0,2).toUpperCase()}-${brand.name.substring(0,3).toUpperCase()}-${model.substring(0,3).toUpperCase()}-${color.name.substring(0,3).toUpperCase()}-${Math.random().toString(36).substring(2, 5)}`,
            manage_inventory: false,
            options: { "Vehicle Model": `${brand.name} ${model}`, "Color": color.name },
            metadata: { make: brand.name, model: model, color: color.name, series: series.name },
            thumbnail: color.localImageUrl,
            prices: [{ region_id: region.id, amount: series.basePrice * 100, currency_code: "inr" }]
          })
        }
      }
    }

    const options = [
      { title: "Vehicle Model", values: Array.from(new Set(variants.map(v => v.options["Vehicle Model"]))) },
      { title: "Color", values: series.colors.map(c => c.name) }
    ]

    try {
      // Import 50 variants per series for speed/stability
      const batch = variants.slice(0, 50) 
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
            options,
            variants: batch
          }]
        }
      })
      logger.info(`  Successfully created ${series.name}`)
    } catch (err) {
      logger.error(`  Error importing ${series.name}: ${err.message}`)
    }
  }
}
