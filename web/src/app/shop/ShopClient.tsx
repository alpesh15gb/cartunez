'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import VehicleSelector from '@/components/VehicleSelector';
import { API_URL } from '@/config';
import ProductCard from '@/components/ProductCard';

function ShopContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const search = searchParams.get('search') || '';
    const categoryName = searchParams.get('category') || 'All';
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategoryId, setSelectedCategoryId] = useState('All');
    const [priceRange, setPriceRange] = useState(250000);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const queryParams = new URLSearchParams();
                const catId = searchParams.get('categoryId');
                const modelId = searchParams.get('modelId');
                const year = searchParams.get('year');

                if (catId) queryParams.append('categoryId', catId);
                if (search) queryParams.append('search', search);
                if (modelId) queryParams.append('modelId', modelId);
                if (year) queryParams.append('year', year);

                const [prodRes, catRes] = await Promise.all([
                    fetch(`${API_URL}/products?${queryParams.toString()}`),
                    fetch(`${API_URL}/categories`)
                ]);
                const prods = await prodRes.json();
                const cats = await catRes.json();
                const productsData = Array.isArray(prods) ? prods : (prods?.products || []);
                setProducts(productsData);
                const categoriesData = Array.isArray(cats) ? cats : (cats?.categories || []);
                setCategories(categoriesData);
                
                if (catId) setSelectedCategoryId(catId);
                else setSelectedCategoryId('All');
            } catch (error) {
                console.error('Error fetching shop data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [searchParams]);

    const filteredProducts = products.filter(p =>
        p.price <= priceRange
    );

    return (
        <div className="min-h-screen bg-white">
            {/* Minimal Header */}
            <div className="bg-card py-12 border-b border-border mb-12">
                <div className="container mx-auto px-6">
                    <h1 className="text-4xl font-black uppercase italic tracking-tighter">
                        All <span className="text-primary italic">Collection</span>
                    </h1>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted mt-2">
                        Home / Shop / {selectedCategoryId === 'All' ? 'All' : categories.find(c => c.id === selectedCategoryId)?.name || categoryName}
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-6 pb-12">
                <VehicleSelector onVehicleSelect={(modelId, year) => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.set('modelId', modelId);
                    params.set('year', year);
                    router.push(`/shop?${params.toString()}`);
                }} />
            </div>

            <div className="container mx-auto px-6 flex flex-col lg:flex-row gap-12 pb-24">
                {/* Modern Sidebar */}
                <aside className="w-full lg:w-64 space-y-12">
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6 border-b-4 border-primary w-fit pb-1">Categories</h3>
                        <div className="space-y-3">
                            <button
                                onClick={() => {
                                    const params = new URLSearchParams(searchParams.toString());
                                    params.delete('categoryId');
                                    router.push(`/shop?${params.toString()}`);
                                }}
                                className={`block w-full text-left text-[11px] font-bold uppercase tracking-widest transition-colors ${selectedCategoryId === 'All' ? 'text-primary' : 'text-muted hover:text-foreground'}`}
                            >
                                All
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => {
                                        const params = new URLSearchParams(searchParams.toString());
                                        params.set('categoryId', cat.id);
                                        router.push(`/shop?${params.toString()}`);
                                    }}
                                    className={`block w-full text-left text-[11px] font-bold uppercase tracking-widest transition-colors ${selectedCategoryId === cat.id ? 'text-primary' : 'text-muted hover:text-foreground'}`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6 border-b-4 border-primary w-fit pb-1">Max Price</h3>
                        <input
                            type="range"
                            min="0"
                            max="250000"
                            step="5000"
                            value={priceRange}
                            onChange={(e) => setPriceRange(parseInt(e.target.value))}
                            className="w-full accent-primary mt-2"
                        />
                        <div className="flex justify-between text-[10px] font-black uppercase mt-2">
                            <span>₹0</span>
                            <span className="text-primary">₹{priceRange.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                </aside>

                {/* Product Grid */}
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-8 pb-4 border-b border-border">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted">
                            {loading ? 'Searching...' : `${filteredProducts.length} Results Found`}
                        </span>
                        <div className="flex items-center space-x-2 text-[10px] font-black uppercase">
                            <span>Sort By:</span>
                            <select className="bg-transparent outline-none cursor-pointer">
                                <option>Newest Arrivals</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="animate-pulse bg-gray-100 aspect-[3/4] rounded-xl"></div>
                            ))}
                        </div>
                    ) : filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                            {filteredProducts.map((product) => (
                                <div key={product.id}>
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-card border border-dashed border-border rounded-xl">
                            <p className="text-muted font-bold uppercase tracking-widest">No products found for "{search || 'this category'}"</p>
                            <button 
                                onClick={() => {
                                    router.push('/shop');
                                }}
                                className="mt-4 text-primary font-black uppercase tracking-widest text-xs border-b-2 border-primary"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ShopClient() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        }>
            <ShopContent />
        </Suspense>
    );
}
