import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getCategoryData(handle: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'}/store/product-categories?handle=${handle}`,
      { 
        headers: {
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
        },
        next: { revalidate: 3600 } 
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.product_categories && data.product_categories.length > 0 ? data.product_categories[0] : null;
  } catch (error) {
    return null;
  }
}

async function getCategoryProducts(categoryId: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'}/store/products?category_id=${categoryId}&fields=id,title,handle,thumbnail,variants.prices.amount,variants.prices.currency_code`,
      { 
        headers: {
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
        },
        next: { revalidate: 60 } 
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.products || [];
  } catch (error) {
    return [];
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategoryData(slug);
  
  if (!category) return notFound();

  const products = await getCategoryProducts(category.id);

  const catCovers: Record<string, string> = {
    'car-headlight-bulb': "/categories/headlight-bulb.png",
    'android-player': "/categories/android-player.png",
    'floor-mats': "/categories/floor-mats.png",
    'car-floor-mats': "/categories/floor-mats.png",
    'music-system': "/categories/music-system.png",
    'car-audio': "/categories/car-audio.png",
    'cleaning-care': "/categories/cleaning-care.png",
    'car-cleaning': "/categories/cleaning-care.png",
    'perfume': "/categories/perfume.png",
    'dashcam': "/categories/dashcam.png",
    'key-cover': "/categories/key-cover.png",
    'android-frame': "/categories/android-frame.png",
    'car-camera-1': "/categories/car-camera-1.png",
    'car-device-charger': "/categories/car-device-charger.png",
    'car-seat-covers': "/categories/seat-covers.png",
    'mobile-holders': "/categories/mobile-holder.png",
    'car-lighting': "/categories/car-lighting.png",
    'interior-accessories': "/categories/interior-acc.png",
    'exterior-accessories': "/categories/exterior-acc.png",
    'fog-lamp-bracket': "/categories/exterior-acc.png",
    'side-mirror-covers': "/categories/exterior-acc.png",
    'focus-light': "/categories/headlight-bulb.png",
    'dieseltronic': "https://dieseltronic.in/cdn/shop/products/Dual_1024x1024.jpg?v=1592482046",
    'default': "/categories/android-player.png"
  };

  const displayData = {
    name: category.name,
    description: category.description || "Premium car accessories for your vehicle.",
    heroImage: catCovers[slug] || catCovers['default'],
    seoText: category.description || `Enhance your driving experience with top-tier products from CarTunez. We offer a wide range of accessories designed to protect, enhance, and personalize your vehicle.`,
    faqs: [
      { q: "How fast is delivery?", a: "We offer 2-4 days express delivery across India." },
      { q: "Are these items in stock?", a: "Yes, all items shown are ready for immediate dispatch from our warehouse." }
    ]
  };

  return (
    <main className="flex-grow">
      {/* Category Hero */}
      <section className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/30 z-10" />
          <Image 
            src={displayData.heroImage} 
            alt={displayData.name} 
            fill 
            className="object-cover"
            priority
          />
        </div>
        <div className="container mx-auto px-4 relative z-20 text-center">
          <div className="text-sm text-gray-400 mb-4 flex items-center justify-center gap-2 font-bold tracking-widest uppercase">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-white">{displayData.name}</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-4 uppercase">{displayData.name}</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light">
            {displayData.description}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8 border-b border-border pb-4">
          <p className="text-gray-400">Showing 24 products</p>
          <select className="bg-surface border border-border text-white px-4 py-2 rounded-lg outline-none focus:border-primary transition-colors cursor-pointer appearance-none relative">
            <option>Best Selling</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-24">
          {products.map((product: any) => {
             let price = product.variants?.[0]?.prices?.[0]?.amount || 0;
             if (price > 9999) price = price / 100;

             return (
               <div key={product.id} className="card-premium group">
                 <Link href={`/product/${product.handle}`} className="block relative aspect-[4/5] overflow-hidden bg-background">
                   <div className="absolute inset-x-4 bottom-4 z-20 flex opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
                     <button className="w-full bg-primary/90 hover:bg-primary text-white font-bold py-3 text-sm rounded shadow-glow backdrop-blur-sm transition-colors">
                       Quick Add
                     </button>
                   </div>
                   {product.thumbnail ? (
                     <Image src={product.thumbnail} alt={product.title} fill className="object-cover group-hover:scale-110 transition-all duration-700" />
                   ) : (
                     <div className="w-full h-full bg-border/20 flex items-center justify-center text-gray-500 text-xs text-center">No Image</div>
                   )}
                 </Link>
                 <div className="p-4 md:p-6">
                   <div className="text-primary text-xs font-bold mb-1 uppercase tracking-wider">{displayData.name}</div>
                   <Link href={`/product/${product.handle}`} className="hover:text-primary transition-colors block mb-2">
                     <h3 className="font-bold line-clamp-2 md:text-lg leading-tight">{product.title}</h3>
                   </Link>
                   <div className="text-lg font-black">₹{price.toLocaleString('en-IN')}</div>
                 </div>
               </div>
             );
          })}
        </div>

        <section className="bg-surface p-8 md:p-12 rounded-2xl border border-border mb-16 shadow-surface">
          <h2 className="text-3xl font-black mb-6">About {displayData.name}</h2>
          <div className="prose prose-invert max-w-none text-gray-300 font-light leading-relaxed">
            {displayData.seoText.split('\n\n').map((paragraph: string, idx: number) => (
              <p key={idx} className="mb-4">{paragraph}</p>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black mb-8 text-center">{displayData.name} FAQs</h2>
          <div className="space-y-4">
            {displayData.faqs.map((faq, idx) => (
              <details key={idx} className="group bg-surface rounded-xl border border-border overflow-hidden cursor-pointer" open={idx === 0}>
                <summary className="font-bold p-6 flex justify-between items-center outline-none">
                  {faq.q}
                  <span className="text-primary group-open:rotate-180 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </span>
                </summary>
                <div className="p-6 pt-0 text-gray-400 leading-relaxed font-light border-t border-border/50">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
