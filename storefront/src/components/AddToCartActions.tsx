"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

type AddToCartProps = {
  product: {
    id: string;
    title: string;
    handle: string;
    thumbnail?: string;
    variantId?: string;
    variantTitle?: string;
    price: number;
  };
};

export default function AddToCartActions({ product }: AddToCartProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    addItem({
      id: product.variantId || product.id,
      name: product.title,
      price: product.price,
      quantity: quantity,
      image: product.thumbnail || '',
      variant: product.variantTitle,
      handle: product.handle
    });
    
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-12">
      <div className="flex items-center justify-between bg-surface border border-border rounded-xl px-4 py-2 sm:w-32 shrink-0">
        <button 
          onClick={() => setQuantity(q => Math.max(1, q - 1))}
          className="text-gray-400 hover:text-white p-2 transition-colors -ml-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
        </button>
        <span className="font-bold text-lg select-none w-8 text-center">{quantity}</span>
        <button 
          onClick={() => setQuantity(q => q + 1)}
          className="text-gray-400 hover:text-white p-2 transition-colors -mr-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
        </button>
      </div>
      
      <button 
        onClick={handleAdd}
        className={`btn-primary flex-grow py-4 shadow-[0_0_30px_rgba(230,0,0,0.3)] min-h-[56px] transition-all duration-300 ${isAdded ? 'bg-green-600 shadow-green-600/20' : ''}`}
      >
        {isAdded ? (
          <span className="flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            Added to Bag
          </span>
        ) : (
          "Add to Cart"
        )}
      </button>

      <button className="btn-secondary aspect-square px-0 w-[56px] min-h-[56px] rounded-xl flex items-center justify-center shrink-0 hover:text-primary transition-colors" title="Add to Wishlist">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
      </button>
    </div>
  );
}
