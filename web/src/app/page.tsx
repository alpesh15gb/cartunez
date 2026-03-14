'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { API_URL } from '@/config';
import ProductCard from '@/components/ProductCard';
import { getSafeImageUrl } from '@/utils/imageUrl';

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
      <section className="relative h-[800px] md:h-[950px] w-full mb-20">
        <Image unoptimized
          src="/hero.png"
          alt="Premium Automotive Mastery"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <div className="max-w-4xl space-y-6">
            <h1 className="text-white text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-tight">
              "Mastery in every <br />
              <span className="text-primary italic">component</span>"
            </h1>
            <p className="text-white/80 text-xs md:text-sm font-medium max-w-xl mx-auto leading-relaxed uppercase tracking-widest">
              India's Premier Destination for High-Performance Automotive Parts. <br />
              Crafting Excellence, One Part at a Time.
            </p>
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/shop" className="btn-primary w-full sm:w-auto">Shop All Parts</Link>
            </div>
          </div>
        </div>

        {/* Floating Side Tags (Static UI for aesthetic) */}
        <div className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 flex-col gap-1 z-30 mr-8">
            {['PERFORMANCE', 'INTERIOR', 'EXTERIOR', 'NEW'].map(tag => (
                <div key={tag} className="bg-white text-[9px] font-black tracking-widest px-4 py-2 text-black shadow-lg cursor-pointer hover:bg-primary hover:text-white transition-all">
                    {tag}
                </div>
            ))}
        </div>
      </section>

      {/* Bestsellers Section */}
      <section className="container mx-auto px-6 mb-24">
        <h2 className="section-title">Our Bestsellers</h2>
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse bg-gray-50 aspect-[3/4] rounded"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Featured Side-by-Side Banners */}
      <section className="grid grid-cols-1 md:grid-cols-2 h-[500px] md:h-[600px] mb-24">
        <div className="relative group overflow-hidden border-r border-white/10">
          <Image unoptimized src="/performance.png" alt="Performance" fill className="object-cover group-hover:scale-110 transition-transform duration-700 brightness-75" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 bg-black/20 group-hover:bg-black/40 transition-all">
            <h3 className="text-white text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
                Performance <br /> Upgrades
            </h3>
            <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest max-w-xs mb-8">
                Curated high-performance upgrades for professional automotive builds.
            </p>
            <Link href="/shop?category=Performance" className="bg-white text-black text-[10px] font-black uppercase tracking-widest px-8 py-3 rounded-full hover:bg-primary hover:text-white transition-all">
                EXPLORE
            </Link>
          </div>
        </div>
        <div className="relative group overflow-hidden">
          <Image unoptimized src="/interior.png" alt="Interior" fill className="object-cover group-hover:scale-110 transition-transform duration-700 brightness-75" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 bg-black/20 group-hover:bg-black/40 transition-all">
            <h3 className="text-white text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
                Interior <br /> Aesthetics
            </h3>
            <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest max-w-xs mb-8">
                Stylish and ergonomic interior masterpieces for ultimate comfort.
            </p>
            <Link href="/shop?category=Interior" className="bg-white text-black text-[10px] font-black uppercase tracking-widest px-8 py-3 rounded-full hover:bg-primary hover:text-white transition-all">
                EXPLORE
            </Link>
          </div>
        </div>
      </section>

      {/* Latest products Section */}
      <section className="container mx-auto px-6 mb-24">
        <h2 className="section-title">Latest products</h2>
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
                    <Image unoptimized src={getSafeImageUrl(news.imageUrl)} alt={news.title} fill className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />
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
