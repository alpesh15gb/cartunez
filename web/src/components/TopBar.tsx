import Link from 'next/link';
import { Mail, Phone, Truck, Headphones } from 'lucide-react';

export default function TopBar() {
    return (
        <div className="hidden lg:block bg-secondary text-white/90 py-2.5">
            <div className="container mx-auto px-6 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]">
                {/* Left: Contact */}
                <div className="flex items-center space-x-6">
                    <a href="mailto:info@cartunez.in" className="flex items-center space-x-2 hover:text-primary transition-colors">
                        <Mail size={12} className="text-primary" />
                        <span>info@cartunez.in</span>
                    </a>
                </div>

                {/* Center: Announcement */}
                <div className="flex items-center space-x-3">
                    <span className="text-primary tracking-widest">•</span>
                    <span>Premium Automotive Mastery</span>
                    <span className="text-primary tracking-widest">•</span>
                    <span>Free Shipping on Orders over ₹5,000</span>
                    <span className="text-primary tracking-widest">•</span>
                </div>

                {/* Right: Support Links */}
                <div className="flex items-center space-x-8">
                    <Link href="/shop" className="hover:text-primary transition-colors flex items-center space-x-2">
                        <Truck size={12} className="text-primary" />
                        <span>Track Order</span>
                    </Link>
                    <Link href="/support" className="hover:text-primary transition-colors flex items-center space-x-2">
                        <Headphones size={12} className="text-primary" />
                        <span>24/7 Support</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
