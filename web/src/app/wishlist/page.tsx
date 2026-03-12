'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { API_URL } from '@/config';

export default function WishlistPage() {
    const { isAuthenticated, token } = useAuth();
    const router = useRouter();
    const [wishlist, setWishlist] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login?redirect=/wishlist');
            return;
        }

        const fetchWishlist = async () => {
            try {
                const response = await fetch(`${API_URL}/wishlist`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setWishlist(data);
                }
            } catch (error) {
                console.error('Error fetching wishlist:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWishlist();
    }, [isAuthenticated, token, router]);

    const removeFromWishlist = async (id: string) => {
        try {
            const response = await fetch(`${API_URL}/wishlist/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                setWishlist(wishlist.filter(item => item.id !== id));
            }
        } catch (error) {
            console.error('Error removing from wishlist:', error);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
        </div>
    );

    return (
        <div className="container mx-auto px-6 py-12">
            <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-12">The <span className="text-primary italic">Vault</span></h1>
            
            {wishlist.length === 0 ? (
                <div className="text-center py-20 bg-card border border-dashed border-border rounded-xl">
                    <p className="text-muted font-bold uppercase tracking-widest mb-8">Your wishlist is empty</p>
                    <Link href="/shop" className="btn-primary px-8 py-4 text-xs">Browse Collection</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {wishlist.map((item) => (
                        <div key={item.id} className="bg-card border border-border group relative overflow-hidden flex flex-col">
                            <div className="aspect-square relative overflow-hidden bg-white">
                                <Image
                                    src={item.product.images[0] || '/placeholder.png'}
                                    alt={item.product.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <button 
                                    onClick={() => removeFromWishlist(item.id)}
                                    className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-colors z-10"
                                >
                                    <span className="text-lg">×</span>
                                </button>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-sm font-black uppercase tracking-tighter mb-2">{item.product.name}</h3>
                                <p className="text-primary font-black text-xl mb-6">₹{item.product.price.toLocaleString()}</p>
                                <div className="mt-auto space-y-2">
                                    <Link 
                                        href={`/product/${item.product.id}`}
                                        className="btn-outline w-full py-3 text-[10px]"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
