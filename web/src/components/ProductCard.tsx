'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    discountPrice?: number | null;
    images?: string[];
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const currentPrice = product.discountPrice || product.price;
  const oldPrice = product.discountPrice ? product.price : null;
  const discountAmount = oldPrice ? oldPrice - currentPrice : 0;

  return (
    <div className="bg-white border border-[#f0f0f0] rounded-xl p-2 relative flex flex-col transition-shadow hover:shadow-md h-full">
      {/* Wishlist Heart */}
      <button className="absolute top-2 right-2 z-10 text-gray-400 hover:text-red-500 transition-colors">
        <Heart size={18} />
      </button>

      {/* Image Area with ADD Button Overlay */}
      <Link href={`/product/${product.id}`} className="relative block aspect-square mb-2 bg-[#f8f9fa] rounded-lg overflow-hidden flex-shrink-0">
        {product.images && product.images[0] ? (
          <Image
            unoptimized
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-contain p-2 hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">🚗</div>
        )}
      </Link>

      <Link href={`/product/${product.id}`} className="flex flex-col flex-1 mt-2">
        {/* Price & Discount */}
        <div className="flex items-center space-x-2 mt-1">
          <span className="bg-[#287b3e] text-white font-bold text-xs px-1.5 py-0.5 rounded">
            ₹{currentPrice.toLocaleString('en-IN')}
          </span>
          {oldPrice && (
            <span className="text-gray-400 text-xs line-through">
              ₹{oldPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>
        
        {discountAmount > 0 && (
          <div className="text-[#287b3e] text-[10px] font-bold mt-1">
            ₹{discountAmount.toLocaleString('en-IN')} OFF
          </div>
        )}

        {/* Product Title */}
        <h3 className="text-[#333] text-xs font-semibold mt-2 line-clamp-2 leading-tight">
          {product.name}
        </h3>

        {/* Push bottom info to the end */}
        <div className="mt-auto pt-2">
          {/* Keep layout balanced but remove fake data */}
          <div className="h-4"></div>
        </div>
      </Link>
    </div>
  );
}
