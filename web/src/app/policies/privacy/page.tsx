'use client';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-white pb-24">
            <div className="bg-card py-20 border-b border-border">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-4">
                        Privacy <span className="text-primary italic">Policy</span>
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted">Last Updated: March 2026</p>
                </div>
            </div>

            <div className="container mx-auto px-6 mt-16 max-w-4xl">
                <div className="prose prose-sm prose-gray max-w-none space-y-12">
                    <section>
                        <h2 className="text-xl font-black uppercase tracking-tighter mb-4 border-b-2 border-primary w-fit pb-1">1. Information Collection</h2>
                        <p className="text-sm leading-relaxed text-gray-600">
                            We collect information from you when you register on our site, place an order, subscribe to our newsletter, respond to a survey or fill out a form. When ordering or registering on our site, as appropriate, you may be asked to enter your: name, e-mail address, mailing address or phone number.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black uppercase tracking-tighter mb-4 border-b-2 border-primary w-fit pb-1">2. Information Usage</h2>
                        <p className="text-sm leading-relaxed text-gray-600">
                            Any of the information we collect from you may be used in one of the following ways:
                        </p>
                        <ul className="list-disc pl-6 text-sm text-gray-600 space-y-2 mt-4">
                            <li>To personalize your experience (your information helps us to better respond to your individual needs)</li>
                            <li>To improve our website (we continually strive to improve our website offerings based on the information and feedback we receive from you)</li>
                            <li>To improve customer service (your information helps us to more effectively respond to your customer service requests and support needs)</li>
                            <li>To process transactions</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-black uppercase tracking-tighter mb-4 border-b-2 border-primary w-fit pb-1">3. Data Protection</h2>
                        <p className="text-sm leading-relaxed text-gray-600">
                            We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information. We offer the use of a secure server. All supplied sensitive/credit information is transmitted via Secure Socket Layer (SSL) technology and then encrypted into our Payment gateway providers database only to be accessible by those authorized with special access rights to such systems.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black uppercase tracking-tighter mb-4 border-b-2 border-primary w-fit pb-1">4. Cookies Policy</h2>
                        <p className="text-sm leading-relaxed text-gray-600">
                            Cookies are small files that a site or its service provider transfers to your computer's hard drive through your Web browser (if you allow) that enables the sites or service providers systems to recognize your browser and capture and remember certain information. We use cookies to help us remember and process the items in your shopping cart and understand and save your preferences for future visits.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
