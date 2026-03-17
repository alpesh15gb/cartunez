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
    return true; // Already exists
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

  const JSON_PATH = path.join(process.cwd(), "..", "autoform_products.json")
  
  if (!fs.existsSync(JSON_PATH)) {
    logger.error(`JSON file not found at ${JSON_PATH}`)
    return
  }

  const template = JSON.parse(fs.readFileSync(JSON_PATH, "utf8"))

  logger.info("Starting Autoform LOCAL image import...")

  // Ensure category exists
  let { data: existingCategories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name"],
    filters: { name: "Car Seat Covers" }
  })
  
  let categoryId
  if (existingCategories.length > 0) {
    categoryId = existingCategories[0].id
  } else {
    const { result } = await createProductCategoriesWorkflow(container).run({
      input: {
        product_categories: [{ name: "Car Seat Covers", is_active: true }]
      }
    })
    categoryId = result[0].id
  }

  for (const series of template.series) {
    logger.info(`Processing Series: ${series.name}`)
    
    // Download images locally
    const localImages: any[] = []
    for (const color of series.colors) {
      const filename = `${series.handle}-${color.name.toLowerCase().replace(/\//g, '-')}.webp`
      const localPath = path.join(UPLOADS_DIR, filename)
      const success = await downloadImage(color.image, localPath, logger)
      
      if (success) {
        color.localImageUrl = `${UPLOADS_BASE_URL}/${filename}`
      } else {
        color.localImageUrl = color.image // Fallback to remote if download fails
      }
      localImages.push({ url: color.localImageUrl })
    }

    // Check if product already exists to avoid duplicates
    let { data: existingProducts } = await query.graph({
      entity: "product",
      fields: ["id", "handle"],
      filters: { handle: series.handle }
    })

    if (existingProducts.length > 0) {
      logger.info(`  Series ${series.name} already exists. Skipping product creation.`)
      continue
    }

    const colorNames = series.colors.map(c => c.name)
    const variants: any[] = []
    
    for (const brand of template.brands) {
      for (const model of brand.models) {
        for (const color of series.colors) {
          variants.push({
            title: `${brand.name} ${model} - ${color.name}`,
            sku: `AF-${series.name.substring(0,2).toUpperCase()}-${brand.name.substring(0,3).toUpperCase()}-${model.substring(0,3).toUpperCase()}-${color.name.substring(0,3).toUpperCase()}-${Math.random().toString(36).substring(2, 5)}`,
            manage_inventory: false,
            options: { 
              "Vehicle Model": `${brand.name} ${model}`,
              "Color": color.name
            },
            metadata: {
              make: brand.name,
              model: model,
              color: color.name,
              series: series.name
            },
            thumbnail: color.localImageUrl,
            prices: [
              {
                region_id: region.id,
                amount: series.basePrice * 100,
                currency_code: region.currency_code
              }
            ]
          })
        }
      }
    }

    const options = [
      { title: "Vehicle Model", values: Array.from(new Set(variants.map(v => v.options["Vehicle Model"]))) },
      { title: "Color", values: colorNames }
    ]

    try {
      const chunkSize = 100
      const initialBatch = variants.slice(0, chunkSize)
      
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
            variants: initialBatch
          }]
        }
      })
      
      logger.info(`  Successfully created ${series.name} with ${initialBatch.length} local variants.`)
      
    } catch (err) {
      logger.error(`  Error importing ${series.name}: ${err.message}`)
    }
  }

  logger.info("Autoform LOCAL Import Complete!")
}
