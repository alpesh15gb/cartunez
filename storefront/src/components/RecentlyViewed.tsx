"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type RecentProduct = {
  id: string;
  title: string;
  handle: string;
  thumbnail?: string;
  price: string;
};

export default function RecentlyViewed({ currentProduct }: { currentProduct?: RecentProduct }) {
  const [recentProducts, setRecentProducts] = useState<RecentProduct[]>([]);

  useEffect(() => {
    // 1. Load history from localStorage
    const saved = localStorage.getItem("cartunez_recently_viewed");
    let history: RecentProduct[] = saved ? JSON.parse(saved) : [];

    // 2. Add current product if provided
    if (currentProduct) {
      // Remove if already exists to move it to front
      history = history.filter(p => p.id !== currentProduct.id);
      // Add to front
      history.unshift(currentProduct);
      // Keep only last 10
      history = history.slice(0, 10);
      localStorage.setItem("cartunez_recently_viewed", JSON.stringify(history));
    }

    // 3. For display, we usually want to show items OTHER than the current one
    const displayItems = currentProduct 
      ? history.filter(p => p.id !== currentProduct.id && p.handle !== currentProduct.handle).slice(0, 4)
      : history.slice(0, 4);

    setRecentProducts(displayItems);
  }, [currentProduct]);

  if (recentProducts.length === 0) return null;

  return (
    <div className="mt-24 pt-16 border-t border-border">
      <div className="flex justify-between items-end mb-8">
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wider">Recently Viewed</h2>
        <Link href="/shop" className="text-primary font-bold hover:text-white transition-colors text-sm">View All</Link>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {recentProducts.map((product) => (
          <div key={product.id} className="card-premium group">
            <Link href={`/product/${product.handle}`} className="block relative aspect-[4/5] overflow-hidden bg-background">
              <div className="absolute inset-x-4 bottom-4 z-20 flex opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0 text-center">
                <div className="w-full bg-primary/90 hover:bg-primary text-white font-bold py-2 md:py-3 text-xs md:text-sm rounded shadow-glow backdrop-blur-sm transition-colors flex items-center justify-center">
                  View Product
                </div>
              </div>
              {product.thumbnail ? (
                <Image 
                  src={product.thumbnail} 
                  alt={product.title} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-all duration-700" 
                />
              ) : (
                <div className="w-full h-full bg-border/20 flex items-center justify-center text-gray-600">No Image</div>
              )}
            </Link>
            <div className="p-4 md:p-6">
              <Link href={`/product/${product.handle}`} className="hover:text-primary transition-colors block mb-2">
                <h3 className="font-bold line-clamp-2 md:text-lg leading-tight uppercase">
                  {product.title}
                </h3>
              </Link>
              <div className="text-lg md:text-xl font-black text-white">
                {product.price}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
