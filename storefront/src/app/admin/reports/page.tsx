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
        { label: "Import", href: "/admin/import", icon: "📤" },
        { label: "Reports", href: "/admin/reports", icon: "📈" },
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

// Simple Bar Chart Component
function BarChart({ data, label }: { data: number[]; label: string }) {
    const max = Math.max(...data)

    return (
        <div className="space-y-3">
            <div className="flex items-end gap-2 h-32">
                {data.map((value, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div
                            className="w-full bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-lg transition-all hover:from-orange-400 hover:to-orange-300"
                            style={{ height: `${(value / max) * 100}%` }}
                        />
                    </div>
                ))}
            </div>
            <div className="flex gap-2 text-xs text-white/40">
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"].map((month, i) => (
                    <div key={i} className="flex-1 text-center">{month}</div>
                ))}
            </div>
        </div>
    )
}

// Stat Card with Trend
function StatCardWithTrend({ label, value, change, trend, icon }: {
    label: string
    value: string
    change: string
    trend: "up" | "down"
    icon: string
}) {
    return (
        <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{icon}</span>
                <span className={`text-sm font-medium px-2 py-1 rounded flex items-center gap-1 ${trend === "up" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                    }`}>
                    {trend === "up" ? "↑" : "↓"} {change}
                </span>
            </div>
            <p className="text-3xl font-bold text-white">{value}</p>
            <p className="text-white/60 text-sm mt-1">{label}</p>
        </div>
    )
}

// Top Products Table
function TopProductsTable() {
    const products = [
        { name: "Premium LED Headlight H4", sales: 245, revenue: 367155, growth: 23 },
        { name: "Leather Seat Cover Set", sales: 189, revenue: 755811, growth: 15 },
        { name: "7D Floor Mats - Swift", sales: 156, revenue: 389844, growth: 18 },
        { name: "Android Stereo 9-inch", sales: 98, revenue: 881802, growth: -5 },
        { name: "LED Fog Light Kit", sales: 87, revenue: 260613, growth: 12 },
    ]

    return (
        <table className="w-full">
            <thead className="bg-white/[0.02]">
                <tr className="text-left text-white/40 text-sm">
                    <th className="py-3 px-4 font-medium">#</th>
                    <th className="py-3 px-4 font-medium">Product</th>
                    <th className="py-3 px-4 font-medium">Sales</th>
                    <th className="py-3 px-4 font-medium">Revenue</th>
                    <th className="py-3 px-4 font-medium">Growth</th>
                </tr>
            </thead>
            <tbody>
                {products.map((product, i) => (
                    <tr key={i} className="border-b border-white/5">
                        <td className="py-3 px-4 text-white/40">{i + 1}</td>
                        <td className="py-3 px-4 text-white">{product.name}</td>
                        <td className="py-3 px-4 text-white">{product.sales}</td>
                        <td className="py-3 px-4 text-orange-500 font-medium">₹{product.revenue.toLocaleString()}</td>
                        <td className="py-3 px-4">
                            <span className={product.growth >= 0 ? "text-green-500" : "text-red-500"}>
                                {product.growth >= 0 ? "+" : ""}{product.growth}%
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

// Top Vehicles Table
function TopVehiclesTable() {
    const vehicles = [
        { name: "Maruti Swift", orders: 156, customers: 134 },
        { name: "Hyundai Creta", orders: 132, customers: 118 },
        { name: "Tata Nexon", orders: 98, customers: 89 },
        { name: "Maruti Baleno", orders: 87, customers: 76 },
        { name: "Hyundai Venue", orders: 76, customers: 68 },
    ]

    return (
        <table className="w-full">
            <thead className="bg-white/[0.02]">
                <tr className="text-left text-white/40 text-sm">
                    <th className="py-3 px-4 font-medium">#</th>
                    <th className="py-3 px-4 font-medium">Vehicle</th>
                    <th className="py-3 px-4 font-medium">Orders</th>
                    <th className="py-3 px-4 font-medium">Unique Customers</th>
                </tr>
            </thead>
            <tbody>
                {vehicles.map((vehicle, i) => (
                    <tr key={i} className="border-b border-white/5">
                        <td className="py-3 px-4 text-white/40">{i + 1}</td>
                        <td className="py-3 px-4 text-white">{vehicle.name}</td>
                        <td className="py-3 px-4 text-white">{vehicle.orders}</td>
                        <td className="py-3 px-4 text-blue-500">{vehicle.customers}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default function ReportsPage() {
    const [dateRange, setDateRange] = useState("30d")
    const [activeReport, setActiveReport] = useState<"sales" | "products" | "vehicles" | "customers">("sales")

    // Sample data
    const salesData = [45000, 52000, 48000, 61000, 55000, 72000, 68000]
    const ordersData = [120, 145, 132, 168, 155, 189, 175]

    return (
        <div className="flex min-h-screen">
            <AdminSidebar />

            <main className="flex-1 overflow-auto">
                <header className="bg-black/50 border-b border-white/10 px-8 py-4 flex items-center justify-between sticky top-0 z-10 backdrop-blur-xl">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Reports & Analytics</h1>
                        <p className="text-white/60 text-sm">Track your store's performance</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="input py-2 w-auto"
                        >
                            <option value="7d">Last 7 Days</option>
                            <option value="30d">Last 30 Days</option>
                            <option value="90d">Last 90 Days</option>
                            <option value="1y">Last Year</option>
                        </select>
                        <button className="btn btn-secondary">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Export PDF
                        </button>
                    </div>
                </header>

                <div className="p-8">
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCardWithTrend
                            icon="💰"
                            label="Total Revenue"
                            value="₹4,01,000"
                            change="12.5%"
                            trend="up"
                        />
                        <StatCardWithTrend
                            icon="📦"
                            label="Total Orders"
                            value="1,084"
                            change="8.2%"
                            trend="up"
                        />
                        <StatCardWithTrend
                            icon="👥"
                            label="New Customers"
                            value="256"
                            change="5.7%"
                            trend="up"
                        />
                        <StatCardWithTrend
                            icon="📊"
                            label="Avg Order Value"
                            value="₹3,700"
                            change="2.1%"
                            trend="down"
                        />
                    </div>

                    {/* Report Tabs */}
                    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                        {[
                            { id: "sales", label: "Sales Overview", icon: "📈" },
                            { id: "products", label: "Top Products", icon: "📦" },
                            { id: "vehicles", label: "Top Vehicles", icon: "🚗" },
                            { id: "customers", label: "Customer Insights", icon: "👥" },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveReport(tab.id as any)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${activeReport === tab.id
                                        ? "bg-orange-500 text-white"
                                        : "bg-white/5 text-white/60 hover:bg-white/10"
                                    }`}
                            >
                                <span>{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Sales Overview */}
                    {activeReport === "sales" && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="card p-6">
                                <h3 className="text-lg font-semibold text-white mb-6">Revenue Trend</h3>
                                <BarChart data={salesData} label="Revenue" />
                                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between text-sm">
                                    <span className="text-white/60">Total: <span className="text-orange-500 font-medium">₹4,01,000</span></span>
                                    <span className="text-white/60">Average: <span className="text-white font-medium">₹57,286</span></span>
                                </div>
                            </div>

                            <div className="card p-6">
                                <h3 className="text-lg font-semibold text-white mb-6">Orders Trend</h3>
                                <BarChart data={ordersData} label="Orders" />
                                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between text-sm">
                                    <span className="text-white/60">Total: <span className="text-blue-500 font-medium">1,084 orders</span></span>
                                    <span className="text-white/60">Average: <span className="text-white font-medium">155/day</span></span>
                                </div>
                            </div>

                            {/* Payment Methods */}
                            <div className="card p-6">
                                <h3 className="text-lg font-semibold text-white mb-6">Payment Methods</h3>
                                <div className="space-y-4">
                                    {[
                                        { method: "Razorpay (UPI)", percent: 45, amount: 180450 },
                                        { method: "Razorpay (Cards)", percent: 30, amount: 120300 },
                                        { method: "Cash on Delivery", percent: 25, amount: 100250 },
                                    ].map((item, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-white">{item.method}</span>
                                                <span className="text-white/60">{item.percent}% • ₹{item.amount.toLocaleString()}</span>
                                            </div>
                                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"
                                                    style={{ width: `${item.percent}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Order Status */}
                            <div className="card p-6">
                                <h3 className="text-lg font-semibold text-white mb-6">Order Status Distribution</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { status: "Delivered", count: 856, color: "bg-green-500" },
                                        { status: "Shipped", count: 124, color: "bg-purple-500" },
                                        { status: "Processing", count: 78, color: "bg-blue-500" },
                                        { status: "Cancelled", count: 26, color: "bg-red-500" },
                                    ].map((item, i) => (
                                        <div key={i} className="bg-white/5 rounded-xl p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className={`w-3 h-3 rounded-full ${item.color}`} />
                                                <span className="text-white/60 text-sm">{item.status}</span>
                                            </div>
                                            <p className="text-2xl font-bold text-white">{item.count}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Top Products */}
                    {activeReport === "products" && (
                        <div className="card overflow-hidden">
                            <div className="p-4 border-b border-white/10 flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-white">Top Selling Products</h3>
                                <button className="text-orange-500 text-sm hover:text-orange-400">
                                    Export CSV
                                </button>
                            </div>
                            <TopProductsTable />
                        </div>
                    )}

                    {/* Top Vehicles */}
                    {activeReport === "vehicles" && (
                        <div className="card overflow-hidden">
                            <div className="p-4 border-b border-white/10 flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-white">Most Popular Vehicles</h3>
                                <button className="text-orange-500 text-sm hover:text-orange-400">
                                    Export CSV
                                </button>
                            </div>
                            <TopVehiclesTable />
                        </div>
                    )}

                    {/* Customer Insights */}
                    {activeReport === "customers" && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="card p-6">
                                <h3 className="text-lg font-semibold text-white mb-6">Customer Acquisition</h3>
                                <div className="space-y-4">
                                    {[
                                        { source: "Direct", percent: 40, customers: 102 },
                                        { source: "Google Search", percent: 35, customers: 90 },
                                        { source: "Social Media", percent: 15, customers: 38 },
                                        { source: "Referrals", percent: 10, customers: 26 },
                                    ].map((item, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-white">{item.source}</span>
                                                <span className="text-white/60">{item.customers} customers</span>
                                            </div>
                                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                                                    style={{ width: `${item.percent}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="card p-6">
                                <h3 className="text-lg font-semibold text-white mb-6">Customer Retention</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/5 rounded-xl p-4 text-center">
                                        <p className="text-3xl font-bold text-green-500">68%</p>
                                        <p className="text-white/60 text-sm">Repeat Customers</p>
                                    </div>
                                    <div className="bg-white/5 rounded-xl p-4 text-center">
                                        <p className="text-3xl font-bold text-blue-500">2.4</p>
                                        <p className="text-white/60 text-sm">Avg Orders/Customer</p>
                                    </div>
                                    <div className="bg-white/5 rounded-xl p-4 text-center">
                                        <p className="text-3xl font-bold text-orange-500">₹8,880</p>
                                        <p className="text-white/60 text-sm">Lifetime Value</p>
                                    </div>
                                    <div className="bg-white/5 rounded-xl p-4 text-center">
                                        <p className="text-3xl font-bold text-purple-500">4.2★</p>
                                        <p className="text-white/60 text-sm">Avg Rating</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
