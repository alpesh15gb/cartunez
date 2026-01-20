"use client"

import Link from "next/link"
import { useState } from "react"

// Sample wishlist data
const sampleWishlist = [
    { id: "1", title: "Premium LED Headlight Bulb H4 - 6000K Cool White", price: 1499, originalPrice: 2499, image: "💡", rating: 5, inStock: true },
    { id: "2", title: "Leather Car Seat Cover Set - Universal Fit", price: 3999, originalPrice: 5999, image: "🪑", rating: 4, inStock: true },
    { id: "3", title: "Android Stereo 9-inch HD Touchscreen", price: 8999, originalPrice: 12999, image: "📱", rating: 4, inStock: true },
    { id: "4", title: "LED Car Door Logo Projector Light", price: 599, originalPrice: 999, image: "✨", rating: 3, inStock: false },
    { id: "5", title: "7D Car Floor Mats - Swift", price: 2499, originalPrice: 3499, image: "🟫", rating: 5, inStock: true },
]

export default function WishlistPage() {
    const [wishlist, setWishlist] = useState(sampleWishlist)

    const removeItem = (id: string) => {
        setWishlist(items => items.filter(item => item.id !== id))
    }

    const addToCart = (id: string) => {
        // Add to cart logic
        console.log("Added to cart:", id)
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="bg-white/[0.02] border-b border-white/10">
                <div className="container-custom py-4">
                    <nav className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-white/60 hover:text-orange-500 transition-colors">Home</Link>
                        <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <Link href="/account" className="text-white/60 hover:text-orange-500 transition-colors">Account</Link>
                        <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-white">Wishlist</span>
                    </nav>
                </div>
            </div>

            <div className="container-custom py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white">My Wishlist</h1>
                        <p className="text-white/60 mt-1">{wishlist.length} items</p>
                    </div>
                    {wishlist.length > 0 && (
                        <button className="btn btn-secondary text-sm">
                            Add All to Cart
                        </button>
                    )}
                </div>

                {wishlist.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {wishlist.map((item) => {
                            const discount = Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)

                            return (
                                <div key={item.id} className="card group">
                                    <div className="relative aspect-square bg-white/5 overflow-hidden">
                                        <div className="absolute inset-0 flex items-center justify-center text-6xl">
                                            {item.image}
                                        </div>
                                        {discount > 0 && (
                                            <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                                                {discount}% OFF
                                            </span>
                                        )}
                                        {!item.inStock && (
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                <span className="text-white font-medium">Out of Stock</span>
                                            </div>
                                        )}
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="absolute top-3 right-3 w-10 h-10 bg-red-500/80 rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="p-4">
                                        <div className="flex items-center gap-1 mb-2">
                                            {[...Array(5)].map((_, i) => (
                                                <svg
                                                    key={i}
                                                    className={`w-4 h-4 ${i < item.rating ? "text-yellow-400" : "text-white/20"}`}
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>

                                        <Link href={`/product/${item.id}`}>
                                            <h3 className="text-white font-medium mb-2 line-clamp-2 hover:text-orange-400 transition-colors">
                                                {item.title}
                                            </h3>
                                        </Link>

                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="text-orange-500 font-bold text-lg">₹{item.price.toLocaleString()}</span>
                                            <span className="text-white/40 line-through text-sm">₹{item.originalPrice.toLocaleString()}</span>
                                        </div>

                                        <button
                                            onClick={() => addToCart(item.id)}
                                            disabled={!item.inStock}
                                            className="btn btn-primary w-full text-sm py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {item.inStock ? (
                                                <>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                    </svg>
                                                    Add to Cart
                                                </>
                                            ) : (
                                                "Notify When Available"
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 mx-auto mb-6 bg-white/5 rounded-full flex items-center justify-center text-5xl">
                            ❤️
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Your wishlist is empty</h2>
                        <p className="text-white/60 mb-6">Save items you love to buy them later</p>
                        <Link href="/" className="btn btn-primary">
                            Start Shopping
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
