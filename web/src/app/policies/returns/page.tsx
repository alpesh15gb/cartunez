'use client';

import { RotateCcw, ShieldCheck, Clock, AlertTriangle } from 'lucide-react';

export default function ReturnPolicy() {
    return (
        <div className="min-h-screen bg-white pb-24">
            <div className="bg-card py-20 border-b border-border">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-4">
                        Returns & <span className="text-primary italic">Refunds</span>
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted">A clear policy for your peace of mind</p>
                </div>
            </div>

            <div className="container mx-auto px-6 mt-16 max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    <div className="bg-card p-6 rounded-2xl border border-border text-center">
                        <Clock className="mx-auto text-primary mb-4" size={32} />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-2">7-Day Window</h3>
                        <p className="text-[10px] text-muted font-bold uppercase">From the date of delivery</p>
                    </div>
                    <div className="bg-card p-6 rounded-2xl border border-border text-center">
                        <ShieldCheck className="mx-auto text-primary mb-4" size={32} />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-2">Unused & Original</h3>
                        <p className="text-[10px] text-muted font-bold uppercase">Packaging must be intact</p>
                    </div>
                    <div className="bg-card p-6 rounded-2xl border border-border text-center">
                        <RotateCcw className="mx-auto text-primary mb-4" size={32} />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-2">Easy Process</h3>
                        <p className="text-[10px] text-muted font-bold uppercase">Via our support portal</p>
                    </div>
                </div>

                <div className="prose prose-sm prose-gray max-w-none space-y-12">
                    <section>
                        <h2 className="text-xl font-black uppercase tracking-tighter mb-4 border-b-2 border-primary w-fit pb-1">General Terms</h2>
                        <p className="text-sm leading-relaxed text-gray-600">
                            CarTunez is committed to your satisfaction. If you receive a part that is physically damaged, defective, or different from what you ordered, you may request a return within 7 days of delivery.
                        </p>
                    </section>

                    <section className="bg-secondary text-white p-8 rounded-3xl shadow-xl">
                        <div className="flex items-center gap-4 mb-4">
                            <AlertTriangle className="text-primary" size={24} />
                            <h2 className="text-xl font-black uppercase italic tracking-tighter">Non-Returnable Items</h2>
                        </div>
                        <p className="text-sm leading-relaxed text-gray-300 mb-4">
                            Certain types of items cannot be returned due to technical and safety reasons:
                        </p>
                        <ul className="list-disc pl-6 text-sm text-gray-300 space-y-2">
                            <li>Electrical components that have been plugged in or installed.</li>
                            <li>Engine management systems (ECUs) and custom-tuned chips.</li>
                            <li>Items with tampered serial numbers or manufacturer seals.</li>
                            <li>Special-order parts imported specifically for your vehicle.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-black uppercase tracking-tighter mb-4 border-b-2 border-primary w-fit pb-1">The Refund Process</h2>
                        <p className="text-sm leading-relaxed text-gray-600">
                            Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund.
                            If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within 5-10 business days.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
