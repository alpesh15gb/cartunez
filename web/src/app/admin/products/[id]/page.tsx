'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useParams, useRouter } from 'next/navigation';
import { API_URL } from '@/config';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  Image as ImageIcon,
  Layout,
  Tag,
  Hash,
  Info,
  ChevronDown
} from 'lucide-react';

export default function ProductFormPage() {
  const params = useParams();
  const id = params?.id as string;
  const isEdit = id && id !== 'new';
  const { token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    discountPrice: '',
    description: '',
    categoryId: '',
    images: [''],
    stock: '100',
    isOutOfStock: false,
    specifications: ''
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/categories`);
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };

    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/products/${id}`);
        const data = await res.json();
        setFormData({
          name: data.name,
          price: data.price.toString(),
          discountPrice: data.discountPrice?.toString() || '',
          description: data.description || '',
          categoryId: data.categoryId,
          images: data.images.length > 0 ? data.images : [''],
          stock: (data.stockQuantity || 100).toString(),
          isOutOfStock: data.isOutOfStock || false,
          specifications: data.specifications || ''
        });
      } catch (err) {
        console.error('Failed to fetch product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    if (isEdit) fetchProduct();
  }, [id, isEdit]);

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const removeImageField = (index: number) => {
    if (formData.images.length === 1) return;
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
      stockQuantity: parseInt(formData.stock),
      images: formData.images.filter(img => img.trim() !== '')
    };

    try {
      const url = isEdit ? `${API_URL}/products/${id}` : `${API_URL}/products`;
      const method = isEdit ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        router.push('/admin/products');
      }
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="h-96 flex items-center justify-center text-muted uppercase font-bold tracking-widest animate-pulse">Scanning Asset Data...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Breadcrumbs */}
      <div className="flex items-center justify-between">
        <Link href="/admin/products" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest">
          <ArrowLeft size={16} />
          Inventory List
        </Link>
        <div className="flex items-center gap-2">
           <div className={`h-2 w-2 rounded-full ${isEdit ? 'bg-primary animate-pulse' : 'bg-green-500'} shadow-[0_0_8px] shadow-current`} />
           <span className="text-[10px] font-black uppercase tracking-widest">{isEdit ? 'Modification Mode' : 'New Deployment'}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-primary/10 text-primary rounded-xl">
                  <Layout size={20} />
                </div>
                <h3 className="text-xl font-black italic uppercase tracking-tight">Core Configuration</h3>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted">Asset Name</label>
                <input 
                  required
                  className="w-full bg-background border border-border p-4 rounded-xl outline-none focus:border-primary transition-all text-sm font-semibold"
                  placeholder="e.g. NH ONE LED Headlight Pro Vision"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted">Technical Description</label>
                <textarea 
                  rows={6}
                  className="w-full bg-background border border-border p-4 rounded-xl outline-none focus:border-primary transition-all text-sm font-semibold"
                  placeholder="Detail the performance specifications..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>

            {/* Pricing and Stock */}
            <div className="bg-card border border-border rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-primary/10 text-primary rounded-xl">
                  <Tag size={20} />
                </div>
                <h3 className="text-xl font-black italic uppercase tracking-tight">Market & Stock</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted">MRP (₹)</label>
                  <input 
                    required
                    type="number"
                    className="w-full bg-background border border-border p-4 rounded-xl outline-none focus:border-primary transition-all text-sm font-semibold"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted">Discount Price (₹)</label>
                  <input 
                    type="number"
                    className="w-full bg-background border border-border p-4 rounded-xl outline-none focus:border-primary transition-all text-sm font-semibold"
                    value={formData.discountPrice}
                    onChange={e => setFormData({...formData, discountPrice: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted">In-Stock Units</label>
                  <input 
                    required
                    type="number"
                    className="w-full bg-background border border-border p-4 rounded-xl outline-none focus:border-primary transition-all text-sm font-semibold"
                    value={formData.stock}
                    onChange={e => setFormData({...formData, stock: e.target.value})}
                  />
                </div>
              </div>

              {/* Force Out of Stock Toggle */}
              <div className="mt-8 pt-8 border-t border-border flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="text-sm font-black uppercase italic tracking-tight">Manual Availability Override</h4>
                  <p className="text-[10px] font-bold text-muted uppercase tracking-widest leading-relaxed">
                    Force product status to "Out of Stock" regardless of quantity count
                  </p>
                </div>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, isOutOfStock: !formData.isOutOfStock})}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors border-2 ${formData.isOutOfStock ? 'bg-red-500 border-red-500 shadow-[0_0_15px] shadow-red-500/30' : 'bg-muted border-border'}`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${formData.isOutOfStock ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Media and Sidebar Info */}
          <div className="space-y-8">
            <div className="bg-card border border-border rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-primary/10 text-primary rounded-xl">
                  <ImageIcon size={20} />
                </div>
                <h3 className="text-xl font-black italic uppercase tracking-tight">Fleet Imagery</h3>
              </div>

              <div className="space-y-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="space-y-2 ring-1 ring-border p-3 rounded-xl bg-background/50 hover:bg-background transition-colors">
                     <div className="flex items-center justify-between">
                       <label className="text-[9px] uppercase font-black tracking-widest text-muted">Image {index + 1} URL</label>
                       {formData.images.length > 1 && (
                         <button onClick={() => removeImageField(index)} className="text-red-500 p-1 hover:bg-red-500/10 rounded">
                           <Trash2 size={12} />
                         </button>
                       )}
                     </div>
                     <input 
                        className="w-full bg-background border border-border p-2 rounded-lg outline-none focus:border-primary transition-all text-[10px] font-mono"
                        placeholder="https://..."
                        value={image}
                        onChange={e => handleImageChange(index, e.target.value)}
                      />
                      {image && (
                        <div className="mt-2 h-20 w-full rounded-lg overflow-hidden border border-border shadow-inner">
                          <img src={image} className="w-full h-full object-cover" alt="Preview" />
                        </div>
                      )}
                  </div>
                ))}
                <button 
                  type="button"
                  onClick={addImageField}
                  className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-border rounded-xl text-[10px] font-bold uppercase tracking-widest text-muted hover:border-primary hover:text-primary transition-all"
                >
                  <Plus size={14} />
                  Add Image URL
                </button>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-primary/10 text-primary rounded-xl">
                  <Info size={20} />
                </div>
                <h3 className="text-xl font-black italic uppercase tracking-tight">Classification</h3>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted">Assign Category</label>
                <select 
                  required
                  className="w-full bg-background border border-border p-4 rounded-xl outline-none focus:border-primary transition-all text-sm font-semibold appearance-none"
                  value={formData.categoryId}
                  onChange={e => setFormData({...formData, categoryId: e.target.value})}
                >
                  <option value="">Select Sector...</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Floating/Fixed Save Bar */}
        <div className="fixed bottom-8 right-8 z-50">
          <button 
            type="submit"
            disabled={saving}
            className="flex items-center gap-3 bg-primary text-primary-foreground px-10 py-5 rounded-full font-black uppercase italic tracking-widest shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            {saving ? (
              <div className="h-5 w-5 border-2 border-primary-foreground border-t-transparent animate-spin rounded-full" />
            ) : (
              <Save size={20} />
            )}
            {isEdit ? 'Save Modification' : 'Deploy Asset'}
          </button>
        </div>
      </form>
    </div>
  );
}
