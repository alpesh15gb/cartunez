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
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsRes = await fetch(`${API_URL}/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const statsData = await statsRes.json();
        setStats(statsData);

        const ordersRes = await fetch(`${API_URL}/orders`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const ordersData = await ordersRes.json();
        setRecentOrders(Array.isArray(ordersData) ? ordersData.slice(0, 5) : []);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchDashboardData();
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

        {/* Quick Actions Panel */}
        <div className="bg-card border border-border rounded-2xl p-8">
          <div className="space-y-1 mb-8">
            <h3 className="text-xl font-black italic uppercase tracking-tight">Quick Actions</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Common Management Tasks</p>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <button 
              onClick={() => window.location.href = '/admin/products'}
              className="flex items-center justify-between p-4 bg-background border border-border rounded-xl hover:border-primary transition-all group"
            >
              <div className="flex items-center gap-3">
                <Package size={18} className="text-muted group-hover:text-primary transition-colors" />
                <span className="text-[10px] font-black uppercase tracking-widest">Add New Product</span>
              </div>
              <ArrowUpRight size={14} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            
            <button 
              onClick={() => window.location.href = '/admin/orders'}
              className="flex items-center justify-between p-4 bg-background border border-border rounded-xl hover:border-primary transition-all group"
            >
              <div className="flex items-center gap-3">
                <ShoppingCart size={18} className="text-muted group-hover:text-primary transition-colors" />
                <span className="text-[10px] font-black uppercase tracking-widest">Review Penalties</span>
              </div>
              <ArrowUpRight size={14} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center justify-between p-4 bg-background border border-border rounded-xl hover:border-primary transition-all group"
            >
              <div className="flex items-center gap-3">
                <Users size={18} className="text-muted group-hover:text-primary transition-colors" />
                <span className="text-[10px] font-black uppercase tracking-widest">Manage Staff</span>
              </div>
              <ArrowUpRight size={14} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-8 border-b border-border flex justify-between items-center">
          <div className="space-y-1">
            <h3 className="text-xl font-black italic uppercase tracking-tight">Recent Deployments</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Latest Customer Order Stream</p>
          </div>
          <button 
            onClick={() => window.location.href = '/admin/orders'}
            className="text-[10px] font-black uppercase tracking-widest text-primary border-b-2 border-primary"
          >
            View All Orders
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#f8f9fa] border-b border-border">
              <tr>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted">Order ID</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted">Customer</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted">Amount</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted">Status</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#fcfcfc] transition-colors group">
                    <td className="px-8 py-5">
                      <span className="font-bold text-xs tracking-tighter">#{order.id.slice(-8).toUpperCase()}</span>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-xs font-bold leading-tight">{order.user?.email.split('@')[0]}</p>
                      <p className="text-[9px] text-muted-foreground uppercase font-medium">{order.user?.email}</p>
                    </td>
                    <td className="px-8 py-5">
                      <span className="font-black text-xs text-primary italic">₹{order.totalAmount.toLocaleString()}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <div className={`h-1.5 w-1.5 rounded-full ${order.status === 'DELIVERED' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{order.status}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => window.location.href = `/admin/orders`}
                        className="p-2 hover:bg-primary/10 rounded-lg text-primary transition-colors"
                      >
                        <ArrowUpRight size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-10 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Scanning for active fleet orders...</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
