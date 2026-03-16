import Image from "next/image";
import Link from "next/link";
import { Metadata } from 'next'
import ProductGallery from "@/components/ProductGallery";
import AddToCartActions from "@/components/AddToCartActions";
import DieselTronicActions from "@/components/DieselTronicActions";
import CompatibilityBadge from "@/components/CompatibilityBadge";
import NeoWheelsProductPage from "@/components/NeoWheelsProductPage";
import RecentlyViewed from "@/components/RecentlyViewed";
 
type MedusaProduct = {
  id: string;
  title: string;
  handle: string;
  description: string;
  thumbnail?: string;
  images?: { url: string }[];
  metadata?: Record<string, any>;
  categories?: { handle: string }[];
  options?: { title: string; values: { value: string }[] }[];
  variants?: {
    id: string;
    title: string;
    inventory_quantity: number;
    manage_inventory: boolean;
    metadata?: Record<string, any>;
    prices: { amount: number; currency_code: string }[];
  }[];
  reviews?: { rating: number }[];
};

async function getProduct(slug: string): Promise<MedusaProduct | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'}/store/products?handle=${slug}&fields=id,title,handle,description,thumbnail,images.url,metadata,categories.handle,variants.id,variants.title,variants.inventory_quantity,variants.manage_inventory,variants.metadata,variants.prices.amount,variants.prices.currency_code`,
      { 
        headers: {
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
        },
        next: { revalidate: 60 } 
      }
    );
    if (!res.ok) return null;
    
    const data = await res.json();
    return data.products && data.products.length > 0 ? data.products[0] : null;
  } catch (error) {
    console.warn(`Failed to fetch Medusa product ${slug}.`, error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) {
    const backupTitle = slug.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return {
      title: `${backupTitle} | Cartunez`,
      description: `Buy premium ${backupTitle} for your car at Cartunez. Fast shipping in India.`,
    }
  }

  return {
    title: `${product.title} | Cartunez`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  
  // Use mock data if product fetching failed (backend not running)
  const isFallback = !product;
  const displayProduct = product || {
    id: "premium-led-kit-v2",
    title: "LED Ambient Interior Kit V2 Pro",
    description: "Premium fiber optic LED ambient lighting kit for your car. Features 64 colors, animated modes, and mobile app control. Transform your vehicle's interior with our professional-grade kit.",
    thumbnail: "https://images.unsplash.com/photo-1621251349071-70bf214d48db?auto=format&fit=crop&q=80&w=1200",
    images: [{ url: "https://images.unsplash.com/photo-1621251349071-70bf214d48db?auto=format&fit=crop&q=80&w=1200" }, { url: "https://images.unsplash.com/photo-1610488582068-d6219468bfb8?auto=format&fit=crop&q=80&w=1200" }],
    handle: "premium-led-kit-v2",
    categories: [{ handle: "universal" }],
    variants: [{ id: "v_premium_led_base", title: "Pro (6 Strips)", prices: [{ amount: 349900, currency_code: 'inr' }], inventory_quantity: 10, manage_inventory: false }]
  } as unknown as MedusaProduct;

  const images = displayProduct.images?.length ? displayProduct.images.map((i: any) => i.url) : [displayProduct.thumbnail || 'https://images.unsplash.com/photo-1621251349071-70bf214d48db?auto=format&fit=crop&q=80&w=1200'];
  let price = displayProduct.variants?.[0]?.prices?.[0]?.amount || 0;
  if (price > 0) price = price / 100;
  
  // Mock highlights
  const highlights = [
     "Universal Fit for any 12V Car",
     displayProduct.metadata?.warranty ? `${displayProduct.metadata.warranty} Warranty` : "Cartunez Warranty",
     displayProduct.metadata?.installation_type ? `Installation: ${displayProduct.metadata.installation_type}` : "Easy Setup"
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: displayProduct.title,
    image: images[0],
    description: displayProduct.description,
    offers: {
      '@type': 'Offer',
      url: `https://cartunez.in/product/${slug}`,
      priceCurrency: 'INR',
      price: price,
      itemCondition: 'https://schema.org/NewCondition',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '42'
    }
  };

  const isDieselTronic = slug.includes('dieseltronic');
  const isNeoWheels = slug.startsWith('neo-wheels');
  
  // Custom highlights for DieselTRONIC
  const dieselHighlights = isDieselTronic ? [
    "4 Switchable Maps (Economy, Stock, P1, P2)",
    "Up to 30% Increase in Power & Torque",
    "Plug & Play Installation",
    "Water & Heat Resistant Construction"
  ] : highlights;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <main className="flex-grow pt-4 pb-24 container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6 flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-white font-bold">{displayProduct.title}</span>
        </div>

        {isNeoWheels ? (
          <NeoWheelsProductPage product={displayProduct as any} />
        ) : (
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          {/* Product Gallery */}
          <div className="lg:w-1/2">
            <ProductGallery images={images} title={displayProduct.title} />
          </div>

          {/* Product Info */}
          <div className="lg:w-1/2 flex flex-col justify-center">
            {isNeoWheels && isFallback && <p className="text-yellow-500 text-xs font-bold mb-2">Displaying fallback data - Medusa Backend not reachable</p>}
            {isFallback && <p className="text-yellow-500 text-xs text-bold mb-2">Displaying fallback data - Medusa Backend not reachable</p>}
            
            {isDieselTronic && (
              <div className="mb-6 flex items-center gap-3 bg-primary/10 border border-primary/20 p-3 rounded-xl animate-in fade-in slide-in-from-left-4 duration-500">
                 <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shrink-0 shadow-glow">
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                 </div>
                 <div>
                   <h4 className="text-[10px] font-black text-primary uppercase tracking-tighter">Verified Official Partner</h4>
                   <p className="text-xs font-black text-white leading-none mt-0.5">SOLE DISTRIBUTOR IN HYDERABAD</p>
                 </div>
              </div>
            )}

            <h1 className="text-2xl md:text-3xl font-black mb-4 leading-tight tracking-tight uppercase">{displayProduct.title}</h1>
            
            <CompatibilityBadge 
              productPCD={displayProduct.metadata?.pcd}
              productSize={displayProduct.metadata?.wheel_size}
              category={displayProduct.categories?.[0]?.handle}
            />
            
            <div className="flex items-end gap-3 mb-6">
              <span className="text-3xl md:text-4xl font-black text-primary">₹{price.toLocaleString('en-IN')}</span>
              {!isDieselTronic && (
                <>
                  <span className="text-lg text-gray-500 line-through pb-1">₹{(price * 2).toLocaleString('en-IN')}</span>
                  <span className="text-sm font-bold text-green-400 pb-1.5 bg-green-400/10 px-2 py-0.5 rounded ml-2">50% OFF</span>
                </>
              )}
            </div>

            <p className="text-gray-300 leading-relaxed mb-8">{displayProduct.description}</p>

            <ul className="space-y-2.5 mb-8">
              {dieselHighlights.map((h, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  </div>
                  <span className="font-medium">{h}</span>
                </li>
              ))}
            </ul>

            {isDieselTronic ? (
              <DieselTronicActions 
                product={{
                  id: displayProduct.id || 'dt-id',
                  title: displayProduct.title,
                  handle: slug,
                  thumbnail: displayProduct.thumbnail,
                  variants: displayProduct.variants || []
                }}
              />
            ) : (
              <>
                {/* Variants */}
                <div className="mb-8 p-4 border border-border bg-surface rounded-xl">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-sm">Select Variant</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {displayProduct.variants && displayProduct.variants.map((v: any, i: number) => (
                       <label key={i} className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${i === 0 ? 'border-primary bg-primary/5' : 'border-border hover:border-gray-500'}`}>
                        <div className="flex items-center gap-3">
                          <input type="radio" name="variant" className="w-4 h-4 accent-primary" defaultChecked={i === 0} />
                          <span className="font-bold text-sm text-white">{v.title}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Stock indicator */}
                <div className="flex items-center gap-2 mb-6">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  <span className="text-sm font-bold text-green-400">In Stock - Ready to ship</span>
                </div>

                {/* Add to Cart Actions */}
                <AddToCartActions 
                  product={{
                    id: displayProduct.id || 'fallback-id',
                    title: displayProduct.title,
                    handle: slug,
                    thumbnail: displayProduct.thumbnail,
                    variantId: displayProduct.variants?.[0]?.id,
                    variantTitle: displayProduct.variants?.[0]?.title,
                    price: price
                  }} 
                />
              </>
            )}
            {/* Trust Builders */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-border/50">
               <div className="flex flex-col gap-2">
                 <div className="text-primary">
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="14" x="3" y="5" rx="2" ry="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="8" x2="8" y1="15" y2="15"/><line x1="12" x2="12" y1="15" y2="15"/><line x1="16" x2="16" y1="15" y2="15"/></svg>
                 </div>
                 <h4 className="font-bold text-sm">Secure Payment</h4>
                 <p className="text-xs text-gray-500">100% secure with Razorpay. All cards, UPI, & NetBanking accepted.</p>
               </div>
               <div className="flex flex-col gap-2">
                 <div className="text-primary">
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3-6 5"/><path d="m9 8 .25 2.52a2 2 0 0 1-.6 1.7L7.6 13.2a2 2 0 0 1-2.83 0l-1.62-1.62a2 2 0 0 1 0-2.83l1.1-1.1a2 2 0 0 1 1.7-.6L8.4 7a2 2 0 0 0 1.7-2.321L9.74 3M2 2l4 4"/></svg>
                 </div>
                 <h4 className="font-bold text-sm">Cartunez Warranty</h4>
                 <p className="text-xs text-gray-500">Replacement guarantee against manufacturing defects.</p>
               </div>
               <div className="flex flex-col gap-2">
                 <div className="text-primary">
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11"/><path d="M14 9h4l4 4v4c0 .6-.4 1-1 1h-2"/><circle cx="7" cy="18" r="2"/><path d="M9 18h6"/><circle cx="17" cy="18" r="2"/></svg>
                 </div>
                 <h4 className="font-bold text-sm">Fast Dispatch</h4>
                 <p className="text-xs text-gray-500">Usually ships within 24 hours from our Mumbai warehouse.</p>
               </div>
            </div>
            
            {/* Delivery Estimate */}
            <div className="mt-8 p-4 bg-background border border-border rounded-xl">
              <h4 className="font-bold text-sm mb-3">Check Delivery Estimate</h4>
              <div className="flex gap-2">
                <input type="text" placeholder="Enter PIN Code" className="w-full bg-surface border border-border rounded-lg px-4 py-2 outline-none focus:border-primary transition-colors text-sm" />
                <button className="btn-secondary px-6 shrink-0 text-sm">Check</button>
              </div>
            </div>
            
          </div>
        </div>
        )}

        {/* Recently Viewed Products */}
        <RecentlyViewed 
          currentProduct={{
            id: displayProduct.id || slug,
            title: displayProduct.title,
            handle: slug,
            thumbnail: displayProduct.thumbnail,
            price: `₹${price.toLocaleString('en-IN')}`
          }}
        />

      </main>
    </>
  );
}
