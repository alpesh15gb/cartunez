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

// Sample fitment data
const sampleFitments = [
    { id: "1", product: "Premium LED Headlight Bulb H4", productId: "LED-H4-6K", vehicle: "Maruti Swift 2018-2024", fitmentType: "direct", notes: "Plug and play" },
    { id: "2", product: "Premium LED Headlight Bulb H4", productId: "LED-H4-6K", vehicle: "Maruti Baleno 2015-2024", fitmentType: "direct", notes: "Direct fit" },
    { id: "3", product: "7D Floor Mats", productId: "MAT-7D-SWF", vehicle: "Maruti Swift 2018-2024", fitmentType: "custom", notes: "Custom fit for Swift" },
    { id: "4", product: "Leather Seat Cover Set", productId: "SEAT-LTH-UNI", vehicle: "Universal", fitmentType: "universal", notes: "Fits most cars" },
    { id: "5", product: "LED Fog Light Kit", productId: "LED-FOG-DRL", vehicle: "Hyundai Creta 2020-2024", fitmentType: "direct", notes: "Exact fit for Creta" },
    { id: "6", product: "Android Stereo 9-inch", productId: "AUD-AND-9", vehicle: "Maruti Swift 2018-2024", fitmentType: "custom", notes: "Requires frame" },
]

export default function FitmentsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedType, setSelectedType] = useState("all")
    const [showAddModal, setShowAddModal] = useState(false)

    // Add fitment form state
    const [newFitment, setNewFitment] = useState({
        productId: "",
        makeId: "",
        modelId: "",
        variantId: "",
        fitmentType: "direct",
        notes: "",
    })

    const fitmentTypes = ["all", "direct", "custom", "universal"]

    const filteredFitments = sampleFitments.filter(fitment => {
        const matchesSearch = fitment.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
            fitment.vehicle.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesType = selectedType === "all" || fitment.fitmentType === selectedType
        return matchesSearch && matchesType
    })

    const typeColors: Record<string, string> = {
        direct: "bg-green-500/10 text-green-500",
        custom: "bg-blue-500/10 text-blue-500",
        universal: "bg-purple-500/10 text-purple-500",
    }

    return (
        <div className="flex min-h-screen">
            <AdminSidebar />

            <main className="flex-1 overflow-auto">
                <header className="bg-black/50 border-b border-white/10 px-8 py-4 flex items-center justify-between sticky top-0 z-10 backdrop-blur-xl">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Fitment Management</h1>
                        <p className="text-white/60 text-sm">Map products to compatible vehicles</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="btn btn-secondary">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            Import CSV
                        </button>
                        <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Fitment
                        </button>
                    </div>
                </header>

                <div className="p-8">
                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <div className="card p-4">
                            <p className="text-3xl font-bold text-orange-500">{sampleFitments.length}</p>
                            <p className="text-white/60 text-sm">Total Fitments</p>
                        </div>
                        <div className="card p-4">
                            <p className="text-3xl font-bold text-green-500">
                                {sampleFitments.filter(f => f.fitmentType === "direct").length}
                            </p>
                            <p className="text-white/60 text-sm">Direct Fit</p>
                        </div>
                        <div className="card p-4">
                            <p className="text-3xl font-bold text-blue-500">
                                {sampleFitments.filter(f => f.fitmentType === "custom").length}
                            </p>
                            <p className="text-white/60 text-sm">Custom Fit</p>
                        </div>
                        <div className="card p-4">
                            <p className="text-3xl font-bold text-purple-500">
                                {sampleFitments.filter(f => f.fitmentType === "universal").length}
                            </p>
                            <p className="text-white/60 text-sm">Universal</p>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="card p-4 mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Search by product or vehicle..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="input"
                                />
                            </div>
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="input w-auto"
                            >
                                {fitmentTypes.map(type => (
                                    <option key={type} value={type}>
                                        {type === "all" ? "All Types" : type.charAt(0).toUpperCase() + type.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Fitments Table */}
                    <div className="card overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-white/[0.02]">
                                <tr className="text-left text-white/40 text-sm">
                                    <th className="py-4 px-4 font-medium">Product</th>
                                    <th className="py-4 px-4 font-medium">SKU</th>
                                    <th className="py-4 px-4 font-medium">Vehicle</th>
                                    <th className="py-4 px-4 font-medium">Fitment Type</th>
                                    <th className="py-4 px-4 font-medium">Notes</th>
                                    <th className="py-4 px-4 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredFitments.map((fitment) => (
                                    <tr key={fitment.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                                        <td className="py-4 px-4 text-white">{fitment.product}</td>
                                        <td className="py-4 px-4 text-white/60 font-mono text-sm">{fitment.productId}</td>
                                        <td className="py-4 px-4 text-white/80">{fitment.vehicle}</td>
                                        <td className="py-4 px-4">
                                            <span className={`px-2 py-1 rounded text-sm font-medium capitalize ${typeColors[fitment.fitmentType]}`}>
                                                {fitment.fitmentType}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-white/60 text-sm">{fitment.notes}</td>
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
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Add Fitment Modal */}
                    {showAddModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center">
                            <div className="absolute inset-0 bg-black/80" onClick={() => setShowAddModal(false)} />
                            <div className="relative bg-[#141414] border border-white/10 rounded-2xl p-6 w-full max-w-lg">
                                <h2 className="text-xl font-bold text-white mb-6">Add New Fitment</h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-white/60 text-sm mb-2">Product</label>
                                        <select className="input">
                                            <option value="">Select Product</option>
                                            <option value="1">Premium LED Headlight Bulb H4</option>
                                            <option value="2">7D Floor Mats - Swift</option>
                                            <option value="3">Leather Seat Cover Set</option>
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-white/60 text-sm mb-2">Make</label>
                                            <select className="input">
                                                <option value="">Select Make</option>
                                                <option value="maruti">Maruti Suzuki</option>
                                                <option value="hyundai">Hyundai</option>
                                                <option value="tata">Tata Motors</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-white/60 text-sm mb-2">Model</label>
                                            <select className="input">
                                                <option value="">Select Model</option>
                                                <option value="swift">Swift</option>
                                                <option value="baleno">Baleno</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-white/60 text-sm mb-2">Variant</label>
                                            <select className="input">
                                                <option value="">All Variants</option>
                                                <option value="lxi">LXi</option>
                                                <option value="vxi">VXi</option>
                                                <option value="zxi">ZXi</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-white/60 text-sm mb-2">Fitment Type</label>
                                        <select className="input">
                                            <option value="direct">Direct Fit</option>
                                            <option value="custom">Custom Fit</option>
                                            <option value="universal">Universal</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-white/60 text-sm mb-2">Notes (Optional)</label>
                                        <textarea className="input h-24 resize-none" placeholder="Installation notes, modifications required, etc." />
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button onClick={() => setShowAddModal(false)} className="btn btn-secondary flex-1">
                                        Cancel
                                    </button>
                                    <button className="btn btn-primary flex-1">
                                        Add Fitment
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
