"use client"

import { useState } from "react"
import Link from "next/link"

// Address Form Component
function AddressForm({
    address,
    onChange,
}: {
    address: Record<string, string>
    onChange: (field: string, value: string) => void
}) {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-white/60 text-sm mb-2">First Name *</label>
                    <input
                        type="text"
                        value={address.firstName}
                        onChange={(e) => onChange("firstName", e.target.value)}
                        className="input"
                        required
                    />
                </div>
                <div>
                    <label className="block text-white/60 text-sm mb-2">Last Name *</label>
                    <input
                        type="text"
                        value={address.lastName}
                        onChange={(e) => onChange("lastName", e.target.value)}
                        className="input"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block text-white/60 text-sm mb-2">Phone Number *</label>
                <input
                    type="tel"
                    value={address.phone}
                    onChange={(e) => onChange("phone", e.target.value)}
                    className="input"
                    placeholder="10-digit mobile number"
                    required
                />
            </div>

            <div>
                <label className="block text-white/60 text-sm mb-2">Email (Optional)</label>
                <input
                    type="email"
                    value={address.email}
                    onChange={(e) => onChange("email", e.target.value)}
                    className="input"
                    placeholder="For order updates"
                />
            </div>

            <div>
                <label className="block text-white/60 text-sm mb-2">Address Line 1 *</label>
                <input
                    type="text"
                    value={address.line1}
                    onChange={(e) => onChange("line1", e.target.value)}
                    className="input"
                    placeholder="House/Flat number, Building name"
                    required
                />
            </div>

            <div>
                <label className="block text-white/60 text-sm mb-2">Address Line 2</label>
                <input
                    type="text"
                    value={address.line2}
                    onChange={(e) => onChange("line2", e.target.value)}
                    className="input"
                    placeholder="Street, Area, Landmark"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-white/60 text-sm mb-2">City *</label>
                    <input
                        type="text"
                        value={address.city}
                        onChange={(e) => onChange("city", e.target.value)}
                        className="input"
                        required
                    />
                </div>
                <div>
                    <label className="block text-white/60 text-sm mb-2">Pincode *</label>
                    <input
                        type="text"
                        value={address.pincode}
                        onChange={(e) => onChange("pincode", e.target.value)}
                        className="input"
                        maxLength={6}
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block text-white/60 text-sm mb-2">State *</label>
                <select
                    value={address.state}
                    onChange={(e) => onChange("state", e.target.value)}
                    className="input"
                    required
                >
                    <option value="">Select State</option>
                    <option value="DL">Delhi</option>
                    <option value="MH">Maharashtra</option>
                    <option value="KA">Karnataka</option>
                    <option value="TN">Tamil Nadu</option>
                    <option value="UP">Uttar Pradesh</option>
                    <option value="GJ">Gujarat</option>
                    <option value="RJ">Rajasthan</option>
                    <option value="WB">West Bengal</option>
                    <option value="AP">Andhra Pradesh</option>
                    <option value="TS">Telangana</option>
                    <option value="KL">Kerala</option>
                    <option value="PB">Punjab</option>
                    <option value="HR">Haryana</option>
                </select>
            </div>

            <div>
                <label className="block text-white/60 text-sm mb-2">GSTIN (Optional - for business invoice)</label>
                <input
                    type="text"
                    value={address.gstin}
                    onChange={(e) => onChange("gstin", e.target.value.toUpperCase())}
                    className="input"
                    placeholder="22AAAAA0000A1Z5"
                    maxLength={15}
                />
            </div>
        </div>
    )
}

// Payment Option Component
function PaymentOption({
    id,
    name,
    description,
    icon,
    selected,
    onSelect,
    disabled,
    badge,
}: {
    id: string
    name: string
    description: string
    icon: React.ReactNode
    selected: boolean
    onSelect: () => void
    disabled?: boolean
    badge?: string
}) {
    return (
        <button
            onClick={onSelect}
            disabled={disabled}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all ${selected
                    ? "border-orange-500 bg-orange-500/10"
                    : disabled
                        ? "border-white/5 bg-white/[0.02] opacity-50 cursor-not-allowed"
                        : "border-white/10 hover:border-white/20 bg-white/[0.02]"
                }`}
        >
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selected ? "bg-orange-500/20" : "bg-white/5"}`}>
                    {icon}
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <span className={`font-medium ${selected ? "text-orange-500" : "text-white"}`}>{name}</span>
                        {badge && (
                            <span className="px-2 py-0.5 bg-green-500/20 text-green-500 text-xs font-medium rounded">
                                {badge}
                            </span>
                        )}
                    </div>
                    <p className="text-white/50 text-sm">{description}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected ? "border-orange-500" : "border-white/20"
                    }`}>
                    {selected && <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />}
                </div>
            </div>
        </button>
    )
}

// Order Item Summary
function OrderItemSummary({ items }: { items: Array<{ title: string; quantity: number; price: number; image: string }> }) {
    return (
        <div className="space-y-3">
            {items.map((item, i) => (
                <div key={i} className="flex gap-3">
                    <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                        {item.image}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-white text-sm line-clamp-1">{item.title}</p>
                        <p className="text-white/50 text-sm">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-white font-medium">₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
            ))}
        </div>
    )
}

export default function CheckoutPage() {
    const [step, setStep] = useState(1)
    const [address, setAddress] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        line1: "",
        line2: "",
        city: "",
        pincode: "",
        state: "",
        gstin: "",
    })
    const [paymentMethod, setPaymentMethod] = useState("razorpay")
    const [isProcessing, setIsProcessing] = useState(false)

    // Sample cart data
    const cartItems = [
        { title: "Premium LED Headlight Bulb H4 - 6000K", price: 1499, quantity: 2, image: "💡" },
        { title: "Leather Car Seat Cover Set", price: 3999, quantity: 1, image: "🪑" },
    ]

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const discount = 700 // From coupon
    const shipping = 0 // Free shipping
    const codFee = paymentMethod === "cod" ? 40 : 0
    const total = subtotal - discount + shipping + codFee

    const handleAddressChange = (field: string, value: string) => {
        setAddress((prev) => ({ ...prev, [field]: value }))
    }

    const handlePlaceOrder = () => {
        setIsProcessing(true)
        // Simulate order processing
        setTimeout(() => {
            window.location.href = "/order/success"
        }, 2000)
    }

    const isAddressValid = address.firstName && address.lastName && address.phone && address.line1 && address.city && address.pincode && address.state

    return (
        <div className="min-h-screen">
            {/* Breadcrumb */}
            <div className="bg-white/[0.02] border-b border-white/10">
                <div className="container-custom py-4">
                    <nav className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-white/60 hover:text-orange-500 transition-colors">Home</Link>
                        <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <Link href="/cart" className="text-white/60 hover:text-orange-500 transition-colors">Cart</Link>
                        <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-white">Checkout</span>
                    </nav>
                </div>
            </div>

            <div className="container-custom py-8">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">Checkout</h1>

                {/* Progress Steps */}
                <div className="flex items-center gap-4 mb-8">
                    <div className={`flex items-center gap-2 ${step >= 1 ? "text-orange-500" : "text-white/40"}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-orange-500 text-white" : "bg-white/10"}`}>1</div>
                        <span className="hidden sm:block font-medium">Address</span>
                    </div>
                    <div className={`flex-1 h-0.5 ${step >= 2 ? "bg-orange-500" : "bg-white/10"}`} />
                    <div className={`flex items-center gap-2 ${step >= 2 ? "text-orange-500" : "text-white/40"}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-orange-500 text-white" : "bg-white/10"}`}>2</div>
                        <span className="hidden sm:block font-medium">Payment</span>
                    </div>
                    <div className={`flex-1 h-0.5 ${step >= 3 ? "bg-orange-500" : "bg-white/10"}`} />
                    <div className={`flex items-center gap-2 ${step >= 3 ? "text-orange-500" : "text-white/40"}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? "bg-orange-500 text-white" : "bg-white/10"}`}>3</div>
                        <span className="hidden sm:block font-medium">Confirm</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Step 1: Address */}
                        {step === 1 && (
                            <div className="card p-6">
                                <h2 className="text-xl font-bold text-white mb-6">Shipping Address</h2>
                                <AddressForm address={address} onChange={handleAddressChange} />
                                <button
                                    onClick={() => setStep(2)}
                                    disabled={!isAddressValid}
                                    className="btn btn-primary w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Continue to Payment
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            </div>
                        )}

                        {/* Step 2: Payment */}
                        {step === 2 && (
                            <div className="card p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-white">Payment Method</h2>
                                    <button onClick={() => setStep(1)} className="text-orange-500 text-sm hover:text-orange-400">
                                        Edit Address
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    <PaymentOption
                                        id="razorpay"
                                        name="Pay Online"
                                        description="UPI, Cards, Netbanking, Wallets"
                                        icon={<svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>}
                                        selected={paymentMethod === "razorpay"}
                                        onSelect={() => setPaymentMethod("razorpay")}
                                        badge="Recommended"
                                    />

                                    <PaymentOption
                                        id="cod"
                                        name="Cash on Delivery"
                                        description={`Pay when you receive • ₹${codFee} extra fee`}
                                        icon={<svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                                        selected={paymentMethod === "cod"}
                                        onSelect={() => setPaymentMethod("cod")}
                                    />
                                </div>

                                <div className="flex gap-4 mt-6">
                                    <button onClick={() => setStep(1)} className="btn btn-secondary flex-1">
                                        Back
                                    </button>
                                    <button onClick={() => setStep(3)} className="btn btn-primary flex-1">
                                        Review Order
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Confirm */}
                        {step === 3 && (
                            <div className="space-y-6">
                                {/* Address Summary */}
                                <div className="card p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-lg font-bold text-white">Shipping Address</h2>
                                        <button onClick={() => setStep(1)} className="text-orange-500 text-sm hover:text-orange-400">Edit</button>
                                    </div>
                                    <div className="text-white/80">
                                        <p className="font-medium">{address.firstName} {address.lastName}</p>
                                        <p>{address.line1}</p>
                                        {address.line2 && <p>{address.line2}</p>}
                                        <p>{address.city}, {address.state} - {address.pincode}</p>
                                        <p>Phone: {address.phone}</p>
                                    </div>
                                </div>

                                {/* Payment Summary */}
                                <div className="card p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-lg font-bold text-white">Payment Method</h2>
                                        <button onClick={() => setStep(2)} className="text-orange-500 text-sm hover:text-orange-400">Edit</button>
                                    </div>
                                    <p className="text-white/80">
                                        {paymentMethod === "razorpay" ? "Pay Online (UPI/Cards/Netbanking)" : "Cash on Delivery"}
                                    </p>
                                </div>

                                {/* Place Order */}
                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={isProcessing}
                                    className="btn btn-primary w-full py-4 text-lg disabled:opacity-50"
                                >
                                    {isProcessing ? (
                                        <>
                                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            {paymentMethod === "razorpay" ? "Pay ₹" + total.toLocaleString() : "Place Order (COD)"}
                                        </>
                                    )}
                                </button>

                                <p className="text-white/40 text-sm text-center">
                                    By placing this order, you agree to our Terms & Conditions
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div>
                        <div className="card p-6 sticky top-24">
                            <h2 className="text-lg font-bold text-white mb-4">Order Summary</h2>

                            <OrderItemSummary items={cartItems} />

                            <div className="border-t border-white/10 mt-4 pt-4 space-y-2">
                                <div className="flex justify-between text-white/60 text-sm">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-green-500 text-sm">
                                    <span>Discount (SAVE10)</span>
                                    <span>-₹{discount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-white/60 text-sm">
                                    <span>Shipping</span>
                                    <span className="text-green-500">FREE</span>
                                </div>
                                {codFee > 0 && (
                                    <div className="flex justify-between text-white/60 text-sm">
                                        <span>COD Fee</span>
                                        <span>₹{codFee}</span>
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-white/10 mt-4 pt-4">
                                <div className="flex justify-between">
                                    <span className="text-lg font-bold text-white">Total</span>
                                    <span className="text-xl font-bold text-orange-500">₹{total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
