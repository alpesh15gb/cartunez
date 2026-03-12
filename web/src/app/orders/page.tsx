'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { API_URL } from '@/config';

export default function OrdersPage() {
    const { isAuthenticated, token } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login?redirect=/orders');
            return;
        }

        const fetchOrders = async () => {
            try {
                const response = await fetch(`${API_URL}/orders/my-orders`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setOrders(data);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [isAuthenticated, token, router]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
        </div>
    );

    return (
        <div className="container mx-auto px-6 py-12">
            <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-12">Order <span className="text-primary italic">History</span></h1>

            {orders.length === 0 ? (
                <div className="text-center py-20 bg-card border border-dashed border-border rounded-xl">
                    <p className="text-muted font-bold uppercase tracking-widest">No orders found</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-card border border-border overflow-hidden">
                            <div className="bg-secondary text-white p-6 flex flex-wrap justify-between items-center gap-4">
                                <div>
                                    <p className="text-[10px] uppercase font-bold tracking-widest text-muted">Order ID</p>
                                    <p className="text-sm font-black uppercase italic tracking-tighter">{order.id}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold tracking-widest text-muted">Date</p>
                                    <p className="text-sm font-black uppercase italic tracking-tighter">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold tracking-widest text-muted">Total Payload</p>
                                    <p className="text-sm font-black italic tracking-tighter text-primary">₹{order.totalAmount.toLocaleString()}</p>
                                </div>
                                <div className="bg-primary/20 border border-primary text-primary px-4 py-1 rounded text-[10px] font-black uppercase italic tracking-widest">
                                    {order.status}
                                </div>
                            </div>
                            
                            <div className="p-6">
                                <div className="space-y-4">
                                    {order.items.map((item: any) => (
                                        <div key={item.id} className="flex justify-between items-center bg-white/5 border border-border p-4 rounded">
                                            <div className="flex items-center space-x-4">
                                                <div className="relative w-12 h-12 bg-white border border-border rounded overflow-hidden">
                                                    <Image
                                                        src={item.product.images[0] || '/placeholder.png'}
                                                        alt={item.product.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-wider">{item.product.name}</p>
                                                    <p className="text-[8px] text-muted font-bold uppercase tracking-widest">QTY: {item.quantity}</p>
                                                </div>
                                            </div>
                                            <p className="text-[10px] font-black tracking-widest">₹{item.price.toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 pt-6 border-t border-border flex justify-end">
                                    <button className="btn-outline px-6 py-2 text-[10px] font-black uppercase italic">
                                        Track Shipment
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
