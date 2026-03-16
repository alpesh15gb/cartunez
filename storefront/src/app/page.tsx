import Image from "next/image";
import Link from "next/link";
import UniversalVehicleSelector from "@/components/UniversalVehicleSelector";

async function getCategories() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'}/store/product-categories?fields=id,name,handle`,
      { 
        headers: {
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
        },
        next: { revalidate: 3600 } 
      }
    );
    const data = await res.json();
    const categories = data.product_categories || [];

    // Filter and fetch images for categories that actually have products
    const categoriesWithImages = [];
    for (const cat of categories) {
      if (categoriesWithImages.length >= 4) break;
      
      try {
        const pRes = await fetch(
          `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'}/store/products?category_id=${cat.id}&limit=1&fields=thumbnail`,
          { 
            headers: {
              "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
            },
            next: { revalidate: 3600 } 
          }
        );
        const pData = await pRes.json();
        if (pData.products && pData.products.length > 0) {
          categoriesWithImages.push({
            ...cat,
            image: pData.products[0].thumbnail
          });
        }
      } catch (e) {
        continue;
      }
    }

    return categoriesWithImages;
  } catch (e) { return []; }
}

async function getFeaturedProducts() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'}/store/products?limit=4&fields=id,title,handle,thumbnail,variants.prices.amount,variants.prices.currency_code`,
      { 
        headers: {
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
        },
        next: { revalidate: 60 } 
      }
    );
    const data = await res.json();
    return data.products || [];
  } catch (e) { return []; }
}

export default async function Home() {
  const [categories, featuredProducts] = await Promise.all([
    getCategories(),
    getFeaturedProducts()
  ]);

  // Beautiful high-res covers for your actual category names
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
    'default': "/categories/android-player.png"
  };
  return (
    <main className="flex-grow">
      {/* Hero Banner */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />
          <Image 
            src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=2000" 
            alt="Performance Car Interior" 
            fill 
            className="object-cover opacity-60"
            priority
          />
        </div>
        <div className="container mx-auto px-4 relative z-20 text-center md:text-left flex flex-col md:items-start items-center">
          <span className="bg-primary/20 text-primary border border-primary/50 px-4 py-1 rounded-full text-sm font-bold tracking-wider mb-6 animate-pulse">
            NEW ARRIVALS 2026
          </span>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight max-w-3xl">
            ELEVATE YOUR RIDE TO <span className="text-primary italic">PERFECTION</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl font-light">
            Premium car accessories engineered for enthusiasts. From dynamic lighting to performance seat covers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Link href="/shop" className="btn-primary">
              Shop Now
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
            <Link href="/categories" className="btn-secondary">
              View Categories
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="bg-background border-b border-border py-4 md:py-6 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-6 md:gap-4 opacity-80">
            {[
              { icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', label: '100% GENUINE PRODUCTS' },
              { icon: 'M5 12l5 5L20 7', label: 'EXPERT INSTALLATION SUPPORT' },
              { icon: 'M21 10H3M21 6H3M21 14H3M21 18H3', label: 'PAN-INDIA FAST SHIPPING' },
              { icon: 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6', label: 'SECURE PAYMENTS' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 group">
                <div className="text-primary group-hover:scale-110 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={item.icon}/>
                  </svg>
                </div>
                <span className="text-[10px] md:text-xs font-black tracking-tighter text-white">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vehicle Selection Section */}
      <section className="relative z-30 mt-8 mb-16">
        <div className="container mx-auto px-4">
          <UniversalVehicleSelector />
        </div>
      </section>



      {/* Featured Categories */}
      <section className="py-24 container mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black mb-2">SHOP BY CATEGORY</h2>
            <div className="h-1 w-24 bg-primary rounded-full"></div>
          </div>
          <Link href="/categories" className="hidden md:flex items-center gap-2 text-primary hover:text-white transition-colors font-bold uppercase tracking-wider">
            All Categories <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat: any) => (
            <Link href={`/category/${cat.handle}`} key={cat.id} className="card-premium aspect-square relative group block overflow-hidden bg-white">
              <Image 
                src={catCovers[cat.handle] || cat.image || catCovers['default']} 
                alt={cat.name} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                <h3 className="text-2xl font-black text-white drop-shadow-lg">{cat.name}</h3>
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 shadow-glow">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m9 18 6-6-6-6"/></svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-surface border-y border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">PERFORMANCE UPGRADES</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Discover our best-selling accessories designed to take your vehicle to the next level.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product: any) => {
              let price = product.variants?.[0]?.prices?.[0]?.amount || 0;
              if (price > 0 && product.variants?.[0]?.prices?.[0]?.currency_code === 'inr') {
                price = price / 100;
              }

              return (
                <div key={product.id} className="card-premium group">
                  <div className="relative aspect-[4/5] overflow-hidden bg-white">
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-primary text-white text-[10px] font-bold px-2 py-1 rounded">HOT</span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-background/40 backdrop-blur-sm z-10 transition-all duration-300">
                      <button className="btn-primary py-3 px-6 text-sm">Add to Cart</button>
                    </div>
                    {product.thumbnail ? (
                      <Image src={product.thumbnail} alt={product.title} fill className="object-contain transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full bg-border/20" />
                    )}
                  </div>
                  <div className="p-6">
                    <div className="text-primary text-[10px] font-bold mb-1 uppercase tracking-widest">Performance</div>
                    <Link href={`/product/${product.handle}`} className="hover:text-primary transition-colors">
                      <h3 className="text-lg font-bold mb-2 line-clamp-1">{product.title}</h3>
                    </Link>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex text-yellow-500">
                        {[1,2,3,4,5].map(s => <svg key={s} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)}
                      </div>
                      <span className="text-xs text-gray-400 font-bold">(42)</span>
                    </div>
                    <div className="text-xl font-black">₹{price.toLocaleString('en-IN')}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* Popular Brands Row (Now at bottom) */}
      <section className="py-12 bg-surface border-b border-border overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center mb-8">
            <h3 className="text-xs font-bold text-primary tracking-[0.3em] uppercase mb-2">Authorized Partners</h3>
            <p className="text-gray-500 text-sm">Shop accessories from the world's leading automotive brands</p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 md:gap-x-20">
            {[
              { name: "OSRAM", q: "osram" },
              { name: "SONY", q: "sony" },
              { name: "BLAUPUNKT", q: "blaupunkt" },
              { name: "PIONEER", q: "pioneer" },
              { name: "JBL", q: "jbl" },
              { name: "myTVS", q: "mytvs" },
              { name: "NAKAMICHI", q: "nakamichi" },
              { name: "NIHON", q: "nippon" },
              { name: "DIAMOND", q: "diamond" },
              { name: "DIESELTRONIC", q: "dieseltronic" },
              { name: "RACE DYNAMICS", q: "race dynamics" },
              { name: "YUEMI", q: "yuemi" }
            ].map((brand) => (
              <Link 
                key={brand.name} 
                href={`/shop?q=${brand.q}`}
                className="group relative"
              >
                <span className="text-2xl md:text-3xl font-black italic tracking-tighter text-white/50 group-hover:text-white transition-all duration-300 transform group-hover:scale-110 block">
                  {brand.name}
                </span>
                <div className="absolute -bottom-2 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
