'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

export default function ContactPage() {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSubmitting(false);
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Minimal Header */}
            <div className="bg-card py-20 border-b border-border">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-5xl font-black uppercase italic tracking-tighter mb-4">
                        Contact <span className="text-primary italic">Us</span>
                    </h1>
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted">Get in touch with the CarTunez team</p>
                </div>
            </div>

            <div className="container mx-auto px-6 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                    {/* Contact Info */}
                    <div className="space-y-12">
                        <div>
                            <h2 className="text-sm font-black uppercase tracking-[0.2em] mb-8 border-b-4 border-primary w-fit pb-1">Our Offices</h2>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-card rounded-xl border border-border">
                                        <MapPin className="text-primary" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-1">Visit Us</p>
                                        <p className="text-sm font-bold leading-relaxed">Mumbai High-Performance Center,<br />Andheri East, Mumbai, Maharashtra 400069</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-card rounded-xl border border-border">
                                        <Mail className="text-primary" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-1">Email Support</p>
                                        <p className="text-sm font-bold">support@cartunez.in</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-card rounded-xl border border-border">
                                        <Phone className="text-primary" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-1">Call Us</p>
                                        <p className="text-sm font-bold">+91 98765 43210</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-secondary text-white rounded-3xl p-10 shadow-2xl relative overflow-hidden">
                            <div className="relative z-10">
                                <MessageSquare size={40} className="text-primary mb-6" />
                                <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-4">Live Chat <span className="text-primary italic">Support</span></h3>
                                <p className="text-sm font-bold text-gray-300 leading-relaxed mb-6">Our experts are available Mon-Sat (10am - 8pm) to help you choose the right parts for your car.</p>
                                <button className="bg-primary text-white font-black uppercase text-[10px] tracking-widest px-8 py-3 rounded-xl hover:bg-white hover:text-secondary transition-all">Start Chat</button>
                            </div>
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-card rounded-3xl p-10 border border-border">
                        <h2 className="text-sm font-black uppercase tracking-[0.2em] mb-8">Send a Message</h2>
                        {submitted ? (
                            <div className="text-center py-20">
                                <div className="w-20 h-20 bg-[#287b3e] text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                    <Send size={32} />
                                </div>
                                <h3 className="text-xl font-black uppercase tracking-tighter mb-2">Message Sent!</h3>
                                <p className="text-sm text-muted font-bold">We'll get back to you within 24 hours.</p>
                                <button onClick={() => setSubmitted(false)} className="mt-8 text-[10px] font-black uppercase tracking-widest text-primary border-b-2 border-primary">Send Another</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Your Name</label>
                                        <input 
                                            required
                                            type="text" 
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            placeholder="John Doe"
                                            className="w-full bg-white border border-border px-5 py-3.5 rounded-xl text-sm outline-none focus:border-primary transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Email Address</label>
                                        <input 
                                            required
                                            type="email" 
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            placeholder="john@example.com"
                                            className="w-full bg-white border border-border px-5 py-3.5 rounded-xl text-sm outline-none focus:border-primary transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Subject</label>
                                    <input 
                                        required
                                        type="text" 
                                        value={formData.subject}
                                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                        placeholder="Inquiry about custom tuning"
                                        className="w-full bg-white border border-border px-5 py-3.5 rounded-xl text-sm outline-none focus:border-primary transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Your Message</label>
                                    <textarea 
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                                        placeholder="How can we help you?"
                                        rows={5}
                                        className="w-full bg-white border border-border px-5 py-3.5 rounded-xl text-sm outline-none focus:border-primary transition-all resize-none"
                                    />
                                </div>
                                <button 
                                    disabled={submitting}
                                    className="w-full bg-secondary text-white py-4 rounded-xl font-black uppercase text-xs tracking-[0.2em] hover:bg-primary transition-all shadow-lg active:scale-95 disabled:opacity-50"
                                >
                                    {submitting ? 'Transmitting...' : 'Send Transmission'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
