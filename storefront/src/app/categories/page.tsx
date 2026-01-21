"use client"

import Link from "next/link"

const categories = [
    { name: "Lighting", slug: "lighting", icon: "💡", count: 250, description: "LED headlights, fog lights, DRLs and more" },
    { name: "Seat Covers", slug: "seat-covers", icon: "🪑", count: 180, description: "Leather, fabric, and custom fit covers" },
    { name: "Audio Systems", slug: "audio", icon: "🔊", count: 120, description: "Speakers, subwoofers, and stereos" },
    { name: "Floor Mats", slug: "floor-mats", icon: "🟫", count: 200, description: "3D, 7D, and custom fit mats" },
    { name: "Exterior", slug: "exterior", icon: "🚗", count: 150, description: "Body kits, spoilers, and accessories" },
    { name: "Interior", slug: "interior", icon: "🎨", count: 300, description: "Dashboard, steering, and interior trim" },
    { name: "Car Care", slug: "car-care", icon: "🧽", count: 100, description: "Cleaning, polishing, and maintenance" },
    { name: "Electronics", slug: "electronics", icon: "📱", count: 80, description: "GPS, cameras, and gadgets" },
]

export default function CategoriesPage() {
    return (
        <div className="min-h-screen py-12">
            <div className="container-custom">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Shop by <span className="text-gradient">Category</span>
                    </h1>
                    <p className="text-white/60 max-w-2xl mx-auto">
                        Browse our wide range of car accessories organized by category
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categories.map((category) => (
                        <Link
                            key={category.slug}
                            href={`/categories/${category.slug}`}
                            className="card card-hover p-6 group"
                        >
                            <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors">
                                <span className="text-4xl">{category.icon}</span>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">{category.name}</h3>
                            <p className="text-white/50 text-sm mb-3">{category.description}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-orange-500 font-medium">{category.count}+ Products</span>
                                <svg className="w-5 h-5 text-white/40 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
