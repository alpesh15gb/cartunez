import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import SearchBox from "@/components/SearchBox";
import CartIndicator from "@/components/CartIndicator";
import { CartProvider } from "@/context/CartContext";
import { GarageProvider } from "@/context/GarageContext";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CarTunez | Premium Car Accessories",
  description: "Elevate your ride to perfection with CarTunez. Premium car accessories engineered for enthusiasts.",
  openGraph: {
    title: "CarTunez | Premium Car Accessories",
    description: "Elevate your ride to perfection with CarTunez. Premium car accessories engineered for enthusiasts.",
    siteName: "CarTunez",
  }
};

function Navigation() {
  return (
    <nav className="glass-nav py-2">
      <div className="container mx-auto px-4 flex justify-between items-center gap-4">
        <Link href="/" className="relative w-72 h-14 md:w-[450px] md:h-20 shrink-0 group flex items-center">
          {/* Absolute container scaled to 200% height so the logo gets much bigger without expanding the header */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[130%] h-[200%] md:h-[210%]">
            <Image 
              src="/logo-v4.png" 
              alt="CarTunez Logo" 
              fill 
              className="object-contain object-left transition-all duration-300 group-hover:scale-105" 
              priority
            />
          </div>
        </Link>
        <div className="hidden lg:flex gap-8 font-medium">
          <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
          <Link href="/categories" className="hover:text-primary transition-colors">All Categories</Link>
          <Link href="/about" className="hover:text-primary transition-colors">About</Link>
        </div>
        
        {/* Search Bar UI Mockup */}
        <SearchBox />

        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <button className="md:hidden p-2 hover:bg-white/10 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </button>
          <Link href="/wishlist" className="p-2 hover:bg-white/10 rounded-full transition-colors relative hidden sm:block">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          </Link>
          <CartIndicator />
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="py-16 border-t border-border mt-auto bg-surface/30">
      <div className="container mx-auto px-4 text-center">
        <div className="relative w-[420px] h-[105px] md:w-[700px] md:h-[175px] max-w-[90vw] mx-auto mb-10 hover:opacity-100 transition-opacity">
          <Image 
            src="/logo-v4.png"  
            alt="CarTunez Logo" 
            fill 
            className="object-contain" 
          />
        </div>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-8 text-sm font-medium">
          <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
          <Link href="/about" className="hover:text-primary transition-colors">About</Link>
          <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
          <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
          <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
        </div>
        
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12 mb-10 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>Shop 12&13, S.P.Road, Hyderabad</span>
          </div>
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <span>+91 99496 95030</span>
          </div>
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            <span>cartunezhyd@gmail.com</span>
          </div>
        </div>
        <p className="text-gray-500 text-xs tracking-widest uppercase">&copy; 2026 CarTunez. GET YOUR CAR ROLLING IN STYLE.</p>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <CartProvider>
          <GarageProvider>
            <Navigation />
            {children}
          </GarageProvider>
        </CartProvider>
        <Footer />
      </body>
    </html>
  );
}
