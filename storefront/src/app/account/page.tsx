"use client"

import { useState } from "react"
import Link from "next/link"

// OTP Login Component
function OtpLogin({ onLogin }: { onLogin: (user: any) => void }) {
    const [phone, setPhone] = useState("")
    const [otp, setOtp] = useState("")
    const [step, setStep] = useState<"phone" | "otp">("phone")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSendOtp = async () => {
        if (phone.length !== 10) {
            setError("Please enter a valid 10-digit phone number")
            return
        }

        setIsLoading(true)
        setError("")

        // Simulate API call
        setTimeout(() => {
            setStep("otp")
            setIsLoading(false)
        }, 1000)
    }

    const handleVerifyOtp = async () => {
        if (otp.length !== 6) {
            setError("Please enter a valid 6-digit OTP")
            return
        }

        setIsLoading(true)
        setError("")

        // Simulate API call
        setTimeout(() => {
            onLogin({
                id: "user123",
                phone,
                name: "John Doe",
                email: "john@example.com",
            })
            setIsLoading(false)
        }, 1000)
    }

    return (
        <div className="card p-8 max-w-md mx-auto">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-white">Login / Sign Up</h2>
                <p className="text-white/60 mt-2">Enter your phone number to continue</p>
            </div>

            {step === "phone" ? (
                <div className="space-y-4">
                    <div>
                        <label className="block text-white/60 text-sm mb-2">Phone Number</label>
                        <div className="flex gap-2">
                            <div className="w-20 bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white flex items-center justify-center">
                                +91
                            </div>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                                placeholder="Enter 10-digit number"
                                className="input flex-1"
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                        onClick={handleSendOtp}
                        disabled={isLoading || phone.length !== 10}
                        className="btn btn-primary w-full disabled:opacity-50"
                    >
                        {isLoading ? "Sending OTP..." : "Send OTP"}
                    </button>

                    <p className="text-white/40 text-xs text-center">
                        By continuing, you agree to our Terms of Service and Privacy Policy
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    <div>
                        <label className="block text-white/60 text-sm mb-2">Enter OTP</label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                            placeholder="6-digit OTP"
                            className="input text-center text-xl tracking-widest"
                            maxLength={6}
                        />
                        <p className="text-white/40 text-sm mt-2">
                            OTP sent to +91 {phone.slice(0, 2)}****{phone.slice(-2)}
                        </p>
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                        onClick={handleVerifyOtp}
                        disabled={isLoading || otp.length !== 6}
                        className="btn btn-primary w-full disabled:opacity-50"
                    >
                        {isLoading ? "Verifying..." : "Verify OTP"}
                    </button>

                    <button
                        onClick={() => setStep("phone")}
                        className="w-full text-center text-orange-500 text-sm hover:text-orange-400"
                    >
                        Change phone number
                    </button>
                </div>
            )}
        </div>
    )
}

// Account Dashboard
function AccountDashboard({ user, onLogout }: { user: any; onLogout: () => void }) {
    const menuItems = [
        { label: "My Orders", href: "/account/orders", icon: "📦", count: 3 },
        { label: "Wishlist", href: "/account/wishlist", icon: "❤️", count: 5 },
        { label: "Saved Vehicles", href: "/account/vehicles", icon: "🚗", count: 2 },
        { label: "Addresses", href: "/account/addresses", icon: "📍" },
        { label: "Payment Methods", href: "/account/payments", icon: "💳" },
        { label: "Settings", href: "/account/settings", icon: "⚙️" },
    ]

    return (
        <div className="container-custom py-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">My Account</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                    <div className="card p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center text-2xl">
                                👤
                            </div>
                            <div>
                                <h2 className="text-white font-semibold text-lg">{user.name || "Welcome!"}</h2>
                                <p className="text-white/60 text-sm">+91 {user.phone}</p>
                                {user.email && <p className="text-white/40 text-sm">{user.email}</p>}
                            </div>
                        </div>

                        <Link href="/account/profile" className="btn btn-secondary w-full text-sm">
                            Edit Profile
                        </Link>

                        <button
                            onClick={onLogout}
                            className="w-full mt-4 text-red-500 text-sm hover:text-red-400 transition-colors"
                        >
                            Logout
                        </button>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="card p-4 text-center">
                            <p className="text-2xl font-bold text-orange-500">3</p>
                            <p className="text-white/60 text-sm">Orders</p>
                        </div>
                        <div className="card p-4 text-center">
                            <p className="text-2xl font-bold text-orange-500">5</p>
                            <p className="text-white/60 text-sm">Wishlist</p>
                        </div>
                    </div>
                </div>

                {/* Menu Items */}
                <div className="lg:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {menuItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="card card-hover p-4 flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-2xl group-hover:bg-orange-500/20 transition-colors">
                                        {item.icon}
                                    </div>
                                    <span className="text-white font-medium group-hover:text-orange-400 transition-colors">
                                        {item.label}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {item.count !== undefined && (
                                        <span className="bg-orange-500/20 text-orange-500 text-sm font-medium px-2 py-1 rounded-lg">
                                            {item.count}
                                        </span>
                                    )}
                                    <svg className="w-5 h-5 text-white/40 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Recent Orders */}
                    <div className="card p-6 mt-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">Recent Orders</h3>
                            <Link href="/account/orders" className="text-orange-500 text-sm hover:text-orange-400">
                                View All
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {[
                                { id: "ORD-12345", date: "Jan 15, 2026", status: "Delivered", total: 4997, items: 3 },
                                { id: "ORD-12344", date: "Jan 10, 2026", status: "Shipped", total: 2499, items: 1 },
                            ].map((order) => (
                                <Link
                                    key={order.id}
                                    href={`/account/orders/${order.id}`}
                                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                                >
                                    <div>
                                        <p className="text-white font-medium">{order.id}</p>
                                        <p className="text-white/40 text-sm">{order.date} • {order.items} items</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-orange-500 font-medium">₹{order.total.toLocaleString()}</p>
                                        <span className={`text-sm ${order.status === "Delivered" ? "text-green-500" : "text-blue-500"}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function AccountPage() {
    const [user, setUser] = useState<any>(null)

    // Check for saved user on mount
    // In production, check session/JWT token

    const handleLogin = (userData: any) => {
        setUser(userData)
        // Save to session
    }

    const handleLogout = () => {
        setUser(null)
        // Clear session
    }

    return (
        <div className="min-h-screen py-8 md:py-16">
            {user ? (
                <AccountDashboard user={user} onLogout={handleLogout} />
            ) : (
                <OtpLogin onLogin={handleLogin} />
            )}
        </div>
    )
}
