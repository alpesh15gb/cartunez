"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PriceFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [min, setMin] = useState(searchParams.get("min") || "");
  const [max, setMax] = useState(searchParams.get("max") || "");
  const [rangeValue, setRangeValue] = useState(searchParams.get("max") || "50000");

  useEffect(() => {
    setMin(searchParams.get("min") || "");
    setMax(searchParams.get("max") || "");
    setRangeValue(searchParams.get("max") || "50000");
  }, [searchParams]);

  const handleRefine = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (min) params.set("min", min);
    else params.delete("min");
    
    if (max) params.set("max", max);
    else params.delete("max");

    router.push(`/shop?${params.toString()}`);
  };

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setRangeValue(val);
    setMax(val);
  };

  return (
    <div className="space-y-4">
      <div className="relative pt-2">
        <input 
          type="range" 
          min="0" 
          max="100000" 
          step="500"
          value={rangeValue}
          onChange={handleRangeChange}
          className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-primary" 
        />
        <div className="flex justify-between mt-2 text-[10px] font-bold text-gray-500 uppercase">
          <span>₹0</span>
          <span>₹1L+</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="relative w-full">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">₹</span>
          <input 
            type="number" 
            placeholder="Min" 
            value={min}
            onChange={(e) => setMin(e.target.value)}
            className="w-full bg-surface border border-border rounded-xl pl-6 p-2.5 text-xs text-white outline-none focus:border-primary transition-all" 
          />
        </div>
        <span className="text-gray-500">-</span>
        <div className="relative w-full">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">₹</span>
          <input 
            type="number" 
            placeholder="Max" 
            value={max}
            onChange={(e) => setMax(e.target.value)}
            className="w-full bg-surface border border-border rounded-xl pl-6 p-2.5 text-xs text-white outline-none focus:border-primary transition-all" 
          />
        </div>
      </div>
      
      <button 
        onClick={handleRefine}
        className="w-full bg-primary/10 hover:bg-primary text-primary hover:text-white font-bold py-3 rounded-xl transition-all text-xs border border-primary/20 hover:border-primary shadow-sm hover:shadow-glow uppercase tracking-tighter"
      >
        Refine Results
      </button>

      {(min || max) && (
        <button 
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString());
            params.delete("min");
            params.delete("max");
            router.push(`/shop?${params.toString()}`);
          }}
          className="w-full text-center text-[10px] text-gray-500 hover:text-white transition-colors uppercase font-bold"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}
