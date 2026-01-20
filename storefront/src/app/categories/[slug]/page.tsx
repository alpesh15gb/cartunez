"use client"

import { useState } from "react"
import Link from "next/link"

// Filter Sidebar Component
function FilterSidebar({
    selectedFilters,
    onFilterChange,
}: {
    selectedFilters: Record<string, string[]>
    onFilterChange: (category: string, value: string) => void
}) {
    const filters = {
        price: [
            { label: "Under ₹500", value: "0-500" },
            { label: "₹500 - ₹1,000", value: "500-1000" },
            { label: "₹1,000 - ₹2,500", value: "1000-2500" },
            { label: "₹2,500 - ₹5,000", value: "2500-5000" },
            { label: "Above ₹5,000", value: "5000-999999" },
        ],
        brand: [
            { label: "Osram", value: "osram" },
            { label: "Philips", value: "philips" },
            { label: "Bosch", value: "bosch" },
            { label: "3M", value: "3m" },
            { label: "Generic", value: "generic" },
        ],
        rating: [
            { label: "4★ & above", value: "4" },
            { label: "3★ & above", value: "3" },
            { label: "2★ & above", value: "2" },
        ],
        availability: [
            { label: "In Stock", value: "in-stock" },
            { label: "Express Delivery", value: "express" },
        ],
    }

    return (
        <aside className="space-y-6">
            <div className="card p-4">
                <h3 className="text-white font-semibold mb-4">Filters</h3>

                {/* Price Range */}
                <div className="mb-6">
                    <h4 className="text-white/80 text-sm font-medium mb-3">Price</h4>
                    <div className="space-y-2">
                        {filters.price.map((item) => (
                            <label key={item.value} className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={selectedFilters.price?.includes(item.value)}
                                    onChange={() => onFilterChange("price", item.value)}
                                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-orange-500 focus:ring-orange-500"
                                />
                                <span className="text-white/60 text-sm group-hover:text-white transition-colors">
                                    {item.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Brand */}
                <div className="mb-6">
                    <h4 className="text-white/80 text-sm font-medium mb-3">Brand</h4>
                    <div className="space-y-2">
                        {filters.brand.map((item) => (
                            <label key={item.value} className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={selectedFilters.brand?.includes(item.value)}
                                    onChange={() => onFilterChange("brand", item.value)}
                                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-orange-500 focus:ring-orange-500"
                                />
                                <span className="text-white/60 text-sm group-hover:text-white transition-colors">
                                    {item.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Rating */}
                <div className="mb-6">
                    <h4 className="text-white/80 text-sm font-medium mb-3">Rating</h4>
                    <div className="space-y-2">
                        {filters.rating.map((item) => (
                            <label key={item.value} className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="rating"
                                    checked={selectedFilters.rating?.includes(item.value)}
                                    onChange={() => onFilterChange("rating", item.value)}
                                    className="w-4 h-4 border-white/20 bg-white/5 text-orange-500 focus:ring-orange-500"
                                />
                                <span className="text-white/60 text-sm group-hover:text-white transition-colors">
                                    {item.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Availability */}
                <div>
                    <h4 className="text-white/80 text-sm font-medium mb-3">Availability</h4>
                    <div className="space-y-2">
                        {filters.availability.map((item) => (
                            <label key={item.value} className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={selectedFilters.availability?.includes(item.value)}
                                    onChange={() => onFilterChange("availability", item.value)}
                                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-orange-500 focus:ring-orange-500"
                                />
                                <span className="text-white/60 text-sm group-hover:text-white transition-colors">
                                    {item.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Clear Filters */}
                <button className="w-full mt-6 py-2 text-orange-500 text-sm font-medium hover:text-orange-400 transition-colors">
                    Clear All Filters
                </button>
            </div>
        </aside>
    )
}

// Product Card Component
function ProductCard({
    id,
    title,
    price,
    originalPrice,
    image,
    rating,
    reviews,
    inStock,
}: {
    id: string
    title: string
    price: number
    originalPrice?: number
    image: string
    rating: number
    reviews: number
    inStock: boolean
}) {
    const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

    return (
        <Link href={`/product/${id}`} className="card card-hover group block">
            <div className="relative aspect-square bg-white/5 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-6xl">
                    {image}
                </div>
                {discount > 0 && (
                    <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                        {discount}% OFF
                    </span>
                )}
                {!inStock && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white font-medium">Out of Stock</span>
                    </div>
                )}
                <button
                    onClick={(e) => {
                        e.preventDefault()
                        // Add to wishlist
                    }}
                    className="absolute top-3 right-3 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-orange-500"
                >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
            </div>
            <div className="p-4">
                <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                        <svg
                            key={i}
                            className={`w-4 h-4 ${i < rating ? "text-yellow-400" : "text-white/20"}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    ))}
                    <span className="text-white/50 text-xs ml-1">({reviews})</span>
                </div>
                <h3 className="text-white font-medium mb-2 line-clamp-2 group-hover:text-orange-400 transition-colors">
                    {title}
                </h3>
                <div className="flex items-center gap-2">
                    <span className="text-orange-500 font-bold text-lg">₹{price.toLocaleString()}</span>
                    {originalPrice && (
                        <span className="text-white/40 line-through text-sm">₹{originalPrice.toLocaleString()}</span>
                    )}
                </div>
                <button
                    onClick={(e) => {
                        e.preventDefault()
                        // Add to cart
                    }}
                    disabled={!inStock}
                    className="btn btn-secondary w-full mt-4 text-sm py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {inStock ? "Add to Cart" : "Notify Me"}
                </button>
            </div>
        </Link>
    )
}

// Category name mapping
const categoryNames: Record<string, string> = {
    lighting: "Lighting",
    "seat-covers": "Seat Covers",
    audio: "Audio Systems",
    "floor-mats": "Floor Mats",
    exterior: "Exterior",
    interior: "Interior",
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
    const [sortBy, setSortBy] = useState("popularity")
    const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})
    const [showMobileFilters, setShowMobileFilters] = useState(false)

    const categoryName = categoryNames[params.slug] || params.slug

    // Sample products - in production, fetch from API
    const products = [
        { id: "1", title: "Premium LED Headlight Bulb H4 - 6000K Cool White", price: 1499, originalPrice: 2499, image: "💡", rating: 5, reviews: 42, inStock: true },
        { id: "2", title: "LED Fog Light Kit with DRL - Universal Fit", price: 2999, originalPrice: 4499, image: "🔦", rating: 4, reviews: 28, inStock: true },
        { id: "3", title: "Interior Ambient LED Strip Light - RGB 12V", price: 799, originalPrice: 1299, image: "🌈", rating: 4, reviews: 156, inStock: true },
        { id: "4", title: "LED Car Door Logo Projector Light - Pair", price: 599, originalPrice: 999, image: "✨", rating: 3, reviews: 89, inStock: false },
        { id: "5", title: "T10 LED Bulb Set - 6000K White (4pcs)", price: 299, originalPrice: 499, image: "💡", rating: 5, reviews: 234, inStock: true },
        { id: "6", title: "LED Brake Light Third Stop Lamp", price: 899, originalPrice: 1499, image: "🔴", rating: 4, reviews: 67, inStock: true },
        { id: "7", title: "Universal LED DRL Strip - Flexible 60cm", price: 449, originalPrice: 799, image: "〰️", rating: 4, reviews: 112, inStock: true },
        { id: "8", title: "LED License Plate Light - Error Free", price: 349, originalPrice: 599, image: "🔳", rating: 5, reviews: 45, inStock: true },
    ]

    const handleFilterChange = (category: string, value: string) => {
        setSelectedFilters((prev) => {
            const current = prev[category] || []
            if (current.includes(value)) {
                return { ...prev, [category]: current.filter((v) => v !== value) }
            }
            return { ...prev, [category]: [...current, value] }
        })
    }

    return (
        <div className="min-h-screen">
            {/* Breadcrumb */}
            <div className="bg-white/[0.02] border-b border-white/10">
                <div className="container-custom py-4">
                    <nav className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-white/60 hover:text-orange-500 transition-colors">
                            Home
                        </Link>
                        <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <Link href="/categories" className="text-white/60 hover:text-orange-500 transition-colors">
                            Categories
                        </Link>
                        <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-white">{categoryName}</span>
                    </nav>
                </div>
            </div>

            <div className="container-custom py-8">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white">{categoryName}</h1>
                        <p className="text-white/60 mt-1">{products.length} products found</p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Mobile Filter Toggle */}
                        <button
                            onClick={() => setShowMobileFilters(!showMobileFilters)}
                            className="lg:hidden btn btn-secondary py-2 px-4"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            Filters
                        </button>

                        {/* Sort Dropdown */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="input py-2 px-4 w-auto"
                        >
                            <option value="popularity">Sort by: Popularity</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="newest">Newest First</option>
                            <option value="rating">Highest Rated</option>
                            <option value="discount">Biggest Discount</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-8">
                    {/* Sidebar - Desktop */}
                    <div className="hidden lg:block w-64 flex-shrink-0">
                        <FilterSidebar
                            selectedFilters={selectedFilters}
                            onFilterChange={handleFilterChange}
                        />
                    </div>

                    {/* Mobile Filters */}
                    {showMobileFilters && (
                        <div className="fixed inset-0 z-50 lg:hidden">
                            <div className="absolute inset-0 bg-black/80" onClick={() => setShowMobileFilters(false)} />
                            <div className="absolute right-0 top-0 bottom-0 w-80 bg-[#0A0A0A] overflow-y-auto">
                                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                                    <h2 className="text-white font-semibold">Filters</h2>
                                    <button onClick={() => setShowMobileFilters(false)} className="text-white/60 hover:text-white">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="p-4">
                                    <FilterSidebar
                                        selectedFilters={selectedFilters}
                                        onFilterChange={handleFilterChange}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Product Grid */}
                    <div className="flex-1">
                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                            {products.map((product) => (
                                <ProductCard key={product.id} {...product} />
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-center gap-2 mt-12">
                            <button className="w-10 h-10 rounded-xl bg-white/5 text-white/60 hover:bg-white/10 transition-colors">
                                <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button className="w-10 h-10 rounded-xl bg-orange-500 text-white font-medium">1</button>
                            <button className="w-10 h-10 rounded-xl bg-white/5 text-white/60 hover:bg-white/10 transition-colors font-medium">2</button>
                            <button className="w-10 h-10 rounded-xl bg-white/5 text-white/60 hover:bg-white/10 transition-colors font-medium">3</button>
                            <span className="text-white/40 px-2">...</span>
                            <button className="w-10 h-10 rounded-xl bg-white/5 text-white/60 hover:bg-white/10 transition-colors font-medium">10</button>
                            <button className="w-10 h-10 rounded-xl bg-white/5 text-white/60 hover:bg-white/10 transition-colors">
                                <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
