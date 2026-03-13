'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { API_URL } from '@/config';
import { ChevronLeft, Search, Share, ChevronDown, ChevronUp, Heart } from 'lucide-react';

export default function ProductClient({ initialProduct }: { initialProduct: any }) {
    const params = useParams();
    const router = useRouter();
    const { addToCart } = useCart();
    const { token, isAuthenticated } = useAuth();
    const [product, setProduct] = useState<any>(initialProduct);
    const [wishlistLoading, setWishlistLoading] = useState(false);
    const [loading, setLoading] = useState(!initialProduct);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isHighlightsOpen, setIsHighlightsOpen] = useState(true);
    const [isInfoOpen, setIsInfoOpen] = useState(false);

    useEffect(() => {
        if (!initialProduct && params.id) {
            const fetchProduct = async () => {
                try {
                    const response = await fetch(`${API_URL}/products/${params.id}`);
                    const data = await response.json();
                    setProduct(data);
                } catch (error) {
                    console.error('Error fetching product:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchProduct();
        }
    }, [params.id, initialProduct]);

    const addToWishlist = async () => {
        if (!isAuthenticated) return router.push('/login?redirect=/product/' + params.id);
        setWishlistLoading(true);
        try {
            const response = await fetch(`${API_URL}/wishlist`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ productId: params.id })
            });
            if (response.ok) {
                alert('Added to wishlist!');
            }
        } catch (error) {
            console.error('Wishlist error:', error);
        } finally {
            setWishlistLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#ff4d30]"></div>
        </div>
    );

    if (!product) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-semibold">
            Product Not Found
        </div>
    );

    const images = product.images && product.images.length > 0 ? product.images : [];
    const mainImage = images[activeImageIndex] || null;
    const currentPrice = product.discountPrice || product.price;
    const oldPrice = product.discountPrice ? product.price : null;
    const discountAmount = oldPrice ? oldPrice - currentPrice : 0;

    return (
        <div className="min-h-screen bg-[#f3f4f6] pb-[80px]"> {/* Bottom padding for sticky button */}
            {/* Transparent Top Navigation Bar */}
            <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 bg-gradient-to-b from-black/20 to-transparent pointer-events-none">
                <button onClick={() => router.back()} className="bg-white/90 p-2 text-black rounded-full shadow-sm pointer-events-auto active:scale-95 transition-transform backdrop-blur-sm">
                    <ChevronLeft size={20} />
                </button>
                <div className="flex gap-3 pointer-events-auto">
                    <button className="bg-white/90 p-2 text-black rounded-full shadow-sm active:scale-95 transition-transform backdrop-blur-sm">
                        <Search size={20} />
                    </button>
                    <button className="bg-white/90 p-2 text-black rounded-full shadow-sm active:scale-95 transition-transform backdrop-blur-sm">
                        <Share size={20} />
                    </button>
                </div>
            </div>

            {/* Product Image Gallery Area */}
            <div className="bg-white pt-0 pb-4">
                <div className="relative w-full aspect-[4/3] bg-white">
                    {mainImage ? (
                        <Image unoptimized
                            src={mainImage}
                            alt={product.name}
                            fill
                            className="object-contain"
                            priority
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-[6rem]">🚗</div>
                    )}
                    
                    {/* Image Pagination Dots */}
                    {images.length > 1 && (
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-20">
                            {images.map((_: any, idx: number) => (
                                <div 
                                    key={idx} 
                                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeImageIndex ? 'w-4 bg-gray-800' : 'w-1.5 bg-gray-300'}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Product Core Info Block */}
            <div className="bg-white px-4 py-5 mb-2 rounded-b-2xl shadow-sm">
                <div className="flex justify-between items-start gap-4 mb-2">
                    <h1 className="text-gray-900 font-semibold text-lg leading-tight">
                        {product.name}
                    </h1>
                    <button onClick={addToWishlist} disabled={wishlistLoading} className="text-gray-400 hover:text-red-500 flex-shrink-0 mt-1">
                        <Heart size={20} className={wishlistLoading ? 'opacity-50' : ''} />
                    </button>
                </div>

                <p className="text-gray-500 text-sm mb-4">
                    Net quantity: 1 pc
                </p>

                {/* Price Display */}
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <div className="bg-[#287b3e] text-white px-2 py-0.5 rounded text-lg font-bold shadow-sm">
                            ₹{currentPrice.toLocaleString('en-IN')}
                        </div>
                    </div>
                    {oldPrice && (
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-gray-500 text-xs">MRP <span className="line-through">₹{oldPrice.toLocaleString('en-IN')}</span> (incl. of all taxes)</span>
                            {discountAmount > 0 && (
                                <span className="text-[#287b3e] text-xs font-bold">₹{discountAmount.toLocaleString('en-IN')} OFF</span>
                            )}
                        </div>
                    )}
                </div>

                {/* Thumbnail Selector */}
                {images.length > 1 && (
                    <div className="mt-6">
                        <p className="text-gray-700 text-sm font-medium mb-3">View More Images</p>
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                            {images.map((img: string, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImageIndex(idx)}
                                    className={`relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${activeImageIndex === idx ? 'border-gray-800 shadow-sm' : 'border-gray-100'}`}
                                >
                                    <Image unoptimized src={img} alt={`Thumbnail ${idx}`} fill className="object-contain p-1" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Highlights Section */}
            <div className="bg-white mb-2 shadow-sm rounded-2xl overflow-hidden">
                <button 
                    onClick={() => setIsHighlightsOpen(!isHighlightsOpen)}
                    className="w-full px-4 py-5 flex justify-between items-center bg-white"
                >
                    <span className="font-bold text-gray-900 text-lg">Highlights</span>
                    {isHighlightsOpen ? <ChevronUp size={20} className="text-gray-600" /> : <ChevronDown size={20} className="text-gray-600" />}
                </button>
                
                {isHighlightsOpen && (
                    <div className="px-4 pb-5">
                        <div className="space-y-4">
                            <div className="flex text-sm">
                                <span className="w-1/3 text-gray-500">Category</span>
                                <span className="w-2/3 text-gray-900 font-medium">{product.category?.name || 'Automotive'}</span>
                            </div>
                            <div className="flex text-sm">
                                <span className="w-1/3 text-gray-500">Unit</span>
                                <span className="w-2/3 text-gray-900 font-medium">1 pc</span>
                            </div>
                            {/* Instead of specs table, just show the description directly here since we scraped it */}
                            <div className="flex text-sm">
                                <span className="w-1/3 text-gray-500">Key Features</span>
                                <div className="w-2/3 text-gray-900 leading-relaxed font-medium prose prose-sm prose-p:my-1 max-w-none text-[13px]" 
                                     dangerouslySetInnerHTML={{ __html: product.description || 'Premium automotive product designed for durability and high performance.' }} />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Information Section */}
            <div className="bg-white mb-8 shadow-sm rounded-2xl overflow-hidden">
                <button 
                    onClick={() => setIsInfoOpen(!isInfoOpen)}
                    className="w-full px-4 py-5 flex justify-between items-center bg-white"
                >
                    <span className="font-bold text-gray-900 text-lg">Information</span>
                    {isInfoOpen ? <ChevronUp size={20} className="text-gray-600" /> : <ChevronDown size={20} className="text-gray-600" />}
                </button>
                
                {isInfoOpen && (
                    <div className="px-4 pb-5">
                        <div className="flex text-sm">
                            <span className="w-1/3 text-gray-500">Disclaimer</span>
                            <span className="w-2/3 text-gray-700 text-xs leading-relaxed">
                                All images are for representational purposes only. It is advised that you read the details, directions for use, and manufacturing information before purchasing.
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Sticky Add to Cart Bottom Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40">
                <button
                    onClick={() => addToCart({
                        id: product.id,
                        name: product.name,
                        price: currentPrice,
                        quantity: 1,
                        image: mainImage || '🚗'
                    })}
                    className="w-full bg-[#e83e8c] text-white font-bold py-3.5 rounded-xl shadow-md active:scale-95 transition-transform text-center tracking-wide"
                >
                    Add to cart
                </button>
            </div>
        </div>
    );
}
