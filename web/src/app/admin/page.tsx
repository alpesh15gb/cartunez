'use client';

import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { API_URL } from '@/config';
import { 
  Users, 
  Package, 
  TrendingUp, 
  AlertCircle,
  ArrowUpRight,
  ShoppingCart
} from 'lucide-react';

interface Stats {
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  pendingOrders: number;
  totalSales: number;
}

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_URL}/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchStats();
  }, [token]);

  const cards = [
    { 
      name: 'Total Revenue', 
      value: `₹${(stats?.totalSales || 0).toLocaleString()}`, 
      label: 'Real-time Earnings',
      icon: TrendingUp,
      color: 'text-green-500',
      bg: 'bg-green-500/10'
    },
    { 
      name: 'Active Orders', 
      value: (stats?.totalOrders || 0).toString(), 
      label: `${stats?.pendingOrders || 0} pending fulfillment`,
      icon: ShoppingCart,
      color: 'text-primary',
      bg: 'bg-primary/10'
    },
    { 
      name: 'Catalog Size', 
      value: (stats?.totalProducts || 0).toString(), 
      label: 'Inventory active in fleet',
      icon: Package,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    { 
      name: 'Total Drivers', 
      value: (stats?.totalUsers || 0).toString(), 
      label: 'Registered users base',
      icon: Users,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10'
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-card rounded-2xl animate-pulse border border-border" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black italic uppercase tracking-tighter">Command Center</h1>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">Fleet and Inventory Performance Monitoring</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.name} className="group relative overflow-hidden bg-card border border-border rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/50 hover:-translate-y-1">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-1">{card.name}</p>
                <h3 className="text-2xl font-black italic tracking-tight">{card.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${card.bg} ${card.color}`}>
                <card.icon size={20} />
              </div>
            </div>
            
            <div className="mt-4 flex items-center gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted">{card.label}</span>
              <ArrowUpRight size={12} className="text-primary ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Subtle Gradient Accent */}
            <div className={`absolute bottom-0 left-0 h-[2px] w-0 bg-primary group-hover:w-full transition-all duration-500`} />
          </div>
        ))}
      </div>

      {/* Activity / Placeholder for Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-8 relative overflow-hidden h-[400px]">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h3 className="text-xl font-black italic uppercase tracking-tight">Performance Chart</h3>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Revenue & Orders Activity</p>
            </div>
            <div className="flex gap-2">
              <div className="px-3 py-1 bg-background border border-border rounded text-[10px] font-bold uppercase tracking-widest">Monthly</div>
            </div>
          </div>
          
          <div className="flex h-full items-center justify-center border-t border-dashed border-border mt-4 pt-4">
             <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground animate-pulse">Visual Analytics Incoming...</p>
          </div>
          
          {/* Glass Overlay for Chart Placeholder */}
          <div className="absolute inset-x-8 bottom-24 top-24 bg-primary/5 blur-3xl rounded-full" />
        </div>

        <div className="bg-card border border-border rounded-2xl p-8">
          <div className="space-y-1 mb-8">
            <h3 className="text-xl font-black italic uppercase tracking-tight">System Status</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Real-time Infrastructure Health</p>
          </div>
          
          <div className="space-y-6">
            {[
              { label: 'Database Sync', status: 'Operational', color: 'bg-green-500' },
              { label: 'API Gateway', status: 'Active', color: 'bg-green-500' },
              { label: 'Admin Mobile Connect', status: 'Live', color: 'bg-green-500' },
              { label: 'Payment Integration', status: 'Standby', color: 'bg-yellow-500' },
              { label: 'Catalog Scraper', status: 'Idle', color: 'bg-blue-500' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between group">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">{item.label}</span>
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-foreground">{item.status}</span>
                  <div className={`h-1.5 w-1.5 rounded-full ${item.color} shadow-[0_0_8px] shadow-current transition-all group-hover:scale-150`} />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 bg-primary/5 border border-primary/20 rounded-xl p-4 flex gap-4 items-center">
            <AlertCircle size={24} className="text-primary shrink-0" />
            <div>
              <p className="text-[10px] font-black uppercase text-foreground leading-tight">Catalog Import Active</p>
              <p className="text-[9px] font-bold text-muted uppercase tracking-wider">846 Products Synced</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
