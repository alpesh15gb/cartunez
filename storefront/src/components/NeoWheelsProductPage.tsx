"use client";

import { useState } from "react";
import Image from "next/image";
import AddToCartActions from "@/components/AddToCartActions";
import CompatibilityBadge from "@/components/CompatibilityBadge";

type Variant = {
  id: string;
  title: string;
  prices: { amount: number; currency_code: string }[];
  metadata?: Record<string, any>;
};

interface Props {
  product: {
    id: string;
    title: string;
    handle: string;
    description: string;
    thumbnail?: string;
    images?: { url: string }[];
    variants: Variant[];
  };
}

export default function NeoWheelsProductPage({ product }: Props) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const selectedVariant = product.variants[selectedIdx];

  // Determine the image for the currently selected variant
  const variantImage = selectedVariant?.metadata?.variant_image as string | undefined;
  const displayImage = variantImage || product.thumbnail || "/wheels/techno-17-bm.jpg";

  // Price in INR
  const priceRaw = selectedVariant?.prices?.find(p => p.currency_code?.toLowerCase() === "inr")?.amount || 
                   selectedVariant?.prices?.[0]?.amount || 0;
  const price = priceRaw / 100;

  // Parse PCD and size from variant title as reliable fallback
  // Title format: '17" / PCD 5x114.3 / Black Machined'
  const parseTitleSpecs = (title: string) => {
    const sizeMatch = title?.match(/^(\d+)["\"]/);
    const pcdMatch = title?.match(/PCD\s+([\dx.]+)/i);
    return {
      size: sizeMatch?.[1] ?? null,
      pcd: pcdMatch?.[1] ?? null,
    };
  };

  const parsed = parseTitleSpecs(selectedVariant?.title ?? "");

  // Prefer metadata values, fall back to title-parsed values
  const pcd    = (selectedVariant?.metadata?.pcd as string | undefined) ?? parsed.pcd ?? undefined;
  const size   = (selectedVariant?.metadata?.wheel_size as string | undefined) ?? parsed.size ?? undefined;
  const offset = selectedVariant?.metadata?.offset as string | undefined;
  const bore   = selectedVariant?.metadata?.center_bore as string | undefined;
  const finish = selectedVariant?.metadata?.finish as string | undefined;

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
      {/* Left: Image + Gallery */}
      <div className="lg:w-1/2">
        {/* Main image — switches with variant */}
        <div className="relative aspect-square rounded-3xl overflow-hidden bg-surface border border-border shadow-2xl mb-4 group">
          <Image
            key={displayImage}  // forces re-render on change
            src={displayImage}
            alt={`${product.title} - ${selectedVariant?.title}`}
            fill
            className="object-contain p-8 transition-all duration-500 group-hover:scale-105"
            priority
          />
          {/* Variant badge overlay */}
          {finish && (
            <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/10">
              {finish}
            </div>
          )}
        </div>

        {/* Thumbnail row — one per unique image */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {product.variants.map((v, i) => {
            const img = (v.metadata?.variant_image as string) || product.thumbnail;
            if (!img) return null;
            return (
              <button
                key={i}
                onClick={() => setSelectedIdx(i)}
                className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                  selectedIdx === i ? "border-primary shadow-glow scale-105" : "border-border hover:border-gray-500"
                }`}
              >
                <Image src={img} alt={v.title} fill className="object-contain p-1" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: Info + Variant Selector */}
      <div className="lg:w-1/2 flex flex-col">
        <h1 className="text-2xl md:text-3xl font-black mb-3 leading-tight tracking-tight uppercase">
          {product.title}
        </h1>

        {/* Compatibility badge — re-evaluates on every variant change */}
        <CompatibilityBadge
          productPCD={pcd}
          productSize={size}   // ← selected variant's size, updates on variant click
          category="neo-wheels"
        />

        {/* Price */}
        <div className="flex items-end gap-3 mb-6">
          <span className="text-4xl font-black text-primary">₹{price.toLocaleString("en-IN")}</span>
          <span className="text-sm font-medium text-gray-500 pb-1">per wheel</span>
        </div>

        {/* Wheel specs card */}
        {pcd && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 p-4 bg-surface border border-border rounded-2xl">
            {[
              { label: "PCD", value: pcd },
              { label: "Size", value: `${size}"` },
              { label: "Offset", value: `ET${offset}` },
              { label: "Bore", value: `${bore}mm` },
            ].map(spec => (
              <div key={spec.label} className="text-center p-2 bg-background rounded-xl">
                <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">{spec.label}</div>
                <div className="text-sm font-black text-white">{spec.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* Variant selector */}
        <div className="mb-8">
          <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">
            Select Variant — <span className="text-primary">{selectedVariant?.title}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
            {product.variants.map((v, i) => {
              const vPrice = (v.prices?.find(p => p.currency_code?.toLowerCase() === "inr")?.amount || v.prices?.[0]?.amount || 0) / 100;
              const vImg = v.metadata?.variant_image as string;
              return (
                <button
                  key={i}
                  onClick={() => setSelectedIdx(i)}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                    selectedIdx === i
                      ? "border-primary bg-primary/10 shadow-glow"
                      : "border-border hover:border-gray-500 bg-surface"
                  }`}
                >
                  {/* Mini variant image */}
                  {vImg && (
                    <div className="relative w-10 h-10 shrink-0 rounded-lg overflow-hidden bg-background">
                      <Image src={vImg} alt={v.title} fill className="object-contain p-0.5" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="text-xs font-black text-white leading-tight truncate">{v.title}</div>
                    <div className="text-[10px] text-primary font-bold">₹{vPrice.toLocaleString("en-IN")}/wheel</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-400 leading-relaxed text-sm mb-8">{product.description}</p>

        {/* Stock indicator */}
        <div className="flex items-center gap-2 mb-6">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-sm font-bold text-green-400">In Stock — Ships within 2-3 days</span>
        </div>

        {/* Add to Cart */}
        <AddToCartActions
          product={{
            id: product.id,
            title: `${product.title} - ${selectedVariant?.title}`,
            handle: product.handle,
            thumbnail: displayImage,
            variantId: selectedVariant?.id,
            variantTitle: selectedVariant?.title,
            price
          }}
        />

        {/* Highlights */}
        <ul className="space-y-2 mt-6 pt-6 border-t border-border/50">
          {[
            "ISI Certified — Safe for Indian roads & highways",
            "TÜV Rheinland approved flow-formed process",
            "Compatible with TPMS sensors",
            "Free fitment check at CarTunez, Hyderabad"
          ].map((h, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
              <div className="mt-0.5 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              </div>
              <span>{h}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
