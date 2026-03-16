import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'About Us | CarTunez',
  description: 'Learn about CarTunez, the premium car accessories destination in Hyderabad.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="max-w-4xl mx-auto text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tight text-white">
            Driven by <span className="text-primary font-style-italic">Passion</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 leading-relaxed font-medium">
            CarTunez isn't just an accessory shop. It's a destination for enthusiasts who believe driving is an experience, not just a commute. We are Hyderabad's premier source for high-performance upgrades and premium aftermarket parts.
          </p>
        </section>

        {/* Story Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto mb-20">
          <div className="relative h-[450px] w-full rounded-2xl overflow-hidden border border-border shadow-2xl transition-transform hover:scale-[1.02] duration-500">
            <Image 
              src="/cartunez-store.png" 
              alt="CarTunez Storefront" 
              fill 
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold uppercase tracking-wide text-white">Our Story</h2>
            <div className="w-16 h-1 bg-primary rounded-full"></div>
            <p className="text-gray-400 leading-relaxed text-lg">
              What started as an obsession with cars has evolved into CarTunez. For years, we struggled to find a single, reliable source in India for genuine, premium automotive accessories. We saw a gap between what enthusiasts wanted and what the local market provided.
            </p>
            <p className="text-gray-400 leading-relaxed text-lg">
              Today, CarTunez partners with the biggest names in the industry—from Neo Wheels to DieselTRONIC—to bring you exactly what your vehicle needs to stand out safely and stylishly. 
            </p>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="max-w-6xl mx-auto mb-20">
          <h2 className="text-center text-2xl font-black uppercase tracking-widest text-white mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface/50 border border-border p-8 rounded-xl hover:bg-surface transition-colors group">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">100% Genuine</h3>
              <p className="text-gray-400">We source directly from manufacturers and authorized distributors. No knock-offs, no compromises.</p>
            </div>
            
            <div className="bg-surface/50 border border-border p-8 rounded-xl hover:bg-surface transition-colors group">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Expert Advice</h3>
              <p className="text-gray-400">Not sure about PCDs, offsets, or wiring harnesses? Our team eats, sleeps, and breathes cars. We'll guide you.</p>
            </div>

            <div className="bg-surface/50 border border-border p-8 rounded-xl hover:bg-surface transition-colors group">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h40L5 18Z"/><path d="M15 18H9"/><path d="M19 18h2c.6 0 1-.4 1-1V5c0-.6-.4-1-1-1H11v2"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Fast Shipping</h3>
              <p className="text-gray-400">We ship PAN-India with secure packaging. Get your upgrades delivered to your doorstep safely and swiftly.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center max-w-2xl mx-auto px-4 py-16 bg-gradient-to-b from-primary/10 to-transparent border border-primary/20 rounded-3xl">
          <h2 className="text-3xl font-black uppercase text-white mb-4">Ready to upgrade?</h2>
          <p className="text-gray-400 mb-8">Browse our collection and find the exact parts tailored for your vehicle.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/shop" className="bg-primary text-white font-bold px-8 py-3 rounded-xl hover:bg-red-700 transition-colors uppercase tracking-wider text-sm shadow-[0_0_20px_rgba(255,0,0,0.3)]">
              Enter Shop
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
