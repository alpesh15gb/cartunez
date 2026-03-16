"use client";

import { useGarage } from "@/context/GarageContext";

interface CompatibilityBadgeProps {
  productPCD?: string;
  productSize?: string;  
  category?: string;
  metadata?: Record<string, any>; // Add metadata prop
}

// Generic accessories that fit every car
const UNIVERSAL_CATEGORIES = [
  "car-cleaning", "perfume", "key-cover", "mobile-holders",
  "cleaning-care", "air-freshener"
];

export default function CompatibilityBadge({ productPCD, productSize, category, metadata }: CompatibilityBadgeProps) {
  const { savedVehicle, isVehicleSaved } = useGarage();

  if (!isVehicleSaved || !savedVehicle) return null;

  // ── Universal accessories always fit ────────────────────────────
  const isGenericAccessory = category &&
    UNIVERSAL_CATEGORIES.some(c => category.toLowerCase().includes(c));

  if (isGenericAccessory) {
    return <Badge type="universal" label={`Universal fit — works with your ${savedVehicle.make} ${savedVehicle.model}`} />;
  }

  // ── Wheel compatibility: must pass BOTH PCD AND size checks ─────
  if (productPCD) {
    // 1. PCD check — bolt pattern must match exactly
    const isPCDMatch = productPCD.toLowerCase().trim() === savedVehicle.pcd.toLowerCase().trim();

    // 2. Size check — wheel diameter must be in vehicle's recommended range
    const isSizeOk = !productSize
      ? true
      : savedVehicle.recommendedSizes.includes(productSize.replace(/['"]/g, '').trim());

    if (!isPCDMatch) {
      return (
        <Badge
          type="no-fit"
          label={`Bolt pattern mismatch — your ${savedVehicle.model} needs ${savedVehicle.pcd}, this wheel is ${productPCD}`}
        />
      );
    }

    if (!isSizeOk && productSize) {
      const minSize = savedVehicle.recommendedSizes[0];
      const maxSize = savedVehicle.recommendedSizes[savedVehicle.recommendedSizes.length - 1];
      return (
        <Badge
          type="size-warn"
          label={`Size not recommended — ${productSize}" is outside ${minSize}"–${maxSize}" range for ${savedVehicle.model}`}
        />
      );
    }

    return (
      <Badge
        type="fit"
        label={`Confirmed fit — ${productSize ? `${productSize}" wheel, ` : ""}${savedVehicle.pcd} PCD matches your ${savedVehicle.model}`}
      />
    );
  }

  // ── Custom-fit accessories (Seat covers, Mats, etc.) ─────────────
  if (metadata?.make && metadata?.model) {
    const isMakeMatch = metadata.make.toLowerCase() === savedVehicle.make.toLowerCase();
    const isModelMatch = savedVehicle.model.toLowerCase().includes(metadata.model.toLowerCase()) || 
                         metadata.model.toLowerCase().includes(savedVehicle.model.toLowerCase());

    if (isMakeMatch && isModelMatch) {
      return (
        <Badge
          type="fit"
          label={`Confirmed Custom Fit — Handcrafted specifically for your ${savedVehicle.make} ${savedVehicle.model}`}
        />
      );
    } else {
      return (
        <Badge
          type="no-fit"
          label={`Does not fit — This setup is for ${metadata.make} ${metadata.model}, but your car is a ${savedVehicle.model}`}
        />
      );
    }
  }

  // productPCD is undefined — wheel data not loaded yet, or non-wheel product
  return null;
}

// ── Sub-component: renders the correct badge style ───────────────
function Badge({ type, label }: { type: "fit" | "no-fit" | "size-warn" | "universal"; label: string }) {
  const styles = {
    fit:       { wrapper: "bg-green-500/10 border-green-500/30", text: "text-green-400", icon: "✓" },
    "no-fit":  { wrapper: "bg-red-500/10 border-red-500/30",   text: "text-red-400",   icon: "✕" },
    "size-warn":{ wrapper: "bg-orange-500/10 border-orange-500/30", text: "text-orange-400", icon: "⚠" },
    universal: { wrapper: "bg-blue-500/10 border-blue-500/30", text: "text-blue-400",  icon: "✓" },
  }[type];

  const icons = {
    "✓": <path d="M20 6 9 17l-5-5"/>,
    "✕": <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>,
    "⚠": <><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 2 22h20a2 2 0 0 0 1.73-4Z"/><path d="M12 9v4"/><circle cx="12" cy="17" r="1"/></>,
  }[styles.icon];

  return (
    <div className={`flex items-start gap-2.5 px-4 py-3 border rounded-xl mb-6 ${styles.wrapper}`}>
      <div className={`mt-0.5 shrink-0 ${styles.text}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {icons}
        </svg>
      </div>
      <span className={`text-[10px] font-black uppercase tracking-widest leading-relaxed ${styles.text}`}>
        {label}
      </span>
    </div>
  );
}
