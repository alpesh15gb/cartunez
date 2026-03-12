'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { API_URL } from '@/config';

function TrackContent() {
    const searchParams = useSearchParams();
    const [orderId, setOrderId] = useState(searchParams.get('orderId') || '');
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleTrack = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!orderId) return;
        
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`${API_URL}/orders/${orderId}`);
            if (response.ok) {
                const data = await response.json();
                setOrder(data);
            } else {
                setError('Order not found. Please check your ID.');
            }
        } catch (err) {
            setError('Failed to fetch order status.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (searchParams.get('orderId')) {
            handleTrack();
        }
    }, []);

    const steps = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
    const currentStepIndex = order ? steps.indexOf(order.status) : -1;

    return (
        <div className="container mx-auto px-6 py-12">
            <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-12">Radar <span className="text-primary italic">Tracking</span></h1>

            <div className="max-w-xl mx-auto mb-16">
                <form onSubmit={handleTrack} className="flex gap-4">
                    <input
                        type="text"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        placeholder="Enter Order ID"
                        className="flex-1 bg-card border border-border p-4 rounded focus:border-primary outline-none transition-colors text-sm font-bold uppercase"
                    />
                    <button type="submit" className="btn-primary px-8 py-4 text-xs" disabled={loading}>
                        {loading ? 'Scanning...' : 'Track'}
                    </button>
                </form>
                {error && <p className="text-red-500 text-[10px] font-bold uppercase mt-4">{error}</p>}
            </div>

            {order && (
                <div className="max-w-3xl mx-auto">
                    <div className="bg-card border border-border p-12 rounded-xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
                        
                        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
                            {steps.map((step, index) => (
                                <div key={step} className="flex flex-col items-center relative flex-1">
                                    <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center z-10 ${
                                        index <= currentStepIndex ? 'bg-primary border-primary text-white' : 'bg-card border-border text-muted'
                                    }`}>
                                        {index < currentStepIndex ? '✓' : index + 1}
                                    </div>
                                    <p className={`text-[9px] font-black uppercase tracking-widest mt-4 ${
                                        index <= currentStepIndex ? 'text-foreground' : 'text-muted'
                                    }`}>
                                        {step}
                                    </p>
                                    {index < steps.length - 1 && (
                                        <div className={`absolute top-4 left-1/2 w-full h-0.5 hidden md:block ${
                                            index < currentStepIndex ? 'bg-primary' : 'bg-border'
                                        }`} />
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-border">
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted mb-4">Shipment Details</h3>
                                <p className="text-sm font-black uppercase italic tracking-tighter mb-2">{order.shippingAddress}</p>
                                <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Method: {order.paymentMethod}</p>
                            </div>
                            <div className="text-right">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted mb-4">Payload Summary</h3>
                                <p className="text-2xl font-black italic tracking-tighter text-primary">₹{order.totalAmount.toLocaleString()}</p>
                                <p className="text-[10px] font-bold text-muted uppercase tracking-widest mt-2">{order.items.length} Units</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function TrackPage() {
    return (
        <Suspense fallback={<div>Loading Radar...</div>}>
            <TrackContent />
        </Suspense>
    );
}
