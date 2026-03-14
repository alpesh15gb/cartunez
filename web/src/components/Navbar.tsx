'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X, Search, ShoppingCart, User, Heart, Package, Truck, Home } from 'lucide-react';

export default function Navbar() {
    const { totalItems } = useCart();
    const { user, logout, isAuthenticated } = useAuth();
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
        { label: 'Home', href: '/' },
        { label: 'Performance', href: '/shop?category=Performance' },
        { label: 'Interior', href: '/shop?category=Interior' },
        { label: 'Categories', href: '/categories' },
    ];

    return (
        <header className="bg-white border-b border-border sticky top-0 z-50">
            {/* Main Header */}
            <div className="container mx-auto px-4 md:px-6 h-20 md:h-28 flex items-center justify-between relative">
                
                {/* 1. Left Section: Navigation Menu (Desktop) / Hamburger (Mobile) */}
                <div className="flex items-center flex-1">
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 -ml-2 text-secondary hover:text-primary transition-colors"
                    >
                        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>

                    <nav className="hidden md:flex items-center space-x-6 text-[10px] font-black uppercase tracking-widest text-[#1a1a1a]">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.href} 
                                href={link.href} 
                                className="hover:text-primary transition-colors hover:underline decoration-primary decoration-2 underline-offset-4"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* 2. Center Section: Logo */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <Link href="/" className="flex items-center group">
                        <div className="relative h-16 w-56 md:h-24 md:w-80">
                            <Image
                                src="/logo.png"
                                alt="CarTunez"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </Link>
                </div>

                {/* 3. Right Section: Utility Icons */}
                <div className="flex items-center justify-end flex-1 space-x-4 md:space-x-6 text-[#1a1a1a]">
                    <form onSubmit={handleSearch} className="hidden lg:flex items-center relative">
                        <input
                            type="text"
                            placeholder="Search Assets..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-gray-50 border border-gray-100 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest outline-none focus:ring-2 ring-primary/10 transition-all w-48 focus:w-64"
                        />
                        <button type="submit" className="absolute right-3 text-gray-400 hover:text-primary">
                            <Search size={14} />
                        </button>
                    </form>

                    <button 
                        onClick={() => setIsMenuOpen(true)}
                        className="lg:hidden p-1 hover:text-primary transition-colors"
                    >
                        <Search size={22} strokeWidth={1.5} />
                    </button>
                    
                    <Link href="/cart" className="p-1 relative hover:text-primary transition-colors">
                        <ShoppingCart size={22} strokeWidth={1.5} />
                        {mounted && totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 bg-primary text-white text-[8px] rounded-full min-w-4 h-4 px-1 flex items-center justify-center font-bold">
                                {totalItems}
                            </span>
                        )}
                    </Link>

                    {isAuthenticated ? (
                        <Link href={user?.role === 'ADMIN' ? '/admin' : '/profile'} className="p-1 hover:text-primary transition-colors">
                            <User size={22} strokeWidth={1.5} />
                        </Link>
                    ) : (
                        <Link href="/login" className="p-1 hover:text-primary transition-colors">
                            <User size={22} strokeWidth={1.5} />
                        </Link>
                    )}
                </div>
            </div>

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
                        <span className="text-lg font-black uppercase italic tracking-tighter">
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
                                <span className="text-sm font-bold uppercase tracking-wider group-hover:text-primary transition-colors">
                                    {link.label}
                                </span>
                            </Link>
                        ))}
                    </div>

                    {/* Drawer Footer */}
                    <div className="p-6 border-t border-border bg-card">
                        {isAuthenticated ? (
                            <button 
                                onClick={() => { logout(); setIsMenuOpen(false); }}
                                className="flex items-center justify-center space-x-3 w-full bg-red-600 text-white py-4 rounded-xl font-black uppercase text-xs tracking-[0.2em] hover:bg-red-700 transition-all active:scale-95"
                            >
                                <X size={18} />
                                <span>Logout Account</span>
                            </button>
                        ) : (
                            <Link 
                                href="/login" 
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center justify-center space-x-3 w-full bg-secondary text-white py-4 rounded-xl font-black uppercase text-xs tracking-[0.2em] hover:bg-primary hover:text-white transition-all active:scale-95"
                            >
                                <User size={18} />
                                <span>Member Account</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
