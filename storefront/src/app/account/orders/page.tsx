"use client"

import Link from "next/link"
import { useState } from "react"

// Sample orders data
const sampleOrders = [
    {
        id: "ORD-12345",
        date: "Jan 15, 2026",
        status: "delivered",
        total: 4997,
        items: [
            { title: "Premium LED Headlight Bulb H4", price: 1499, quantity: 2, image: "💡" },
            { title: "7D Car Floor Mats - Swift", price: 1999, quantity: 1, image: "🟫" },
        ],
    },
    {
        id: "ORD-12344",
        date: "Jan 10, 2026",
        status: "shipped",
        total: 3999,
        tracking: "SHP123456789",
        items: [
            { title: "Leather Car Seat Cover Set", price: 3999, quantity: 1, image: "🪑" },
        ],
    },
    {
        id: "ORD-12343",
        date: "Jan 5, 2026",
        status: "processing",
        total: 8999,
        items: [
            { title: "Android Stereo 9-inch HD Touchscreen", price: 8999, quantity: 1, image: "📱" },
        ],
    },
]

const statusColors: Record<string, string> = {
    delivered: "text-green-500 bg-green-500/10",
    shipped: "text-blue-500 bg-blue-500/10",
    processing: "text-yellow-500 bg-yellow-500/10",
    cancelled: "text-red-500 bg-red-500/10",
}

const statusLabels: Record<string, string> = {
    delivered: "Delivered",
    shipped: "Shipped",
    processing: "Processing",
    cancelled: "Cancelled",
}

export default function OrdersPage() {
    const [filter, setFilter] = useState("all")

    const filteredOrders = filter === "all"
        ? sampleOrders
        : sampleOrders.filter(o => o.status === filter)

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="bg-white/[0.02] border-b border-white/10">
                <div className="container-custom py-4">
                    <nav className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-white/60 hover:text-orange-500 transition-colors">Home</Link>
                        <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <Link href="/account" className="text-white/60 hover:text-orange-500 transition-colors">Account</Link>
                        <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-white">Orders</span>
                    </nav>
                </div>
            </div>

            <div className="container-custom py-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-white">My Orders</h1>

                    {/* Filter */}
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {[
                            { value: "all", label: "All" },
                            { value: "processing", label: "Processing" },
                            { value: "shipped", label: "Shipped" },
                            { value: "delivered", label: "Delivered" },
                        ].map(({ value, label }) => (
                            <button
                                key={value}
                                onClick={() => setFilter(value)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${filter === value
                                        ? "bg-orange-500 text-white"
                                        : "bg-white/5 text-white/60 hover:bg-white/10"
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {filteredOrders.length > 0 ? (
                    <div className="space-y-4">
                        {filteredOrders.map((order) => (
                            <div key={order.id} className="card overflow-hidden">
                                {/* Order Header */}
                                <div className="p-4 bg-white/5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <p className="text-white font-medium">{order.id}</p>
                                            <p className="text-white/40 text-sm">{order.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-3 py-1 rounded-lg text-sm font-medium ${statusColors[order.status]}`}>
                                            {statusLabels[order.status]}
                                        </span>
                                        <span className="text-orange-500 font-bold">₹{order.total.toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="p-4 space-y-3">
                                    {order.items.map((item, i) => (
                                        <div key={i} className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-white/5 rounded-xl flex items-center justify-center text-3xl">
                                                {item.image}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-white font-medium">{item.title}</p>
                                                <p className="text-white/40 text-sm">Qty: {item.quantity} × ₹{item.price.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Actions */}
                                <div className="p-4 border-t border-white/10 flex flex-wrap gap-3">
                                    {order.status === "shipped" && order.tracking && (
                                        <button className="btn btn-secondary text-sm py-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            </svg>
                                            Track Shipment
                                        </button>
                                    )}
                                    <button className="btn btn-secondary text-sm py-2">
                                        View Details
                                    </button>
                                    {order.status === "delivered" && (
                                        <button className="btn btn-secondary text-sm py-2">
                                            Buy Again
                                        </button>
                                    )}
                                    {order.status === "delivered" && (
                                        <button className="btn btn-secondary text-sm py-2 text-orange-500">
                                            Write Review
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 mx-auto mb-6 bg-white/5 rounded-full flex items-center justify-center text-5xl">
                            📦
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">No orders found</h2>
                        <p className="text-white/60 mb-6">Start shopping to see your orders here</p>
                        <Link href="/" className="btn btn-primary">
                            Start Shopping
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
