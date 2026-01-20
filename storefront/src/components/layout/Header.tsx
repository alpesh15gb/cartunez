"use client"

import Link from "next/link"
import { useState } from "react"
import SearchAutocomplete from "../ui/SearchAutocomplete"

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)

    return (
        <header className="fixed top-0 left-0 right-0 z-50 glass">
            <div className="container-custom">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-lg">CT</span>
                        </div>
                        <span className="text-xl font-bold text-white hidden sm:block">
                            Car<span className="text-orange-500">Tunez</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-8">
                        <Link href="/shop-by-car" className="text-white/80 hover:text-orange-500 transition-colors font-medium">
                            Shop by Car
                        </Link>
                        <Link href="/categories" className="text-white/80 hover:text-orange-500 transition-colors font-medium">
                            Categories
                        </Link>
                        <Link href="/deals" className="text-white/80 hover:text-orange-500 transition-colors font-medium">
                            Deals
                        </Link>
                        <Link href="/brands" className="text-white/80 hover:text-orange-500 transition-colors font-medium">
                            Brands
                        </Link>
                    </nav>

                    {/* Search Bar - Desktop */}
                    <div className="hidden md:flex flex-1 max-w-md mx-8">
                        <SearchAutocomplete />
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        {/* Mobile Search Toggle */}
                        <button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className="md:hidden p-2 text-white/80 hover:text-orange-500 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>

                        {/* Account */}
                        <Link href="/account" className="p-2 text-white/80 hover:text-orange-500 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </Link>

                        {/* Cart */}
                        <Link href="/cart" className="relative p-2 text-white/80 hover:text-orange-500 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                0
                            </span>
                        </Link>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-2 text-white/80 hover:text-orange-500 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Search */}
                {isSearchOpen && (
                    <div className="md:hidden pb-4">
                        <input
                            type="text"
                            placeholder="Search car accessories..."
                            className="input"
                            autoFocus
                        />
                    </div>
                )}

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <nav className="lg:hidden py-4 border-t border-white/10">
                        <div className="flex flex-col gap-4">
                            <Link href="/shop-by-car" className="text-white/80 hover:text-orange-500 transition-colors font-medium py-2">
                                Shop by Car
                            </Link>
                            <Link href="/categories" className="text-white/80 hover:text-orange-500 transition-colors font-medium py-2">
                                Categories
                            </Link>
                            <Link href="/deals" className="text-white/80 hover:text-orange-500 transition-colors font-medium py-2">
                                Deals
                            </Link>
                            <Link href="/brands" className="text-white/80 hover:text-orange-500 transition-colors font-medium py-2">
                                Brands
                            </Link>
                        </div>
                    </nav>
                )}
            </div>
        </header>
    )
}
