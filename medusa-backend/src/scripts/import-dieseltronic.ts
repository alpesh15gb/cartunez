import { 
  ContainerRegistrationKeys, 
  Modules, 
  ProductStatus 
} from "@medusajs/framework/utils"
import { 
  createProductsWorkflow,
  createProductCategoriesWorkflow,
  deleteProductsWorkflow
} from "@medusajs/medusa/core-flows"

export default async function importDieselTronic({ container }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  
  // Configuration
  const SALES_CHANNEL_ID = "sc_01KKVGK5NNKY1WZS2T69FG7A6M"
  const SHIPPING_PROFILE_ID = "sp_01KKVGK5S10V8E13J4F57SZZY8"
  const REGION_ID = "reg_01KKVH69QGNMNB0XC90NXRWN5D"
  
  logger.info("Starting DieselTRONIC final integration (V3)...")

  const dieselTronicData = {
    "Toyota": ["Fortuner 2.5", "Fortuner 2.8", "Fortuner 3.0", "Innova Crysta", "Innova", "Hilux", "Corolla Altis", "Etios", "Land Cruiser Prado", "Land Cruiser 200"],
    "Mahindra": ["Scorpio N", "Scorpio Classic", "Scorpio mHawk", "XUV700", "XUV500", "XUV300", "Thar CRDe", "Thar mHawk", "Thar BS6", "Bolero BS4", "Bolero BS6", "Marazzo", "TUV300"],
    "Tata": ["Nexon", "Harrier", "Safari (New)", "Safari (Old)", "Altroz", "Hexa", "Tiago", "Tigor", "Xenon", "Aria"],
    "Hyundai": ["Creta", "Verna", "i20 Elite", "i20 Active", "Tucson", "Santa Fe", "Venue", "Alcazar", "Elantra TDI"],
    "Kia": ["Seltos", "Sonet", "Carnival", "Carens"],
    "Maruti Suzuki": ["Swift DDiS", "Dzire DDiS", "Brezza", "S-Cross 1.3", "S-Cross 1.6", "Ciaz", "Ertiga", "Ignis", "Baleno"],
    "BMW": ["1 Series", "3 Series 320d", "5 Series 520d", "5 Series 530d", "7 Series 730d", "X1", "X3", "X5", "X6"],
    "Audi": ["A3 TDI", "A4 TDI", "A6 TDI", "Q3", "Q5", "Q7"],
    "Mercedes-Benz": ["A-Class", "B-Class", "C-Class", "E-Class", "S-Class", "GLA", "GLC", "GLE", "GLS"],
    "Volkswagen": ["Polo", "Vento", "Jetta", "Passat", "Tiguan", "Ameo", "Taigun Diesel"],
    "Skoda": ["Octavia", "Superb", "Kodiaq", "Rapid", "Kushaq", "Slavia Diesel"],
    "Ford": ["EcoSport", "Endeavour 2.2", "Endeavour 3.2", "Figo", "Aspire", "Fiesta", "Freestyle"],
    "Jeep": ["Compass", "Meridian"],
    "MG": ["Hector", "Gloster"],
    "Renault": ["Duster", "Lodgy", "Captur", "Pulse", "Scala"],
    "Nissan": ["Micra", "Sunny", "Terrano", "Kicks"],
    "Isuzu": ["V-Cross", "MU-X", "D-Max"],
    "Mitsubishi": ["Pajero Sport", "Outlander"],
    "Force": ["Gurkha", "One"],
    "Chevrolet": ["Beat", "Cruze", "Optra Magnum", "Captiva", "Sail"],
    "Fiat": ["Punto", "Linea", "Avventura", "Urban Cross"]
  }

  // 1. Cleanup existing partial products
  const { data: existingProducts } = await query.graph({
    entity: "product",
    fields: ["id"],
    filters: {
      handle: { $like: "dieseltronic%" }
    }
  })

  if (existingProducts.length > 0) {
    logger.info(`Cleaning up ${existingProducts.length} existing DieselTRONIC products...`)
    await deleteProductsWorkflow(container).run({
      input: { ids: existingProducts.map(p => p.id) }
    })
  }

  // 2. Ensure DieselTRONIC category exists
  const categoryName = "DieselTRONIC"
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
        product_categories: [{ name: categoryName, handle: "dieseltronic", is_active: true }]
      }
    })
    categoryId = result[0].id
  }

  // 3. Create products with actual images from dieseltronic.in
  const productsToCreate = [
    { 
      title: "DieselTRONIC Single Channel", 
      price: 21999, 
      handle: "dieseltronic-single-channel",
      image: "https://dieseltronic.in/cdn/shop/products/Single_1024x1024.jpg?v=1592482030",
      description: "Sophisticated piggyback ECU for diesel engines. Controls fuel rail pressure to deliver up to 25% increase in power and 20% improve in fuel economy. Features 4 optimized maps."
    },
    { 
      title: "DieselTRONIC Dual Channel", 
      price: 27999, 
      handle: "dieseltronic-dual-channel",
      image: "https://dieseltronic.in/cdn/shop/products/Dual_1024x1024.jpg?v=1592482046",
      description: "Advanced performance system that controls both fueling and turbo boost. Delivers up to 30% increase in power and torque. Ideal for enthusiasts looking for maximum performance gain. Features 4 switchable maps."
    },
    { 
      title: "DieselTRONIC Off-Road Edition", 
      price: 24999, 
      handle: "dieseltronic-off-road",
      image: "https://dieseltronic.in/cdn/shop/products/Dual_1024x1024.jpg?v=1592482046", // Usually similar look or ruggedized
      description: "Specially tuned for off-road vehicles like Mahindra Thar and Force Gurkha. Includes 'Easy Crawler' mode for extreme terrains. Ruggedized for water and heat resistance. Optimized for low-end torque."
    }
  ]

  for (const pInfo of productsToCreate) {
    logger.info(`Creating product: ${pInfo.title}...`)
    
    const variants: any[] = []
    
    // Filter brands for Off-Road edition (mostly Mahindra, Force, Jeep, Isuzu)
    const brandsToInclude = pInfo.handle === "dieseltronic-off-road" 
      ? ["Mahindra", "Force", "Jeep", "Isuzu", "Toyota"] 
      : Object.keys(dieselTronicData);

    for (const brand of brandsToInclude) {
      const models = dieselTronicData[brand];
      for (const model of (models as string[])) {
        // Limit variants per product to 500
        if (variants.length >= 500) break;

        const cleanBrand = brand.substring(0,3).toUpperCase();
        const cleanModel = model.replace(/[^a-zA-Z0-9]/g, '').substring(0,6).toUpperCase();
        const rand = Math.random().toString(36).substring(2, 5).toUpperCase();
        const sku = `DT-${pInfo.handle.split('-')[1].toUpperCase()}-${cleanBrand}-${cleanModel}-${rand}`;

        variants.push({
          title: `${brand} ${model}`,
          sku: sku,
          manage_inventory: false,
          options: {
            "Brand": brand,
            "Model": model
          },
          prices: [
            {
              region_id: REGION_ID,
              amount: pInfo.price * 100,
              currency_code: "inr"
            }
          ]
        })
      }
      if (variants.length >= 500) break;
    }

    const productInput = {
      title: pInfo.title,
      handle: pInfo.handle,
      description: `${pInfo.description} Sole distributor in Hyderabad - CarTunez.`,
      status: ProductStatus.PUBLISHED,
      thumbnail: pInfo.image,
      images: [{ url: pInfo.image }],
      category_ids: [categoryId],
      shipping_profile_id: SHIPPING_PROFILE_ID,
      sales_channels: [{ id: SALES_CHANNEL_ID }],
      options: [
        { title: "Brand", values: Array.from(new Set(variants.map(v => v.options.Brand))) },
        { title: "Model", values: Array.from(new Set(variants.map(v => v.options.Model))) }
      ],
      variants: variants
    }

    try {
      await createProductsWorkflow(container).run({
          input: { products: [productInput] }
      })
      logger.info(`  Successfully created ${pInfo.title} with ${variants.length} variants.`)
    } catch (err) {
      logger.error(`  Error creating ${pInfo.title}: ${err.message}`)
    }
  }

  logger.info("DieselTRONIC Final Integration V3 Complete!")
}
