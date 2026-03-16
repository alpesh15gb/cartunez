"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

type MedusaProduct = {
  id: string;
  title: string;
  handle: string;
  description: string;
  thumbnail?: string;
  variants?: {
    prices: { amount: number; currency_code: string }[];
  }[];
};

const PAGE_SIZE = 20;

interface Props {
  initialProducts: MedusaProduct[];
  totalCount: number;
  categoryId?: string;
  query?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
}

export default function ProductGrid({
  initialProducts,
  totalCount,
  categoryId,
  query,
  minPrice,
  maxPrice,
  sort,
}: Props) {
  const [products, setProducts] = useState<MedusaProduct[]>(initialProducts);
  const [offset, setOffset] = useState(initialProducts.length);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialProducts.length < totalCount);

  // Reset when filters change
  useEffect(() => {
    setProducts(initialProducts);
    setOffset(initialProducts.length);
    setHasMore(initialProducts.length < totalCount);
  }, [initialProducts, totalCount]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
      const url = new URL(`${backendUrl}/store/products`);
      url.searchParams.set("fields", "id,title,handle,description,thumbnail,variants.id,variants.prices.amount,variants.prices.currency_code");
      url.searchParams.set("limit", String(PAGE_SIZE));
      url.searchParams.set("offset", String(offset));
      if (categoryId) url.searchParams.set("category_id", categoryId);
      if (query)      url.searchParams.set("q", query);

      const res = await fetch(url.toString(), {
        headers: {
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
        },
      });

      if (!res.ok) throw new Error("Fetch failed");
      const data = await res.json();
      let newProducts: MedusaProduct[] = data.products || [];

      // Client-side price filter
      if (minPrice || maxPrice) {
        const min = minPrice ? parseInt(minPrice) * 100 : 0;
        const max = maxPrice ? parseInt(maxPrice) * 100 : Infinity;
        newProducts = newProducts.filter((p) => {
          const inr = p.variants?.flatMap(v => v.prices).filter(pr => pr.currency_code?.toLowerCase() === "inr") ?? [];
          if (!inr.length) return true;
          return inr.some(pr => pr.amount >= min && pr.amount <= max);
        });
      }

      // Client-side sort
      if (sort) {
        newProducts.sort((a, b) => {
          const price = (p: MedusaProduct) =>
            p.variants?.[0]?.prices?.find(pr => pr.currency_code?.toLowerCase() === "inr")?.amount ?? 0;
          if (sort === "price-asc") return price(a) - price(b);
          if (sort === "price-desc") return price(b) - price(a);
          return 0;
        });
      }

      setProducts(prev => [...prev, ...newProducts]);
      setOffset(prev => prev + newProducts.length);
      setHasMore(newProducts.length === PAGE_SIZE);
    } catch (err) {
      console.error("Load more failed:", err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, offset, categoryId, query, minPrice, maxPrice, sort]);

  return (
    <>
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center w-full">
          <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mb-6 text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
          <h2 className="text-2xl font-black mb-2 uppercase">No Products Found</h2>
          <p className="text-gray-500 max-w-xs mx-auto">We couldn't find any accessories matching your criteria.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => {
              const variant  = product.variants?.[0];
              const priceObj = variant?.prices?.find(p => p.currency_code?.toLowerCase() === "inr") ?? variant?.prices?.[0];
              const price    = priceObj ? priceObj.amount / 100 : 0;

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
                      <div className="w-full h-full bg-border/20 flex items-center justify-center text-gray-500 text-xs">No Image</div>
                    )}
                  </Link>
                  <div className="p-4 md:p-6">
                    <Link href={`/product/${product.handle}`} className="hover:text-primary transition-colors block mb-2">
                      <h3 className="font-bold line-clamp-2 md:text-lg leading-tight">{product.title}</h3>
                    </Link>
                    <div className="flex items-end gap-2">
                      <div className="text-lg md:text-xl font-black">₹{price.toLocaleString("en-IN")}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Load More */}
          <div className="mt-12 flex flex-col items-center gap-3">
            {hasMore ? (
              <>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                  Showing {products.length} of {totalCount} products
                </p>
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="btn-secondary min-w-48 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Loading…
                    </>
                  ) : (
                    <>
                      Load More Products
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </>
                  )}
                </button>
              </>
            ) : products.length > 0 ? (
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                ✓ All {products.length} products loaded
              </p>
            ) : null}
          </div>
        </>
      )}
    </>
  );
}
