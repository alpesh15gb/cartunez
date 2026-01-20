"use client"

import { useState } from "react"
import Link from "next/link"

// Cart Item Component
function CartItem({
    item,
    onQuantityChange,
    onRemove,
}: {
    item: {
        id: string
        title: string
        price: number
        originalPrice: number
        quantity: number
        image: string
        variant?: string
    }
    onQuantityChange: (id: string, quantity: number) => void
    onRemove: (id: string) => void
}) {
    return (
        <div className="card p-4 md:p-6">
            <div className="flex gap-4">
                {/* Image */}
                <div className="w-24 h-24 md:w-32 md:h-32 bg-white/5 rounded-xl flex items-center justify-center text-4xl flex-shrink-0">
                    {item.image}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                    <Link href={`/product/${item.id}`} className="text-white font-medium hover:text-orange-400 transition-colors line-clamp-2">
                        {item.title}
                    </Link>
                    {item.variant && (
                        <p className="text-white/50 text-sm mt-1">{item.variant}</p>
                    )}

                    {/* Mobile Price */}
                    <div className="md:hidden mt-2">
                        <span className="text-orange-500 font-bold">₹{item.price.toLocaleString()}</span>
                        {item.originalPrice > item.price && (
                            <span className="text-white/40 line-through text-sm ml-2">
                                ₹{item.originalPrice.toLocaleString()}
                            </span>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 mt-4">
                        {/* Quantity */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => onQuantityChange(item.id, Math.max(1, item.quantity - 1))}
                                className="w-8 h-8 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors flex items-center justify-center"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                            </button>
                            <span className="w-8 text-center text-white font-medium">{item.quantity}</span>
                            <button
                                onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                                className="w-8 h-8 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors flex items-center justify-center"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                        </div>

                        <span className="text-white/20">|</span>

                        {/* Remove */}
                        <button
                            onClick={() => onRemove(item.id)}
                            className="text-red-500 text-sm hover:text-red-400 transition-colors"
                        >
                            Remove
                        </button>

                        {/* Wishlist */}
                        <button className="text-white/60 text-sm hover:text-orange-500 transition-colors hidden md:block">
                            Move to Wishlist
                        </button>
                    </div>
                </div>

                {/* Desktop Price */}
                <div className="hidden md:block text-right">
                    <span className="text-orange-500 font-bold text-lg">₹{(item.price * item.quantity).toLocaleString()}</span>
                    {item.originalPrice > item.price && (
                        <p className="text-white/40 line-through text-sm">
                            ₹{(item.originalPrice * item.quantity).toLocaleString()}
                        </p>
                    )}
                    <p className="text-green-500 text-sm mt-1">
                        You save ₹{((item.originalPrice - item.price) * item.quantity).toLocaleString()}
                    </p>
                </div>
            </div>
        </div>
    )
}

// Order Summary Component
function OrderSummary({
    subtotal,
    discount,
    shipping,
    total,
    coupon,
    onApplyCoupon,
    onRemoveCoupon,
}: {
    subtotal: number
    discount: number
    shipping: number
    total: number
    coupon: string | null
    onApplyCoupon: (code: string) => void
    onRemoveCoupon: () => void
}) {
    const [couponInput, setCouponInput] = useState("")
    const [couponError, setCouponError] = useState("")

    const handleApplyCoupon = () => {
        if (!couponInput.trim()) {
            setCouponError("Please enter a coupon code")
            return
        }
        // Simulate validation
        if (couponInput.toUpperCase() === "SAVE10") {
            onApplyCoupon(couponInput.toUpperCase())
            setCouponInput("")
            setCouponError("")
        } else {
            setCouponError("Invalid coupon code")
        }
    }

    return (
        <div className="card p-6 sticky top-24">
            <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

            {/* Coupon */}
            <div className="mb-6">
                {coupon ? (
                    <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 rounded-xl p-3">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-green-500 font-medium">{coupon}</span>
                        </div>
                        <button onClick={onRemoveCoupon} className="text-white/60 hover:text-white">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ) : (
                    <div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Enter coupon code"
                                value={couponInput}
                                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                                className="input flex-1"
                            />
                            <button onClick={handleApplyCoupon} className="btn btn-secondary">
                                Apply
                            </button>
                        </div>
                        {couponError && (
                            <p className="text-red-500 text-sm mt-2">{couponError}</p>
                        )}
                        <p className="text-white/40 text-sm mt-2">Try: SAVE10</p>
                    </div>
                )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 border-t border-white/10 pt-4">
                <div className="flex justify-between text-white/60">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                    <div className="flex justify-between text-green-500">
                        <span>Discount</span>
                        <span>-₹{discount.toLocaleString()}</span>
                    </div>
                )}
                <div className="flex justify-between text-white/60">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? <span className="text-green-500">FREE</span> : `₹${shipping}`}</span>
                </div>
                {shipping === 0 && (
                    <p className="text-green-500 text-sm">🎉 You qualify for free shipping!</p>
                )}
            </div>

            {/* Total */}
            <div className="flex justify-between items-center border-t border-white/10 pt-4 mt-4">
                <span className="text-xl font-bold text-white">Total</span>
                <span className="text-2xl font-bold text-orange-500">₹{total.toLocaleString()}</span>
            </div>

            {/* Checkout Button */}
            <Link href="/checkout" className="btn btn-primary w-full mt-6">
                Proceed to Checkout
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
            </Link>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-4 mt-6 text-white/40 text-sm">
                <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Secure
                </div>
                <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Protected
                </div>
            </div>
        </div>
    )
}

export default function CartPage() {
    const [cartItems, setCartItems] = useState([
        { id: "1", title: "Premium LED Headlight Bulb H4 - 6000K Cool White", price: 1499, originalPrice: 2499, quantity: 2, image: "💡" },
        { id: "2", title: "Leather Car Seat Cover Set - Universal Fit", price: 3999, originalPrice: 5999, quantity: 1, image: "🪑", variant: "Black/Red" },
        { id: "3", title: "7D Car Floor Mats - Custom Fit for Swift", price: 2499, originalPrice: 3499, quantity: 1, image: "🟫" },
    ])
    const [coupon, setCoupon] = useState<string | null>(null)

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const discount = coupon ? Math.round(subtotal * 0.1) : 0 // 10% discount for SAVE10
    const shipping = subtotal >= 999 ? 0 : 99
    const total = subtotal - discount + shipping

    const handleQuantityChange = (id: string, quantity: number) => {
        setCartItems((items) =>
            items.map((item) => (item.id === id ? { ...item, quantity } : item))
        )
    }

    const handleRemove = (id: string) => {
        setCartItems((items) => items.filter((item) => item.id !== id))
    }

    const handleApplyCoupon = (code: string) => {
        setCoupon(code)
    }

    const handleRemoveCoupon = () => {
        setCoupon(null)
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-6 bg-white/5 rounded-full flex items-center justify-center text-5xl">
                        🛒
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Your cart is empty</h1>
                    <p className="text-white/60 mb-6">Add some products to get started!</p>
                    <Link href="/" className="btn btn-primary">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen">
            {/* Breadcrumb */}
            <div className="bg-white/[0.02] border-b border-white/10">
                <div className="container-custom py-4">
                    <nav className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-white/60 hover:text-orange-500 transition-colors">Home</Link>
                        <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-white">Shopping Cart</span>
                    </nav>
                </div>
            </div>

            <div className="container-custom py-8">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">
                    Shopping Cart ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <CartItem
                                key={item.id}
                                item={item}
                                onQuantityChange={handleQuantityChange}
                                onRemove={handleRemove}
                            />
                        ))}

                        {/* Continue Shopping */}
                        <Link href="/" className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-400 transition-colors mt-4">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Continue Shopping
                        </Link>
                    </div>

                    {/* Order Summary */}
                    <div>
                        <OrderSummary
                            subtotal={subtotal}
                            discount={discount}
                            shipping={shipping}
                            total={total}
                            coupon={coupon}
                            onApplyCoupon={handleApplyCoupon}
                            onRemoveCoupon={handleRemoveCoupon}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
