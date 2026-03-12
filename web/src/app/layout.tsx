import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import TopBar from "@/components/TopBar";
import Link from 'next/link';
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Cartunez | Modern Performance Shop",
  description: "The premium destination for automotive parts and high-end accessories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} font-sans antialiased text-foreground bg-white`}>
        <AuthProvider>
          <CartProvider>
            <TopBar />
            <Navbar />
            <main>
              {children}
            </main>

            {/* Modern Footer */}
            <footer className="bg-secondary text-white pt-16 pb-8 border-t-8 border-primary">
              <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                  <div>
                    <h2 className="text-2xl font-black italic tracking-tighter mb-6 uppercase">CARTUNEZ</h2>
                    <p className="text-muted text-[11px] font-bold uppercase tracking-widest leading-relaxed mb-6">
                      Get Your Car Rolling In Style !!!
                    </p>
                    <div className="flex space-x-4 opacity-50">
                      {/* Social Placeholders */}
                      <span className="text-xl hover:text-primary cursor-pointer transition-colors">f</span>
                      <span className="text-xl hover:text-primary cursor-pointer transition-colors">t</span>
                      <span className="text-xl hover:text-primary cursor-pointer transition-colors">i</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-8 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-10 after:h-0.5 after:bg-primary">Quick Links</h3>
                    <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-muted">
                      <li><Link href="/shop" className="hover:text-primary">All Collection</Link></li>
                      <li><Link href="/categories" className="hover:text-primary">Featured Parts</Link></li>
                      <li><Link href="/track" className="hover:text-primary">Track Order</Link></li>
                      <li><Link href="/login" className="hover:text-primary">My Account</Link></li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-8 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-10 after:h-0.5 after:bg-primary">Categories</h3>
                    <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-muted">
                      <li><Link href="/shop?category=interior" className="hover:text-primary">Interior Accessories</Link></li>
                      <li><Link href="/shop?category=exterior" className="hover:text-primary">Exterior Styling</Link></li>
                      <li><Link href="/shop?category=electronics" className="hover:text-primary">Marine Electronics</Link></li>
                      <li><Link href="/shop?category=batteries" className="hover:text-primary">Battery Systems</Link></li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-8 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-10 after:h-0.5 after:bg-primary">Contact Details</h3>
                    <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-muted">
                      <li className="flex items-start space-x-3 text-left">
                        <span className="mt-0.5">📍</span>
                        <span>Shop No 12&13, Veer Hanuman Temple, S.P. Road, Secunderabad, Hyderabad, 500003</span>
                      </li>
                      <li className="flex items-center space-x-3"><span>📞</span> <span>+91 9949695030</span></li>
                      <li className="flex items-center space-x-3"><span>✉️</span> <span>cartunezhyd@gmail.com</span></li>
                    </ul>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-[9px] font-bold uppercase tracking-widest text-muted">
                  <p>© 2026 Cartunez. All Performance Reserved.</p>
                  <div className="flex space-x-6 mt-4 md:mt-0">
                    <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
                    <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
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
