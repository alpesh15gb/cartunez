import Link from "next/link";
import { Suspense } from "react";
import PriceFilter from "@/components/PriceFilter";
import SortDropdown from "@/components/SortDropdown";
import ProductGrid from "@/components/ProductGrid";
import GarageUpdater from "@/components/GarageUpdater";
import { vehicleData } from "@/data/car-compatibility";

const PAGE_SIZE = 20;

type MedusaProduct = {
  id: string;
  title: string;
  handle: string;
  description: string;
  thumbnail?: string;
  variants?: {
    id: string;
    metadata?: Record<string, any>;
    prices: { amount: number; currency_code: string }[];
  }[];
};

// ── Medusa helpers ─────────────────────────────────────────────────────────
const BACKEND = () => process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
const KEY = () => process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";
const headers = () => ({ "x-publishable-api-key": KEY() });

async function fetchProducts(params: Record<string, string>): Promise<{ products: MedusaProduct[]; count: number }> {
  try {
    const url = new URL(`${BACKEND()}/store/products`);
    url.searchParams.set("fields", "id,title,handle,description,thumbnail,variants.id,variants.title,variants.metadata,variants.prices.amount,variants.prices.currency_code");
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
    const res = await fetch(url.toString(), { headers: headers(), cache: "no-store" });
    if (!res.ok) return { products: [], count: 0 };
    const data = await res.json();
    return { products: data.products || [], count: data.count ?? 0 };
  } catch { return { products: [], count: 0 }; }
}

async function resolveCategoryId(handle: string): Promise<string | undefined> {
  if (handle.startsWith("pcat_")) return handle;
  try {
    const res = await fetch(`${BACKEND()}/store/product-categories?handle=${handle}`, { headers: headers(), cache: "no-store" });
    if (!res.ok) return undefined;
    const d = await res.json();
    return d.product_categories?.[0]?.id;
  } catch { return undefined; }
}

async function getCategories() {
  try {
    const res = await fetch(`${BACKEND()}/store/product-categories`, { headers: headers(), cache: "no-store" });
    if (!res.ok) return [];
    return (await res.json()).product_categories || [];
  } catch { return []; }
}

function sortProducts(products: MedusaProduct[], sort?: string) {
  if (!sort) return products;
  return [...products].sort((a, b) => {
    const price = (p: MedusaProduct) =>
      p.variants?.[0]?.prices?.find(pr => pr.currency_code?.toLowerCase() === "inr")?.amount ?? 0;
    if (sort === "price-asc") return price(a) - price(b);
    if (sort === "price-desc") return price(b) - price(a);
    return 0;
  });
}

// ── Vehicle-based search ───────────────────────────────────────────────────
async function getVehicleCompatibleProducts(vehicleLabel: string) {
  // Find vehicle in our data
  const vehicle = vehicleData.find(
    v => `${v.make} ${v.model}`.toLowerCase() === vehicleLabel.toLowerCase()
  );
  if (!vehicle) return { products: [], count: 0, vehicle: null };

  // 1. Neo Wheels — fetch ALL and filter by PCD client-side
  //    (variant metadata.pcd must match vehicle.pcd)
  const nwCatId = await resolveCategoryId("neo-wheels");
  const allResults = await Promise.all([
    nwCatId ? fetchProducts({ category_id: nwCatId, limit: "200" }) : { products: [], count: 0 },
    // 2. DieselTRONIC — always fetch for vehicle searches
    fetchProducts({ q: "dieseltronic", limit: "50" }),
  ]);

  const [nwRaw, dtRaw] = allResults;

  // Filter Neo Wheels: at least one variant must have matching PCD
  const nwFiltered = nwRaw.products.filter(p =>
    p.variants?.some(v => {
      const varPcd = (v.metadata?.pcd as string | undefined)?.toLowerCase().trim();
      // Also parse from title: "17\" / PCD 5x114.3 / Black Machined"
      const titlePcd = v.metadata?.pcd
        ? undefined
        : (p.variants?.[0] as any)?.title?.match(/PCD\s+([\dx.]+)/i)?.[1];
      return varPcd === vehicle.pcd.toLowerCase().trim() ||
             titlePcd?.toLowerCase() === vehicle.pcd.toLowerCase().trim();
    })
  );

  // Filter DieselTRONIC: variant title must mention make AND a key word from the model
  const dtFiltered = dtRaw.products.filter(p =>
    p.variants?.some((v: any) => {
      if (!v.title) return false;
      const t = v.title.toLowerCase();
      const userMake = vehicle.make.toLowerCase();
      const userModelWords = vehicle.model.toLowerCase().split(" ").filter(w => w.length > 1);
      
      const makeMatch = t.includes(userMake);
      const modelMatch = userModelWords.some(w => t.includes(w));
      
      return makeMatch && modelMatch;
    })
  );

  const combined = [...nwFiltered, ...dtFiltered];
  // Deduplicate
  const seen = new Set<string>();
  const deduped = combined.filter(p => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });

  return { products: deduped, count: deduped.length, vehicle };
}

// ── Normal search ──────────────────────────────────────────────────────────
async function getNormalProducts(
  categoryId?: string,
  query?: string,
  minPrice?: string,
  maxPrice?: string,
  sort?: string
) {
  let actualCategoryId = categoryId;
  if (categoryId && !categoryId.startsWith("pcat_")) {
    actualCategoryId = await resolveCategoryId(categoryId);
  }

  const params: Record<string, string> = {
    limit: String(PAGE_SIZE),
    offset: "0",
  };
  if (actualCategoryId) params.category_id = actualCategoryId;
  if (query) params.q = query;

  let { products, count } = await fetchProducts(params);

  if (minPrice || maxPrice) {
    const min = minPrice ? parseInt(minPrice) * 100 : 0;
    const max = maxPrice ? parseInt(maxPrice) * 100 : Infinity;
    products = products.filter(p => {
      const inr = p.variants?.flatMap(v => v.prices).filter(pr => pr.currency_code?.toLowerCase() === "inr") ?? [];
      if (!inr.length) return true;
      return inr.some(pr => pr.amount >= min && pr.amount <= max);
    });
  }

  products = sortProducts(products, sort);
  return { products, count, resolvedCategoryId: actualCategoryId };
}

// ── Page ───────────────────────────────────────────────────────────────────
export default async function Shop({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; vehicle?: string; min?: string; max?: string; sort?: string }>;
}) {
  const params   = await searchParams;
  const vehicle  = params.vehicle;    // e.g. "Mahindra Thar 2020"
  const q        = params.q;
  const catParam = params.category;
  const min      = params.min;
  const max      = params.max;
  const sort     = params.sort;

  const categories = await getCategories();

  // ── Vehicle search mode ──────────────────────────────────────────────────
  if (vehicle) {
    const { products, count, vehicle: veh } = await getVehicleCompatibleProducts(vehicle);

    return (
      <main className="flex-grow pt-8 pb-24 container mx-auto px-4">
        {/* Auto-save the searched vehicle to garage so product page badges show the right car */}
        <Suspense fallback={null}><GarageUpdater /></Suspense>

        {/* Vehicle Banner */}
        <div className="mb-8">
          <div className="text-sm text-gray-500 mb-4 flex items-center gap-2">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-white">Vehicle Search</span>
          </div>

          {veh ? (
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
              {/* Vehicle card */}
              <div className="flex items-center gap-4 bg-primary/10 border border-primary/30 rounded-2xl px-6 py-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <circle cx="6" cy="17" r="2"/><circle cx="18" cy="17" r="2"/>
                    <path d="M15 7H7l-3 6h16l-2-6z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-0.5">Showing results for</div>
                  <div className="text-xl font-black text-white">{veh.make} {veh.model}</div>
                  <div className="text-xs text-gray-400 font-bold">PCD {veh.pcd} · Bore {veh.centerBore}mm · Sizes: {veh.recommendedSizes.join(", ")}″</div>
                </div>
              </div>
              <Link href="/shop" className="text-sm text-gray-500 hover:text-white transition-colors flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                Clear vehicle filter
              </Link>
            </div>
          ) : (
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl px-6 py-4 mb-6">
              <p className="text-orange-400 font-bold text-sm">
                Vehicle "{vehicle}" not found in our database. Showing all products instead.
              </p>
            </div>
          )}

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black uppercase">
                {veh ? `Compatible Wheels & Parts` : "All Products"}
              </h1>
              <p className="text-gray-400 mt-1">
                {count} products found{veh ? ` — Neo Wheels (PCD ${veh.pcd}) + DieselTRONIC` : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Section labels */}
        {veh && count > 0 && (
          <div className="mb-6 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 bg-surface border border-border rounded-full px-4 py-1.5 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
              Neo Wheels (PCD {veh.pcd})
            </div>
            <div className="flex items-center gap-2 bg-surface border border-border rounded-full px-4 py-1.5 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-orange-400 inline-block"></span>
              DieselTRONIC Performance
            </div>
          </div>
        )}

        <ProductGrid
          initialProducts={products}
          totalCount={count}
        />
      </main>
    );
  }

  // ── Normal shop mode ─────────────────────────────────────────────────────
  const { products, count, resolvedCategoryId } = await getNormalProducts(catParam, q, min, max, sort);

  const activeCategory = categories.find(
    (c: any) => c.id === catParam || c.handle === catParam
  );

  return (
    <main className="flex-grow pt-8 pb-24 container mx-auto px-4">
      <div className="mb-8">
        <div className="text-sm text-gray-500 mb-4 flex items-center gap-2">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <span className="text-white">Shop</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-black mb-2 uppercase">
              {q ? `Search: ${q}` : activeCategory ? activeCategory.name : "All Products"}
            </h1>
            <p className="text-gray-400">{count} results</p>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <span className="text-gray-400 text-sm font-bold uppercase tracking-widest">Sort by:</span>
            <SortDropdown />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="hidden md:block w-64 shrink-0 space-y-8">
          <div>
            <h3 className="text-lg font-bold mb-4 uppercase tracking-wider border-b border-border pb-2">Categories</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/shop" className="flex items-center justify-between group">
                  <span className={!catParam ? "text-primary font-bold" : "text-gray-400 group-hover:text-white transition-colors"}>All Accessories</span>
                  <span className="text-xs text-gray-600 bg-surface px-2 py-1 rounded-full">{count}</span>
                </Link>
              </li>
              {categories.map((cat: any) => (
                <li key={cat.id}>
                  <Link href={`/shop?category=${cat.handle}`} className="flex items-center justify-between group">
                    <span className={catParam === cat.id || catParam === cat.handle ? "text-primary font-bold" : "text-gray-400 group-hover:text-white transition-colors"}>
                      {cat.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4 uppercase tracking-wider border-b border-border pb-2">Price Range</h3>
            <PriceFilter />
          </div>
        </aside>

        <div className="flex-grow">
          <ProductGrid
            initialProducts={products}
            totalCount={count}
            categoryId={resolvedCategoryId}
            query={q}
            minPrice={min}
            maxPrice={max}
            sort={sort}
          />
        </div>
      </div>

      {/* Mobile Filter/Sort Bar */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] bg-surface/90 backdrop-blur-xl border border-border/50 p-2 rounded-2xl shadow-2xl shadow-black/50 z-50 flex gap-2">
        <button className="flex-1 bg-surface-hover hover:bg-surface border border-border text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
          <span className="text-sm">Filter</span>
        </button>
        <div className="w-px bg-border/50 my-2"></div>
        <button className="flex-1 bg-surface-hover hover:bg-surface border border-border text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="m3 16 4 4 4-4"/><path d="M7 20V4"/><path d="m21 8-4-4-4 4"/><path d="M17 4v16"/></svg>
          <span className="text-sm">Sort</span>
        </button>
      </div>
    </main>
  );
}
