"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { vehicleData } from "@/data/car-compatibility";
import { useGarage } from "@/context/GarageContext";

type Suggestion =
  | { type: "vehicle"; make: string; model: string; pcd: string; label: string }
  | { type: "product"; label: string; query: string };

export default function SearchBox() {
  const [query, setQuery]           = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen]             = useState(false);
  const router                      = useRouter();
  const { saveToGarage }            = useGarage();
  const inputRef                    = useRef<HTMLInputElement>(null);
  const boxRef                      = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) { setSuggestions([]); setOpen(false); return; }

    const vehicleSuggestions: Suggestion[] = vehicleData
      .filter(v =>
        v.model.toLowerCase().includes(q) ||
        v.make.toLowerCase().includes(q) ||
        `${v.make} ${v.model}`.toLowerCase().includes(q)
      )
      .slice(0, 5)
      .map(v => ({
        type: "vehicle" as const,
        make: v.make,
        model: v.model,
        pcd: v.pcd,
        label: `${v.make} ${v.model}`,
      }));

    // Always add the product search option at the bottom
    const productSuggestion: Suggestion[] = [
      { type: "product", label: `Search all products for "${query.trim()}"`, query: query.trim() }
    ];

    setSuggestions([...vehicleSuggestions, ...productSuggestion]);
    setOpen(true);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Check if query exactly matches a vehicle
    const q = query.trim().toLowerCase();
    const exact = vehicleData.find(
      v => v.model.toLowerCase() === q ||
           `${v.make} ${v.model}`.toLowerCase() === q
    );
    if (exact) {
      router.push(`/shop?vehicle=${encodeURIComponent(`${exact.make} ${exact.model}`)}`);
    } else {
      router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
    }
    setOpen(false);
    setQuery("");
  };

  const selectVehicle = (s: Suggestion) => {
    if (s.type === "vehicle") {
      // ── Save to garage immediately — before navigation ──────────────────
      // This ensures product pages show "Fits your i20" not a stale garage entry.
      saveToGarage(s.make, s.model);
      router.push(`/shop?vehicle=${encodeURIComponent(s.label)}`);
    } else {
      router.push(`/shop?q=${encodeURIComponent(s.query)}`);
    }
    setOpen(false);
    setQuery("");
  };

  return (
    <div ref={boxRef} className="flex-grow max-w-md hidden md:block relative">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); }}
            onFocus={() => query.length >= 2 && setOpen(true)}
            placeholder="Search wheels, accessories or vehicle…"
            className="w-full bg-surface border border-border rounded-full py-2 pl-10 pr-4 outline-none focus:border-primary transition-colors text-sm"
          />
          <button type="submit" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
          </button>
        </div>
      </form>

      {/* Dropdown */}
      {open && suggestions.length > 0 && (
        <div className="absolute top-12 left-0 right-0 bg-surface border border-border rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">

          {/* Vehicle suggestions section */}
          {suggestions.some(s => s.type === "vehicle") && (
            <>
              <div className="px-4 py-2 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-border/50 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 17H5"/><path d="M5 17v-5l3-6h8l3 6v5"/>
                  <circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/>
                </svg>
                Vehicles — Find Compatible Wheels
              </div>
              {suggestions.filter(s => s.type === "vehicle").map((s, i) => (
                <button
                  key={`v-${i}`}
                  onClick={() => selectVehicle(s)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <circle cx="6" cy="17" r="2"/><circle cx="18" cy="17" r="2"/>
                      <path d="M15 7H7l-3 6h16l-2-6z"/>
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-white truncate">{(s as any).label}</div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">
                      PCD {(s as any).pcd} · Show compatible wheels
                    </div>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 shrink-0">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </button>
              ))}
            </>
          )}

          {/* Divider + Product search — always shown */}
          <div className="border-t border-border/50">
            <div className="px-4 py-2 text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
              </svg>
              Products
            </div>
            {suggestions.filter(s => s.type === "product").map((s, i) => (
              <button
                key={`p-${i}`}
                onClick={() => selectVehicle(s)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-500/5 transition-colors text-left border-t border-border/30"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                  </svg>
                </div>
                <div className="flex-1 text-sm font-medium text-blue-300">{(s as any).label}</div>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 shrink-0">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
