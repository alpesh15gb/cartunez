"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

// Sample products for search
const allProducts = [
    { id: "1", title: "Premium LED Headlight Bulb H4 - 6000K Cool White", price: 1499, originalPrice: 2499, image: "💡", rating: 5, reviews: 42, category: "lighting" },
    { id: "2", title: "LED Fog Light Kit with DRL - Universal Fit", price: 2999, originalPrice: 4499, image: "🔦", rating: 4, reviews: 28, category: "lighting" },
    { id: "3", title: "Interior Ambient LED Strip Light - RGB 12V", price: 799, originalPrice: 1299, image: "🌈", rating: 4, reviews: 156, category: "lighting" },
    { id: "4", title: "Leather Car Seat Cover Set - Universal Fit", price: 3999, originalPrice: 5999, image: "🪑", rating: 5, reviews: 89, category: "seat-covers" },
    { id: "5", title: "7D Car Floor Mats - Custom Fit for Swift", price: 2499, originalPrice: 3499, image: "🟫", rating: 5, reviews: 234, category: "floor-mats" },
    { id: "6", title: "Android Stereo 9-inch HD Touchscreen", price: 8999, originalPrice: 12999, image: "📱", rating: 4, reviews: 67, category: "audio" },
    { id: "7", title: "T10 LED Bulb Set - 6000K White (4pcs)", price: 299, originalPrice: 499, image: "💡", rating: 5, reviews: 312, category: "lighting" },
    { id: "8", title: "Car Perfume Air Freshener - Ocean Breeze", price: 199, originalPrice: 399, image: "🌊", rating: 4, reviews: 89, category: "interior" },
]

// Product Card
function ProductCard({ product }: { product: typeof allProducts[0] }) {
    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)

    return (
        <Link href={`/product/${product.id}`} className="card card-hover group block">
            <div className="relative aspect-square bg-white/5 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-6xl">
                    {product.image}
                </div>
                {discount > 0 && (
                    <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                        {discount}% OFF
                    </span>
                )}
            </div>
            <div className="p-4">
                <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                        <svg
                            key={i}
                            className={`w-4 h-4 ${i < product.rating ? "text-yellow-400" : "text-white/20"}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    ))}
                    <span className="text-white/50 text-xs ml-1">({product.reviews})</span>
                </div>
                <h3 className="text-white font-medium mb-2 line-clamp-2 group-hover:text-orange-400 transition-colors">
                    {product.title}
                </h3>
                <div className="flex items-center gap-2">
                    <span className="text-orange-500 font-bold text-lg">₹{product.price.toLocaleString()}</span>
                    <span className="text-white/40 line-through text-sm">₹{product.originalPrice.toLocaleString()}</span>
                </div>
            </div>
        </Link>
    )
}

function SearchResultsContent() {
    const searchParams = useSearchParams()
    const query = searchParams.get("q") || ""
    const [sortBy, setSortBy] = useState("relevance")
    const [results, setResults] = useState<typeof allProducts>([])

    useEffect(() => {
        if (query) {
            const q = query.toLowerCase()
            const filtered = allProducts.filter(
                (p) =>
                    p.title.toLowerCase().includes(q) ||
                    p.category.toLowerCase().includes(q)
            )
            setResults(filtered)
        } else {
            setResults([])
        }
    }, [query])

    // Sort results
    const sortedResults = [...results].sort((a, b) => {
        switch (sortBy) {
            case "price-low":
                return a.price - b.price
            case "price-high":
                return b.price - a.price
            case "rating":
                return b.rating - a.rating
            case "reviews":
                return b.reviews - a.reviews
            default:
                return 0
        }
    })

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="bg-white/[0.02] border-b border-white/10">
                <div className="container-custom py-4">
                    <nav className="flex items-center gap-2 text-sm mb-4">
                        <Link href="/" className="text-white/60 hover:text-orange-500 transition-colors">Home</Link>
                        <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-white">Search Results</span>
                    </nav>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-white">
                                {query ? (
                                    <>
                                        Results for &quot;<span className="text-orange-500">{query}</span>&quot;
                                    </>
                                ) : (
                                    "Search"
                                )}
                            </h1>
                            <p className="text-white/60 mt-1">{sortedResults.length} products found</p>
                        </div>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="input py-2 px-4 w-auto"
                        >
                            <option value="relevance">Sort by: Relevance</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="rating">Highest Rated</option>
                            <option value="reviews">Most Reviews</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="container-custom py-8">
                {sortedResults.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {sortedResults.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : query ? (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 mx-auto mb-6 bg-white/5 rounded-full flex items-center justify-center text-5xl">
                            🔍
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">No results found</h2>
                        <p className="text-white/60 mb-6">
                            We couldn&apos;t find anything matching &quot;{query}&quot;
                        </p>
                        <div className="max-w-md mx-auto">
                            <p className="text-white/40 text-sm mb-4">Try searching for:</p>
                            <div className="flex flex-wrap justify-center gap-2">
                                {["LED headlight", "Seat covers", "Floor mats", "Car stereo"].map((term) => (
                                    <Link
                                        key={term}
                                        href={`/search?q=${encodeURIComponent(term)}`}
                                        className="px-4 py-2 bg-white/5 rounded-lg text-white/80 hover:bg-white/10 transition-colors"
                                    >
                                        {term}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 mx-auto mb-6 bg-white/5 rounded-full flex items-center justify-center text-5xl">
                            🔍
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Start searching</h2>
                        <p className="text-white/60">Enter a search term to find products</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <SearchResultsContent />
        </Suspense>
    )
}
