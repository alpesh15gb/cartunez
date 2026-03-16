"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, totalItems } = useCart();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-background" />;

  const shipping = subtotal > 1000 || totalItems === 0 ? 0 : 150;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <main className="flex-grow flex flex-col items-center justify-center py-24 container mx-auto px-4 text-center">
        <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center mb-6 text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
        </div>
        <h1 className="text-4xl font-black mb-4">YOUR CART IS EMPTY</h1>
        <p className="text-gray-400 mb-10 max-w-md mx-auto font-light">
          Looks like you haven't added any premium accessories to your ride yet. Elevate your driving experience today.
        </p>
        <Link href="/shop" className="btn-primary px-12 py-4">
          Start Shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="flex-grow pt-8 pb-32 md:pb-24 container mx-auto px-4 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <h1 className="text-4xl md:text-5xl font-black uppercase">YOUR SHOPPING BAG</h1>
        <p className="text-gray-400 font-bold">{totalItems} {totalItems === 1 ? 'Item' : 'Items'}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Cart Items List */}
        <div className="lg:w-2/3 flex flex-col gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-surface border border-border rounded-2xl p-4 flex flex-col sm:flex-row gap-4 sm:items-center relative group overflow-hidden">
              <Link href={`/product/${item.handle}`} className="shrink-0 w-24 h-24 sm:w-32 sm:h-32 relative bg-background rounded-xl overflow-hidden block border border-border/50">
                {item.image ? (
                  <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">No Image</div>
                )}
              </Link>
              
              <div className="flex-grow flex flex-col justify-between h-full py-1">
                <div>
                  <div className="flex justify-between items-start gap-4">
                    <Link href={`/product/${item.handle}`} className="hover:text-primary transition-colors">
                      <h3 className="font-bold text-lg md:text-xl leading-tight line-clamp-2">{item.name}</h3>
                    </Link>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-gray-600 hover:text-primary transition-colors p-2 -mr-2"
                      title="Remove Item"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                  </div>
                  {item.variant && <p className="text-xs font-bold text-gray-500 mt-2 uppercase tracking-widest">{item.variant}</p>}
                </div>
                
                <div className="flex justify-between items-end mt-4">
                  <div className="flex items-center justify-between bg-background border border-border rounded-xl px-2 py-1.5 w-32">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="text-gray-400 hover:text-white p-1 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/></svg>
                    </button>
                    <span className="font-bold text-base select-none">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="text-gray-400 hover:text-white p-1 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </button>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-gray-500 text-xs font-bold mb-1">₹{item.price.toLocaleString('en-IN')} each</div>
                    <div className="font-black text-xl text-white">₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <div className="mt-4 flex flex-col sm:flex-row gap-4">
             <div className="flex-grow relative group">
               <input type="text" placeholder="GIFT CARD OR DISCOUNT CODE" className="w-full bg-surface border border-border rounded-xl px-4 py-4 outline-none focus:border-primary transition-colors text-xs font-bold uppercase tracking-widest" />
               <button className="absolute right-3 top-3 bg-background border border-border text-white text-[10px] font-black tracking-widest px-4 py-2 rounded-lg hover:bg-white/10 transition-colors">APPLY</button>
             </div>
             <Link href="/shop" className="btn-secondary py-4 text-xs font-black tracking-widest shrink-0 px-8">
               CONTINUE SHOPPING
             </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-surface border border-border rounded-2xl p-6 lg:sticky lg:top-24 shadow-surface">
            <h2 className="text-2xl font-black mb-6 border-b border-border pb-4 tracking-tight">ORDER SUMMARY</h2>
            
            <div className="space-y-4 mb-6 text-sm text-gray-400 font-medium">
              <div className="flex justify-between items-center">
                <span>Subtotal</span>
                <span className="font-bold text-white text-base">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Estimated Shipping</span>
                <span className="font-bold text-white uppercase tracking-widest text-xs">
                  {shipping === 0 ? <span className="text-green-400">FREE</span> : `₹${shipping}`}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>GST (Estimated)</span>
                <span className="font-bold text-white">Included</span>
              </div>
            </div>
            
            <div className="border-t border-border pt-4 mb-8">
              <div className="flex justify-between items-end">
                <span className="text-lg font-bold uppercase tracking-tighter">Estimated Total</span>
                <span className="text-3xl font-black text-primary">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <Link href="/checkout" className="btn-primary w-full py-4 text-sm font-black tracking-widest group shadow-glow">
              PROCEED TO SECURE CHECKOUT
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>

            <div className="mt-8 space-y-4 pt-6 border-t border-border/50">
              <div className="flex items-center gap-3 text-xs text-gray-500 font-bold uppercase tracking-widest">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="18" height="14" x="3" y="5" rx="2" ry="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="8" x2="8" y1="15" y2="15"/><line x1="12" x2="12" y1="15" y2="15"/><line x1="16" x2="16" y1="15" y2="15"/></svg>
                Secure Razorpay Checkout
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500 font-bold uppercase tracking-widest">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                7-Day Replacement Policy
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
