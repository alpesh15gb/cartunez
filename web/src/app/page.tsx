'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { API_URL } from '@/config';
import ProductCard from '@/components/ProductCard';

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [newsList, setNewsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [productsRes, newsRes] = await Promise.all([
          fetch(`${API_URL}/products`),
          fetch(`${API_URL}/news`)
        ]);
        
        const productsData = await productsRes.json();
        const newsData = await newsRes.json();

        const productsList = Array.isArray(productsData) ? productsData : (productsData?.products || []);
        if (productsList) {
          setProducts(productsList.slice(0, 12));
        }
        const newsArray = Array.isArray(newsData) ? newsData : (newsData?.news || []);
        if (newsArray) {
          setNewsList(newsArray.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);


  return (
    <div className="relative overflow-hidden">
      {/* Structured Data (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Cartunez",
            "url": "https://cartunez.in",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://cartunez.in/shop?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Cartunez",
            "url": "https://cartunez.in",
            "logo": "https://cartunez.in/logo.png",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+91-9949695030",
              "contactType": "customer service",
              "areaServed": "IN",
              "availableLanguage": "en"
            },
            "sameAs": [
              "https://www.facebook.com/cartunez",
              "https://www.instagram.com/cartunez"
            ]
          })
        }}
      />

      {/* Background Ghost Text */}
      <div className="ghost-title" aria-hidden="true">AUTO PARTS</div>

      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-12 pb-24">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Hero Content */}
          <div className="flex-1 space-y-6">
            <span className="text-primary font-black uppercase tracking-[0.3em] text-xs">New Arrivals</span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black italic uppercase tracking-tighter leading-none">
              Premium <span className="text-secondary">Automotive Parts</span> & Accessories
            </h1>
            <p className="text-muted font-medium max-w-lg leading-relaxed">
              Elevate your vehicle's performance and aesthetics with Cartunez – India's premium destination for curated automotive masterpieces and high-end styling.
            </p>
            <div className="pt-4 flex space-x-4">
              <Link href="/shop" className="btn-primary">Shop Collection</Link>
              <Link href="/categories" className="btn-outline">Explore Parts</Link>
            </div>
          </div>

          {/* Hero Image / Car Display */}
          <div className="flex-1 relative h-[300px] md:h-[500px] w-full rounded-sm overflow-hidden group shadow-2xl">
            <Image unoptimized
              src="/hero.png"
              alt="Cartunez - High-performance sports car with custom upgrades"
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-1000"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Featured Banners */}
      <section className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
        <div className="relative h-64 bg-secondary overflow-hidden group shadow-lg">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <div className="relative z-20 h-full p-10 flex flex-col justify-center text-center items-center">
            <h3 className="text-white text-3xl font-black italic uppercase mb-4">Performance Upgrades</h3>
            <Link href="/shop" className="inline-block bg-primary text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 w-fit hover:bg-white hover:text-primary transition-colors">Shop All</Link>
          </div>
          <Image unoptimized src="/performance.png" alt="High-performance automotive engine parts" fill className="object-cover grayscale opacity-20 group-hover:opacity-40 transition-opacity" />
        </div>
        <div className="relative h-64 bg-primary overflow-hidden group shadow-lg">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <div className="relative z-20 h-full p-10 flex flex-col justify-center text-center items-center">
            <h3 className="text-white text-3xl font-black italic uppercase mb-4">Luxury Interiors</h3>
            <Link href="/shop" className="inline-block bg-secondary text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 w-fit hover:bg-white hover:text-primary transition-colors">Shop Now</Link>
          </div>
          <Image unoptimized src="/interior.png" alt="Premium luxury car interior accessories" fill className="object-cover grayscale opacity-20 group-hover:opacity-40 transition-opacity" />
        </div>
      </section>

      {/* Trending Products */}
      <section className="container mx-auto px-6 mb-24">
        <h2 className="section-title">Trending Products</h2>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[1, 2, 4, 4].map((i) => (
              <div key={i} className="animate-pulse bg-gray-100 h-64 rounded-xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Newsletter */}
      <section className="bg-primary py-12 mb-24">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-white">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter">Subscribe Newsletter</h2>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mt-1 uppercase">Stay updated with latest parts and exclusive offers</p>
          </div>
          <div className="flex w-full md:w-auto max-w-md bg-white p-1">
            <input
              type="email"
              placeholder="Your email address..."
              className="flex-1 px-6 py-2 outline-none text-sm font-medium"
            />
            <button className="bg-secondary text-white px-8 py-2 text-xs font-black uppercase italic hover:bg-black transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="container mx-auto px-6 mb-24">
        <h2 className="section-title">Latest News</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {newsList.length > 0 ? (
            newsList.map((news) => (
              <div key={news.id} className="group cursor-pointer">
                <div className="relative h-64 bg-card mb-6 overflow-hidden rounded-sm">
                  {news.imageUrl ? (
                    <Image unoptimized src={news.imageUrl} alt={news.title} fill className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-8xl grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700">
                      📰
                    </div>
                  )}
                </div>
                <span className="text-primary font-black uppercase tracking-widest text-[10px]">{new Date(news.createdAt).toLocaleDateString()}</span>
                <h3 className="text-xl font-black uppercase italic tracking-tighter mt-2 group-hover:text-primary transition-colors">{news.title}</h3>
                <p className="text-muted text-[11px] font-medium leading-relaxed mt-4 line-clamp-3">
                  {news.content}
                </p>
                {news.externalUrl ? (
                   <Link href={news.externalUrl} target="_blank" className="text-[10px] font-black uppercase tracking-[0.2em] mt-6 border-b-2 border-primary pb-1 group-hover:translate-x-2 transition-transform inline-block">Read on Social</Link>
                ) : (
                   <button className="text-[10px] font-black uppercase tracking-[0.2em] mt-6 border-b-2 border-primary pb-1 group-hover:translate-x-2 transition-transform inline-block">Read More</button>
                )}
              </div>
            ))
          ) : (
             <div className="col-span-3 text-center py-12 border-2 border-dashed border-border text-muted font-bold uppercase tracking-widest">
                No updates yet. Check back soon for latest arrivals!
             </div>
          )}
        </div>
      </section>
    </div>
  );
}
