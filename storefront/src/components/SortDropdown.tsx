"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SortDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "recommended";

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    
    if (value === "recommended") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }

    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="relative">
      <select 
        value={currentSort}
        onChange={handleSortChange}
        className="bg-surface border border-border text-white px-4 py-2.5 rounded-xl outline-none focus:border-primary transition-all cursor-pointer appearance-none pr-10 min-w-[180px] text-sm font-bold uppercase tracking-tighter"
      >
        <option value="recommended">Recommended</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="newest">Latest Arrivals</option>
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </div>
    </div>
  );
}
