'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Search, Hammer, Truck, ShieldCheck, CreditCard } from 'lucide-react';

export default function FAQPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const categories = ['All', 'Ordering', 'Shipping', 'Returns', 'Product Help'];

    const faqs = [
        {
            category: 'Ordering',
            question: 'How do I place an order for multiple parts?',
            answer: 'You can add multiple items to your cart by clicking the "Add to Cart" button on the product page. Once you have all your parts, click the cart icon in the top right to proceed to checkout.'
        },
        {
            category: 'Shipping',
            question: 'How long does shipping take within India?',
            answer: 'Standard shipping usually takes 3-7 business days depending on your location. Premium high-performance parts might take slightly longer if they require special handling. You will receive a tracking ID once shipped.'
        },
        {
            category: 'Product Help',
            question: 'Are the products genuine and covered by warranty?',
            answer: 'Yes, all our products are sourced directly from authorized manufacturers. Most parts come with a standard 1-year manufacturer warranty unless specified otherwise on the product page.'
        },
        {
            category: 'Returns',
            question: 'What is your return policy?',
            answer: 'We offer a 7-day return policy for unused products in their original packaging. Please note that custom-tuned or installed electronic components are non-returnable due to safety and testing protocols.'
        },
        {
            category: 'Ordering',
            question: 'Do you offer Cash on Delivery (COD)?',
            answer: 'Currently, we accept all major Credit/Debit cards, UPI, and Net Banking via our secure payment gateway to ensure the fastest processing of your high-value automotive orders.'
        }
    ];

    const filteredFaqs = faqs.filter(faq => 
        (activeCategory === 'All' || faq.category === activeCategory) &&
        (faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || faq.answer.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-[#f8f9fa] pb-24">
            {/* Header Section */}
            <div className="bg-secondary text-white py-24 relative overflow-hidden">
                <div className="container mx-auto px-6 text-center relative z-10">
                    <h1 className="text-5xl font-black uppercase italic tracking-tighter mb-6">
                        Support <span className="text-primary italic">Center</span>
                    </h1>
                    <div className="max-w-2xl mx-auto relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search your question..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/10 backdrop-blur-md border border-white/20 px-16 py-5 rounded-2xl text-lg outline-none focus:bg-white focus:text-secondary transition-all"
                        />
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -mr-48 -mt-48"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-[100px] -ml-40 -mb-40"></div>
            </div>

            <div className="container mx-auto px-6 -mt-10">
                {/* Category Pills */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all shadow-sm ${activeCategory === cat ? 'bg-primary text-white scale-105' : 'bg-white text-muted hover:bg-card'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="max-w-4xl mx-auto">
                    {filteredFaqs.length > 0 ? (
                        <div className="space-y-4">
                            {filteredFaqs.map((faq, index) => (
                                <div key={index} className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-all">
                                    <button 
                                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                        className="w-full text-left px-8 py-6 flex justify-between items-center group"
                                    >
                                        <div className="flex items-center gap-6">
                                            <span className="text-xs font-black uppercase tracking-widest text-[#e83e8c] opacity-50">0{index + 1}</span>
                                            <span className="font-bold text-gray-900 group-hover:text-primary transition-colors">{faq.question}</span>
                                        </div>
                                        {openIndex === index ? <ChevronUp size={20} className="text-primary" /> : <ChevronDown size={20} className="text-muted" />}
                                    </button>
                                    <div className={`transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                                        <div className="px-8 pb-8 pl-[4.5rem]">
                                            <p className="text-sm text-gray-600 leading-relaxed font-medium">
                                                {faq.answer}
                                            </p>
                                            <div className="flex gap-4 mt-6">
                                                <span className="bg-card text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-border">{faq.category}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-muted font-bold uppercase tracking-widest">No matching questions found</p>
                            <button onClick={() => setSearchTerm('')} className="mt-4 text-primary font-black uppercase text-[10px] tracking-widest border-b-2 border-primary">Clear Search</button>
                        </div>
                    )}
                </div>

                {/* Quick Support Links */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-5xl mx-auto">
                    <div className="bg-white p-8 rounded-3xl border border-border text-center group hover:border-primary transition-colors">
                        <div className="w-16 h-16 bg-card rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-white transition-all">
                            <Truck size={24} />
                        </div>
                        <h3 className="font-black uppercase tracking-widest text-[11px] mb-2">Track Shipping</h3>
                        <p className="text-[10px] font-bold text-muted uppercase">Real-time logistics updates</p>
                    </div>
                    <div className="bg-white p-8 rounded-3xl border border-border text-center group hover:border-primary transition-colors">
                        <div className="w-16 h-16 bg-card rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-white transition-all">
                            <ShieldCheck size={24} />
                        </div>
                        <h3 className="font-black uppercase tracking-widest text-[11px] mb-2">Genuine Warranty</h3>
                        <p className="text-[10px] font-bold text-muted uppercase">100% Authentic Parts</p>
                    </div>
                    <div className="bg-white p-8 rounded-3xl border border-border text-center group hover:border-primary transition-colors">
                        <div className="w-16 h-16 bg-card rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-white transition-all">
                            <CreditCard size={24} />
                        </div>
                        <h3 className="font-black uppercase tracking-widest text-[11px] mb-2">Secure Payments</h3>
                        <p className="text-[10px] font-bold text-muted uppercase">Certified Encrypted Gateway</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
