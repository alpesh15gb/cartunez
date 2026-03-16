import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function fixLinks({ container }) {
  const remoteLink = container.resolve(ContainerRegistrationKeys.LINK)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: channels } = await query.graph({
    entity: "sales_channel",
    fields: ["id", "name"]
  })

  const defaultChannel = channels.find(c => c.name === "Default Sales Channel") || channels[0]
  
  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id"]
  })

  console.log("Linking products to channel: " + defaultChannel.name)

  const links = products.map(p => ({
    [Modules.PRODUCT]: { product_id: p.id },
    [Modules.SALES_CHANNEL]: { sales_channel_id: defaultChannel.id }
  }))

  try {
    await remoteLink.create(links)
  } catch (e) {
    console.log("Links might already exist, skipping...")
  }
  
  const { data: keys } = await query.graph({
    entity: "api_key",
    fields: ["id"],
    filters: { type: "publishable" }
  })
  
  if (keys.length > 0) {
    console.log("Linking API key to channel...")
    try {
      await remoteLink.create({
        [Modules.API_KEY]: { api_key_id: keys[0].id },
        [Modules.SALES_CHANNEL]: { sales_channel_id: defaultChannel.id }
      })
    } catch (e) {
      console.log("Key link might already exist.")
    }
  }

  console.log("Success! Linked " + products.length + " products.");
}
