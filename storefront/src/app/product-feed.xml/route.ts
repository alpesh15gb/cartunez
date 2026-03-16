export async function GET() {
  const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
  let products = [];
  
  try {
    const res = await fetch(`${backendUrl}/store/products`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      products = data.products || [];
    }
  } catch (error) {
    console.error('Failed to fetch products for feed', error);
  }

  // Construct XML
  const baseUrl = "https://cartunez.in";
  
  let xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
<channel>
  <title>Cartunez Products</title>
  <link>${baseUrl}</link>
  <description>Premium Car Accessories</description>`;

  products.forEach((product: any) => {
    // Basic mapping, assuming standard Medusa payload
    const price = product.variants?.[0]?.prices?.[0]?.amount 
      ? (product.variants[0].prices[0].amount / (product.variants[0].prices[0].amount > 9999 ? 100 : 1)).toFixed(2) 
      : '0.00';
      
    xml += `
  <item>
    <g:id>${product.id}</g:id>
    <g:title><![CDATA[${product.title}]]></g:title>
    <g:description><![CDATA[${product.description || product.title}]]></g:description>
    <g:link>${baseUrl}/product/${product.handle}</g:link>
    <g:image_link>${product.thumbnail || product.images?.[0]?.url || ''}</g:image_link>
    <g:condition>new</g:condition>
    <g:availability>${product.variants?.[0]?.inventory_quantity > 0 || !product.variants?.[0]?.manage_inventory ? 'in stock' : 'out of stock'}</g:availability>
    <g:price>${price} INR</g:price>
    <g:brand>${product.metadata?.car_brand || 'Cartunez'}</g:brand>
  </item>`;
  });

  xml += `
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
