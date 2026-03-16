"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const { items, subtotal, totalItems } = useCart();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-background" />;

  const shipping = subtotal > 1000 || totalItems === 0 ? 0 : 150;
  const total = subtotal + (paymentMethod === 'cod' ? shipping + 50 : shipping);

  return (
    <main className="flex-grow pt-8 pb-32 container mx-auto px-4 max-w-6xl">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Checkout Steps */}
        <div className="lg:w-2/3">
          <div className="flex items-center gap-4 mb-12">
            <Link href="/cart" className="text-gray-400 hover:text-white flex items-center gap-2 text-sm font-bold tracking-widest uppercase transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              Back to Bag
            </Link>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-between items-center mb-12 relative before:absolute before:inset-0 before:top-1/2 before:-translate-y-1/2 before:w-full before:h-0.5 before:bg-border before:z-0">
            {['Address', 'Shipping', 'Payment'].map((label, i) => (
              <div key={label} className="relative z-10 flex flex-col items-center gap-2 group cursor-pointer" onClick={() => i + 1 <= step && setStep(i + 1)}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= i + 1 ? 'bg-primary text-white shadow-glow' : 'bg-surface border border-border text-gray-500'}`}>
                  {step > i + 1 ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg> : i + 1}
                </div>
                <span className={`text-xs font-bold uppercase tracking-wider ${step >= i + 1 ? 'text-white' : 'text-gray-500'}`}>{label}</span>
              </div>
            ))}
          </div>

          <div className="bg-surface border border-border rounded-2xl p-6 md:p-10 shadow-surface">
            {/* Step 1: Address */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-black mb-6">SHIPPING ADDRESS</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">First Name <span className="text-primary">*</span></label>
                    <input type="text" className="w-full bg-background border border-border rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors" placeholder="e.g. Rahul" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Last Name <span className="text-primary">*</span></label>
                    <input type="text" className="w-full bg-background border border-border rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors" placeholder="e.g. Sharma" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm text-gray-400">Email Address <span className="text-primary">*</span></label>
                    <input type="email" className="w-full bg-background border border-border rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors" placeholder="rahul@example.com" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm text-gray-400">Address <span className="text-primary">*</span></label>
                    <input type="text" className="w-full bg-background border border-border rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors" placeholder="Apartment, Street, Area" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">City <span className="text-primary">*</span></label>
                    <input type="text" className="w-full bg-background border border-border rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors" placeholder="e.g. Mumbai" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">State <span className="text-primary">*</span></label>
                    <select className="w-full bg-background border border-border rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors appearance-none">
                      <option>Maharashtra</option>
                      <option>Delhi</option>
                      <option>Karnataka</option>
                      <option>Tamil Nadu</option>
                      <option>Gujarat</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">PIN Code <span className="text-primary">*</span></label>
                    <input type="text" className="w-full bg-background border border-border rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors" placeholder="400001" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Phone <span className="text-primary">*</span></label>
                    <input type="tel" className="w-full bg-background border border-border rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors" placeholder="+91 98765 43210" />
                  </div>
                </div>
                <button onClick={() => setStep(2)} className="btn-primary w-full md:w-auto mt-4 px-12">Continue to Shipping</button>
              </div>
            )}

            {/* Step 2: Shipping */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-black mb-6">SHIPPING METHOD</h2>
                <div className="space-y-4 mb-8">
                  <label className="flex items-start gap-4 p-4 border border-primary rounded-xl cursor-pointer bg-primary/5 transition-colors">
                    <div className="pt-1">
                      <input type="radio" name="shipping" className="w-4 h-4 accent-primary" defaultChecked />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-center mb-1">
                         <span className="font-bold">Standard Delivery</span>
                         <span className="font-bold">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                      </div>
                      <p className="text-sm text-gray-400">Delivery in 4-6 Business Days</p>
                    </div>
                  </label>
                  
                  <label className="flex items-start gap-4 p-4 border border-border hover:border-gray-500 rounded-xl cursor-pointer bg-background transition-colors">
                    <div className="pt-1">
                      <input type="radio" name="shipping" className="w-4 h-4 accent-primary" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-center mb-1">
                         <span className="font-bold">Express Delivery</span>
                         <span className="font-bold">₹299</span>
                      </div>
                      <p className="text-sm text-gray-400">Delivery in 1-2 Business Days</p>
                    </div>
                  </label>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setStep(1)} className="btn-secondary px-8">Back</button>
                  <button onClick={() => setStep(3)} className="btn-primary px-12">Continue to Payment</button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-black mb-6">PAYMENT METHOD</h2>
                <p className="text-gray-400 text-sm mb-6">All transactions are secure and encrypted. Powered by Razorpay.</p>
                
                <div className="space-y-4 mb-8">
                  {/* UPI */}
                  <div className={`border rounded-xl overflow-hidden transition-colors ${paymentMethod === 'upi' ? 'border-primary bg-primary/5' : 'border-border bg-background hover:border-gray-500'}`}>
                    <label className="flex items-center gap-4 p-4 cursor-pointer" onClick={() => setPaymentMethod('upi')}>
                      <input type="radio" name="payment" checked={paymentMethod === 'upi'} readOnly className="w-4 h-4 accent-primary" />
                      <div className="flex-grow flex justify-between items-center">
                        <span className="font-bold">UPI (GPay, PhonePe, Paytm)</span>
                        <div className="flex gap-1 text-primary">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                        </div>
                      </div>
                    </label>
                    {paymentMethod === 'upi' && (
                      <div className="px-12 py-6 border-t border-border/50 text-center animate-in fade-in slide-in-from-top-2">
                        <div className="w-32 h-32 bg-white rounded-lg mx-auto mb-4 flex items-center justify-center p-2">
                           <div className="w-full h-full bg-[repeating-linear-gradient(45deg,black,black_10px,white_10px,white_20px)] rounded" />
                        </div>
                        <p className="text-sm text-gray-400">Scan QR Code from your UPI app</p>
                        <p className="text-xs text-gray-500 mt-2">or enter your VPA below</p>
                        <input type="text" placeholder="example@upi" className="w-full max-w-xs mt-3 bg-background border border-border rounded-lg px-4 py-2 outline-none focus:border-primary transition-colors text-center" />
                      </div>
                    )}
                  </div>
                  
                  {/* Credit Card */}
                  <div className={`border rounded-xl overflow-hidden transition-colors ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-border bg-background hover:border-gray-500'}`}>
                    <label className="flex items-center gap-4 p-4 cursor-pointer" onClick={() => setPaymentMethod('card')}>
                      <input type="radio" name="payment" checked={paymentMethod === 'card'} readOnly className="w-4 h-4 accent-primary" />
                      <div className="flex-grow flex justify-between items-center">
                        <span className="font-bold">Credit/Debit Card</span>
                      </div>
                    </label>
                  </div>
                  
                  {/* COD */}
                  <div className={`border rounded-xl overflow-hidden transition-colors ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-border bg-background hover:border-gray-500'}`}>
                    <label className="flex items-center gap-4 p-4 cursor-pointer" onClick={() => setPaymentMethod('cod')}>
                      <input type="radio" name="payment" checked={paymentMethod === 'cod'} readOnly className="w-4 h-4 accent-primary" />
                      <div className="flex-grow">
                        <span className="font-bold">Cash on Delivery (COD)</span>
                      </div>
                    </label>
                    {paymentMethod === 'cod' && (
                       <div className="px-12 py-4 border-t border-border/50 animate-in fade-in slide-in-from-top-2">
                         <p className="text-sm text-yellow-500">₹50 additional charge applies for Cash on Delivery.</p>
                       </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-4">
                  <button onClick={() => setStep(2)} className="btn-secondary w-full sm:w-auto px-8">Back</button>
                  <button className="btn-primary w-full sm:w-auto px-12 shadow-glow">Pay ₹{total.toLocaleString('en-IN')} Now</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right fixed summary panel */}
        <div className="lg:w-1/3">
          <div className="bg-surface border border-border rounded-2xl p-6 lg:sticky lg:top-24 max-h-[calc(100vh-8rem)] overflow-y-auto shadow-surface">
             <h3 className="text-xl font-black mb-6 tracking-tight">ORDER SUMMARY</h3>
             
             {/* Dynamic line items */}
             <div className="space-y-4 border-b border-border pb-6 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-background rounded-lg border border-border relative overflow-hidden shrink-0">
                      <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full z-10 border border-surface">
                        {item.quantity}
                      </span>
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-600">No Image</div>
                      )}
                    </div>
                    <div className="flex-grow flex flex-col justify-center min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-xs font-bold line-clamp-2 text-white">{item.name}</span>
                        <span className="text-sm font-black whitespace-nowrap">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                      {item.variant && <span className="text-[10px] text-gray-500 font-bold uppercase mt-1">{item.variant}</span>}
                    </div>
                  </div>
                ))}
                {items.length === 0 && <p className="text-sm text-gray-500 italic">No items in bag.</p>}
             </div>

             <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between text-gray-400">
                <span className="font-medium">Subtotal</span>
                <span className="text-white font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span className="font-medium">Shipping</span>
                <span className="text-green-400 font-bold uppercase text-xs tracking-widest">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>
              {paymentMethod === 'cod' && (
                <div className="flex justify-between text-gray-400">
                  <span className="font-medium">COD Surcharge</span>
                  <span className="text-white font-bold">₹50</span>
                </div>
              )}
              <div className="flex justify-between text-gray-400">
                <span className="font-medium">GST (Included)</span>
                <span className="text-white font-bold">₹{Math.round(subtotal * 0.18).toLocaleString('en-IN')}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center border-t border-border pt-6">
              <span className="text-lg font-black uppercase tracking-tighter">Total</span>
              <span className="text-3xl font-black text-primary">₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
