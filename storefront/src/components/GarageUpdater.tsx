"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useGarage } from "@/context/GarageContext";
import { vehicleData } from "@/data/car-compatibility";

/**
 * Reads the ?vehicle= URL param and saves the vehicle to the garage.
 * This ensures that when a user selects "Hyundai i20" from the search dropdown,
 * the product pages they navigate to will show "Fits your i20" — not a stale garage entry.
 */
export default function GarageUpdater() {
  const searchParams = useSearchParams();
  const { saveToGarage, savedVehicle } = useGarage();

  useEffect(() => {
    const vehicleParam = searchParams.get("vehicle");
    if (!vehicleParam) return;

    // Already synced — don't re-save unnecessarily
    if (savedVehicle && `${savedVehicle.make} ${savedVehicle.model}` === vehicleParam) return;

    const match = vehicleData.find(
      v => `${v.make} ${v.model}`.toLowerCase() === vehicleParam.toLowerCase()
    );
    if (match) {
      saveToGarage(match.make, match.model);
    }
  }, [searchParams]); // intentionally omit saveToGarage, savedVehicle to avoid re-render loops

  return null; // renders nothing — side-effect only
}
