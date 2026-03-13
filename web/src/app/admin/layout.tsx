'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Newspaper, 
  Settings, 
  LogOut,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'News Feed', href: '/admin/news', icon: Newspaper },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && (!isAuthenticated || user?.role !== 'ADMIN')) {
      router.push('/login');
    }
  }, [mounted, isAuthenticated, user, router]);

  if (!mounted || !isAuthenticated || user?.role !== 'ADMIN') {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-card transition-all duration-300 ease-in-out`}
      >
        {/* Branding */}
        <div className="flex h-20 items-center justify-between px-6">
          {isSidebarOpen && (
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-black italic tracking-tighter text-primary">CARTUNEZ</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Admin</span>
            </Link>
          )}
          <button 
            onClick={toggleSidebar}
            className="rounded-lg p-2 hover:bg-muted transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 px-4 py-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <item.icon size={22} className={isActive ? 'scale-110' : ''} />
                {isSidebarOpen && (
                  <span className="text-sm font-semibold tracking-wide">{item.name}</span>
                )}
                {isActive && isSidebarOpen && (
                  <ChevronRight size={16} className="ml-auto opacity-50" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3 px-2 py-3 rounded-xl hover:bg-muted transition-colors group cursor-pointer" onClick={() => logout()}>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
              {user.email.charAt(0).toUpperCase()}
            </div>
            {isSidebarOpen && (
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-xs font-bold uppercase tracking-wider">{user.email.split('@')[0]}</p>
                <p className="text-[10px] text-muted font-bold uppercase tracking-widest">Sign Out</p>
              </div>
            )}
            {isSidebarOpen && <LogOut size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main 
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'pl-64' : 'pl-20'
        }`}
      >
        <header className="sticky top-0 z-40 flex h-20 items-center border-b border-border bg-background/80 px-8 backdrop-blur-md">
          <div className="flex items-center gap-4">
             <h2 className="text-lg font-black uppercase italic tracking-tight">
               {navItems.find(i => i.href === pathname)?.name || 'Admin Panel'}
             </h2>
          </div>
          
          <div className="ml-auto flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">System Online</span>
              <span className="text-[10px] font-bold text-muted uppercase italic">Performance Mode</span>
            </div>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
