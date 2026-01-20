"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

// Image Gallery Component
function ImageGallery({ images }: { images: string[] }) {
    const [selectedIndex, setSelectedIndex] = useState(0)

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-white/5 rounded-2xl overflow-hidden flex items-center justify-center">
                <span className="text-9xl">{images[selectedIndex]}</span>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedIndex(index)}
                        className={`w-20 h-20 flex-shrink-0 rounded-xl bg-white/5 flex items-center justify-center text-3xl border-2 transition-all ${selectedIndex === index
                                ? "border-orange-500"
                                : "border-transparent hover:border-white/20"
                            }`}
                    >
                        {image}
                    </button>
                ))}
            </div>
        </div>
    )
}

// Fitment Checker Component
function FitmentChecker({ productId }: { productId: string }) {
    const [selectedMake, setSelectedMake] = useState("")
    const [selectedModel, setSelectedModel] = useState("")
    const [selectedYear, setSelectedYear] = useState("")
    const [fitmentResult, setFitmentResult] = useState<null | { fits: boolean; notes?: string }>(null)
    const [isChecking, setIsChecking] = useState(false)

    const makes = [
        { id: "maruti", name: "Maruti Suzuki" },
        { id: "hyundai", name: "Hyundai" },
        { id: "tata", name: "Tata Motors" },
        { id: "mahindra", name: "Mahindra" },
    ]

    const models: Record<string, string[]> = {
        maruti: ["Swift", "Baleno", "Dzire", "Brezza"],
        hyundai: ["Creta", "Venue", "i20", "Verna"],
        tata: ["Nexon", "Punch", "Harrier", "Safari"],
        mahindra: ["Thar", "Scorpio N", "XUV700"],
    }

    const years = ["2024", "2023", "2022", "2021", "2020"]

    const checkFitment = () => {
        setIsChecking(true)
        // Simulate API call
        setTimeout(() => {
            setFitmentResult({
                fits: true,
                notes: "Direct plug and play. No modifications required.",
            })
            setIsChecking(false)
        }, 1000)
    }

    return (
        <div className="card p-4 md:p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Check Fitment for Your Car
            </h3>

            <div className="grid grid-cols-3 gap-3 mb-4">
                <select
                    value={selectedMake}
                    onChange={(e) => {
                        setSelectedMake(e.target.value)
                        setSelectedModel("")
                        setFitmentResult(null)
                    }}
                    className="input text-sm py-2"
                >
                    <option value="">Make</option>
                    {makes.map((make) => (
                        <option key={make.id} value={make.id}>{make.name}</option>
                    ))}
                </select>

                <select
                    value={selectedModel}
                    onChange={(e) => {
                        setSelectedModel(e.target.value)
                        setFitmentResult(null)
                    }}
                    className="input text-sm py-2"
                    disabled={!selectedMake}
                >
                    <option value="">Model</option>
                    {selectedMake && models[selectedMake]?.map((model) => (
                        <option key={model} value={model}>{model}</option>
                    ))}
                </select>

                <select
                    value={selectedYear}
                    onChange={(e) => {
                        setSelectedYear(e.target.value)
                        setFitmentResult(null)
                    }}
                    className="input text-sm py-2"
                    disabled={!selectedModel}
                >
                    <option value="">Year</option>
                    {years.map((year) => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>

            <button
                onClick={checkFitment}
                disabled={!selectedMake || !selectedModel || !selectedYear || isChecking}
                className="btn btn-secondary w-full text-sm py-2 disabled:opacity-50"
            >
                {isChecking ? "Checking..." : "Check Fitment"}
            </button>

            {fitmentResult && (
                <div className={`mt-4 p-4 rounded-xl ${fitmentResult.fits ? "bg-green-500/10 border border-green-500/20" : "bg-red-500/10 border border-red-500/20"}`}>
                    <div className="flex items-center gap-2 mb-1">
                        {fitmentResult.fits ? (
                            <>
                                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-green-500 font-medium">This product fits your vehicle!</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <span className="text-red-500 font-medium">This product may not fit</span>
                            </>
                        )}
                    </div>
                    {fitmentResult.notes && (
                        <p className="text-white/60 text-sm">{fitmentResult.notes}</p>
                    )}
                </div>
            )}
        </div>
    )
}

// Quantity Selector
function QuantitySelector({ value, onChange, max = 10 }: { value: number; onChange: (v: number) => void; max?: number }) {
    return (
        <div className="flex items-center gap-2">
            <button
                onClick={() => onChange(Math.max(1, value - 1))}
                className="w-10 h-10 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-colors flex items-center justify-center"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
            </button>
            <span className="w-12 text-center text-white font-medium">{value}</span>
            <button
                onClick={() => onChange(Math.min(max, value + 1))}
                className="w-10 h-10 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-colors flex items-center justify-center"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
            </button>
        </div>
    )
}

// Tab Component
function Tabs({ tabs, activeTab, onChange }: { tabs: string[]; activeTab: string; onChange: (tab: string) => void }) {
    return (
        <div className="flex gap-1 p-1 bg-white/5 rounded-xl">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => onChange(tab)}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${activeTab === tab
                            ? "bg-orange-500 text-white"
                            : "text-white/60 hover:text-white"
                        }`}
                >
                    {tab}
                </button>
            ))}
        </div>
    )
}

export default function ProductPage({ params }: { params: { id: string } }) {
    const [quantity, setQuantity] = useState(1)
    const [activeTab, setActiveTab] = useState("Description")
    const [selectedPincode, setSelectedPincode] = useState("")
    const [deliveryInfo, setDeliveryInfo] = useState<null | { days: number; cod: boolean }>(null)

    // Sample product data - in production, fetch from API
    const product = {
        id: params.id,
        title: "Premium LED Headlight Bulb H4 - 6000K Cool White (Pair)",
        price: 1499,
        originalPrice: 2499,
        rating: 4.8,
        reviews: 156,
        images: ["💡", "🔦", "📦", "🚗"],
        sku: "LED-H4-6K-PR",
        brand: "Osram",
        inStock: true,
        stockQuantity: 24,
        highlights: [
            "6000K Cool White Color",
            "50,000+ Hours Lifespan",
            "Plug & Play Installation",
            "IP68 Waterproof Rating",
            "1 Year Warranty",
        ],
        description: `
      Upgrade your vehicle's lighting with our premium LED headlight bulbs. 
      Featuring cutting-edge LED technology, these bulbs provide 300% brighter 
      light output compared to standard halogen bulbs while consuming less power.
      
      The 6000K cool white color temperature offers excellent visibility and 
      a modern look. With an IP68 waterproof rating, these bulbs can withstand 
      any weather condition.
    `,
        specifications: [
            { label: "Bulb Type", value: "H4/9003/HB2" },
            { label: "Wattage", value: "55W per bulb" },
            { label: "Lumens", value: "12,000 LM (pair)" },
            { label: "Color Temperature", value: "6000K Cool White" },
            { label: "Voltage", value: "DC 9-32V" },
            { label: "Lifespan", value: "50,000+ hours" },
            { label: "Waterproof Rating", value: "IP68" },
            { label: "Warranty", value: "1 Year" },
        ],
    }

    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)

    const checkDelivery = () => {
        // Simulate API call
        setDeliveryInfo({ days: 3, cod: true })
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
                        <Link href="/categories/lighting" className="text-white/60 hover:text-orange-500 transition-colors">Lighting</Link>
                        <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-white line-clamp-1">{product.title}</span>
                    </nav>
                </div>
            </div>

            <div className="container-custom py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Left - Images */}
                    <div>
                        <ImageGallery images={product.images} />
                    </div>

                    {/* Right - Details */}
                    <div className="space-y-6">
                        {/* Title & Rating */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-1 bg-orange-500/10 text-orange-500 text-xs font-medium rounded">
                                    {product.brand}
                                </span>
                                <span className="text-white/40 text-sm">SKU: {product.sku}</span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
                                {product.title}
                            </h1>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className={`w-5 h-5 ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-white/20"}`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                    <span className="text-white ml-2">{product.rating}</span>
                                </div>
                                <span className="text-white/40">|</span>
                                <span className="text-white/60">{product.reviews} reviews</span>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-end gap-3">
                            <span className="text-3xl font-bold text-orange-500">
                                ₹{product.price.toLocaleString()}
                            </span>
                            <span className="text-xl text-white/40 line-through">
                                ₹{product.originalPrice.toLocaleString()}
                            </span>
                            <span className="px-2 py-1 bg-green-500/10 text-green-500 text-sm font-medium rounded">
                                {discount}% OFF
                            </span>
                        </div>

                        {/* Stock Status */}
                        <div className="flex items-center gap-2">
                            {product.inStock ? (
                                <>
                                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                                    <span className="text-green-500 text-sm font-medium">In Stock</span>
                                    <span className="text-white/40 text-sm">({product.stockQuantity} available)</span>
                                </>
                            ) : (
                                <>
                                    <span className="w-2 h-2 bg-red-500 rounded-full" />
                                    <span className="text-red-500 text-sm font-medium">Out of Stock</span>
                                </>
                            )}
                        </div>

                        {/* Highlights */}
                        <div className="card p-4">
                            <h3 className="text-white font-semibold mb-3">Highlights</h3>
                            <ul className="space-y-2">
                                {product.highlights.map((highlight, i) => (
                                    <li key={i} className="flex items-center gap-3 text-white/80 text-sm">
                                        <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        {highlight}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Fitment Checker */}
                        <FitmentChecker productId={product.id} />

                        {/* Delivery Check */}
                        <div className="card p-4">
                            <h3 className="text-white font-semibold mb-3">Check Delivery</h3>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    placeholder="Enter pincode"
                                    value={selectedPincode}
                                    onChange={(e) => setSelectedPincode(e.target.value)}
                                    maxLength={6}
                                    className="input flex-1"
                                />
                                <button onClick={checkDelivery} className="btn btn-secondary">
                                    Check
                                </button>
                            </div>
                            {deliveryInfo && (
                                <div className="mt-3 space-y-2">
                                    <p className="text-green-500 text-sm flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Delivery in {deliveryInfo.days} days
                                    </p>
                                    {deliveryInfo.cod && (
                                        <p className="text-white/60 text-sm flex items-center gap-2">
                                            <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            Cash on Delivery available
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Quantity & Add to Cart */}
                        <div className="flex items-center gap-4">
                            <QuantitySelector value={quantity} onChange={setQuantity} max={product.stockQuantity} />
                            <button className="btn btn-primary flex-1">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                Add to Cart
                            </button>
                            <button className="w-12 h-12 rounded-xl bg-white/5 text-white/60 hover:text-orange-500 hover:bg-white/10 transition-colors flex items-center justify-center">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </button>
                        </div>

                        {/* Buy Now */}
                        <button className="btn btn-outline w-full">
                            Buy Now
                        </button>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="mt-12">
                    <Tabs
                        tabs={["Description", "Specifications", "Reviews"]}
                        activeTab={activeTab}
                        onChange={setActiveTab}
                    />

                    <div className="mt-6">
                        {activeTab === "Description" && (
                            <div className="card p-6">
                                <div className="text-white/80 whitespace-pre-line leading-relaxed">
                                    {product.description}
                                </div>
                            </div>
                        )}

                        {activeTab === "Specifications" && (
                            <div className="card overflow-hidden">
                                <table className="w-full">
                                    <tbody>
                                        {product.specifications.map((spec, i) => (
                                            <tr key={i} className={i % 2 === 0 ? "bg-white/5" : ""}>
                                                <td className="px-6 py-4 text-white/60 font-medium">{spec.label}</td>
                                                <td className="px-6 py-4 text-white">{spec.value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === "Reviews" && (
                            <div className="card p-6">
                                <p className="text-white/60">Reviews coming soon...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
