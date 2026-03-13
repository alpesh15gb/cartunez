'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    discountPrice?: number | null;
    images?: string[];
    isOutOfStock?: boolean;
    stockQuantity?: number;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const currentPrice = product.discountPrice || product.price;
  const oldPrice = product.discountPrice ? product.price : null;
  const hasDiscount = !!oldPrice;

  const handleAddToCart = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      addToCart({
          id: product.id,
          name: product.name,
          price: currentPrice,
          image: product.images?.[0] || '',
          quantity: 1
      });
      alert('Added to cart!');
  };

  return (
    <div className="bg-white group relative flex flex-col h-full text-center">
      {/* Product Image Area */}
      <Link href={`/product/${product.id}`} className="relative block aspect-[3/4] overflow-hidden mb-4 bg-[#f9f9f9]">
        {product.images && product.images[0] ? (
          <Image
            unoptimized
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl grayscale opacity-20">🚗</div>
        )}

        {/* Sale Badge */}
        {hasDiscount && (
            <div className="absolute top-4 right-4 bg-primary text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded shadow-sm z-10">
                Sale!
            </div>
        )}

        {/* Out of Stock Overlay */}
        {(product.isOutOfStock || product.stockQuantity === 0) && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-20">
             <span className="bg-black text-white text-[9px] font-black uppercase tracking-widest px-4 py-1 rounded shadow-lg">Sold Out</span>
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="flex flex-col flex-1 px-2">
        <Link href={`/product/${product.id}`}>
            <h3 className="text-[#1a1a1a] text-sm font-black uppercase tracking-tight line-clamp-1 mb-1 group-hover:text-primary transition-colors">
            {product.name}
            </h3>
        </Link>
        
        {/* Rating Stars (Static for UI) */}
        <div className="flex items-center justify-center space-x-0.5 mb-2">
            {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={10} className={i <= 4 ? "fill-primary text-primary" : "fill-gray-200 text-gray-200"} />
            ))}
        </div>

        {/* Price Section */}
        <div className="flex flex-col items-center mb-4">
            {oldPrice && (
                <span className="text-gray-300 text-[10px] font-bold line-through mb-0.5">
                    ₹{oldPrice.toLocaleString('en-IN')}.00
                </span>
            )}
            <span className="text-primary font-black text-sm tracking-tight">
                ₹{currentPrice.toLocaleString('en-IN')}.00
            </span>
        </div>

        {/* Add to Cart Button */}
        <button 
            onClick={handleAddToCart}
            disabled={product.isOutOfStock || product.stockQuantity === 0}
            className="mt-auto w-full bg-primary text-white text-[9px] font-black uppercase tracking-[0.2em] py-2.5 rounded hover:bg-black transition-all duration-300 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
            Add to Cart
        </button>
      </div>
    </div>
  );
}
