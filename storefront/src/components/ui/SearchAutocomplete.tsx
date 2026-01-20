"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface SearchResult {
    id: string
    title: string
    type: "product" | "category" | "vehicle"
    image: string
    price?: number
    url: string
}

// Sample search data - in production, this comes from Meilisearch API
const sampleProducts = [
    { id: "1", title: "Premium LED Headlight Bulb H4 - 6000K", type: "product" as const, image: "💡", price: 1499, url: "/product/1" },
    { id: "2", title: "LED Fog Light Kit with DRL", type: "product" as const, image: "🔦", price: 2999, url: "/product/2" },
    { id: "3", title: "Interior Ambient LED Strip Light", type: "product" as const, image: "🌈", price: 799, url: "/product/3" },
    { id: "4", title: "Leather Car Seat Cover Set", type: "product" as const, image: "🪑", price: 3999, url: "/product/4" },
    { id: "5", title: "7D Car Floor Mats - Swift", type: "product" as const, image: "🟫", price: 2499, url: "/product/5" },
    { id: "6", title: "Android Stereo 9-inch HD", type: "product" as const, image: "📱", price: 8999, url: "/product/6" },
]

const sampleCategories = [
    { id: "c1", title: "Lighting", type: "category" as const, image: "💡", url: "/categories/lighting" },
    { id: "c2", title: "Seat Covers", type: "category" as const, image: "🪑", url: "/categories/seat-covers" },
    { id: "c3", title: "Audio Systems", type: "category" as const, image: "🔊", url: "/categories/audio" },
    { id: "c4", title: "Floor Mats", type: "category" as const, image: "🟫", url: "/categories/floor-mats" },
]

const sampleVehicles = [
    { id: "v1", title: "Maruti Suzuki Swift", type: "vehicle" as const, image: "🚗", url: "/shop-by-car/swift" },
    { id: "v2", title: "Hyundai Creta", type: "vehicle" as const, image: "🚙", url: "/shop-by-car/creta" },
    { id: "v3", title: "Tata Nexon", type: "vehicle" as const, image: "🚙", url: "/shop-by-car/nexon" },
]

export default function SearchAutocomplete() {
    const [query, setQuery] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const [results, setResults] = useState<SearchResult[]>([])
    const [recentSearches, setRecentSearches] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    // Load recent searches from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("recentSearches")
        if (saved) {
            setRecentSearches(JSON.parse(saved))
        }
    }, [])

    // Search function
    useEffect(() => {
        if (query.length < 2) {
            setResults([])
            return
        }

        setIsLoading(true)

        // Simulate API delay
        const timer = setTimeout(() => {
            const q = query.toLowerCase()

            // Search products
            const productResults = sampleProducts.filter(p =>
                p.title.toLowerCase().includes(q)
            ).slice(0, 4)

            // Search categories
            const categoryResults = sampleCategories.filter(c =>
                c.title.toLowerCase().includes(q)
            ).slice(0, 2)

            // Search vehicles
            const vehicleResults = sampleVehicles.filter(v =>
                v.title.toLowerCase().includes(q)
            ).slice(0, 2)

            setResults([...productResults, ...categoryResults, ...vehicleResults])
            setIsLoading(false)
        }, 200)

        return () => clearTimeout(timer)
    }, [query])

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    // Handle search submit
    const handleSearch = (searchQuery: string) => {
        if (!searchQuery.trim()) return

        // Save to recent searches
        const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5)
        setRecentSearches(updated)
        localStorage.setItem("recentSearches", JSON.stringify(updated))

        // Navigate to search results
        router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
        setIsOpen(false)
        setQuery("")
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch(query)
        }
        if (e.key === "Escape") {
            setIsOpen(false)
        }
    }

    const clearRecentSearches = () => {
        setRecentSearches([])
        localStorage.removeItem("recentSearches")
    }

    return (
        <div ref={containerRef} className="relative w-full">
            {/* Search Input */}
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search car accessories..."
                    className="input pl-12 pr-4"
                />
                <svg
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {query && (
                    <button
                        onClick={() => setQuery("")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#141414] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                    {isLoading && (
                        <div className="p-4 text-center">
                            <div className="w-6 h-6 mx-auto border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}

                    {!isLoading && query.length >= 2 && results.length > 0 && (
                        <div className="p-2">
                            {/* Products */}
                            {results.filter(r => r.type === "product").length > 0 && (
                                <div className="mb-2">
                                    <p className="text-white/40 text-xs font-medium px-3 py-2">Products</p>
                                    {results.filter(r => r.type === "product").map(result => (
                                        <Link
                                            key={result.id}
                                            href={result.url}
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
                                        >
                                            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-xl">
                                                {result.image}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white text-sm truncate">{result.title}</p>
                                                {result.price && (
                                                    <p className="text-orange-500 text-sm font-medium">₹{result.price.toLocaleString()}</p>
                                                )}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Categories */}
                            {results.filter(r => r.type === "category").length > 0 && (
                                <div className="mb-2 border-t border-white/10 pt-2">
                                    <p className="text-white/40 text-xs font-medium px-3 py-2">Categories</p>
                                    <div className="flex flex-wrap gap-2 px-3">
                                        {results.filter(r => r.type === "category").map(result => (
                                            <Link
                                                key={result.id}
                                                href={result.url}
                                                onClick={() => setIsOpen(false)}
                                                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                                            >
                                                <span className="text-lg">{result.image}</span>
                                                <span className="text-white text-sm">{result.title}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Vehicles */}
                            {results.filter(r => r.type === "vehicle").length > 0 && (
                                <div className="border-t border-white/10 pt-2">
                                    <p className="text-white/40 text-xs font-medium px-3 py-2">Shop by Car</p>
                                    <div className="flex flex-wrap gap-2 px-3">
                                        {results.filter(r => r.type === "vehicle").map(result => (
                                            <Link
                                                key={result.id}
                                                href={result.url}
                                                onClick={() => setIsOpen(false)}
                                                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                                            >
                                                <span className="text-lg">{result.image}</span>
                                                <span className="text-white text-sm">{result.title}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* View All */}
                            <button
                                onClick={() => handleSearch(query)}
                                className="w-full mt-2 p-3 text-center text-orange-500 hover:bg-orange-500/10 transition-colors border-t border-white/10"
                            >
                                View all results for &quot;{query}&quot;
                            </button>
                        </div>
                    )}

                    {!isLoading && query.length >= 2 && results.length === 0 && (
                        <div className="p-6 text-center">
                            <p className="text-white/60">No results found for &quot;{query}&quot;</p>
                            <p className="text-white/40 text-sm mt-1">Try a different search term</p>
                        </div>
                    )}

                    {!isLoading && query.length < 2 && (
                        <div className="p-2">
                            {/* Recent Searches */}
                            {recentSearches.length > 0 && (
                                <div className="mb-2">
                                    <div className="flex items-center justify-between px-3 py-2">
                                        <p className="text-white/40 text-xs font-medium">Recent Searches</p>
                                        <button onClick={clearRecentSearches} className="text-white/40 text-xs hover:text-white">
                                            Clear
                                        </button>
                                    </div>
                                    {recentSearches.map((search, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleSearch(search)}
                                            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left"
                                        >
                                            <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-white text-sm">{search}</span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Popular Searches */}
                            <div className="border-t border-white/10 pt-2">
                                <p className="text-white/40 text-xs font-medium px-3 py-2">Popular Searches</p>
                                <div className="flex flex-wrap gap-2 px-3 pb-2">
                                    {["LED headlight", "Seat covers", "Floor mats", "Car stereo", "Swift accessories"].map((term) => (
                                        <button
                                            key={term}
                                            onClick={() => handleSearch(term)}
                                            className="px-3 py-1.5 bg-white/5 rounded-lg text-white/80 text-sm hover:bg-white/10 transition-colors"
                                        >
                                            {term}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
