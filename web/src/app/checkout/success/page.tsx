'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');

    return (
        <div className="container mx-auto px-6 py-20 flex flex-col items-center justify-center min-h-[70vh] text-center">
            <div className="relative mb-12">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
                <div className="relative bg-card border border-primary p-8 rounded-full shadow-[0_0_50px_rgba(var(--primary-rgb),0.3)]">
                    <CheckCircle size={80} className="text-primary" />
                </div>
            </div>

            <h1 className="text-6xl font-black italic uppercase tracking-tighter mb-4">Mission <span className="text-primary italic">Accomplished</span></h1>
            <p className="text-muted text-sm font-bold uppercase tracking-[0.3em] mb-12">Your order has been deployed successfully</p>

            <div className="w-full max-w-xl bg-card border border-border p-10 rounded-2xl relative overflow-hidden mb-12 shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
                <div className="flex flex-col gap-8">
                    <div className="text-left w-full border-b border-border pb-6">
                        <p className="text-[10px] uppercase font-black tracking-widest text-muted mb-2">Order Tracking ID</p>
                        <p className="text-2xl font-mono font-black tracking-tighter text-primary break-all">#{orderId?.slice(-12).toUpperCase() || 'TX-DEPLOY-PENDING'}</p>
                    </div>
                    
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="text-left">
                            <h3 className="text-sm font-black uppercase tracking-widest text-white mb-2">Payload Secure</h3>
                            <p className="text-[10px] font-bold text-muted uppercase tracking-widest leading-relaxed">
                                Our logistics team has received your deployment request. <br/>
                                Check your email for full telemetry data.
                            </p>
                        </div>
                        <div className="bg-primary/10 p-6 rounded-xl border border-primary/20 flex flex-col items-center justify-center min-w-[150px]">
                            <Package size={32} className="text-primary mb-2" />
                            <p className="text-[10px] uppercase font-black tracking-widest text-primary">Status: Deployed</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-xl">
                <Link href="/shop" className="group">
                    <div className="bg-secondary p-6 rounded-xl border border-white/5 hover:border-primary transition-all flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-widest text-white">Back to Hangar</span>
                        <ArrowRight size={20} className="text-primary group-hover:translate-x-2 transition-transform" />
                    </div>
                </Link>
                <Link href="/track" className="group">
                    <div className="bg-card p-6 rounded-xl border border-border hover:border-primary transition-all flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-widest text-muted">Track Telemetry</span>
                        <ArrowRight size={20} className="text-muted group-hover:translate-x-2 transition-transform" />
                    </div>
                </Link>
            </div>

            <div className="mt-16 flex items-center justify-center space-x-12 opacity-30">
                <div className="text-[10px] font-black uppercase tracking-[0.4em]">Speed</div>
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                <div className="text-[10px] font-black uppercase tracking-[0.4em]">Precision</div>
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                <div className="text-[10px] font-black uppercase tracking-[0.4em]">Quality</div>
            </div>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-primary animate-spin">
                    <CheckCircle size={40} />
                </div>
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}
