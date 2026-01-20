"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

// Sidebar Component (reusable)
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

// Sample products data
const sampleProducts = [
    { id: "1", sku: "LED-H4-6K", name: "Premium LED Headlight Bulb H4 - 6000K", category: "Lighting", price: 1499, stock: 45, status: "active" },
    { id: "2", sku: "SEAT-LTH-UNI", name: "Leather Car Seat Cover Set - Universal", category: "Seat Covers", price: 3999, stock: 8, status: "low_stock" },
    { id: "3", sku: "MAT-7D-SWF", name: "7D Car Floor Mats - Swift", category: "Floor Mats", price: 2499, stock: 32, status: "active" },
    { id: "4", sku: "AUD-AND-9", name: "Android Stereo 9-inch HD Touchscreen", category: "Audio", price: 8999, stock: 12, status: "active" },
    { id: "5", sku: "LED-FOG-DRL", name: "LED Fog Light Kit with DRL", category: "Lighting", price: 2999, stock: 0, status: "out_of_stock" },
    { id: "6", sku: "INT-AMB-RGB", name: "Interior Ambient LED Strip Light", category: "Interior", price: 799, stock: 156, status: "active" },
]

export default function ProductsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [selectedStatus, setSelectedStatus] = useState("all")
    const [selectedProducts, setSelectedProducts] = useState<string[]>([])

    const categories = ["all", "Lighting", "Seat Covers", "Floor Mats", "Audio", "Interior", "Exterior"]
    const statuses = ["all", "active", "low_stock", "out_of_stock"]

    const filteredProducts = sampleProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
        const matchesStatus = selectedStatus === "all" || product.status === selectedStatus
        return matchesSearch && matchesCategory && matchesStatus
    })

    const toggleSelectProduct = (id: string) => {
        setSelectedProducts(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        )
    }

    const toggleSelectAll = () => {
        if (selectedProducts.length === filteredProducts.length) {
            setSelectedProducts([])
        } else {
            setSelectedProducts(filteredProducts.map(p => p.id))
        }
    }

    const statusColors: Record<string, string> = {
        active: "bg-green-500/10 text-green-500",
        low_stock: "bg-yellow-500/10 text-yellow-500",
        out_of_stock: "bg-red-500/10 text-red-500",
    }

    const statusLabels: Record<string, string> = {
        active: "Active",
        low_stock: "Low Stock",
        out_of_stock: "Out of Stock",
    }

    return (
        <div className="flex min-h-screen">
            <AdminSidebar />

            <main className="flex-1 overflow-auto">
                {/* Header */}
                <header className="bg-black/50 border-b border-white/10 px-8 py-4 flex items-center justify-between sticky top-0 z-10 backdrop-blur-xl">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Products</h1>
                        <p className="text-white/60 text-sm">Manage your product catalog</p>
                    </div>
                    <Link href="/admin/products/new" className="btn btn-primary">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Product
                    </Link>
                </header>

                <div className="p-8">
                    {/* Filters */}
                    <div className="card p-4 mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Search by name or SKU..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="input"
                                />
                            </div>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="input w-auto"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>
                                        {cat === "all" ? "All Categories" : cat}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="input w-auto"
                            >
                                {statuses.map(status => (
                                    <option key={status} value={status}>
                                        {status === "all" ? "All Status" : statusLabels[status]}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Bulk Actions */}
                    {selectedProducts.length > 0 && (
                        <div className="card p-4 mb-6 flex items-center justify-between bg-orange-500/10 border-orange-500/20">
                            <span className="text-white">
                                {selectedProducts.length} product{selectedProducts.length > 1 ? "s" : ""} selected
                            </span>
                            <div className="flex gap-2">
                                <button className="btn btn-secondary text-sm py-2">
                                    Bulk Edit
                                </button>
                                <button className="btn btn-secondary text-sm py-2 text-red-500">
                                    Delete Selected
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Products Table */}
                    <div className="card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-white/[0.02]">
                                    <tr className="text-left text-white/40 text-sm">
                                        <th className="py-4 px-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                                                onChange={toggleSelectAll}
                                                className="w-4 h-4 rounded"
                                            />
                                        </th>
                                        <th className="py-4 px-4 font-medium">SKU</th>
                                        <th className="py-4 px-4 font-medium">Product Name</th>
                                        <th className="py-4 px-4 font-medium">Category</th>
                                        <th className="py-4 px-4 font-medium">Price</th>
                                        <th className="py-4 px-4 font-medium">Stock</th>
                                        <th className="py-4 px-4 font-medium">Status</th>
                                        <th className="py-4 px-4 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map((product) => (
                                        <tr key={product.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                                            <td className="py-4 px-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedProducts.includes(product.id)}
                                                    onChange={() => toggleSelectProduct(product.id)}
                                                    className="w-4 h-4 rounded"
                                                />
                                            </td>
                                            <td className="py-4 px-4 text-white/60 font-mono text-sm">{product.sku}</td>
                                            <td className="py-4 px-4">
                                                <Link href={`/admin/products/${product.id}`} className="text-white hover:text-orange-400">
                                                    {product.name}
                                                </Link>
                                            </td>
                                            <td className="py-4 px-4 text-white/60">{product.category}</td>
                                            <td className="py-4 px-4 text-orange-500 font-medium">₹{product.price.toLocaleString()}</td>
                                            <td className="py-4 px-4">
                                                <span className={product.stock < 10 ? "text-red-500" : "text-white"}>
                                                    {product.stock}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className={`px-2 py-1 rounded text-sm font-medium ${statusColors[product.status]}`}>
                                                    {statusLabels[product.status]}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex gap-2">
                                                    <Link href={`/admin/products/${product.id}`} className="text-white/60 hover:text-white p-1">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </Link>
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

                        {/* Pagination */}
                        <div className="p-4 border-t border-white/10 flex items-center justify-between">
                            <p className="text-white/60 text-sm">
                                Showing {filteredProducts.length} of {sampleProducts.length} products
                            </p>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 bg-white/5 text-white/60 rounded hover:bg-white/10">
                                    Previous
                                </button>
                                <button className="px-3 py-1 bg-orange-500 text-white rounded">1</button>
                                <button className="px-3 py-1 bg-white/5 text-white/60 rounded hover:bg-white/10">2</button>
                                <button className="px-3 py-1 bg-white/5 text-white/60 rounded hover:bg-white/10">
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
