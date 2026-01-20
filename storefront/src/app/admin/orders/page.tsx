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

// Sample orders data
const sampleOrders = [
    {
        id: "ORD-12350",
        customer: "Rahul Sharma",
        phone: "+91 98765 43210",
        total: 4999,
        status: "pending",
        paymentMethod: "razorpay",
        paymentStatus: "paid",
        items: 2,
        date: "Jan 21, 2026 12:05 AM"
    },
    {
        id: "ORD-12349",
        customer: "Priya Patel",
        phone: "+91 98765 43211",
        total: 2499,
        status: "processing",
        paymentMethod: "cod",
        paymentStatus: "pending",
        items: 1,
        date: "Jan 20, 2026 11:30 PM"
    },
    {
        id: "ORD-12348",
        customer: "Amit Kumar",
        phone: "+91 98765 43212",
        total: 8999,
        status: "shipped",
        paymentMethod: "razorpay",
        paymentStatus: "paid",
        items: 1,
        tracking: "SHP123456789",
        date: "Jan 20, 2026 10:15 PM"
    },
    {
        id: "ORD-12347",
        customer: "Sneha Singh",
        phone: "+91 98765 43213",
        total: 1499,
        status: "delivered",
        paymentMethod: "razorpay",
        paymentStatus: "paid",
        items: 1,
        date: "Jan 20, 2026 7:00 PM"
    },
    {
        id: "ORD-12346",
        customer: "Vikram Reddy",
        phone: "+91 98765 43214",
        total: 3999,
        status: "delivered",
        paymentMethod: "cod",
        paymentStatus: "collected",
        items: 1,
        date: "Jan 19, 2026 3:30 PM"
    },
    {
        id: "ORD-12345",
        customer: "Anita Gupta",
        phone: "+91 98765 43215",
        total: 599,
        status: "cancelled",
        paymentMethod: "razorpay",
        paymentStatus: "refunded",
        items: 1,
        date: "Jan 19, 2026 11:00 AM"
    },
]

export default function OrdersPage() {
    const [selectedStatus, setSelectedStatus] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")

    const statuses = ["all", "pending", "processing", "shipped", "delivered", "cancelled"]

    const statusColors: Record<string, string> = {
        pending: "bg-yellow-500/10 text-yellow-500",
        processing: "bg-blue-500/10 text-blue-500",
        shipped: "bg-purple-500/10 text-purple-500",
        delivered: "bg-green-500/10 text-green-500",
        cancelled: "bg-red-500/10 text-red-500",
    }

    const paymentStatusColors: Record<string, string> = {
        paid: "text-green-500",
        pending: "text-yellow-500",
        refunded: "text-blue-500",
        collected: "text-green-500",
    }

    const filteredOrders = sampleOrders.filter(order => {
        const matchesStatus = selectedStatus === "all" || order.status === selectedStatus
        const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.phone.includes(searchQuery)
        return matchesStatus && matchesSearch
    })

    // Stats
    const stats = {
        pending: sampleOrders.filter(o => o.status === "pending").length,
        processing: sampleOrders.filter(o => o.status === "processing").length,
        shipped: sampleOrders.filter(o => o.status === "shipped").length,
        delivered: sampleOrders.filter(o => o.status === "delivered").length,
    }

    return (
        <div className="flex min-h-screen">
            <AdminSidebar />

            <main className="flex-1 overflow-auto">
                <header className="bg-black/50 border-b border-white/10 px-8 py-4 sticky top-0 z-10 backdrop-blur-xl">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Orders</h1>
                        <p className="text-white/60 text-sm">Manage and process customer orders</p>
                    </div>
                </header>

                <div className="p-8">
                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="card p-4 cursor-pointer hover:border-yellow-500/50" onClick={() => setSelectedStatus("pending")}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-bold text-yellow-500">{stats.pending}</p>
                                    <p className="text-white/60 text-sm">Pending</p>
                                </div>
                                <div className="text-2xl">⏳</div>
                            </div>
                        </div>
                        <div className="card p-4 cursor-pointer hover:border-blue-500/50" onClick={() => setSelectedStatus("processing")}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-bold text-blue-500">{stats.processing}</p>
                                    <p className="text-white/60 text-sm">Processing</p>
                                </div>
                                <div className="text-2xl">📋</div>
                            </div>
                        </div>
                        <div className="card p-4 cursor-pointer hover:border-purple-500/50" onClick={() => setSelectedStatus("shipped")}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-bold text-purple-500">{stats.shipped}</p>
                                    <p className="text-white/60 text-sm">Shipped</p>
                                </div>
                                <div className="text-2xl">🚚</div>
                            </div>
                        </div>
                        <div className="card p-4 cursor-pointer hover:border-green-500/50" onClick={() => setSelectedStatus("delivered")}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-bold text-green-500">{stats.delivered}</p>
                                    <p className="text-white/60 text-sm">Delivered</p>
                                </div>
                                <div className="text-2xl">✅</div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="card p-4 mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Search by Order ID, Customer, or Phone..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="input"
                                />
                            </div>
                            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                                {statuses.map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setSelectedStatus(status)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap capitalize ${selectedStatus === status
                                                ? "bg-orange-500 text-white"
                                                : "bg-white/5 text-white/60 hover:bg-white/10"
                                            }`}
                                    >
                                        {status === "all" ? "All Orders" : status}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Orders Table */}
                    <div className="card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-white/[0.02]">
                                    <tr className="text-left text-white/40 text-sm">
                                        <th className="py-4 px-4 font-medium">Order ID</th>
                                        <th className="py-4 px-4 font-medium">Customer</th>
                                        <th className="py-4 px-4 font-medium">Items</th>
                                        <th className="py-4 px-4 font-medium">Total</th>
                                        <th className="py-4 px-4 font-medium">Payment</th>
                                        <th className="py-4 px-4 font-medium">Status</th>
                                        <th className="py-4 px-4 font-medium">Date</th>
                                        <th className="py-4 px-4 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.map((order) => (
                                        <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                                            <td className="py-4 px-4">
                                                <Link href={`/admin/orders/${order.id}`} className="text-orange-500 hover:text-orange-400 font-medium">
                                                    {order.id}
                                                </Link>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div>
                                                    <p className="text-white">{order.customer}</p>
                                                    <p className="text-white/40 text-sm">{order.phone}</p>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-white">{order.items}</td>
                                            <td className="py-4 px-4 text-orange-500 font-medium">₹{order.total.toLocaleString()}</td>
                                            <td className="py-4 px-4">
                                                <div>
                                                    <p className="text-white uppercase text-sm">{order.paymentMethod}</p>
                                                    <p className={`text-sm capitalize ${paymentStatusColors[order.paymentStatus]}`}>
                                                        {order.paymentStatus}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className={`px-2 py-1 rounded text-sm font-medium capitalize ${statusColors[order.status]}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-white/60 text-sm">{order.date}</td>
                                            <td className="py-4 px-4">
                                                <div className="flex gap-2">
                                                    <Link href={`/admin/orders/${order.id}`} className="text-white/60 hover:text-white p-1" title="View">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    </Link>
                                                    {order.status === "pending" && (
                                                        <button className="text-blue-500 hover:text-blue-400 p-1" title="Process">
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                    {order.status === "processing" && (
                                                        <button className="text-purple-500 hover:text-purple-400 p-1" title="Ship">
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredOrders.length === 0 && (
                            <div className="p-8 text-center">
                                <p className="text-white/60">No orders found</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
