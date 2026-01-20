"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

// Sidebar Navigation
const navItems = [
    { label: "Dashboard", href: "/admin", icon: "📊" },
    { label: "Products", href: "/admin/products", icon: "📦" },
    { label: "Orders", href: "/admin/orders", icon: "🛒" },
    { label: "Vehicles", href: "/admin/vehicles", icon: "🚗" },
    { label: "Fitments", href: "/admin/fitments", icon: "🔧" },
    { label: "Import", href: "/admin/import", icon: "📤" },
    { label: "Reports", href: "/admin/reports", icon: "📈" },
    { label: "Settings", href: "/admin/settings", icon: "⚙️" },
]

// Stat Card Component
function StatCard({ label, value, change, icon }: { label: string; value: string; change?: string; icon: string }) {
    const isPositive = change?.startsWith("+")

    return (
        <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">{icon}</span>
                {change && (
                    <span className={`text-sm font-medium px-2 py-1 rounded ${isPositive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                        }`}>
                        {change}
                    </span>
                )}
            </div>
            <p className="text-3xl font-bold text-white">{value}</p>
            <p className="text-white/60 text-sm mt-1">{label}</p>
        </div>
    )
}

// Recent Order Row
function OrderRow({ order }: { order: { id: string; customer: string; total: number; status: string; date: string } }) {
    const statusColors: Record<string, string> = {
        pending: "bg-yellow-500/10 text-yellow-500",
        processing: "bg-blue-500/10 text-blue-500",
        shipped: "bg-purple-500/10 text-purple-500",
        delivered: "bg-green-500/10 text-green-500",
        cancelled: "bg-red-500/10 text-red-500",
    }

    return (
        <tr className="border-b border-white/5 hover:bg-white/[0.02]">
            <td className="py-4 px-4">
                <Link href={`/admin/orders/${order.id}`} className="text-orange-500 hover:text-orange-400 font-medium">
                    {order.id}
                </Link>
            </td>
            <td className="py-4 px-4 text-white">{order.customer}</td>
            <td className="py-4 px-4 text-white">₹{order.total.toLocaleString()}</td>
            <td className="py-4 px-4">
                <span className={`px-2 py-1 rounded text-sm font-medium capitalize ${statusColors[order.status] || ""}`}>
                    {order.status}
                </span>
            </td>
            <td className="py-4 px-4 text-white/60">{order.date}</td>
        </tr>
    )
}

// Top Product Row
function ProductRow({ product }: { product: { name: string; sales: number; revenue: number; stock: number } }) {
    return (
        <tr className="border-b border-white/5 hover:bg-white/[0.02]">
            <td className="py-4 px-4 text-white">{product.name}</td>
            <td className="py-4 px-4 text-white">{product.sales}</td>
            <td className="py-4 px-4 text-orange-500">₹{product.revenue.toLocaleString()}</td>
            <td className="py-4 px-4">
                <span className={`font-medium ${product.stock < 10 ? "text-red-500" : "text-green-500"}`}>
                    {product.stock}
                </span>
            </td>
        </tr>
    )
}

export default function AdminDashboard() {
    const pathname = usePathname()

    // Sample data
    const stats = [
        { label: "Today's Revenue", value: "₹24,500", change: "+12%", icon: "💰" },
        { label: "Total Orders", value: "156", change: "+8%", icon: "📦" },
        { label: "Active Customers", value: "1,234", change: "+5%", icon: "👥" },
        { label: "Low Stock Items", value: "12", change: "-3", icon: "⚠️" },
    ]

    const recentOrders = [
        { id: "ORD-12350", customer: "Rahul Sharma", total: 4999, status: "pending", date: "5 mins ago" },
        { id: "ORD-12349", customer: "Priya Patel", total: 2499, status: "processing", date: "1 hour ago" },
        { id: "ORD-12348", customer: "Amit Kumar", total: 8999, status: "shipped", date: "2 hours ago" },
        { id: "ORD-12347", customer: "Sneha Singh", total: 1499, status: "delivered", date: "5 hours ago" },
        { id: "ORD-12346", customer: "Vikram Reddy", total: 3999, status: "delivered", date: "Yesterday" },
    ]

    const topProducts = [
        { name: "Premium LED Headlight H4", sales: 156, revenue: 233844, stock: 45 },
        { name: "Leather Seat Cover Set", sales: 89, revenue: 355911, stock: 8 },
        { name: "7D Floor Mats - Swift", sales: 78, revenue: 194922, stock: 32 },
        { name: "Android Stereo 9-inch", sales: 45, revenue: 404955, stock: 12 },
    ]

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-black border-r border-white/10 p-4 flex flex-col">
                {/* Logo */}
                <Link href="/admin" className="flex items-center gap-3 px-3 py-4 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-lg">CT</span>
                    </div>
                    <div>
                        <span className="text-white font-bold">Car Tunez</span>
                        <p className="text-white/40 text-xs">Admin Portal</p>
                    </div>
                </Link>

                {/* Navigation */}
                <nav className="flex-1 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
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

                {/* Footer */}
                <div className="border-t border-white/10 pt-4 mt-4">
                    <Link href="/" className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white transition-colors">
                        <span className="text-xl">🌐</span>
                        <span className="font-medium">View Store</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {/* Header */}
                <header className="bg-black/50 border-b border-white/10 px-8 py-4 flex items-center justify-between sticky top-0 z-10 backdrop-blur-xl">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                        <p className="text-white/60 text-sm">Welcome back! Here&apos;s what&apos;s happening today.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-white/60 hover:text-white transition-colors relative">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-500 font-bold">
                            A
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="p-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat) => (
                            <StatCard key={stat.label} {...stat} />
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Recent Orders */}
                        <div className="card overflow-hidden">
                            <div className="p-4 border-b border-white/10 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-white">Recent Orders</h2>
                                <Link href="/admin/orders" className="text-orange-500 text-sm hover:text-orange-400">
                                    View All
                                </Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-white/[0.02]">
                                        <tr className="text-left text-white/40 text-sm">
                                            <th className="py-3 px-4 font-medium">Order ID</th>
                                            <th className="py-3 px-4 font-medium">Customer</th>
                                            <th className="py-3 px-4 font-medium">Total</th>
                                            <th className="py-3 px-4 font-medium">Status</th>
                                            <th className="py-3 px-4 font-medium">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentOrders.map((order) => (
                                            <OrderRow key={order.id} order={order} />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Top Products */}
                        <div className="card overflow-hidden">
                            <div className="p-4 border-b border-white/10 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-white">Top Selling Products</h2>
                                <Link href="/admin/products" className="text-orange-500 text-sm hover:text-orange-400">
                                    View All
                                </Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-white/[0.02]">
                                        <tr className="text-left text-white/40 text-sm">
                                            <th className="py-3 px-4 font-medium">Product</th>
                                            <th className="py-3 px-4 font-medium">Sales</th>
                                            <th className="py-3 px-4 font-medium">Revenue</th>
                                            <th className="py-3 px-4 font-medium">Stock</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {topProducts.map((product) => (
                                            <ProductRow key={product.name} product={product} />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-8">
                        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Link href="/admin/products/new" className="card card-hover p-4 text-center">
                                <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mx-auto mb-3 text-2xl">
                                    ➕
                                </div>
                                <span className="text-white font-medium">Add Product</span>
                            </Link>
                            <Link href="/admin/orders" className="card card-hover p-4 text-center">
                                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-3 text-2xl">
                                    📋
                                </div>
                                <span className="text-white font-medium">Process Orders</span>
                            </Link>
                            <Link href="/admin/vehicles/new" className="card card-hover p-4 text-center">
                                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mx-auto mb-3 text-2xl">
                                    🚗
                                </div>
                                <span className="text-white font-medium">Add Vehicle</span>
                            </Link>
                            <Link href="/admin/fitments/new" className="card card-hover p-4 text-center">
                                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mx-auto mb-3 text-2xl">
                                    🔧
                                </div>
                                <span className="text-white font-medium">Add Fitment</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
