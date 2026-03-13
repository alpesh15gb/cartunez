'use client';

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-white pb-24">
            <div className="bg-card py-20 border-b border-border">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-4">
                        Terms of <span className="text-primary italic">Service</span>
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted">Legal Agreement for CarTunez Platform</p>
                </div>
            </div>

            <div className="container mx-auto px-6 mt-16 max-w-4xl">
                <div className="prose prose-sm prose-gray max-w-none space-y-12">
                    <section>
                        <h2 className="text-xl font-black uppercase tracking-tighter mb-4 border-b-2 border-primary w-fit pb-1">1. Acceptance of Terms</h2>
                        <p className="text-sm leading-relaxed text-gray-600">
                            By accessing and using Cartunez.in, you agree to be bound by these Terms of Service and all applicable laws and regulations in India. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black uppercase tracking-tighter mb-4 border-b-2 border-primary w-fit pb-1">2. Use License</h2>
                        <p className="text-sm leading-relaxed text-gray-600">
                            Permission is granted to temporarily download one copy of the materials (information or software) on Cartunez's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black uppercase tracking-tighter mb-4 border-b-2 border-primary w-fit pb-1">3. Product Accuracy</h2>
                        <p className="text-sm leading-relaxed text-gray-600">
                            The materials appearing on Cartunez's website could include technical, typographical, or photographic errors. Cartunez does not warrant that any of the materials on its website are accurate, complete or current. We may make changes to the materials contained on its website at any time without notice.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black uppercase tracking-tighter mb-4 border-b-2 border-primary w-fit pb-1">4. Delivery Terms</h2>
                        <p className="text-sm leading-relaxed text-gray-600">
                            Shipping times are estimates and not guaranteed. Cartunez is not liable for delays caused by third-party logistics partners or customs clearances within India.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
