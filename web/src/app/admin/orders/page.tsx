'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { API_URL } from '@/config';
import { 
  ShoppingCart, 
  Clock, 
  CheckCircle, 
  Truck, 
  Package, 
  ChevronRight,
  MoreVertical,
  ExternalLink,
  Search,
  Calendar
} from 'lucide-react';

interface Order {
  id: string;
  createdAt: string;
  total: number;
  status: string;
  userName?: string;
  userEmail: string;
  items: any[];
}

export default function OrdersAdminPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_URL}/orders`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchOrders();
  }, [token]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      }
    } catch (err) {
      console.error('Update status failed:', err);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING': return { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10', label: 'Processing' };
      case 'SHIPPED': return { icon: Truck, color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'In Transit' };
      case 'DELIVERED': return { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10', label: 'Delivered' };
      default: return { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10', label: status };
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">Order Logistics</h1>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">Monitor and Manage Customer Shipments</p>
        </div>
        
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="FIND ORDER ID..."
            className="pl-12 pr-6 py-3 bg-card border border-border rounded-xl outline-none focus:border-primary transition-all w-full md:w-64 text-xs font-bold uppercase tracking-widest"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl shadow-black/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted">Ref ID & Date</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted">Customer Detail</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted">Transaction Total</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted">Logistics Status</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-8 h-20 bg-muted/10"></td>
                  </tr>
                ))
              ) : orders.length > 0 ? (
                orders.map((order) => {
                  const status = getStatusInfo(order.status);
                  return (
                    <tr key={order.id} className="hover:bg-muted/30 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-black italic tracking-tight">#{order.id.slice(-6).toUpperCase()}</span>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Calendar size={10} />
                            <span className="text-[9px] font-bold uppercase tracking-widest">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold tracking-tight">{order.userName || 'Anonymous Driver'}</span>
                          <span className="text-[9px] font-bold uppercase tracking-widest text-muted mt-0.5">{order.userEmail}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-sm font-black italic tracking-tight">₹{order.total.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${status.bg} ${status.color} border border-current/20`}>
                          <status.icon size={12} />
                          <span className="text-[9px] font-black uppercase tracking-widest">{status.label}</span>
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                           <select 
                             className="bg-background border border-border text-[9px] font-bold uppercase tracking-widest p-2 rounded-lg outline-none focus:border-primary transition-all cursor-pointer"
                             value={order.status.toUpperCase()}
                             onChange={(e) => updateStatus(order.id, e.target.value)}
                           >
                             <option value="PENDING">SET PROCESSING</option>
                             <option value="SHIPPED">SET SHIPPED</option>
                             <option value="DELIVERED">SET DELIVERED</option>
                           </select>
                           <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
                              <ExternalLink size={16} />
                           </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted">No Logistics Activity Detected</p>
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
