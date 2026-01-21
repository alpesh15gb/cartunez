"use client"

import Link from "next/link"

const deals = [
    {
        id: 1,
        title: "Premium LED Headlight H4 - 6000K",
        originalPrice: 2499,
        salePrice: 1499,
        discount: 40,
        image: "💡",
        category: "Lighting",
        endsIn: "2 days",
    },
    {
        id: 2,
        title: "Leather Car Seat Cover Set - Universal",
        originalPrice: 5999,
        salePrice: 3999,
        discount: 33,
        image: "🪑",
        category: "Seat Covers",
        endsIn: "3 days",
    },
    {
        id: 3,
        title: "Android Stereo 9-inch Touchscreen",
        originalPrice: 12999,
        salePrice: 8999,
        discount: 31,
        image: "📱",
        category: "Audio",
        endsIn: "1 day",
    },
    {
        id: 4,
        title: "7D Car Floor Mats - Custom Fit",
        originalPrice: 3499,
        salePrice: 2499,
        discount: 29,
        image: "🟫",
        category: "Floor Mats",
        endsIn: "5 days",
    },
    {
        id: 5,
        title: "Car Dash Camera 4K WiFi",
        originalPrice: 4999,
        salePrice: 2999,
        discount: 40,
        image: "📷",
        category: "Electronics",
        endsIn: "2 days",
    },
    {
        id: 6,
        title: "Fog Light Kit - Yellow 3000K",
        originalPrice: 1999,
        salePrice: 1299,
        discount: 35,
        image: "🌫️",
        category: "Lighting",
        endsIn: "4 days",
    },
]

export default function DealsPage() {
    return (
        <div className="min-h-screen py-12">
            <div className="container-custom">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-block px-4 py-2 bg-red-500/10 rounded-full border border-red-500/20 mb-4">
                        <span className="text-red-500 font-medium">🔥 Limited Time Offers</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Hot <span className="text-gradient">Deals</span>
                    </h1>
                    <p className="text-white/60 max-w-2xl mx-auto">
                        Save big on premium car accessories. These deals won't last long!
                    </p>
                </div>

                {/* Deals Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {deals.map((deal) => (
                        <Link
                            key={deal.id}
                            href={`/product/${deal.id}`}
                            className="card card-hover overflow-hidden group"
                        >
                            {/* Discount Badge */}
                            <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-red-500 rounded-full">
                                <span className="text-white font-bold text-sm">-{deal.discount}%</span>
                            </div>

                            {/* Timer Badge */}
                            <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-black/50 backdrop-blur rounded-full">
                                <span className="text-white text-sm">⏰ {deal.endsIn}</span>
                            </div>

                            {/* Image */}
                            <div className="h-48 bg-gradient-to-br from-white/5 to-white/0 flex items-center justify-center">
                                <span className="text-7xl">{deal.image}</span>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <span className="text-orange-500 text-sm font-medium">{deal.category}</span>
                                <h3 className="text-white font-semibold mt-1 mb-3 line-clamp-2">{deal.title}</h3>
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl font-bold text-white">₹{deal.salePrice.toLocaleString()}</span>
                                    <span className="text-white/40 line-through">₹{deal.originalPrice.toLocaleString()}</span>
                                </div>
                                <button className="btn btn-primary w-full mt-4">
                                    Grab Deal
                                </button>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
