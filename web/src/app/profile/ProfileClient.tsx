'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/config';
import { Package, Truck, Clock, User as UserIcon, LogOut, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function ProfileClient() {
    const { user, token, isAuthenticated, logout } = useAuth();
    const router = useRouter();
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [returnModalOrder, setReturnModalOrder] = useState<any>(null);
    const [returnReason, setReturnReason] = useState('');
    const [isSubmittingReturn, setIsSubmittingReturn] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login?redirect=/profile');
            return;
        }

        const fetchUserDetails = async () => {
            try {
                if (!user?.id) return;
                const response = await fetch(`${API_URL}/users/${user.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user && user.id) fetchUserDetails();
    }, [isAuthenticated, user, token, router]);

    const submitReturnRequest = async () => {
        if (!returnReason.trim()) return alert('Please provide a reason for the return.');
        setIsSubmittingReturn(true);
        try {
            const response = await fetch(`${API_URL}/orders/${returnModalOrder.id}/return`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ reason: returnReason })
            });
            if (response.ok) {
                alert('Return request submitted successfully!');
                setReturnModalOrder(null);
                setReturnReason('');
                // Refresh data
                window.location.reload();
            } else {
                const err = await response.json();
                alert(err.message || 'Failed to submit return request.');
            }
        } catch (error) {
            console.error('Return request error:', error);
        } finally {
            setIsSubmittingReturn(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
        </div>
    );

    if (!userData) return null;

    return (
        <div className="min-h-screen bg-[#f8f9fa] pb-20">
            {/* Profile Header Block */}
            <div className="bg-white border-b border-border pb-10 pt-20">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-black shadow-lg">
                            {userData.email[0].toUpperCase()}
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-3xl font-black uppercase italic tracking-tighter mb-1">
                                Hello, <span className="text-primary">{userData.email.split('@')[0]}</span>
                            </h1>
                            <p className="text-xs font-bold text-muted uppercase tracking-widest">{userData.email}</p>
                            <div className="flex gap-4 mt-4 justify-center md:justify-start">
                                <span className="bg-card px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-border">
                                    Member since {new Date(userData.createdAt).getFullYear()}
                                </span>
                                <span className="bg-card px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-border">
                                    {userData.orders?.length || 0} Orders Placed
                                </span>
                            </div>
                        </div>
                        <button 
                            onClick={logout}
                            className="md:ml-auto flex items-center gap-2 text-muted hover:text-red-500 font-black uppercase text-[10px] tracking-widest transition-colors"
                        >
                            <LogOut size={16} />
                            Log Out
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Order History Column */}
                <div className="lg:col-span-2">
                    <h2 className="text-sm font-black uppercase tracking-[0.2em] mb-8 border-b-4 border-primary w-fit pb-1">Order History</h2>
                    
                    {userData.orders && userData.orders.length > 0 ? (
                        <div className="space-y-6">
                            {userData.orders.map((order: any) => (
                                <div key={order.id} className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                    <div className="p-6 bg-card flex flex-wrap justify-between items-center gap-4 border-b border-border">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-white rounded-xl border border-border">
                                                <Package className="text-primary" size={24} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-muted">Order ID</p>
                                                <p className="font-bold text-sm tracking-tighter">#{order.id.slice(-8).toUpperCase()}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted text-right">Date</p>
                                            <p className="font-bold text-sm">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted text-right">Total Amount</p>
                                            <p className="font-black text-sm text-primary">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                                        </div>
                                        <div className="flex items-center gap-2 bg-white px-4 py-1.5 rounded-full border border-border shadow-sm">
                                            <span className={`w-2 h-2 rounded-full ${order.status === 'DELIVERED' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                                            <span className="text-[10px] font-black uppercase tracking-widest">{order.status}</span>
                                        </div>

                                        {order.status === 'DELIVERED' && !order.returnStatus && (
                                            <button 
                                                onClick={() => setReturnModalOrder(order)}
                                                className="bg-red-500 text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full hover:bg-red-600 transition-colors shadow-sm active:scale-95"
                                            >
                                                Request Return
                                            </button>
                                        )}

                                        {order.returnStatus && (
                                            <div className={`px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${
                                                order.returnStatus === 'REQUESTED' ? 'bg-blue-50 border-blue-200 text-blue-600' :
                                                order.returnStatus === 'APPROVED' ? 'bg-green-50 border-green-200 text-green-600' :
                                                'bg-red-50 border-red-200 text-red-600'
                                            }`}>
                                                <Clock size={10} />
                                                Return {order.returnStatus}
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6 space-y-4">
                                        {order.items.map((item: any) => (
                                            <div key={item.id} className="flex items-center gap-4">
                                                <div className="w-16 h-16 bg-[#f8f9fa] rounded-lg border border-border relative overflow-hidden flex-shrink-0">
                                                    <img 
                                                        src={item.product?.images?.[0] || 'https://via.placeholder.com/100'} 
                                                        alt={item.product?.name}
                                                        className="object-contain w-full h-full p-2"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-bold leading-tight line-clamp-1">{item.product?.name}</p>
                                                    <p className="text-[10px] font-bold text-muted uppercase mt-1">Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</p>
                                                </div>
                                                <Link 
                                                    href={`/product/${item.productId}`}
                                                    className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
                                                >
                                                    View Part
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border-2 border-dashed border-border p-12 text-center">
                            <p className="text-muted font-bold uppercase tracking-widest mb-4">You haven't placed any orders yet</p>
                            <Link href="/shop" className="bg-primary text-white font-black uppercase text-[10px] tracking-widest px-8 py-3 rounded-xl hover:bg-secondary transition-colors inline-block">
                                Start Shopping
                            </Link>
                        </div>
                    )}
                </div>

                {/* Sidebar Info */}
                <div className="space-y-8">
                    <div className="bg-secondary text-white rounded-3xl p-8 shadow-xl">
                        <h3 className="text-lg font-black uppercase italic tracking-tighter mb-6">Need <span className="text-primary italic">Assistance?</span></h3>
                        <div className="space-y-6">
                            <Link href="/track" className="flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-white/10 rounded-lg group-hover:bg-primary transition-colors">
                                        <Truck size={18} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest">Track Order</span>
                                </div>
                                <ChevronRight size={16} className="text-primary" />
                            </Link>
                            <Link href="/contact" className="flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-white/10 rounded-lg group-hover:bg-primary transition-colors">
                                        <Clock size={18} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest">Support Center</span>
                                </div>
                                <ChevronRight size={16} className="text-primary" />
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-8 border border-border shadow-sm">
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6">Account Settings</h3>
                        <div className="space-y-4">
                            <button className="w-full bg-card text-left p-4 rounded-xl border border-border hover:border-primary transition-colors group">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted group-hover:text-primary mb-1">Shipping Address</p>
                                <p className="text-xs font-bold leading-relaxed">{userData.address || 'No address saved yet.'}</p>
                            </button>
                            <button className="w-full text-center text-[10px] font-black uppercase tracking-widest text-muted hover:text-primary transition-colors py-2">
                                Change Password
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Return Request Modal */}
            {returnModalOrder && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-card">
                            <div>
                                <h3 className="text-xl font-black italic uppercase tracking-tighter">Request Return</h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted mt-1">Order ID: #{returnModalOrder.id.slice(-8).toUpperCase()}</p>
                            </div>
                            <button onClick={() => setReturnModalOrder(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-muted hover:text-red-500">
                                <LogOut size={20} className="rotate-45" />
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary">Reason for Return</label>
                                <textarea 
                                    className="w-full bg-[#f8f9fa] border border-border p-4 rounded-2xl outline-none focus:border-red-500 transition-all text-sm font-semibold min-h-[120px]"
                                    placeholder="Explain why you want to return this product..."
                                    value={returnReason}
                                    onChange={(e) => setReturnReason(e.target.value)}
                                />
                            </div>
                            <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
                                <p className="text-[10px] font-bold text-red-700 leading-relaxed italic">
                                    "Returns are subject to approval. Please ensure the product is in its original condition and packaging."
                                </p>
                            </div>
                        </div>
                        <div className="p-8 border-t border-gray-100 bg-gray-50 flex gap-4">
                            <button 
                                onClick={() => setReturnModalOrder(null)}
                                className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-muted hover:bg-gray-100 rounded-2xl transition-all"
                            >
                                Dismiss
                            </button>
                            <button 
                                onClick={submitReturnRequest}
                                disabled={isSubmittingReturn}
                                className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-black uppercase italic text-xs tracking-widest shadow-xl shadow-red-600/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                            >
                                {isSubmittingReturn ? 'Submitting...' : 'Submit Request'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
