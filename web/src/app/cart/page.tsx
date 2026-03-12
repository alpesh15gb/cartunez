'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';

export default function CartPage() {
    const { cart, removeFromCart, totalPrice, totalItems } = useCart();

    if (cart.length === 0) {
        return (
            <div className="container mx-auto px-6 py-40 text-center">
                <h1 className="text-4xl font-black italic uppercase mb-8">Your Cart is Empty</h1>
                <Link href="/shop" className="btn-primary">Browse Performance Parts</Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-20">
            <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-12">Shopping <span className="text-primary italic">Cart</span></h1>

            <div className="flex flex-col lg:flex-row gap-16">
                {/* Cart Items */}
                <div className="flex-[2] space-y-6">
                    {cart.map((item) => (
                        <div key={item.id} className="flex gap-6 bg-card border border-border p-6 rounded-lg transition-transform hover:scale-[1.01] items-center">
                            <div className="w-24 h-24 bg-background relative rounded border border-border overflow-hidden flex-shrink-0">
                                {item.image && item.image.startsWith('/') ? (
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl grayscale">
                                        {item.image || '🚗'}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-bold uppercase tracking-tight mb-2 hover:text-primary transition-colors cursor-pointer">
                                        <Link href={`/product/${item.id}`}>{item.name}</Link>
                                    </h3>
                                    <p className="text-muted font-bold">₹{item.price.toLocaleString()} x {item.quantity}</p>
                                </div>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-secondary hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
                                >
                                    Remove [X]
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary Sidebar */}
                <div className="flex-1 bg-card border border-border p-8 rounded-lg h-fit space-y-8 sticky top-32">
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter underline underline-offset-8 decoration-primary">Order Summary</h2>
                    <div className="space-y-4 font-bold uppercase tracking-widest text-xs">
                        <div className="flex justify-between">
                            <span className="text-muted">Subtotal ({totalItems} Items)</span>
                            <span>₹{totalPrice.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted">Shipping</span>
                            <span className="text-accent underline underline-offset-4 decoration-accent">FREE</span>
                        </div>
                        <div className="flex justify-between text-lg border-t border-border pt-4 mt-8 font-black text-primary italic">
                            <span>Total</span>
                            <span>₹{totalPrice.toLocaleString()}</span>
                        </div>
                    </div>
                    <Link href="/checkout" className="block w-full">
                        <button className="w-full btn-primary py-4 text-sm">
                            Proceed To Checkout
                        </button>
                    </Link>
                    <p className="text-[10px] text-center text-muted font-bold uppercase tracking-widest italic">
                        Secure SSL Encrypted Checkout
                    </p>
                </div>
            </div>
        </div>
    );
}
