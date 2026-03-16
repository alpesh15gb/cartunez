"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { vehicleData } from "@/data/car-compatibility";
import { useGarage } from "@/context/GarageContext";

export default function UniversalVehicleSelector() {
  const router = useRouter();
  const { saveToGarage, savedVehicle, removeFromGarage } = useGarage();
  
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");

  const makes = Array.from(new Set(vehicleData.map(v => v.make))).sort();
  const models = make ? vehicleData.filter(v => v.make === make).map(v => v.model).sort() : [];

  const handleSearch = () => {
    if (make && model) {
      saveToGarage(make, model);
      router.push(`/shop?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}`);
    }
  };

  if (savedVehicle) {
    return (
      <div className="glass-morphism p-6 rounded-3xl border border-primary/20 bg-primary/5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-glow">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-glow">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
          </div>
          <div>
            <h4 className="text-white font-black text-lg leading-tight uppercase">My Garage</h4>
            <p className="text-primary font-bold text-sm italic">{savedVehicle.make} {savedVehicle.model}</p>
            <p className="text-gray-500 text-[10px] uppercase tracking-widest">PCD: {savedVehicle.pcd} · Bore: {savedVehicle.centerBore}mm</p>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={() => router.push(`/shop?make=${encodeURIComponent(savedVehicle.make)}&model=${encodeURIComponent(savedVehicle.model)}`)}
            className="flex-grow md:flex-initial bg-primary hover:bg-primary-dark text-white font-black px-8 py-3 rounded-xl transition-all shadow-glow uppercase text-xs"
          >
            Find Parts
          </button>
          <button 
            onClick={removeFromGarage}
            className="p-3 rounded-xl bg-surface border border-border hover:border-red-500/50 hover:text-red-500 transition-all text-gray-500"
            title="Clear Garage"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-morphism p-8 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
      
      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="shrink-0 text-center lg:text-left">
          <h3 className="text-white font-black text-2xl uppercase italic tracking-tighter leading-tight">Find Parts For <span className="text-primary block lg:inline">Your Vehicle</span></h3>
          <p className="text-gray-500 text-xs mt-1">Select Make → Model → Show Parts</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow w-full">
          <div className="relative">
            <label className="absolute -top-2.5 left-4 bg-[#0a0a0a] px-2 text-[10px] font-black text-gray-500 uppercase tracking-widest z-10">Make</label>
            <select 
              value={make}
              onChange={(e) => { setMake(e.target.value); setModel(""); }}
              className="w-full bg-surface border border-border rounded-2xl px-5 py-4 text-white font-bold outline-none focus:border-primary transition-all appearance-none cursor-pointer"
            >
              <option value="">Select Make</option>
              {makes.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div className="relative">
            <label className="absolute -top-2.5 left-4 bg-[#0a0a0a] px-2 text-[10px] font-black text-gray-500 uppercase tracking-widest z-10">Model</label>
            <select 
              value={model}
              disabled={!make}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-surface border border-border rounded-2xl px-5 py-4 text-white font-bold outline-none focus:border-primary transition-all appearance-none cursor-pointer disabled:opacity-30"
            >
              <option value="">Select Model</option>
              {models.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>

        <button 
          onClick={handleSearch}
          disabled={!model}
          className="w-full lg:w-auto bg-primary hover:bg-primary-dark text-white font-black px-10 py-5 rounded-2xl transition-all shadow-glow hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:grayscale uppercase text-sm tracking-widest"
        >
          Show Parts
        </button>
      </div>
    </div>
  );
}
