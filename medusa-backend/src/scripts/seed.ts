import { CreateInventoryLevelInput, ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import {
  createApiKeysWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresStep,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows";

const updateStoreCurrencies = createWorkflow(
  "update-store-currencies",
  (input: {
    supported_currencies: { currency_code: string; is_default?: boolean }[];
    store_id: string;
  }) => {
    const normalizedInput = transform({ input }, (data) => {
      return {
        selector: { id: data.input.store_id },
        update: {
          supported_currencies: data.input.supported_currencies.map(
            (currency) => {
              return {
                currency_code: currency.currency_code,
                is_default: currency.is_default ?? false,
              };
            }
          ),
        },
      };
    });

    const stores = updateStoresStep(normalizedInput);

    return new WorkflowResponse(stores);
  }
);

export default async function seedDemoData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
  const storeModuleService = container.resolve(Modules.STORE);

  const countries = ["in"]; // India

  logger.info("Seeding store data...");
  const [store] = await storeModuleService.listStores();
  let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
    name: "Default Sales Channel",
  });

  if (!defaultSalesChannel.length) {
    const { result: salesChannelResult } = await createSalesChannelsWorkflow(
      container
    ).run({
      input: {
        salesChannelsData: [{ name: "Default Sales Channel" }],
      },
    });
    defaultSalesChannel = salesChannelResult;
  }

  await updateStoreCurrencies(container).run({
    input: {
      store_id: store.id,
      supported_currencies: [{ currency_code: "inr", is_default: true }],
    },
  });

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: { default_sales_channel_id: defaultSalesChannel[0].id },
    },
  });

  logger.info("Seeding region data...");
  const { result: regionResult } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "India",
          currency_code: "inr",
          countries,
          payment_providers: ["pp_system_default"], 
        },
      ],
    },
  });
  const region = regionResult[0];

  logger.info("Seeding tax regions...");
  await createTaxRegionsWorkflow(container).run({
    input: countries.map((country_code) => ({
      country_code,
      provider_id: "tp_system",
    })),
  });

  logger.info("Seeding stock location data...");
  const { result: stockLocationResult } = await createStockLocationsWorkflow(container).run({
    input: {
      locations: [
        {
          name: "India Warehouse",
          address: {
            city: "Mumbai",
            country_code: "IN",
            address_1: "Andheri East",
          },
        },
      ],
    },
  });
  const stockLocation = stockLocationResult[0];

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: { default_location_id: stockLocation.id },
    },
  });

  await link.create({
    [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
    [Modules.FULFILLMENT]: { fulfillment_provider_id: "manual_manual" },
  });

  logger.info("Seeding fulfillment data...");
  const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({ type: "default" });
  let shippingProfile = shippingProfiles.length ? shippingProfiles[0] : null;

  if (!shippingProfile) {
    const { result: shippingProfileResult } = await createShippingProfilesWorkflow(container).run({
      input: { data: [{ name: "Default Shipping Profile", type: "default" }] },
    });
    shippingProfile = shippingProfileResult[0];
  }

  const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    name: "India Warehouse delivery",
    type: "shipping",
    service_zones: [
      {
        name: "India",
        geo_zones: [{ country_code: "in", type: "country" }],
      },
    ],
  });

  await link.create({
    [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
    [Modules.FULFILLMENT]: { fulfillment_set_id: fulfillmentSet.id },
  });

  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Standard Delivery",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: { label: "Standard", description: "Ship in 4-6 business days.", code: "standard" },
        prices: [{ region_id: region.id, amount: 0 }],
        rules: [
          { attribute: "enabled_in_store", value: "true", operator: "eq" },
          { attribute: "is_return", value: "false", operator: "eq" },
        ],
      },
      {
        name: "Express Delivery",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: { label: "Express", description: "Ship in 1-2 business days.", code: "express" },
        prices: [{ region_id: region.id, amount: 29900 }], // Amount is in lowest denominator (paise in INR or cents in USD, assume cents equivalents)
        rules: [
          { attribute: "enabled_in_store", value: "true", operator: "eq" },
          { attribute: "is_return", value: "false", operator: "eq" },
        ],
      },
    ],
  });

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: { id: stockLocation.id, add: [defaultSalesChannel[0].id] },
  });

  logger.info("Seeding publishable API key data...");
  let publishableApiKey: any = null;
  const { data } = await query.graph({
    entity: "api_key",
    fields: ["id"],
    filters: { type: "publishable" },
  });

  publishableApiKey = data?.[0];

  if (!publishableApiKey) {
    const { result: [publishableApiKeyResult] } = await createApiKeysWorkflow(container).run({
      input: { api_keys: [{ title: "Webshop", type: "publishable", created_by: "" }] },
    });
    publishableApiKey = publishableApiKeyResult;
  }

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: { id: publishableApiKey.id, add: [defaultSalesChannel[0].id] },
  });

  logger.info("Seeding product categories...");
  const { result: categoryResult } = await createProductCategoriesWorkflow(container).run({
    input: {
      product_categories: [
        { name: "Car Seat Covers", is_active: true },
        { name: "Car Floor Mats", is_active: true },
        { name: "Mobile Holders", is_active: true },
        { name: "Car Lighting", is_active: true },
        { name: "Car Audio", is_active: true },
        { name: "Interior Accessories", is_active: true },
        { name: "Exterior Accessories", is_active: true },
        { name: "Car Cleaning", is_active: true },
      ],
    },
  });

  logger.info("Seeding products...");
  const { result: productsResult } = await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "Magnetic Car Phone Holder | Cartunez",
          category_ids: [categoryResult.find((cat) => cat.name === "Mobile Holders")!.id],
          description: "Buy premium magnetic car phone holder with 360° rotation. Fast delivery across India.",
          handle: "magnetic-car-phone-holder",
          weight: 200,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [{ url: "https://images.unsplash.com/photo-1621251349071-70bf214d48db?auto=format&fit=crop&q=80&w=600" }],
          metadata: {
            car_brand: "Universal",
            car_model: "Universal",
            car_year: "All",
            installation_type: "Dashboard/AC Vent",
            warranty: "6 Months",
          },
          options: [{ title: "Color", values: ["Black", "Silver"] }],
          variants: [
            {
              title: "Black",
              sku: "CT-HLD-MAG-BLK",
              options: { Color: "Black" },
              manage_inventory: false,
              prices: [{ amount: 89900, currency_code: "inr" }], // 899 INR (assuming amount in cents/paise)
            },
            {
              title: "Silver",
              sku: "CT-HLD-MAG-SLV",
              options: { Color: "Silver" },
              manage_inventory: false,
              prices: [{ amount: 89900, currency_code: "inr" }],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "Premium 7D Custom Floor Mats",
          category_ids: [categoryResult.find((cat) => cat.name === "Car Floor Mats")!.id],
          description: "Diamond stitched premium leather 7D custom floor mats.",
          handle: "premium-7d-custom-floor-mats",
          weight: 1500,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [{ url: "https://images.unsplash.com/photo-1610488582068-d6219468bfb8?auto=format&fit=crop&q=80&w=600" }],
          metadata: {
            car_brand: "Hyundai",
            car_model: "Creta",
            car_year: "2020",
            installation_type: "DIY",
            warranty: "1 Year",
          },
          options: [{ title: "Color", values: ["Black-Red", "Beige"] }],
          variants: [
            {
              title: "Black-Red",
              sku: "CT-MAT-7D-BLKRED",
              options: { Color: "Black-Red" },
              manage_inventory: false,
              prices: [{ amount: 450000, currency_code: "inr" }],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
      ],
    },
  });

  logger.info("Seeding inventory levels...");
  const inventoryLevels: CreateInventoryLevelInput[] = [];
  for (const product of productsResult) {
    for (const variant of product.variants) {
      if (!variant.manage_inventory) continue;
      
      const { data: inventoryItemData } = await query.graph({
        entity: "variant",
        fields: ["inventory_items.inventory_item_id"],
        filters: { id: variant.id },
      });
      const inventoryItemId = inventoryItemData?.[0]?.inventory_items?.[0]?.inventory_item_id;
      if (inventoryItemId) {
        inventoryLevels.push({
          location_id: stockLocation.id,
          stocked_quantity: 100,
          inventory_item_id: inventoryItemId,
        });
      }
    }
  }

  if (inventoryLevels.length) {
    await createInventoryLevelsWorkflow(container).run({ input: { inventory_levels: inventoryLevels } });
  }

  logger.info("Finished seeding data.");
}
