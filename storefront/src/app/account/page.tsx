import Link from "next/link";
import Image from "next/image";

export default function AccountPage() {
  return (
    <main className="flex-grow pt-8 pb-32 container mx-auto px-4 max-w-6xl">
      <div className="flex flex-col md:flex-row items-start gap-8 lg:gap-12">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0 bg-surface border border-border rounded-2xl p-6 md:sticky md:top-24 shadow-surface">
          <div className="flex items-center gap-4 border-b border-border pb-6 mb-6">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary font-black text-xl">
              R
            </div>
            <div>
              <h2 className="font-bold">Rahul Sharma</h2>
              <p className="text-sm text-gray-500">rahul.sharma@example.com</p>
            </div>
          </div>
          
          <nav className="space-y-2">
            {[
              { label: 'Order History', icon: <><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M15 11h-6"/><path d="M15 15h-6"/></>, active: true },
              { label: 'Saved Addresses', icon: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>, active: false },
              { label: 'Saved Vehicles', icon: <><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></>, active: false },
              { label: 'My Wishlist', icon: <><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></>, href: '/wishlist', active: false },
            ].map((item, i) => (
              <Link key={i} href={item.href || '#'} className={`flex items-center gap-3 p-3 rounded-lg transition-colors font-bold ${item.active ? 'bg-primary/10 text-primary' : 'hover:bg-background text-gray-400 hover:text-white'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={item.active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {item.icon}
                </svg>
                {item.label}
              </Link>
            ))}
          </nav>
          
          <div className="mt-8 pt-6 border-t border-border">
            <button className="flex items-center gap-3 p-3 rounded-lg text-red-500 font-bold hover:bg-red-500/10 transition-colors w-full">
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
               Logout
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-grow w-full space-y-8">
          
          {/* Order History Section */}
          <section>
            <h1 className="text-3xl font-black mb-6 uppercase tracking-wider">Order History</h1>
            <div className="space-y-4">
              {/* Order Card */}
              <div className="bg-surface border border-border rounded-xl p-6 shadow-surface">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-border pb-4 mb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm">
                    <div>
                      <span className="text-gray-500 block">Order Placed</span>
                      <span className="font-bold text-white">Mar 12, 2026</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Total</span>
                      <span className="font-bold text-white">₹8,498.00</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Ship To</span>
                      <span className="font-bold text-primary cursor-pointer hover:underline">Rahul Sharma</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:items-end text-sm">
                    <span className="text-gray-500 block">Order # 409-2819-3810</span>
                    <Link href="#" className="font-bold text-primary hover:text-white transition-colors">View Invoice</Link>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-6">
                  <div className="flex gap-4">
                     <div className="w-20 h-20 bg-background rounded-lg border border-border overflow-hidden shrink-0 relative">
                        <Image src="https://images.unsplash.com/photo-1621251349071-70bf214d48db?auto=format&fit=crop&q=80&w=200" alt="Product" fill className="object-cover" />
                     </div>
                     <div>
                       <Link href="/product/demo" className="font-bold text-lg hover:text-primary transition-colors block leading-tight">LED Ambient Interior Kit V2 </Link>
                       <p className="text-xs text-gray-500 mt-1">Return window closed on Mar 20, 2026</p>
                       <div className="mt-3 flex gap-2">
                         <button className="btn-primary py-2 px-4 shadow-none border border-primary text-xs w-auto">Buy it again</button>
                       </div>
                     </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 shrink-0 sm:w-48 text-sm">
                     <button className="bg-background border border-border hover:border-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors w-full">Track Package</button>
                     <button className="bg-background border border-border hover:border-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors w-full">Leave Review</button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Saved Vehicles Section */}
          <section>
            <h2 className="text-2xl font-black mb-6 uppercase tracking-wider flex items-center justify-between">
              Saved Vehicles
              <button className="text-sm font-bold text-primary hover:text-white transition-colors flex items-center gap-1">+ Add New</button>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="bg-primary/5 border border-primary rounded-xl p-4 shadow-glow relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-3 bg-primary text-black rounded-bl-xl font-bold text-xs shadow-glow">Active</div>
                 <div className="flex items-center gap-4 relative z-10">
                    <div className="w-16 h-16 bg-background rounded-full border border-primary flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-primary uppercase tracking-widest block mb-1">Make / Model / Year</span>
                      <h3 className="text-xl font-black">Hyundai Creta 2020</h3>
                    </div>
                 </div>
               </div>
               
               <div className="bg-surface border border-border hover:border-gray-500 cursor-pointer transition-colors rounded-xl p-4 flex items-center justify-center text-gray-400 group border-dashed">
                 <div className="flex flex-col items-center gap-2 group-hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    <span className="font-bold text-sm">Add another vehicle for tailored compatibility.</span>
                 </div>
               </div>
            </div>
          </section>

          {/* Saved Addresses Section */}
          <section>
            <h2 className="text-2xl font-black mb-6 uppercase tracking-wider flex items-center justify-between">
              Saved Addresses
            </h2>
            <div className="bg-surface border border-border rounded-xl p-6 w-full max-w-sm">
               <div className="flex justify-between items-start mb-2">
                 <h3 className="font-bold text-lg">Home Address</h3>
                 <div className="flex gap-2">
                   <button className="text-gray-400 hover:text-white transition-colors text-sm font-bold">Edit</button>
                   <span className="text-gray-600">|</span>
                   <button className="text-gray-400 hover:text-red-500 transition-colors text-sm font-bold">Remove</button>
                 </div>
               </div>
               <p className="text-sm text-gray-400 leading-relaxed mb-4">
                 Rahul Sharma<br/>
                 123 Example Street, Block A<br/>
                 Andheri East<br/>
                 Mumbai, Maharashtra 400001
               </p>
               <span className="text-xs font-bold border border-primary text-primary px-3 py-1 rounded bg-primary/10">Default Shipping</span>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
