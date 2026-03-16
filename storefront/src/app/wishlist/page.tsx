"use client";

import Image from "next/image";
import Link from "next/link";

export default function WishlistPage() {
  const wishlistItems = [
    {
      id: 1,
      title: "Magnetic Car Phone Holder | Cartunez",
      price: 899,
      image: "https://images.unsplash.com/photo-1621251349071-70bf214d48db?auto=format&fit=crop&q=80&w=200",
      inStock: true
    },
    {
      id: 2,
      title: "Premium 7D Custom Floor Mats",
      price: 4500,
      image: "https://images.unsplash.com/photo-1610488582068-d6219468bfb8?auto=format&fit=crop&q=80&w=200",
      inStock: true
    }
  ];

  return (
    <main className="flex-grow pt-8 pb-32 container mx-auto px-4 max-w-5xl">
      <div className="flex justify-between items-end mb-8 border-b border-border pb-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black mb-2">MY WISHLIST</h1>
          <p className="text-gray-400">You have {wishlistItems.length} items saved.</p>
        </div>
        <button className="hidden sm:flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
          Share List
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistItems.map((item) => (
          <div key={item.id} className="bg-surface border border-border rounded-2xl p-4 flex flex-col group relative">
            <button className="absolute top-6 right-6 z-10 text-gray-400 hover:text-red-500 transition-colors p-2 bg-background/80 rounded-full backdrop-blur-md">
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            </button>
            <Link href="/product/demo" className="shrink-0 aspect-square relative bg-background rounded-xl overflow-hidden block mb-4">
              <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
            </Link>
            
            <div className="flex-grow flex flex-col justify-between">
              <Link href="/product/demo" className="hover:text-primary transition-colors">
                 <h3 className="font-bold line-clamp-2 md:text-lg leading-tight mb-2">{item.title}</h3>
              </Link>
              
              <div className="flex justify-between items-end mt-4">
                <div className="font-black text-xl">₹{item.price.toLocaleString('en-IN')}</div>
                <span className={`text-xs font-bold px-2 py-1 rounded ${item.inStock ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {item.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              <button 
                className={`w-full py-3 rounded-lg font-bold text-sm mt-4 transition-colors ${item.inStock ? 'bg-primary hover:bg-primary/90 text-white shadow-glow' : 'bg-surface border border-border text-gray-500 cursor-not-allowed'}`}
                disabled={!item.inStock}
              >
                {item.inStock ? 'Add to Cart' : 'Notify Me'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 sm:hidden">
        <button className="btn-secondary w-full py-3 flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
          Share Wishlist
        </button>
      </div>
    </main>
  );
}
