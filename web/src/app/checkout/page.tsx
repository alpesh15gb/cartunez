'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';

export default function CheckoutPage() {
    const { cart, totalPrice, clearCart } = useCart();
    const { user, token, isAuthenticated } = useAuth();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [couponCode, setCouponCode] = useState('');
    const [coupon, setCoupon] = useState<any>(null);
    const [discount, setDiscount] = useState(0);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        paymentMethod: 'RAZORPAY'
    });

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login?redirect=/checkout');
        }
        if (cart.length === 0) {
            router.push('/shop');
        }
    }, [isAuthenticated, cart, router]);

    const handleRazorpayPayment = async (order: any) => {
        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: order.totalAmount * 100,
            currency: "INR",
            name: "Cartunez",
            description: "Automotive Precision Parts",
            order_id: order.razorpayOrderId,
            handler: async function (response: any) {
                // Verify payment on backend
                const verifyRes = await fetch('http://localhost:5000/api/orders/verify-payment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        orderId: order.id,
                        razorpayPaymentId: response.razorpay_payment_id,
                        razorpaySignature: response.razorpay_signature
                    })
                });

                if (verifyRes.ok) {
                    clearCart();
                    router.push('/checkout/success?orderId=' + order.id);
                } else {
                    setError('Payment verification failed');
                }
            },
            prefill: {
                name: formData.name,
                contact: formData.phone
            },
            theme: {
                color: "#E11D48"
            }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
    };

    const handleCouponApply = async () => {
        if (!couponCode) return;
        setError('');
        try {
            const response = await fetch('http://localhost:5000/api/coupons/validate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ code: couponCode })
            });

            const data = await response.json();
            if (response.ok) {
                setCoupon(data);
                if (data.discountType === 'PERCENTAGE') {
                    setDiscount((totalPrice * data.discountAmount) / 100);
                } else {
                    setDiscount(data.discountAmount);
                }
            } else {
                setError(data.message || 'Invalid coupon');
                setCoupon(null);
                setDiscount(0);
            }
        } catch (err) {
            setError('Error validating coupon');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const shippingAddress = `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}. Phone: ${formData.phone}`;

        const orderData = {
            items: cart.map(item => ({
                productId: item.id,
                quantity: item.quantity,
                price: item.price
            })),
            totalAmount: totalPrice - discount,
            paymentMethod: formData.paymentMethod,
            shippingAddress,
            couponId: coupon?.id
        };

        try {
            const response = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderData)
            });

            const data = await response.json();

            if (response.ok) {
                if (formData.paymentMethod === 'RAZORPAY') {
                    handleRazorpayPayment(data);
                } else {
                    clearCart();
                    router.push('/checkout/success?orderId=' + data.id);
                }
            } else {
                setError(data.message || 'Failed to place order');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
            console.error('Order error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated || cart.length === 0) return null;

    return (
        <>
            <div className="container mx-auto px-6 py-12">
            <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-8">Final <span className="text-primary italic">Assembly</span></h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Shipping Details */}
                <div className="bg-card border border-border p-8 rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
                    <h2 className="text-xl font-black uppercase tracking-widest mb-6">Logistics</h2>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500 text-red-500 text-[10px] font-bold uppercase p-4 mb-6 rounded">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-background border border-border p-4 rounded focus:border-primary outline-none transition-colors text-sm"
                                    placeholder="John Racer"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted">Phone Number</label>
                                <input
                                    type="tel"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full bg-background border border-border p-4 rounded focus:border-primary outline-none transition-colors text-sm"
                                    placeholder="+91 9949695030"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted">Shipping Address</label>
                            <textarea
                                required
                                rows={3}
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className="w-full bg-background border border-border p-4 rounded focus:border-primary outline-none transition-colors text-sm"
                                placeholder="Enter your full street address..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted">City</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    className="w-full bg-background border border-border p-4 rounded focus:border-primary outline-none transition-colors text-sm"
                                    placeholder="Hyderabad"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted">State</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.state}
                                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                    className="w-full bg-background border border-border p-4 rounded focus:border-primary outline-none transition-colors text-sm"
                                    placeholder="Telangana"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted">Pincode</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.pincode}
                                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                                    className="w-full bg-background border border-border p-4 rounded focus:border-primary outline-none transition-colors text-sm"
                                    placeholder="500003"
                                />
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-border">
                            <h3 className="text-[10px] uppercase font-black tracking-[0.2em] text-muted">Payment Protocol</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label className={`flex items-center space-x-3 cursor-pointer p-4 border rounded transition-colors ${formData.paymentMethod === 'RAZORPAY' ? 'border-primary bg-primary/5' : 'border-border bg-background'}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="RAZORPAY"
                                        checked={formData.paymentMethod === 'RAZORPAY'}
                                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                        className="text-primary focus:ring-primary h-4 w-4"
                                    />
                                    <span className={`text-xs font-bold uppercase tracking-widest ${formData.paymentMethod === 'RAZORPAY' ? 'text-primary' : 'text-muted'}`}>Digital (Razorpay)</span>
                                </label>
                                <label className={`flex items-center space-x-3 cursor-pointer p-4 border rounded transition-colors ${formData.paymentMethod === 'CASH_ON_DELIVERY' ? 'border-primary bg-primary/5' : 'border-border bg-background'}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="CASH_ON_DELIVERY"
                                        checked={formData.paymentMethod === 'CASH_ON_DELIVERY'}
                                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                        className="text-primary focus:ring-primary h-4 w-4"
                                    />
                                    <span className={`text-xs font-bold uppercase tracking-widest ${formData.paymentMethod === 'CASH_ON_DELIVERY' ? 'text-primary' : 'text-muted'}`}>Cash On Delivery</span>
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-6 mt-8 text-sm disabled:opacity-50"
                        >
                            {loading ? 'DEPLOYING ORDER...' : 'FINALIZE & DEPLOY'}
                        </button>
                    </form>
                </div>

                {/* Order Summary */}
                <div className="lg:sticky lg:top-32 h-fit">
                    <div className="bg-secondary text-white p-8 rounded-xl shadow-2xl">
                        <h2 className="text-xl font-black uppercase tracking-widest mb-8 pb-4 border-b border-white/10">Order Manifest</h2>

                        <div className="space-y-4 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {cart.map((item) => (
                                <div key={item.id} className="flex justify-between items-center bg-white/5 p-4 rounded border border-white/10 hover:border-primary transition-colors">
                                    <div className="flex items-center space-x-4">
                                        <div className="relative w-12 h-12 rounded overflow-hidden bg-white/10">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-wider">{item.name}</p>
                                            <p className="text-[8px] text-muted font-bold uppercase tracking-widest">QTY: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="text-[10px] font-black tracking-widest">₹{(item.price * item.quantity).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4 pt-4 border-t border-white/10">
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted">
                                <span>Sub-Total</span>
                                <span>₹{totalPrice.toLocaleString()}</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-primary">
                                    <span>Discount ({coupon?.code})</span>
                                    <span>-₹{discount.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted">
                                <span>Shipping Fees</span>
                                <span className="text-primary">FREE</span>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-white/20">
                                <span className="text-sm font-black uppercase tracking-[0.2em]">Total Payload</span>
                                <span className="text-2xl font-black italic tracking-tighter text-primary">₹{(totalPrice - discount).toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-white/10">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4">Transmission Code (Coupon)</h3>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    className="flex-1 bg-white/5 border border-white/10 p-3 rounded text-xs outline-none focus:border-primary transition-colors"
                                    placeholder="Enter Code"
                                />
                                <button 
                                    onClick={handleCouponApply}
                                    type="button"
                                    className="bg-primary text-white text-[10px] font-black px-4 py-2 rounded uppercase italic"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex items-center justify-center space-x-8 opacity-40 grayscale">
                        <div className="text-[8px] font-black uppercase tracking-[0.3em]">Precision</div>
                        <div className="w-1 h-1 bg-white rounded-full"></div>
                        <div className="text-[8px] font-black uppercase tracking-[0.3em]">Performance</div>
                        <div className="w-1 h-1 bg-white rounded-full"></div>
                        <div className="text-[8px] font-black uppercase tracking-[0.3em]">Reliability</div>
                    </div>
                </div>
            </div>
        </div>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" />
    </>
  );
}
