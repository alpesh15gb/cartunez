'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const { totalItems } = useCart();
    const [mounted, setMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <header className="bg-white border-b border-border sticky top-0 z-50">
            {/* Main Header */}
            <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2 group">
                    <Image
                        src="/logo.png"
                        alt="CarTunez Logo"
                        width={450}
                        height={180}
                        className="h-24 w-auto object-contain"
                        priority
                    />
                </Link>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-12">
                    <div className="relative w-full">
                        <input
                            type="text"
                            placeholder="Search components, brands, parts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-card border border-border px-6 py-2.5 rounded-full text-sm outline-none focus:border-primary transition-colors"
                        />
                        <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-primary">
                            🔍
                        </button>
                    </div>
                </form>

                {/* Actions */}
                <div className="flex items-center space-x-8 text-[11px] font-black uppercase tracking-widest">
                    <Link href="/login" className="flex flex-col items-center group">
                        <span className="text-lg group-hover:scale-110 transition-transform">👤</span>
                        <span className="hover:text-primary transition-colors mt-1">Account</span>
                    </Link>
                    <Link href="/cart" className="flex flex-col items-center group relative">
                        <span className="text-lg group-hover:scale-110 transition-transform">🛒</span>
                        <span className="hover:text-primary transition-colors mt-1">Cart</span>
                        {mounted && totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 bg-primary text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                                {totalItems}
                            </span>
                        )}
                    </Link>
                </div>
            </div>

            {/* Nav Menu */}
            <nav className="bg-secondary text-white">
                <div className="container mx-auto px-6 flex space-x-10 py-3 text-[11px] font-black uppercase tracking-[0.2em]">
                    <Link href="/" className="hover:text-primary transition-colors decoration-2 underline-offset-8">Home</Link>
                    <Link href="/shop?category=interior" className="hover:text-primary transition-colors">Interior</Link>
                    <Link href="/shop?category=exterior" className="hover:text-primary transition-colors">Exterior</Link>
                    <Link href="/shop?category=electronics" className="hover:text-primary transition-colors">Electronics</Link>
                    <Link href="/shop?category=performance" className="hover:text-primary transition-colors">Performance</Link>
                    <Link href="/categories" className="hover:text-primary transition-colors">All Categories</Link>
                    <Link href="/wishlist" className="hover:text-primary transition-colors">Wishlist</Link>
                    <Link href="/orders" className="hover:text-primary transition-colors">Orders</Link>
                    <Link href="/track" className="hover:text-primary transition-colors">Track</Link>
                </div>
            </nav>
        </header>
    );
}
