'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { API_URL } from '@/config';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Eye, 
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Image as ImageIcon
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  discountPrice: number | null;
  images: string[];
  category: { name: string };
  stock: number;
  isOutOfStock: boolean;
}

export default function ProductsAdminPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/products?page=${page}&search=${searchTerm}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        const productsList = Array.isArray(data) ? data : (data.products || []);
        setProducts(productsList);
        setTotalPages(data.pagination?.totalPages || 1);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchProducts();
  }, [token, page, searchTerm]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">Inventory Fleet</h1>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">Manage 846+ Premium Automotive Assets</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="SEARCH ASSETS..."
              className="pl-12 pr-6 py-3 bg-card border border-border rounded-xl outline-none focus:border-primary transition-all w-full md:w-64 text-xs font-bold uppercase tracking-widest"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Link href="/admin/products/new" className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold uppercase italic text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20">
            <Plus size={18} />
            Add Asset
          </Link>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl shadow-black/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted">Product Details</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted">Category</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted">Pricing</th>
                 <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted">Inventory</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted">Status</th>
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
              ) : products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-xl border border-border bg-background overflow-hidden relative shrink-0">
                          {product.images[0] ? (
                            <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-muted">
                              <ImageIcon size={20} />
                            </div>
                          )}
                          <div className="absolute top-1 right-1 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded text-[8px] font-bold text-white uppercase tracking-tighter">
                            {product.images.length}P
                          </div>
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-bold text-sm tracking-tight truncate max-w-[200px]">{product.name}</p>
                          <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mt-0.5 truncate uppercase">ID: {product.id.slice(-8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1 bg-background border border-border rounded-full text-[9px] font-bold uppercase tracking-widest text-muted">
                        {product.category?.name || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-black italic tracking-tight">₹{product.discountPrice || product.price}</span>
                        {product.discountPrice && (
                          <span className="text-[10px] text-muted-foreground line-through font-bold tracking-tighter decoration-primary decoration-2">₹{product.price}</span>
                        )}
                      </div>
                    </td>
                     <td className="px-6 py-5">
                       <div className="flex items-center gap-2">
                         <div className={`h-2 w-2 rounded-full ${product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'} shadow-[0_0_8px] shadow-current`} />
                         <span className="text-xs font-bold uppercase tracking-widest">{product.stock} units</span>
                       </div>
                    </td>
                    <td className="px-6 py-5">
                       {product.isOutOfStock ? (
                         <span className="px-2 py-1 bg-red-500/10 text-red-500 text-[8px] font-black uppercase rounded border border-red-500/20 tracking-tighter">Force OOS</span>
                       ) : (
                         <span className="px-2 py-1 bg-green-500/10 text-green-500 text-[8px] font-black uppercase rounded border border-green-500/20 tracking-tighter">Normal</span>
                       )}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <Link 
                          href={`/product/${product.id}`} 
                          target="_blank"
                          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                        >
                          <Eye size={16} />
                        </Link>
                        <Link 
                          href={`/admin/products/${product.id}`} 
                          className="p-2 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                        >
                          <Edit2 size={16} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted">No Assets Detected in this sector</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-5 border-t border-border bg-muted/20 flex items-center justify-between">
           <p className="text-[10px] font-bold uppercase tracking-widest text-muted">
             DEPLOYED SECTOR {page} OF {totalPages}
           </p>
           
           <div className="flex items-center gap-2">
             <button 
               disabled={page === 1}
               onClick={() => setPage(p => p - 1)}
               className="p-2 border border-border rounded-lg disabled:opacity-30 hover:bg-muted transition-colors"
             >
               <ChevronLeft size={18} />
             </button>
             <button 
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
               className="p-2 border border-border rounded-lg disabled:opacity-30 hover:bg-muted transition-colors"
             >
               <ChevronRight size={18} />
             </button>
           </div>
        </div>
      </div>
    </div>
  );
}
