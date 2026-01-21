"use client"

import Link from "next/link"

const brands = [
    { name: "Maruti Suzuki", slug: "maruti", logo: "🚗", products: 450 },
    { name: "Hyundai", slug: "hyundai", logo: "🚙", products: 380 },
    { name: "Tata Motors", slug: "tata", logo: "🚐", products: 320 },
    { name: "Mahindra", slug: "mahindra", logo: "🛻", products: 280 },
    { name: "Kia", slug: "kia", logo: "🚘", products: 220 },
    { name: "Toyota", slug: "toyota", logo: "🚖", products: 190 },
    { name: "Honda", slug: "honda", logo: "🏎️", products: 175 },
    { name: "Skoda", slug: "skoda", logo: "🚕", products: 120 },
    { name: "Volkswagen", slug: "volkswagen", logo: "🚌", products: 110 },
    { name: "MG Motor", slug: "mg", logo: "🚗", products: 95 },
    { name: "Renault", slug: "renault", logo: "🚙", products: 85 },
    { name: "Nissan", slug: "nissan", logo: "🚐", products: 75 },
]

const accessoryBrands = [
    { name: "Philips", category: "Lighting", logo: "💡" },
    { name: "JBL", category: "Audio", logo: "🔊" },
    { name: "3M", category: "Car Care", logo: "🧽" },
    { name: "Exide", category: "Batteries", logo: "🔋" },
    { name: "Bosch", category: "Electronics", logo: "⚡" },
    { name: "Pioneer", category: "Audio", logo: "🎵" },
]

export default function BrandsPage() {
    return (
        <div className="min-h-screen py-12">
            <div className="container-custom">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Shop by <span className="text-gradient">Brand</span>
                    </h1>
                    <p className="text-white/60 max-w-2xl mx-auto">
                        Find accessories specifically designed for your car brand
                    </p>
                </div>

                {/* Car Brands */}
                <h2 className="text-2xl font-bold text-white mb-6">Car Brands</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
                    {brands.map((brand) => (
                        <Link
                            key={brand.slug}
                            href={`/shop-by-car?make=${brand.slug}`}
                            className="card card-hover p-6 text-center group"
                        >
                            <div className="text-4xl mb-3">{brand.logo}</div>
                            <h3 className="text-white font-semibold mb-1 group-hover:text-orange-500 transition-colors">
                                {brand.name}
                            </h3>
                            <p className="text-white/40 text-sm">{brand.products} Products</p>
                        </Link>
                    ))}
                </div>

                {/* Accessory Brands */}
                <h2 className="text-2xl font-bold text-white mb-6">Accessory Brands</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                    {accessoryBrands.map((brand) => (
                        <div
                            key={brand.name}
                            className="card p-6 text-center"
                        >
                            <div className="text-3xl mb-2">{brand.logo}</div>
                            <h3 className="text-white font-semibold">{brand.name}</h3>
                            <p className="text-white/40 text-xs">{brand.category}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
