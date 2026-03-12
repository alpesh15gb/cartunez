'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { API_URL } from '@/config';

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/products`);
        const data = await response.json();
        // Limit to 12 for trending section
        if (Array.isArray(data)) {
          setProducts(data.slice(0, 12));
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const LATEST_NEWS = [
    { id: 1, title: 'Best Collection In Store', date: '02 Oct 2026', image: '/interior.png' },
    { id: 2, title: 'Summer Performance Guide', date: '15 Sep 2026', image: '/performance.png' },
    { id: 3, title: 'New Arrival: Forged Wheels', date: '28 Aug 2026', image: '/wheels.png' },
  ];

  return (
    <div className="relative">
      {/* Background Ghost Text */}
      <div className="ghost-title">AUTO PARTS</div>

      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-12 pb-24">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Hero Content */}
          <div className="flex-1 space-y-6">
            <span className="text-primary font-black uppercase tracking-[0.3em] text-xs">New Arrivals</span>
            <h1 className="text-7xl font-black italic uppercase tracking-tighter leading-none">
              Get Your Car <br />
              <span className="text-secondary">Rolling In Style</span>
            </h1>
            <p className="text-muted font-medium max-w-lg leading-relaxed">
              Elevate your vehicle's performance and aesthetics with our premium curated collection of automotive masterpieces.
            </p>
            <div className="pt-4 flex space-x-4">
              <Link href="/shop" className="btn-primary">Shop Now</Link>
              <Link href="/categories" className="btn-outline">Explore More</Link>
            </div>
          </div>

          {/* Hero Image / Car Display */}
          <div className="flex-1 relative h-[500px] w-full rounded-sm overflow-hidden group shadow-2xl">
            <Image
              src="/hero.png"
              alt="Modern Performance Car"
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
        <div className="relative h-64 bg-secondary overflow-hidden group">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <div className="relative z-20 h-full p-10 flex flex-col justify-center text-center items-center">
            <h3 className="text-white text-3xl font-black italic uppercase mb-4">The Best Car Parts</h3>
            <Link href="/shop" className="inline-block bg-primary text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 w-fit hover:bg-white hover:text-primary transition-colors">Shop Now</Link>
          </div>
          <Image src="/performance.png" alt="Car Parts" fill className="object-cover grayscale opacity-20 group-hover:opacity-40 transition-opacity" />
        </div>
        <div className="relative h-64 bg-primary overflow-hidden group">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <div className="relative z-20 h-full p-10 flex flex-col justify-center text-center items-center">
            <h3 className="text-white text-3xl font-black italic uppercase mb-4">Essentials</h3>
            <Link href="/shop" className="inline-block bg-secondary text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 w-fit hover:bg-white hover:text-primary transition-colors">Shop Now</Link>
          </div>
          <Image src="/interior.png" alt="Luxury Cars" fill className="object-cover grayscale opacity-20 group-hover:opacity-40 transition-opacity" />
        </div>
      </section>

      {/* Trending Products */}
      <section className="container mx-auto px-6 mb-24">
        <h2 className="section-title">Trending Products</h2>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 4, 4].map((i) => (
              <div key={i} className="animate-pulse bg-card h-80 rounded-sm"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product.id} className="card-modern group">
                <div className="relative aspect-square bg-card mb-4 overflow-hidden rounded-sm">
                  {product.images && product.images[0] ? (
                    <Image src={product.images[0]} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl group-hover:scale-110 transition-transform">
                      🚗
                    </div>
                  )}
                  {product.discountPrice && (
                    <div className="absolute top-2 left-2 bg-primary text-white text-[9px] font-black px-2 py-0.5 uppercase italic z-10">Sale</div>
                  )}
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] text-yellow-500">
                    ★★★★★
                  </div>
                  <Link href={`/product/${product.id}`} className="block text-[13px] font-bold uppercase tracking-tight hover:text-primary transition-colors overflow-hidden text-ellipsis whitespace-nowrap">
                    {product.name}
                  </Link>
                  <div className="flex items-center space-x-2">
                    <span className="text-primary font-black">₹{(product.discountPrice || product.price).toLocaleString()}</span>
                    {product.discountPrice && (
                      <span className="text-muted text-[10px] line-through">₹{product.price.toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </div>
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
          {LATEST_NEWS.map((news) => (
            <div key={news.id} className="group cursor-pointer">
              <div className="relative h-64 bg-card mb-6 overflow-hidden rounded-sm">
                {news.image.startsWith('/') ? (
                  <Image src={news.image} alt={news.title} fill className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-8xl grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700">
                    {news.image}
                  </div>
                )}
              </div>
              <span className="text-primary font-black uppercase tracking-widest text-[10px]">{news.date}</span>
              <h3 className="text-xl font-black uppercase italic tracking-tighter mt-2 group-hover:text-primary transition-colors">{news.title}</h3>
              <p className="text-muted text-[11px] font-medium leading-relaxed mt-4">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been...
              </p>
              <button className="text-[10px] font-black uppercase tracking-[0.2em] mt-6 border-b-2 border-primary pb-1 group-hover:translate-x-2 transition-transform inline-block">Read More</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
