'use client';

import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-6">
            <div className="text-center max-w-lg">
                <h1 className="text-[120px] font-black italic tracking-tighter text-primary leading-none mb-4">404</h1>
                <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-6">Engine <span className="text-primary italic">Failure</span></h2>
                <p className="text-sm font-bold text-muted uppercase tracking-widest leading-relaxed mb-12">
                    The requested coordinates do not exist in the CarTunez network. You've drifted off course.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link 
                        href="/" 
                        className="flex items-center justify-center gap-2 bg-secondary text-white px-8 py-4 rounded-xl font-black uppercase italic text-xs tracking-widest hover:bg-primary transition-all"
                    >
                        <Home size={16} /> Return Base
                    </Link>
                    <Link 
                        href="/shop" 
                        className="flex items-center justify-center gap-2 bg-card border border-border px-8 py-4 rounded-xl font-black uppercase italic text-xs tracking-widest hover:border-primary transition-all"
                    >
                        <Search size={16} /> Search Parts
                    </Link>
                </div>
            </div>
        </div>
    );
}
