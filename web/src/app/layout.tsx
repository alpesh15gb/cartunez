import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import Image from "next/image";
import "./globals.css";
import Navbar from "@/components/Navbar";
import TopBar from "@/components/TopBar";
import TawkChat from "@/components/TawkChat";
import Link from 'next/link';
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://cartunez.in'),
  title: {
    default: "Cartunez | Premium Automotive Parts & Accessories",
    template: "%s | Cartunez"
  },
  description: "Cartunez is India's premium destination for high-end automotive parts, styling accessories, and performance upgrades. Shop interior, exterior, and electronics.",
  keywords: ["car parts India", "automotive accessories Hyderabad", "luxury car styling", "Android car stereo", "car performance upgrades", "Cartunez"],
  authors: [{ name: "Cartunez Team" }],
  creator: "Cartunez",
  publisher: "Cartunez",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Cartunez',
  },
  openGraph: {
    title: "Cartunez | Premium Automotive Parts",
    description: "Shop the finest collection of automotive masterpieces. High-end parts and accessories for the modern enthusiast.",
    url: 'https://cartunez.in',
    siteName: 'Cartunez',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Cartunez Modern Performance Shop',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Cartunez | Premium Automotive Parts",
    description: "Upgrade your vehicle with our premium curated collection.",
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport = {
  themeColor: '#cc0000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${inter.variable} font-body antialiased text-foreground bg-white`}>
        <AuthProvider>
          <CartProvider>
            <TopBar />
            <Navbar />
            <TawkChat />
            <main>
              {children}
            </main>

            {/* Modern Footer */}
            <footer className="bg-white text-[#1a1a1a] pt-20 pb-10 border-t border-[#f0f0f0]">
              <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                      <div className="relative h-10 w-40 mb-6">
                          <Image
                              src="/logo.png"
                              alt="CarTunez"
                              fill
                              className="object-contain lg:object-left"
                          />
                      </div>
                    <p className="text-muted text-[10px] font-bold uppercase tracking-[0.2em] leading-relaxed max-w-xs">
                      "India's Premier Destination for Automotive Mastery " — Curated components for the modern enthusiast.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-[11px] font-black uppercase tracking-[0.25em] mb-8 text-[#1a1a1a]">Shop</h3>
                    <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-muted">
                      <li><Link href="/shop?category=Interior" className="hover:text-primary transition-colors">Interior</Link></li>
                      <li><Link href="/shop?category=Performance" className="hover:text-primary transition-colors">Performance</Link></li>
                      <li><Link href="/shop?category=exterior" className="hover:text-primary transition-colors">Exterior</Link></li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-[11px] font-black uppercase tracking-[0.25em] mb-8 text-[#1a1a1a]">Info</h3>
                    <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-muted">
                      <li><Link href="/faq" className="hover:text-primary transition-colors">About Us</Link></li>
                      <li><Link href="/contact" className="hover:text-primary transition-colors">Store Locator</Link></li>
                      <li><Link href="/track" className="hover:text-primary transition-colors">Track Order</Link></li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-[11px] font-black uppercase tracking-[0.25em] mb-8 text-[#1a1a1a]">Newsletter</h3>
                    <p className="text-muted text-[10px] font-bold uppercase tracking-widest mb-6 leading-relaxed">
                        Subscribe to get latest updates on products and offers.
                    </p>
                    <div className="flex border-b border-[#1a1a1a] pb-2">
                        <input 
                            type="email" 
                            placeholder="Email address" 
                            className="bg-transparent text-[11px] outline-none flex-1 font-bold uppercase tracking-widest" 
                        />
                        <button className="text-[11px] font-black uppercase tracking-[0.2em] hover:text-primary transition-colors">
                            JOIN
                        </button>
                    </div>
                  </div>
                </div>

                <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-[9px] font-bold uppercase tracking-[0.3em] text-muted space-y-4 md:space-y-0 border-t border-[#f8f8f8]">
                  <p>© 2026 CarTunez Auto. All Rights Reserved.</p>
                  <div className="flex space-x-6">
                    <Link href="/policies/privacy" className="hover:text-primary transition-colors">Privacy</Link>
                    <Link href="/policies/terms" className="hover:text-primary transition-colors">Terms</Link>
                    <Link href="/policies/returns" className="hover:text-primary transition-colors">Returns</Link>
                  </div>
                </div>
              </div>
            </footer>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
