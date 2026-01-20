"use client"

import { useState } from "react"
import Link from "next/link"

// Vehicle data
const vehicleData = {
    makes: [
        { id: "maruti", name: "Maruti Suzuki", logo: "🚗" },
        { id: "hyundai", name: "Hyundai", logo: "🚙" },
        { id: "tata", name: "Tata Motors", logo: "🚐" },
        { id: "mahindra", name: "Mahindra", logo: "🛻" },
        { id: "kia", name: "Kia", logo: "🚕" },
        { id: "toyota", name: "Toyota", logo: "🚗" },
        { id: "honda", name: "Honda", logo: "🚙" },
        { id: "mg", name: "MG Motor", logo: "🚐" },
    ],
    models: {
        maruti: [
            { id: "swift", name: "Swift", type: "Hatchback", image: "🚗" },
            { id: "baleno", name: "Baleno", type: "Hatchback", image: "🚗" },
            { id: "dzire", name: "Dzire", type: "Sedan", image: "🚗" },
            { id: "brezza", name: "Brezza", type: "SUV", image: "🚙" },
            { id: "grand-vitara", name: "Grand Vitara", type: "SUV", image: "🚙" },
            { id: "ertiga", name: "Ertiga", type: "MPV", image: "🚐" },
        ],
        hyundai: [
            { id: "creta", name: "Creta", type: "SUV", image: "🚙" },
            { id: "venue", name: "Venue", type: "SUV", image: "🚙" },
            { id: "i20", name: "i20", type: "Hatchback", image: "🚗" },
            { id: "verna", name: "Verna", type: "Sedan", image: "🚗" },
            { id: "alcazar", name: "Alcazar", type: "SUV", image: "🚙" },
        ],
        tata: [
            { id: "nexon", name: "Nexon", type: "SUV", image: "🚙" },
            { id: "punch", name: "Punch", type: "SUV", image: "🚙" },
            { id: "harrier", name: "Harrier", type: "SUV", image: "🚙" },
            { id: "safari", name: "Safari", type: "SUV", image: "🚙" },
            { id: "altroz", name: "Altroz", type: "Hatchback", image: "🚗" },
        ],
        mahindra: [
            { id: "thar", name: "Thar", type: "SUV", image: "🛻" },
            { id: "scorpio-n", name: "Scorpio N", type: "SUV", image: "🚙" },
            { id: "xuv700", name: "XUV700", type: "SUV", image: "🚙" },
            { id: "xuv300", name: "XUV300", type: "SUV", image: "🚙" },
        ],
        kia: [
            { id: "seltos", name: "Seltos", type: "SUV", image: "🚙" },
            { id: "sonet", name: "Sonet", type: "SUV", image: "🚙" },
            { id: "carens", name: "Carens", type: "MPV", image: "🚐" },
        ],
        toyota: [
            { id: "fortuner", name: "Fortuner", type: "SUV", image: "🚙" },
            { id: "innova", name: "Innova Crysta", type: "MPV", image: "🚐" },
            { id: "hyryder", name: "Urban Cruiser Hyryder", type: "SUV", image: "🚙" },
        ],
        honda: [
            { id: "city", name: "City", type: "Sedan", image: "🚗" },
            { id: "amaze", name: "Amaze", type: "Sedan", image: "🚗" },
            { id: "elevate", name: "Elevate", type: "SUV", image: "🚙" },
        ],
        mg: [
            { id: "hector", name: "Hector", type: "SUV", image: "🚙" },
            { id: "astor", name: "Astor", type: "SUV", image: "🚙" },
            { id: "zs-ev", name: "ZS EV", type: "SUV", image: "🚙" },
        ],
    },
}

// Make Card
function MakeCard({ make, selected, onClick }: { make: typeof vehicleData.makes[0]; selected: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`card p-6 text-center transition-all ${selected ? "border-orange-500 bg-orange-500/10" : "card-hover"
                }`}
        >
            <div className="text-5xl mb-3">{make.logo}</div>
            <h3 className={`font-semibold ${selected ? "text-orange-500" : "text-white"}`}>{make.name}</h3>
        </button>
    )
}

// Model Card
function ModelCard({ model }: { model: { id: string; name: string; type: string; image: string } }) {
    return (
        <Link
            href={`/shop-by-car/${model.id}`}
            className="card card-hover p-6 text-center group"
        >
            <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">{model.image}</div>
            <h3 className="font-semibold text-white group-hover:text-orange-400 transition-colors">{model.name}</h3>
            <p className="text-white/50 text-sm">{model.type}</p>
        </Link>
    )
}

export default function ShopByCarPage() {
    const [selectedMake, setSelectedMake] = useState<string | null>(null)

    const models = selectedMake ? vehicleData.models[selectedMake as keyof typeof vehicleData.models] : null

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-b from-orange-500/10 to-transparent py-16 md:py-24">
                <div className="container-custom text-center">
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        Shop by Your <span className="text-gradient">Car</span>
                    </h1>
                    <p className="text-white/60 text-lg max-w-2xl mx-auto">
                        Select your car make and model to find 100% compatible accessories. Every product shown will fit your vehicle perfectly.
                    </p>
                </div>
            </section>

            {/* Make Selection */}
            <section className="section py-12">
                <div className="container-custom">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-white">Select Your Car Make</h2>
                        {selectedMake && (
                            <button
                                onClick={() => setSelectedMake(null)}
                                className="text-orange-500 hover:text-orange-400 text-sm flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Clear Selection
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                        {vehicleData.makes.map((make) => (
                            <MakeCard
                                key={make.id}
                                make={make}
                                selected={selectedMake === make.id}
                                onClick={() => setSelectedMake(make.id)}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Model Selection */}
            {selectedMake && models && (
                <section className="section py-12 bg-white/[0.02]">
                    <div className="container-custom">
                        <h2 className="text-2xl font-bold text-white mb-8">
                            Select Your {vehicleData.makes.find((m) => m.id === selectedMake)?.name} Model
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {models.map((model) => (
                                <ModelCard key={model.id} model={model} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Popular Categories */}
            <section className="section py-16">
                <div className="container-custom">
                    <h2 className="text-2xl font-bold text-white mb-8">Popular Categories</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {[
                            { name: "LED Lights", icon: "💡", count: 250 },
                            { name: "Seat Covers", icon: "🪑", count: 180 },
                            { name: "Floor Mats", icon: "🟫", count: 200 },
                            { name: "Audio", icon: "🔊", count: 120 },
                            { name: "Exterior", icon: "✨", count: 150 },
                            { name: "Interior", icon: "🎨", count: 300 },
                        ].map((category) => (
                            <Link
                                key={category.name}
                                href={`/categories/${category.name.toLowerCase().replace(" ", "-")}`}
                                className="card card-hover p-6 text-center"
                            >
                                <div className="text-4xl mb-3">{category.icon}</div>
                                <h3 className="font-semibold text-white mb-1">{category.name}</h3>
                                <p className="text-white/50 text-sm">{category.count}+ products</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trust Section */}
            <section className="section py-16 bg-gradient-to-r from-orange-500/10 to-transparent">
                <div className="container-custom">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex items-start gap-4">
                            <div className="w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                                <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-1">100% Fitment Guarantee</h3>
                                <p className="text-white/60 text-sm">Every product is verified to fit your specific vehicle</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                                <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-1">Quality Assured</h3>
                                <p className="text-white/60 text-sm">All products go through strict quality checks</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                                <svg className="w-7 h-7 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-1">Easy Installation</h3>
                                <p className="text-white/60 text-sm">Clear instructions and installation support</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
