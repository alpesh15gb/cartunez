import Image from "next/image";
import Link from "next/link";

async function getCategories() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'}/store/product-categories?fields=id,name,handle,description`,
      { 
        headers: {
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
        },
        next: { revalidate: 3600 } 
      }
    );
    const data = await res.json();
    return data.product_categories || [];
  } catch (e) { return []; }
}

export default async function CategoriesPage() {
  const categories = await getCategories();

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

  return (
    <main className="flex-grow pt-8 pb-24 container mx-auto px-4">
      {/* Header & Breadcrumb */}
      <div className="mb-12">
        <div className="text-sm text-gray-500 mb-4 flex items-center gap-2">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <span className="text-white">Categories</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-2 uppercase">SHOP BY CATEGORY</h1>
        <p className="text-gray-400">Explore our curated collections of premium car accessories.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {categories.map((cat: any) => (
          <Link 
            href={`/category/${cat.handle}`} 
            key={cat.id} 
            className="card-premium group relative block aspect-square overflow-hidden bg-surface"
          >
            <Image 
              src={catCovers[cat.handle] || catCovers['default']} 
              alt={cat.name} 
              fill 
              className="object-cover transition-transform duration-700 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <div className="absolute inset-x-6 bottom-6 flex flex-col items-start">
              <h3 className="text-2xl font-black text-white drop-shadow-lg mb-1">{cat.name}</h3>
              <p className="text-xs text-gray-300 line-clamp-2 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {cat.description || `High-quality ${cat.name.toLowerCase()} for your car.`}
              </p>
              <div className="mt-4 flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                View Collection 
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
