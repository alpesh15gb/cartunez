'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { API_URL } from '@/config';
import { getSafeImageUrl } from '@/utils/imageUrl';
import { ChevronLeft, Search, Share, ChevronDown, ChevronUp, Heart, Star } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

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
    const [reviews, setReviews] = useState<any[]>([]);
    const [reviewLoading, setReviewLoading] = useState(false);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [submittingReview, setSubmittingReview] = useState(false);
    const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

    useEffect(() => {
        const fetchRelated = async (catId: string) => {
            try {
                const response = await fetch(`${API_URL}/products?categoryId=${catId}&limit=4`);
                const data = await response.json();
                const items = Array.isArray(data) ? data : (data.products || []);
                setRelatedProducts(items.filter((p: any) => p.id !== params.id).slice(0, 4));
            } catch (error) {
                console.error('Error fetching related products:', error);
            }
        };

        const fetchReviews = async () => {
            if (!params.id) return;
            setReviewLoading(true);
            try {
                const response = await fetch(`${API_URL}/reviews/${params.id}`);
                const data = await response.json();
                setReviews(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            } finally {
                setReviewLoading(false);
            }
        };

        fetchReviews();
        if (product?.categoryId) {
            fetchRelated(product.categoryId);
        }

        if (!initialProduct && params.id) {
            const fetchProduct = async () => {
                try {
                    const response = await fetch(`${API_URL}/products/${params.id}`);
                    const data = await response.json();
                    setProduct(data);
                    if (data.categoryId) {
                        fetchRelated(data.categoryId);
                    }
                } catch (error) {
                    console.error('Error fetching product:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchProduct();
        }
    }, [params.id, initialProduct, product?.categoryId]);

    const submitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated) return router.push('/login?redirect=/product/' + params.id);
        if (!newReview.comment.trim()) return;

        setSubmittingReview(true);
        try {
            const response = await fetch(`${API_URL}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    productId: params.id,
                    rating: newReview.rating,
                    comment: newReview.comment
                })
            });

            if (response.ok) {
                const data = await response.json();
                setReviews([ { ...data, user: { email: 'You' } }, ...reviews]);
                setNewReview({ rating: 5, comment: '' });
                alert('Review submitted successfully!');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
        } finally {
            setSubmittingReview(false);
        }
    };

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
    const isOutOfStock = product.isOutOfStock || product.stockQuantity === 0;

    const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
    const [isZoomed, setIsZoomed] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.pageX - left) / width) * 100;
        const y = ((e.pageY - top) / height) * 100;
        setZoomPos({ x, y });
    };

    return (
        <div className="min-h-screen bg-[#f8f9fa] pb-24 font-body">
            {/* Top Navigation Bar - Simple & Clean */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors">
                        <ChevronLeft size={16} />
                        Back
                    </button>
                    <div className="flex gap-4">
                        <button className="p-2 text-gray-400 hover:text-black transition-colors"><Search size={20} /></button>
                        <button className="p-2 text-gray-400 hover:text-black transition-colors"><Share size={20} /></button>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 pt-8">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-8 px-1">
                    <Link href="/" className="hover:text-primary">Home</Link>
                    <span>/</span>
                    <Link href="/shop" className="hover:text-primary">Shop</Link>
                    <span>/</span>
                    <span className="text-gray-900">{product.category?.name || 'Automotive'}</span>
                    <span>/</span>
                    <span className="text-gray-900 truncate max-w-[100px]">{product.name}</span>
                </nav>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-12">
                    <div className="flex flex-col lg:flex-row">
                        {/* Left Side: Image Gallery */}
                        <div className="lg:w-3/5 p-8 lg:p-12 bg-white">
                            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white mb-6 group">
                                {mainImage ? (
                                    <>
                                        <Image unoptimized
                                            src={getSafeImageUrl(mainImage)}
                                            alt={product.name}
                                            fill
                                            className={`object-contain transition-transform duration-700 ${isZoomed ? 'scale-150' : 'scale-100'}`}
                                            priority
                                            onMouseMove={handleMouseMove}
                                            onMouseEnter={() => setIsZoomed(true)}
                                            onMouseLeave={() => { setIsZoomed(false); setZoomPos({ x: 50, y: 50 }); }}
                                            style={isZoomed ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : {}}
                                        />
                                        
                                        {/* Sale Badge */}
                                        {oldPrice && (
                                            <div className="absolute top-6 left-6 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg">
                                                Sale!
                                            </div>
                                        )}

                                        <button className="absolute bottom-6 right-6 bg-white/90 p-3 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all text-gray-500 hover:text-black">
                                            <Search size={20} />
                                        </button>
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[8rem] grayscale opacity-10">🚗</div>
                                )}
                            </div>

                            {/* Thumbnails */}
                            {images.length > 1 && (
                                <div className="flex gap-4 justify-center overflow-x-auto py-2 scrollbar-hide">
                                    {images.map((img: string, idx: number) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImageIndex(idx)}
                                            className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all p-1 flex-shrink-0 ${activeImageIndex === idx ? 'border-primary ring-2 ring-primary/10' : 'border-gray-50 hover:border-gray-200'}`}
                                        >
                                            <Image unoptimized src={getSafeImageUrl(img)} alt={`Thumb ${idx}`} fill className="object-contain p-2" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right Side: Product Details */}
                        <div className="lg:w-2/5 p-8 lg:p-16 flex flex-col justify-center border-l border-gray-50">
                            <div className="space-y-6">
                                <h1 className="text-4xl md:text-5xl font-serif font-medium text-gray-900 leading-[1.1] tracking-tight">
                                    {product.name}
                                </h1>

                                <div className="flex items-center gap-4">
                                    <div className="flex text-primary text-lg">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <span key={s}>{s <= 4 ? '★' : '☆'}</span>
                                        ))}
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">(1 customer review)</span>
                                </div>

                                <div className="flex items-baseline gap-4 pt-4 border-t border-gray-50">
                                    <span className="text-3xl font-bold text-gray-900">₹{currentPrice.toLocaleString('en-IN')}.00</span>
                                    {oldPrice && (
                                        <span className="text-xl text-gray-300 line-through font-medium">₹{oldPrice.toLocaleString('en-IN')}.00</span>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 py-2">
                                   <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">SKU:</span>
                                   <span className="text-[10px] font-black uppercase text-gray-900">CA-BT-{(product.id?.slice(-5) || '8460').toUpperCase()}</span>
                                </div>

                                <div className="pt-8 space-y-6">
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center border-2 border-gray-100 rounded-xl px-4 py-2 h-14 bg-gray-50">
                                            <span className="text-[10px] font-black uppercase tracking-widest mr-4">Qty</span>
                                            <input type="number" defaultValue={1} className="w-12 bg-transparent text-center font-bold text-lg outline-none" min={1} />
                                        </div>

                                        <button
                                            disabled={isOutOfStock}
                                            onClick={() => addToCart({
                                                id: product.id,
                                                name: product.name,
                                                price: currentPrice,
                                                quantity: 1,
                                                image: mainImage || '🚗'
                                            })}
                                            className={`flex-1 h-14 rounded-xl font-black uppercase tracking-[0.2em] text-xs shadow-xl transition-all active:scale-95 ${isOutOfStock ? 'bg-gray-200 text-gray-400' : 'bg-primary text-white hover:bg-black'}`}
                                        >
                                            {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
                                        </button>
                                    </div>

                                    <button onClick={addToWishlist} disabled={wishlistLoading} className="w-full flex items-center justify-center gap-2 py-3 border border-gray-100 rounded-xl text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all">
                                        <Heart size={16} className={wishlistLoading ? 'opacity-50' : ''} />
                                        Add to Registry / Wishlist
                                    </button>
                                </div>

                                {isOutOfStock && (
                                    <div className="bg-red-50 p-4 rounded-xl flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                        <p className="text-[10px] font-black uppercase tracking-widest text-red-500">Currently Stocked Out</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Section - Centered */}
                <div className="max-w-4xl mx-auto mb-20">
                    <div className="flex justify-center border-b border-gray-100 mb-10">
                        <div className="flex gap-12">
                            <button 
                                onClick={() => setIsHighlightsOpen(true)}
                                className={`pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${isHighlightsOpen ? 'text-black' : 'text-gray-300'}`}
                            >
                                Description
                                {isHighlightsOpen && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />}
                            </button>
                            <button 
                                onClick={() => setIsHighlightsOpen(false)}
                                className={`pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${!isHighlightsOpen ? 'text-black' : 'text-gray-300'}`}
                            >
                                Reviews ({reviews.length})
                                {!isHighlightsOpen && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />}
                            </button>
                        </div>
                    </div>

                    {isHighlightsOpen ? (
                        <div className="animate-in fade-in duration-500">
                             <div className="prose prose-lg max-w-none text-gray-600 font-medium leading-loose text-center md:text-left"
                                 dangerouslySetInnerHTML={{ __html: product.description || 'Premium automotive product designed for performance.' }} />
                             
                             <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 py-12 border-t border-gray-100">
                                <div className="flex flex-col items-center p-6 bg-gray-50 rounded-2xl">
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2">Category Sector</span>
                                    <span className="text-lg font-serif font-medium text-gray-900">{product.category?.name || 'Automotive'}</span>
                                </div>
                                <div className="flex flex-col items-center p-6 bg-gray-50 rounded-2xl">
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2">Unit Capacity</span>
                                    <span className="text-lg font-serif font-medium text-gray-900">1 Unit Case</span>
                                </div>
                             </div>
                        </div>
                    ) : (
                        <div className="animate-in fade-in duration-500">
                            {/* Submit Review */}
                            <form onSubmit={submitReview} className="mb-16 bg-gray-50 p-8 rounded-3xl space-y-6">
                                <h3 className="text-sm font-black uppercase tracking-widest text-center mb-6">Contribute to the Archive</h3>
                                <div className="flex justify-center gap-2 mb-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setNewReview({ ...newReview, rating: star })}
                                            className={`text-2xl transition-transform active:scale-90 ${star <= newReview.rating ? 'text-yellow-400' : 'text-gray-200'}`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                                <textarea
                                    value={newReview.comment}
                                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                    className="w-full bg-white border border-gray-100 rounded-2xl p-6 text-sm outline-none focus:ring-2 ring-primary/5 transition-all min-h-[120px]"
                                    placeholder="Your technical analysis and feedback..."
                                />
                                <div className="text-center">
                                    <button
                                        type="submit"
                                        disabled={submittingReview}
                                        className="btn-primary"
                                    >
                                        Deploy Review
                                    </button>
                                </div>
                            </form>

                            {/* Reviews List */}
                            <div className="space-y-12">
                                {reviews.length > 0 ? reviews.map((review) => (
                                    <div key={review.id} className="group">
                                        <div className="flex justify-between items-center mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white font-black text-xs">
                                                    {review.user?.email?.[0] || 'U'}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black uppercase tracking-widest text-gray-900">{review.user?.email.split('@')[0]}</p>
                                                    <div className="flex text-yellow-400 text-[10px] mt-0.5">
                                                        {Array.from({ length: 5 }).map((_, i) => (
                                                            <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                                                Rec: {new Date(review.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed font-serif italic text-lg pl-14">
                                            "{review.comment}"
                                        </p>
                                    </div>
                                )) : (
                                    <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-3xl">
                                        <p className="text-xs font-black uppercase tracking-widest text-gray-400">Archive Empty. Be the First to Report.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <div className="pt-20 border-t border-gray-100 mb-24">
                        <h2 className="text-3xl font-serif font-medium text-center text-gray-900 mb-12">Related Precision Assets</h2>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                            {relatedProducts.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
