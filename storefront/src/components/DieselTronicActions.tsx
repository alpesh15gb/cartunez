"use client";

import { useState } from "react";
import VehicleSelector from "./VehicleSelector";
import AddToCartActions from "./AddToCartActions";

interface DieselTronicActionsProps {
  product: {
    id: string;
    title: string;
    handle: string;
    thumbnail?: string;
    variants: any[];
  };
}

export default function DieselTronicActions({ product }: DieselTronicActionsProps) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);

  const handleVariantSelect = (variant: any) => {
    setSelectedVariant(variant);
  };

  const currentPrice = selectedVariant?.prices?.[0]?.amount / 100 || 0;

  return (
    <div className="space-y-6">
      <VehicleSelector 
        variants={product.variants} 
        onSelect={handleVariantSelect} 
      />

      <AddToCartActions 
        product={{
          id: product.id,
          title: product.title,
          handle: product.handle,
          thumbnail: product.thumbnail,
          variantId: selectedVariant?.id,
          variantTitle: selectedVariant?.title,
          price: currentPrice
        }}
      />
    </div>
  );
}
