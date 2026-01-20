"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

// Sidebar Component
function AdminSidebar() {
    const pathname = usePathname()

    const navItems = [
        { label: "Dashboard", href: "/admin", icon: "📊" },
        { label: "Products", href: "/admin/products", icon: "📦" },
        { label: "Orders", href: "/admin/orders", icon: "🛒" },
        { label: "Vehicles", href: "/admin/vehicles", icon: "🚗" },
        { label: "Fitments", href: "/admin/fitments", icon: "🔧" },
        { label: "Customers", href: "/admin/customers", icon: "👥" },
        { label: "Settings", href: "/admin/settings", icon: "⚙️" },
    ]

    return (
        <aside className="w-64 bg-black border-r border-white/10 p-4 flex flex-col min-h-screen">
            <Link href="/admin" className="flex items-center gap-3 px-3 py-4 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">CT</span>
                </div>
                <div>
                    <span className="text-white font-bold">Car Tunez</span>
                    <p className="text-white/40 text-xs">Admin Portal</p>
                </div>
            </Link>

            <nav className="flex-1 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive
                                    ? "bg-orange-500/10 text-orange-500"
                                    : "text-white/60 hover:bg-white/5 hover:text-white"
                                }`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            <div className="border-t border-white/10 pt-4 mt-4">
                <Link href="/" className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white transition-colors">
                    <span className="text-xl">🌐</span>
                    <span className="font-medium">View Store</span>
                </Link>
            </div>
        </aside>
    )
}

// Sample vehicle data
const sampleVehicles = {
    makes: [
        { id: "1", name: "Maruti Suzuki", slug: "maruti", modelsCount: 15, active: true },
        { id: "2", name: "Hyundai", slug: "hyundai", modelsCount: 12, active: true },
        { id: "3", name: "Tata Motors", slug: "tata", modelsCount: 10, active: true },
        { id: "4", name: "Mahindra", slug: "mahindra", modelsCount: 8, active: true },
        { id: "5", name: "Kia", slug: "kia", modelsCount: 5, active: true },
        { id: "6", name: "Toyota", slug: "toyota", modelsCount: 7, active: true },
        { id: "7", name: "Honda", slug: "honda", modelsCount: 6, active: true },
        { id: "8", name: "MG Motor", slug: "mg", modelsCount: 4, active: true },
    ],
    models: [
        { id: "m1", makeId: "1", name: "Swift", slug: "swift", variantsCount: 8, years: "2018-2024" },
        { id: "m2", makeId: "1", name: "Baleno", slug: "baleno", variantsCount: 6, years: "2015-2024" },
        { id: "m3", makeId: "1", name: "Dzire", slug: "dzire", variantsCount: 7, years: "2017-2024" },
        { id: "m4", makeId: "2", name: "Creta", slug: "creta", variantsCount: 10, years: "2015-2024" },
        { id: "m5", makeId: "2", name: "Venue", slug: "venue", variantsCount: 8, years: "2019-2024" },
        { id: "m6", makeId: "3", name: "Nexon", slug: "nexon", variantsCount: 12, years: "2017-2024" },
    ]
}

export default function VehiclesPage() {
    const [activeTab, setActiveTab] = useState<"makes" | "models">("makes")
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedMake, setSelectedMake] = useState<string | null>(null)
    const [showAddModal, setShowAddModal] = useState(false)

    const filteredMakes = sampleVehicles.makes.filter(make =>
        make.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const filteredModels = sampleVehicles.models.filter(model => {
        const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesMake = !selectedMake || model.makeId === selectedMake
        return matchesSearch && matchesMake
    })

    return (
        <div className="flex min-h-screen">
            <AdminSidebar />

            <main className="flex-1 overflow-auto">
                <header className="bg-black/50 border-b border-white/10 px-8 py-4 flex items-center justify-between sticky top-0 z-10 backdrop-blur-xl">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Vehicle Management</h1>
                        <p className="text-white/60 text-sm">Manage vehicle makes, models, and variants</p>
                    </div>
                    <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add {activeTab === "makes" ? "Make" : "Model"}
                    </button>
                </header>

                <div className="p-8">
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="card p-4">
                            <p className="text-3xl font-bold text-orange-500">{sampleVehicles.makes.length}</p>
                            <p className="text-white/60 text-sm">Car Makes</p>
                        </div>
                        <div className="card p-4">
                            <p className="text-3xl font-bold text-blue-500">{sampleVehicles.models.length}</p>
                            <p className="text-white/60 text-sm">Car Models</p>
                        </div>
                        <div className="card p-4">
                            <p className="text-3xl font-bold text-green-500">156</p>
                            <p className="text-white/60 text-sm">Total Variants</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-6">
                        <button
                            onClick={() => setActiveTab("makes")}
                            className={`px-6 py-3 rounded-xl font-medium transition-colors ${activeTab === "makes"
                                    ? "bg-orange-500 text-white"
                                    : "bg-white/5 text-white/60 hover:bg-white/10"
                                }`}
                        >
                            Makes
                        </button>
                        <button
                            onClick={() => setActiveTab("models")}
                            className={`px-6 py-3 rounded-xl font-medium transition-colors ${activeTab === "models"
                                    ? "bg-orange-500 text-white"
                                    : "bg-white/5 text-white/60 hover:bg-white/10"
                                }`}
                        >
                            Models
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="card p-4 mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder={`Search ${activeTab}...`}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="input"
                                />
                            </div>
                            {activeTab === "models" && (
                                <select
                                    value={selectedMake || ""}
                                    onChange={(e) => setSelectedMake(e.target.value || null)}
                                    className="input w-auto"
                                >
                                    <option value="">All Makes</option>
                                    {sampleVehicles.makes.map(make => (
                                        <option key={make.id} value={make.id}>{make.name}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                    </div>

                    {/* Makes Tab */}
                    {activeTab === "makes" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredMakes.map((make) => (
                                <div key={make.id} className="card p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-2xl">
                                                🚗
                                            </div>
                                            <div>
                                                <h3 className="text-white font-semibold">{make.name}</h3>
                                                <p className="text-white/40 text-sm">/{make.slug}</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" checked={make.active} className="sr-only peer" readOnly />
                                            <div className="w-11 h-6 bg-white/10 peer-checked:bg-green-500 rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                        </label>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-white/60 text-sm">{make.modelsCount} models</span>
                                        <div className="flex gap-2">
                                            <button className="text-white/60 hover:text-white p-1">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button className="text-white/60 hover:text-red-500 p-1">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Models Tab */}
                    {activeTab === "models" && (
                        <div className="card overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-white/[0.02]">
                                    <tr className="text-left text-white/40 text-sm">
                                        <th className="py-4 px-4 font-medium">Model Name</th>
                                        <th className="py-4 px-4 font-medium">Make</th>
                                        <th className="py-4 px-4 font-medium">Slug</th>
                                        <th className="py-4 px-4 font-medium">Years</th>
                                        <th className="py-4 px-4 font-medium">Variants</th>
                                        <th className="py-4 px-4 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredModels.map((model) => {
                                        const make = sampleVehicles.makes.find(m => m.id === model.makeId)
                                        return (
                                            <tr key={model.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                                                <td className="py-4 px-4 text-white font-medium">{model.name}</td>
                                                <td className="py-4 px-4 text-white/60">{make?.name}</td>
                                                <td className="py-4 px-4 text-white/40 font-mono text-sm">/{model.slug}</td>
                                                <td className="py-4 px-4 text-white/60">{model.years}</td>
                                                <td className="py-4 px-4">
                                                    <span className="bg-blue-500/10 text-blue-500 px-2 py-1 rounded text-sm">
                                                        {model.variantsCount} variants
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex gap-2">
                                                        <button className="text-white/60 hover:text-white p-1">
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </button>
                                                        <button className="text-white/60 hover:text-red-500 p-1">
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
