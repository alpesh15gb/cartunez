"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { vehicleData, VehicleCompatibility } from "@/data/car-compatibility";

type GarageContextType = {
  savedVehicle: VehicleCompatibility | null;
  saveToGarage: (make: string, model: string) => void;
  removeFromGarage: () => void;
  isVehicleSaved: boolean;
};

const GarageContext = createContext<GarageContextType | undefined>(undefined);

export function GarageProvider({ children }: { children: React.ReactNode }) {
  const [savedVehicle, setSavedVehicle] = useState<VehicleCompatibility | null>(null);
  const [isVehicleSaved, setIsVehicleSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("cartunez_garage");
    if (stored) {
      const { make, model } = JSON.parse(stored);
      const found = vehicleData.find(v => v.make === make && v.model === model);
      if (found) {
        setSavedVehicle(found);
        setIsVehicleSaved(true);
      }
    }
  }, []);

  const saveToGarage = (make: string, model: string) => {
    const found = vehicleData.find(v => v.make === make && v.model === model);
    if (found) {
      setSavedVehicle(found);
      setIsVehicleSaved(true);
      localStorage.setItem("cartunez_garage", JSON.stringify({ make, model }));
    }
  };

  const removeFromGarage = () => {
    setSavedVehicle(null);
    setIsVehicleSaved(false);
    localStorage.removeItem("cartunez_garage");
  };

  return (
    <GarageContext.Provider value={{ savedVehicle, saveToGarage, removeFromGarage, isVehicleSaved }}>
      {children}
    </GarageContext.Provider>
  );
}

export function useGarage() {
  const context = useContext(GarageContext);
  if (context === undefined) {
    throw new Error("useGarage must be used within a GarageProvider");
  }
  return context;
}
