'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

export default function ProductDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { addToCart } = useCart();
    const { token, isAuthenticated } = useAuth();
    const [product, setProduct] = useState<any>(null);
    const [wishlistLoading, setWishlistLoading] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/products/${id}`);
                const data = await response.json();
                setProduct(data);
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProduct();
    }, [id]);

    const addToWishlist = async () => {
        if (!isAuthenticated) return router.push('/login?redirect=/product/' + id);
        setWishlistLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/wishlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ productId: id })
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
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
        </div>
    );

    if (!product) return (
        <div className="container mx-auto px-6 py-40 text-center font-black uppercase italic">
            Product Not Found
        </div>
    );

    const mainImage = product.images && product.images[0] ? product.images[0] : null;

    return (
        <div className="min-h-screen bg-white">
            {/* Breadcrumb */}
            <div className="bg-card py-6 border-b border-border mb-12">
                <div className="container mx-auto px-6 text-[10px] font-black uppercase tracking-widest text-muted">
                    Home / Shop / {product.category?.name || 'Uncategorized'} / <span className="text-foreground">{product.name}</span>
                </div>
            </div>

            <div className="container mx-auto px-6 pb-24">
                <div className="flex flex-col lg:flex-row gap-20">
                    {/* Main Display */}
                    <div className="flex-1 space-y-6">
                        <div className="bg-card border border-border aspect-square relative rounded-sm overflow-hidden group">
                            {mainImage ? (
                                <Image
                                    src={mainImage}
                                    alt={product.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-1000 select-none"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-[12rem] group-hover:scale-110 transition-transform duration-1000 select-none uppercase font-black italic">
                                    🚗
                                </div>
                            )}
                            <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-black px-4 py-1 uppercase italic shadow-lg z-10">Premium Selection</div>
                        </div>
                    </div>

                    {/* Product Specs */}
                    <div className="flex-1 space-y-10">
                        <div>
                            <div className="flex text-sm text-yellow-500 mb-4">★★★★★</div>
                            <h1 className="text-4xl font-black italic uppercase tracking-tighter leading-tight mb-4">{product.name}</h1>
                            <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px] block mb-6">{product.category?.name || 'General Product'}</span>
                            <div className="flex items-end space-x-4 mb-2">
                                <p className="text-4xl font-black text-secondary">₹{(product.discountPrice || product.price).toLocaleString('en-IN')}</p>
                                {product.discountPrice && (
                                    <p className="text-xl font-bold text-muted line-through mb-1">₹{product.price.toLocaleString('en-IN')}</p>
                                )}
                            </div>
                        </div>

                        {/* Description contains HTML from Shopify API */}
                        <div
                            className="text-muted leading-relaxed text-sm font-medium border-l-4 border-primary pl-8 italic mb-12 prose max-w-none"
                            dangerouslySetInnerHTML={{ __html: product.description }}
                        />

                        <div className="flex flex-col sm:flex-row gap-4 pt-6">
                            <button
                                onClick={() => addToCart({
                                    id: product.id,
                                    name: product.name,
                                    price: product.discountPrice || product.price,
                                    quantity: 1,
                                    image: mainImage || '🚗'
                                })}
                                className="btn-primary flex-1 py-5 text-xs shadow-xl active:translate-y-1 transition-transform"
                            >
                                Engage - Add To Cart
                            </button>
                            <button 
                                onClick={addToWishlist}
                                disabled={wishlistLoading}
                                className="btn-outline flex-1 py-5 text-xs shadow-md"
                            >
                                {wishlistLoading ? 'SAVING...' : 'Add To Wishlist'}
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-px bg-border border border-border mt-12 overflow-hidden rounded-sm">
                            <div className="bg-white p-6">
                                <span className="block text-[9px] font-black uppercase tracking-widest text-primary mb-2">Technical Warranty</span>
                                <p className="text-[11px] font-black uppercase text-secondary">2 Year Professional Limited</p>
                            </div>
                            <div className="bg-white p-6">
                                <span className="block text-[9px] font-black uppercase tracking-widest text-primary mb-2">Shipping Logistics</span>
                                <p className="text-[11px] font-black uppercase text-secondary">Free Air Delivery - PAN India</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="container mx-auto px-6 py-24 border-t border-border">
                <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-12">Field <span className="text-primary italic">Reports</span></h2>
                
                {product.reviews && product.reviews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {product.reviews.map((review: any) => (
                            <div key={review.id} className="bg-card border border-border p-8 rounded-xl">
                                <div className="flex text-yellow-500 mb-4 text-xs">
                                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                </div>
                                <p className="text-sm font-medium italic text-muted leading-relaxed mb-6">"{review.comment}"</p>
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-primary">{review.user.email.split('@')[0]}</span>
                                    <span className="text-muted/50">{new Date(review.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-card border border-dashed border-border rounded-xl">
                        <p className="text-muted font-bold uppercase tracking-widest">No reviews yet. Be the first to report.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
