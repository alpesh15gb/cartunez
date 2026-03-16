"use client";

import { useState } from "react";
import PriceFilter from "./PriceFilter";
import SortDropdown from "./SortDropdown";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface Category {
  id: string;
  name: string;
  handle: string;
}

interface MobileFilterBarProps {
  categories: Category[];
  totalCount: number;
}

export default function MobileFilterBar({ categories, totalCount }: MobileFilterBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"filter" | "sort">("filter");
  const searchParams = useSearchParams();
  const catParam = searchParams.get("category");

  if (!isOpen) {
    return (
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] bg-surface/90 backdrop-blur-xl border border-border/50 p-2 rounded-2xl shadow-2xl shadow-black/50 z-50 flex gap-2">
        <button 
          onClick={() => { setActiveTab("filter"); setIsOpen(true); }}
          className="flex-1 bg-surface-hover hover:bg-surface border border-border text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
          <span className="text-sm">Filter</span>
        </button>
        <div className="w-px bg-border/50 my-2"></div>
        <button 
          onClick={() => { setActiveTab("sort"); setIsOpen(true); }}
          className="flex-1 bg-surface-hover hover:bg-surface border border-border text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="m3 16 4 4 4-4"/><path d="M7 20V4"/><path d="m21 8-4-4-4 4"/><path d="M17 4v16"/></svg>
          <span className="text-sm">Sort</span>
        </button>
      </div>
    );
  }

  return (
    <div className="md:hidden fixed inset-0 bg-background/95 backdrop-blur-md z-[100] flex flex-col animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <h2 className="text-xl font-black uppercase italic tracking-tighter">Shop Customization</h2>
        <button 
          onClick={() => setIsOpen(false)}
          className="p-2 bg-surface border border-border rounded-xl text-gray-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>

      <div className="flex border-b border-border">
        <button 
          onClick={() => setActiveTab("filter")}
          className={`flex-1 py-4 text-sm font-black uppercase tracking-widest transition-all ${activeTab === "filter" ? "text-primary border-b-2 border-primary" : "text-gray-500"}`}
        >
          Filters
        </button>
        <button 
          onClick={() => setActiveTab("sort")}
          className={`flex-1 py-4 text-sm font-black uppercase tracking-widest transition-all ${activeTab === "sort" ? "text-primary border-b-2 border-primary" : "text-gray-500"}`}
        >
          Sorting
        </button>
      </div>

      <div className="flex-grow overflow-y-auto p-6 space-y-8">
        {activeTab === "filter" ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
            <div>
              <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Price Range</h3>
              <PriceFilter />
            </div>
            
            <div>
              <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Categories</h3>
              <div className="grid grid-cols-2 gap-2">
                <Link 
                  href="/shop"
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-xl border text-xs font-bold transition-all text-center ${!catParam ? "bg-primary/20 border-primary text-primary" : "bg-surface border-border text-gray-400"}`}
                >
                  All Accessories ({totalCount})
                </Link>
                {categories.map((cat) => (
                  <Link 
                    key={cat.id}
                    href={`/shop?category=${cat.handle}`}
                    onClick={() => setIsOpen(false)}
                    className={`px-4 py-3 rounded-xl border text-xs font-bold transition-all text-center ${catParam === cat.handle ? "bg-primary/20 border-primary text-primary" : "bg-surface border-border text-gray-400"}`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300 text-center">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Order Products By</h3>
            <div className="flex justify-center">
              <SortDropdown />
            </div>
            <p className="text-xs text-gray-500 mt-4 leading-relaxed px-4">
              Select your preferred sorting method to organize the automotive gear.
            </p>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-border">
        <button 
          onClick={() => setIsOpen(false)}
          className="w-full bg-primary text-white font-black py-4 rounded-2xl shadow-glow uppercase tracking-widest"
        >
          Show Results
        </button>
      </div>
    </div>
  );
}
