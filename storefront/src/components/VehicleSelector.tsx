"use client";

import { useState, useMemo } from "react";

type Variant = {
  id: string;
  title: string;
  options?: Record<string, string>;
  prices: { amount: number; currency_code: string }[];
};

interface VehicleSelectorProps {
  variants: Variant[];
  onSelect: (variant: Variant) => void;
}

export default function VehicleSelector({ variants, onSelect }: VehicleSelectorProps) {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");

  // Group variants by Brand and Model
  const brandModelMap = useMemo(() => {
    const map: Record<string, string[]> = {};
    variants.forEach(v => {
      // The variant titles are like "Toyota Fortuner 2.8"
      // In my import script, I also saved them as options: { "Brand": brand, "Model": model }
      // But standard Medusa variants might just have the title. Let's try to parse or use options.
      
      const brand = v.options?.Brand || v.title.split(' ')[0];
      const model = v.options?.Model || v.title.split(' ').slice(1).join(' ');

      if (!map[brand]) map[brand] = [];
      if (!map[brand].includes(model)) map[brand].push(model);
    });
    return map;
  }, [variants]);

  const brands = Object.keys(brandModelMap).sort();
  const models = selectedBrand ? brandModelMap[selectedBrand].sort() : [];

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBrand(e.target.value);
    setSelectedModel("");
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const model = e.target.value;
    setSelectedModel(model);
    
    // Find the variant that matches
    const variant = variants.find(v => {
      const b = v.options?.Brand || v.title.split(' ')[0];
      const m = v.options?.Model || v.title.split(' ').slice(1).join(' ');
      return b === selectedBrand && m === model;
    });

    if (variant) {
      onSelect(variant);
    }
  };

  return (
    <div className="space-y-4 mb-8 p-6 bg-surface border border-border rounded-2xl shadow-surface">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
        </div>
        <h3 className="font-black text-sm uppercase tracking-widest text-white">SELECT YOUR VEHICLE</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Car Brand</label>
          <select 
            value={selectedBrand} 
            onChange={handleBrandChange}
            className="w-full bg-background border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-white font-bold appearance-none cursor-pointer"
          >
            <option value="">Choose Brand</option>
            {brands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Car Model</label>
          <select 
            value={selectedModel} 
            onChange={handleModelChange}
            disabled={!selectedBrand}
            className={`w-full bg-background border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-white font-bold appearance-none cursor-pointer ${!selectedBrand ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <option value="">{selectedBrand ? 'Choose Model' : 'Select Brand First'}</option>
            {models.map(model => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
        </div>
      </div>

      {selectedModel && (
        <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
          <div className="text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
          </div>
          <span className="text-xs font-bold text-primary italic">Perfect mapping available for {selectedBrand} {selectedModel}</span>
        </div>
      )}
    </div>
  );
}
