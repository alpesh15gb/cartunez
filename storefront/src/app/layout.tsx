import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header, Footer } from "@/components/layout";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Car Tunez - Premium Car Accessories | Shop by Your Vehicle",
  description: "Find the perfect accessories for your car. Shop LED lights, seat covers, audio systems, and more with guaranteed fitment. Free shipping on orders above ₹999.",
  keywords: "car accessories, car seat covers, LED headlights, car audio, car mats, India",
  openGraph: {
    title: "Car Tunez - Premium Car Accessories",
    description: "Find the perfect accessories for your car with guaranteed fitment.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <Header />
        <main className="min-h-screen pt-16 md:pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
