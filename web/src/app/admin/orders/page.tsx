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
  Calendar,
  AlertCircle
} from 'lucide-react';

interface Order {
  id: string;
  createdAt: string;
  totalAmount: number;
  status: string;
  userName?: string;
  user: { email: string };
  items: any[];
  returnStatus?: string;
  returnReason?: string;
  returnAdminComment?: string;
}

export default function OrdersAdminPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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
        if (selectedOrder?.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      }
    } catch (err) {
      console.error('Update status failed:', err);
    }
  };

  const handleReturnAction = async (orderId: string, action: string, adminComment: string) => {
    try {
      const res = await fetch(`${API_URL}/orders/${orderId}/return-action`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action, adminComment })
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(orders.map(o => o.id === orderId ? { ...o, returnStatus: action, returnAdminComment: adminComment } : o));
        if (selectedOrder?.id === orderId) {
          setSelectedOrder({ ...selectedOrder, returnStatus: action, returnAdminComment: adminComment });
        }
        alert(`Return ${action.toLowerCase()} successfully!`);
      }
    } catch (err) {
      console.error('Return action failed:', err);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING': return { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10', label: 'Pending Fulfillment' };
      case 'SHIPPED': return { icon: Truck, color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Shipped' };
      case 'DELIVERED': return { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10', label: 'Delivered' };
      default: return { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10', label: status };
    }
  };

  const isNewOrder = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    return diff < 24 * 60 * 60 * 1000; // Less than 24 hours
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
                orders
                .filter(o => o.id.toLowerCase().includes(searchTerm.toLowerCase()) || o.user?.email.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((order) => {
                  const status = getStatusInfo(order.status);
                  const isNew = isNewOrder(order.createdAt);
                  return (
                    <tr key={order.id} className="hover:bg-muted/30 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                             <span className="text-sm font-black italic tracking-tight">#{order.id.slice(-6).toUpperCase()}</span>
                             {isNew && (
                               <span className="px-1.5 py-0.5 bg-primary text-[8px] font-black italic uppercase rounded animate-pulse">New</span>
                             )}
                          </div>
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
                          <span className="text-sm font-bold tracking-tight">{order.userName || order.user?.email.split('@')[0] || 'Anonymous Driver'}</span>
                          <span className="text-[9px] font-bold uppercase tracking-widest text-muted mt-0.5">{order.user?.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-sm font-black italic tracking-tight">₹{order.totalAmount.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${status.bg} ${status.color} border border-current/20`}>
                           <status.icon size={12} />
                          <span className="text-[9px] font-black uppercase tracking-widest">{status.label}</span>
                        </span>
                        {order.returnStatus && (
                          <div className={`mt-2 flex items-center gap-1.5 text-[8px] font-black uppercase tracking-tighter px-2 py-1 rounded border ${
                            order.returnStatus === 'REQUESTED' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' :
                            order.returnStatus === 'APPROVED' ? 'bg-green-500/10 border-green-500/20 text-green-500' :
                            'bg-red-500/10 border-red-500/20 text-red-500'
                          }`}>
                            Return {order.returnStatus}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                           <select 
                             className="bg-background border border-border text-[9px] font-bold uppercase tracking-widest p-2 rounded-lg outline-none focus:border-primary transition-all cursor-pointer"
                             value={order.status.toUpperCase()}
                             onChange={(e) => updateStatus(order.id, e.target.value)}
                           >
                             <option value="PENDING">SET PENDING</option>
                             <option value="SHIPPED">SET SHIPPED</option>
                             <option value="DELIVERED">SET DELIVERED</option>
                           </select>
                           <button 
                             onClick={() => setSelectedOrder(order)}
                             className="p-2 text-muted-foreground hover:text-primary transition-colors"
                           >
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

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
              <div className="flex flex-col">
                <h2 className="text-xl font-black italic uppercase tracking-tighter">Order Payload Details</h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted">TX-ID: {selectedOrder.id}</p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <AlertCircle size={20} className="rotate-45" />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto flex-1 space-y-8 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary">Destination Telemetry</h3>
                  <div className="bg-muted/50 p-4 rounded-xl border border-border">
                    <p className="text-[11px] font-bold leading-relaxed">{selectedOrder.userName || 'Unknown Driver'}</p>
                    <p className="text-[11px] font-bold text-muted mt-1 leading-relaxed">{(selectedOrder as any).shippingAddress || 'No address provided'}</p>
                    <p className="text-[10px] font-bold text-primary mt-2">{selectedOrder.userEmail}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary">Logistic Status</h3>
                  <div className="flex flex-col gap-3">
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg w-fit ${getStatusInfo(selectedOrder.status).bg} ${getStatusInfo(selectedOrder.status).color} border border-current/20`}>
                      <Clock size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{getStatusInfo(selectedOrder.status).label}</span>
                    </span>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted mt-1 italic">
                      Initialized: {new Date(selectedOrder.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary">Order Manifest</h3>
                <div className="border border-border rounded-xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-muted/50 text-[9px] font-black uppercase tracking-widest text-muted">
                      <tr>
                        <th className="px-4 py-3">Component / Item</th>
                        <th className="px-4 py-3">Quantity</th>
                        <th className="px-4 py-3 text-right">Sub-Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-xs font-bold italic">
                      {selectedOrder.items?.map((item: any, idx: number) => (
                        <tr key={idx} className="hover:bg-muted/20">
                          <td className="px-4 py-4">{item.name || item.product?.name || 'Unknown Part'}</td>
                          <td className="px-4 py-4">{item.quantity} Unit(s)</td>
                          <td className="px-4 py-4 text-right">₹{(item.price * item.quantity).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-muted/30">
                      <tr>
                        <td colSpan={2} className="px-4 py-4 text-[11px] font-black uppercase tracking-widest">Aggregate Payload</td>
                        <td className="px-4 py-4 text-right text-lg font-black italic tracking-tighter text-primary">₹{selectedOrder.totalAmount.toLocaleString()}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Return Management in Modal */}
              {selectedOrder.returnStatus && (
                <div className="space-y-4 p-6 bg-red-50/50 border border-red-100 rounded-2xl">
                   <div className="flex items-center gap-3">
                     <AlertCircle size={20} className="text-red-500" />
                     <h3 className="text-sm font-black uppercase italic tracking-tight">Return Manifest</h3>
                   </div>
                   
                   <div className="space-y-4">
                     <div className="bg-white p-4 rounded-xl border border-red-100">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-2">Customer Reason</p>
                        <p className="text-sm font-bold italic">"{selectedOrder.returnReason}"</p>
                     </div>

                     {selectedOrder.returnStatus === 'REQUESTED' ? (
                       <div className="space-y-4">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted">Admin Decision Payload</p>
                          <textarea 
                            id="adminComment"
                            placeholder="Enter decision rationale..."
                            className="w-full bg-white border border-border p-4 rounded-xl outline-none focus:border-red-500 transition-all text-sm font-semibold min-h-[100px]"
                          />
                          <div className="flex gap-4">
                             <button 
                               onClick={() => {
                                 const comment = (document.getElementById('adminComment') as HTMLTextAreaElement).value;
                                 handleReturnAction(selectedOrder.id, 'APPROVED', comment);
                               }}
                               className="flex-1 bg-green-600 text-white py-3 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-green-600/20 hover:scale-105 active:scale-95 transition-all"
                             >
                               Approve Return
                             </button>
                             <button 
                               onClick={() => {
                                 const comment = (document.getElementById('adminComment') as HTMLTextAreaElement).value;
                                 handleReturnAction(selectedOrder.id, 'REJECTED', comment);
                               }}
                               className="flex-1 bg-red-600 text-white py-3 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-red-600/20 hover:scale-105 active:scale-95 transition-all"
                             >
                               Reject Request
                             </button>
                          </div>
                       </div>
                     ) : (
                       <div className={`p-4 rounded-xl border ${selectedOrder.returnStatus === 'APPROVED' ? 'bg-green-100 border-green-200 text-green-700' : 'bg-red-100 border-red-200 text-red-700'}`}>
                          <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-70">Decision: {selectedOrder.returnStatus}</p>
                          <p className="text-sm font-bold italic">"{selectedOrder.returnAdminComment || 'No comment provided.'}"</p>
                       </div>
                     )}
                   </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-border bg-muted/30 flex justify-end gap-4">
               <button 
                 onClick={() => setSelectedOrder(null)}
                 className="px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors"
               >
                 Dismiss
               </button>
               <select 
                 className="bg-primary text-white border-none text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl outline-none cursor-pointer hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                 value={selectedOrder.status.toUpperCase()}
                 onChange={(e) => updateStatus(selectedOrder.id, e.target.value)}
               >
                 <option value="PENDING">SET PENDING</option>
                 <option value="SHIPPED">SET SHIPPED</option>
                 <option value="DELIVERED">SET DELIVERED</option>
               </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
