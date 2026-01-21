"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

// Vehicle Selector Component
function VehicleSelector() {
  const [selectedMake, setSelectedMake] = useState("")
  const [selectedModel, setSelectedModel] = useState("")
  const [selectedYear, setSelectedYear] = useState("")

  // Sample data - in production, fetch from API
  const makes = [
    { id: "maruti", name: "Maruti Suzuki" },
    { id: "hyundai", name: "Hyundai" },
    { id: "tata", name: "Tata Motors" },
    { id: "mahindra", name: "Mahindra" },
    { id: "kia", name: "Kia" },
    { id: "toyota", name: "Toyota" },
    { id: "honda", name: "Honda" },
  ]

  const models: Record<string, string[]> = {
    maruti: ["Swift", "Baleno", "Dzire", "Brezza", "Grand Vitara", "Ertiga"],
    hyundai: ["Creta", "Venue", "i20", "Verna", "Alcazar", "Tucson"],
    tata: ["Nexon", "Punch", "Harrier", "Safari", "Altroz", "Tiago"],
    mahindra: ["Thar", "Scorpio N", "XUV700", "XUV300", "Bolero"],
    kia: ["Seltos", "Sonet", "Carens", "EV6"],
    toyota: ["Fortuner", "Innova Crysta", "Hyryder", "Glanza"],
    honda: ["City", "Amaze", "Elevate"],
  }

  const years = ["2024", "2023", "2022", "2021", "2020", "2019", "2018"]

  return (
    <div className="card p-6 md:p-8">
      <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        Find Parts for Your Car
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <select
          value={selectedMake}
          onChange={(e) => {
            setSelectedMake(e.target.value)
            setSelectedModel("")
          }}
          className="input"
        >
          <option value="">Select Make</option>
          {makes.map((make) => (
            <option key={make.id} value={make.id}>
              {make.name}
            </option>
          ))}
        </select>

        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="input"
          disabled={!selectedMake}
        >
          <option value="">Select Model</option>
          {selectedMake &&
            models[selectedMake]?.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
        </select>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="input"
          disabled={!selectedModel}
        >
          <option value="">Select Year</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <button
        disabled={!selectedMake || !selectedModel || !selectedYear}
        className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Find Compatible Parts
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>
    </div>
  )
}

// Category Card
function CategoryCard({ name, icon, count, href }: { name: string; icon: string; count: number; href: string }) {
  return (
    <Link href={href} className="card card-hover p-6 text-center group">
      <div className="w-16 h-16 mx-auto mb-4 bg-orange-500/10 rounded-2xl flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
        <span className="text-3xl">{icon}</span>
      </div>
      <h3 className="text-white font-semibold mb-1">{name}</h3>
      <p className="text-white/50 text-sm">{count}+ Products</p>
    </Link>
  )
}

// Product Card
function ProductCard({ title, price, originalPrice, image, rating }: {
  title: string
  price: number
  originalPrice?: number
  image: string
  rating: number
}) {
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

  return (
    <div className="card card-hover group">
      <div className="relative aspect-square bg-white/5 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-6xl">
          {image}
        </div>
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
            {discount}% OFF
          </span>
        )}
        <button className="absolute top-3 right-3 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-orange-500">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-4 h-4 ${i < rating ? "text-yellow-400" : "text-white/20"}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-white/50 text-xs ml-1">(42)</span>
        </div>
        <h3 className="text-white font-medium mb-2 line-clamp-2">{title}</h3>
        <div className="flex items-center gap-2">
          <span className="text-orange-500 font-bold text-lg">₹{price.toLocaleString()}</span>
          {originalPrice && (
            <span className="text-white/40 line-through text-sm">₹{originalPrice.toLocaleString()}</span>
          )}
        </div>
        <button className="btn btn-secondary w-full mt-4 text-sm py-2">
          Add to Cart
        </button>
      </div>
    </div>
  )
}

// Brand Logo
function BrandLogo({ name }: { name: string }) {
  return (
    <div className="card card-hover p-6 flex items-center justify-center h-24">
      <span className="text-white/60 font-semibold text-lg">{name}</span>
    </div>
  )
}

export default function Home() {
  const categories = [
    { name: "Lighting", icon: "💡", count: 250, href: "/categories/lighting" },
    { name: "Seat Covers", icon: "🪑", count: 180, href: "/categories/seat-covers" },
    { name: "Audio Systems", icon: "🔊", count: 120, href: "/categories/audio" },
    { name: "Floor Mats", icon: "🟫", count: 200, href: "/categories/floor-mats" },
    { name: "Exterior", icon: "🚗", count: 150, href: "/categories/exterior" },
    { name: "Interior", icon: "🎨", count: 300, href: "/categories/interior" },
  ]

  const products = [
    { title: "Premium LED Headlight Bulb H4 - 6000K Cool White", price: 1499, originalPrice: 2499, image: "💡", rating: 5 },
    { title: "Leather Car Seat Cover Set - Universal Fit", price: 3999, originalPrice: 5999, image: "🪑", rating: 4 },
    { title: "7D Car Floor Mats - Custom Fit for Swift", price: 2499, originalPrice: 3499, image: "🟫", rating: 5 },
    { title: "Android Stereo 9-inch HD Touchscreen", price: 8999, originalPrice: 12999, image: "📱", rating: 4 },
  ]

  const brands = ["Maruti Suzuki", "Hyundai", "Tata", "Mahindra", "Kia", "Toyota"]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-500/10 rounded-full blur-3xl" />

        <div className="container-custom relative py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <div className="inline-block px-4 py-2 bg-orange-500/10 rounded-full border border-orange-500/20">
                <span className="text-orange-500 text-sm font-medium">🚗 India&apos;s #1 Car Accessories Store</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Premium Accessories for{" "}
                <span className="text-gradient">Your Car</span>
              </h1>
              <p className="text-lg text-white/60 max-w-lg">
                Shop by your car model for guaranteed fitment. LED lights, seat covers, audio systems, and 10,000+ more products with free shipping.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/shop-by-car" className="btn btn-primary">
                  Shop by Car
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
                <Link href="/categories" className="btn btn-secondary">
                  Browse Categories
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-6 pt-4">
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Free Shipping ₹999+
                </div>
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  7-Day Returns
                </div>
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  COD Available
                </div>
              </div>
            </div>

            <div className="animate-slide-up">
              <VehicleSelector />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section">
        <div className="container-custom">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Shop by Category</h2>
              <p className="text-white/60">Browse our wide range of car accessories</p>
            </div>
            <Link href="/categories" className="text-orange-500 hover:text-orange-400 font-medium hidden md:flex items-center gap-2">
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <CategoryCard key={category.name} {...category} />
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="section bg-white/[0.02]">
        <div className="container-custom">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Best Sellers</h2>
              <p className="text-white/60">Top-rated products loved by customers</p>
            </div>
            <Link href="/bestsellers" className="text-orange-500 hover:text-orange-400 font-medium hidden md:flex items-center gap-2">
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product, i) => (
              <ProductCard key={i} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Brand Section */}
      <section className="section">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Shop by Car Brand</h2>
            <p className="text-white/60">Find parts specific to your vehicle manufacturer</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brands.map((brand) => (
              <BrandLogo key={brand} name={brand} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Banner */}
      <section className="section bg-gradient-to-r from-orange-500/10 to-transparent">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-orange-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">Guaranteed Fitment</h3>
                <p className="text-white/60 text-sm">100% compatible with your car</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-orange-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">Fast Delivery</h3>
                <p className="text-white/60 text-sm">2-5 days across India</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-orange-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">Secure Payment</h3>
                <p className="text-white/60 text-sm">Razorpay protected checkout</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-orange-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">24/7 Support</h3>
                <p className="text-white/60 text-sm">Expert help anytime</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
