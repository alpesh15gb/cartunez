'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X, Search, ShoppingCart, User, Heart, Package, Truck, Home } from 'lucide-react';

export default function Navbar() {
    const { totalItems } = useCart();
    const [mounted, setMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
            setIsMenuOpen(false);
        }
    };

    const navLinks = [
        { label: 'Home', href: '/', icon: <Home size={18} /> },
        { label: 'Interior', href: '/shop?category=interior', icon: <Package size={18} /> },
        { label: 'Exterior', href: '/shop?category=exterior', icon: <Package size={18} /> },
        { label: 'Electronics', href: '/shop?category=electronics', icon: <Package size={18} /> },
        { label: 'Performance', href: '/shop?category=performance', icon: <Package size={18} /> },
        { label: 'All Categories', href: '/categories', icon: <Package size={18} /> },
        { label: 'Wishlist', href: '/wishlist', icon: <Heart size={18} /> },
        { label: 'Orders', href: '/orders', icon: <Truck size={18} /> },
        { label: 'Track Order', href: '/track', icon: <Truck size={18} /> },
    ];

    return (
        <header className="bg-white border-b border-border sticky top-0 z-50">
            {/* Main Header */}
            <div className="container mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
                {/* Mobile Menu Toggle */}
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden p-2 -ml-2 text-secondary hover:text-primary transition-colors"
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Logo */}
                <Link href="/" className="flex items-center group flex-1 md:flex-initial justify-center md:justify-start">
                    <Image
                        src="/logo.png"
                        alt="CarTunez Logo"
                        width={450}
                        height={180}
                        className="h-10 md:h-24 w-auto object-contain"
                        priority
                    />
                </Link>

                {/* Search Bar (Desktop) */}
                <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8 font-medium">
                    <div className="relative w-full">
                        <input
                            type="text"
                            placeholder="Search components or brands..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-card border border-border px-6 py-2.5 rounded-full text-sm outline-none focus:border-primary transition-all pr-12"
                        />
                        <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors">
                            <Search size={18} />
                        </button>
                    </div>
                </form>

                {/* Actions */}
                <div className="flex items-center space-x-4 md:space-x-8 text-[11px] font-black uppercase tracking-widest">
                    <Link href="/login" className="hidden sm:flex flex-col items-center group">
                        <User size={20} className="group-hover:scale-110 transition-transform group-hover:text-primary" />
                        <span className="hover:text-primary transition-colors mt-1">Account</span>
                    </Link>
                    <Link href="/cart" className="flex flex-col items-center group relative">
                        <ShoppingCart size={20} className="group-hover:scale-110 transition-transform group-hover:text-primary" />
                        <span className="hidden sm:inline hover:text-primary transition-colors mt-1">Cart</span>
                        {mounted && totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 bg-primary text-white text-[9px] rounded-full min-w-4 h-4 px-1 flex items-center justify-center font-bold">
                                {totalItems}
                            </span>
                        )}
                    </Link>
                </div>
            </div>

            {/* Desktop Nav Menu */}
            <nav className="hidden md:block bg-secondary text-white">
                <div className="container mx-auto px-6 flex space-x-8 py-3 text-[10px] font-black uppercase tracking-[0.2em]">
                    {navLinks.slice(0, 8).map((link) => (
                        <Link 
                            key={link.href} 
                            href={link.href} 
                            className="hover:text-primary transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link href="/track" className="ml-auto hover:text-primary transition-colors flex items-center gap-2">
                        <Truck size={14} className="text-primary" />
                        TRACK YOUR BUNDLE
                    </Link>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div 
                className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsMenuOpen(false)}
            />

            {/* Mobile Slide-out Drawer */}
            <div className={`fixed top-0 left-0 bottom-0 z-50 w-[80%] max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Drawer Header */}
                    <div className="p-6 border-b border-border flex items-center justify-between">
                        <span className="text-lg font-black uppercase italic italic tracking-tighter">
                            Navigation <span className="text-primary italic">Menu</span>
                        </span>
                        <button onClick={() => setIsMenuOpen(false)} className="p-2 text-muted hover:text-primary">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Mobile Search */}
                    <div className="p-6 border-b border-border">
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-card border border-border px-5 py-3 rounded-xl text-sm outline-none focus:border-primary transition-all pr-12"
                            />
                            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors">
                                <Search size={20} />
                            </button>
                        </form>
                    </div>

                    {/* Mobile Navigation Links */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-4">Shop Collections</p>
                        {navLinks.map((link) => (
                            <Link 
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center space-x-4 p-4 rounded-xl hover:bg-card group transition-colors"
                            >
                                <span className="text-muted group-hover:text-primary transition-colors">
                                    {link.icon}
                                </span>
                                <span className="text-sm font-bold uppercase tracking-wider group-hover:text-primary transition-colors">
                                    {link.label}
                                </span>
                            </Link>
                        ))}
                    </div>

                    {/* Drawer Footer */}
                    <div className="p-6 border-t border-border bg-card">
                        <Link 
                            href="/login" 
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center justify-center space-x-3 w-full bg-secondary text-white py-4 rounded-xl font-black uppercase text-xs tracking-[0.2em] hover:bg-primary hover:text-white transition-all active:scale-95"
                        >
                            <User size={18} />
                            <span>Member Account</span>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
