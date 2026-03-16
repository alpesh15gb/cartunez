import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | CarTunez",
  description: "Get in touch with CarTunez for premium car accessories and expert advice.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tight">
              Get In <span className="text-primary italic">Touch</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Have questions about vehicle compatibility or specific products? Our team of enthusiasts is ready to help you tune your ride to perfection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-surface/50 border border-border p-8 rounded-3xl shadow-xl">
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-bold uppercase tracking-wider text-gray-400">Full Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      className="w-full bg-background border border-border px-4 py-3 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-bold uppercase tracking-wider text-gray-400">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      className="w-full bg-background border border-border px-4 py-3 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-bold uppercase tracking-wider text-gray-400">Subject</label>
                  <select 
                    id="subject" 
                    className="w-full bg-background border border-border px-4 py-3 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none"
                  >
                    <option>Product Inquiry</option>
                    <option>Vehicle Compatibility</option>
                    <option>Shipping & Returns</option>
                    <option>Bulk Orders</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-bold uppercase tracking-wider text-gray-400">Message</label>
                  <textarea 
                    id="message" 
                    rows={5}
                    className="w-full bg-background border border-border px-4 py-3 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    placeholder="Tell us about your car and what you're looking for..."
                  ></textarea>
                </div>

                <button type="submit" className="w-full btn-primary py-4 font-black uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(255,0,0,0.2)] hover:shadow-[0_0_30px_rgba(255,0,0,0.4)]">
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col justify-center space-y-12">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold uppercase tracking-widest text-white">Visit Our Studio</h2>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  <div>
                    <p className="text-white font-bold mb-1">Hyderabad Store</p>
                    <p className="text-gray-400">Shop number. 12&13, Veer Hanuman Temple S.P.Road,<br />Secunderabad, Hyderabad, Telangana 500003</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-bold uppercase tracking-widest text-white">Direct Channels</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Email Us</p>
                      <p className="text-white font-bold">cartunezhyd@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Call Us</p>
                      <p className="text-white font-bold">+91 99496 95030</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-border">
                <p className="text-gray-500 italic">"Engineering the roar. Styling the ride."</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
