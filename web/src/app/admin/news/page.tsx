'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { API_URL } from '@/config';
import { 
  Newspaper, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Image as ImageIcon,
  Save,
  Clock,
  Globe
} from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  externalUrl?: string;
  createdAt: string;
}

export default function NewsAdminPage() {
  const { token } = useAuth();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: '',
    externalUrl: '',
  });

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(`${API_URL}/news`);
        const data = await res.json();
        setNews(data);
      } catch (err) {
        console.error('Failed to fetch news:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/news`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const newItem = await res.json();
        setNews([newItem, ...news]);
        setFormData({ title: '', content: '', imageUrl: '', externalUrl: '' });
        setIsAdding(false);
      }
    } catch (err) {
      console.error('Failed to create news:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminate this news post?')) return;
    try {
      const res = await fetch(`${API_URL}/news/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setNews(news.filter(n => n.id !== id));
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">Broadcast Center</h1>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">Deploy Marketing Updates to the Homepage Fleet</p>
        </div>
        
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold uppercase italic text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
        >
          {isAdding ? <Trash2 size={18} /> : <Plus size={18} />}
          {isAdding ? 'Cancel Feed' : 'New Broadcast'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-card border-2 border-primary/20 rounded-2xl p-8 space-y-6 animate-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted">Headline Title</label>
              <input 
                required
                className="w-full bg-background border border-border p-4 rounded-xl outline-none focus:border-primary transition-all text-sm font-semibold"
                placeholder="e.g. New Performance Lighting Arriving Soon"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted">Cover Image URL</label>
              <input 
                className="w-full bg-background border border-border p-4 rounded-xl outline-none focus:border-primary transition-all text-sm font-semibold"
                placeholder="https://..."
                value={formData.imageUrl}
                onChange={e => setFormData({...formData, imageUrl: e.target.value})}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted">Broadcast Content</label>
            <textarea 
              required
              rows={4}
              className="w-full bg-background border border-border p-4 rounded-xl outline-none focus:border-primary transition-all text-sm font-semibold"
              placeholder="Tell your story..."
              value={formData.content}
              onChange={e => setFormData({...formData, content: e.target.value})}
            />
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 space-y-2 w-full">
              <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted">Social/External Link (Facebook/Insta)</label>
              <input 
                className="w-full bg-background border border-border p-4 rounded-xl outline-none focus:border-primary transition-all text-sm font-semibold"
                placeholder="Paste your post link here..."
                value={formData.externalUrl}
                onChange={e => setFormData({...formData, externalUrl: e.target.value})}
              />
            </div>
            <button 
              type="submit"
              className="flex items-center gap-3 bg-primary text-primary-foreground px-10 py-4 h-full rounded-xl font-black uppercase italic tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all mt-6 md:mt-0"
            >
              <Save size={18} />
              Deploy Post
            </button>
          </div>
        </form>
      )}

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="h-64 bg-card rounded-2xl animate-pulse border border-border" />
          ))
        ) : news.length > 0 ? (
          news.map((item) => (
            <div key={item.id} className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col group hover:border-primary/40 transition-all hover:shadow-2xl hover:shadow-primary/5">
              <div className="h-48 w-full relative bg-muted overflow-hidden">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-muted/30">
                    <Newspaper size={48} />
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2">
                   <Clock size={12} className="text-primary" />
                   <span className="text-[9px] font-black uppercase text-white tracking-widest">
                     {new Date(item.createdAt).toLocaleDateString()}
                   </span>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-black italic uppercase tracking-tight mb-2 leading-tight">{item.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-3 font-semibold mb-6">{item.content}</p>
                </div>
                
                <div className="flex items-center justify-between border-t border-border pt-4">
                  <div className="flex items-center gap-2">
                    {item.externalUrl && (
                      <a 
                        href={item.externalUrl} 
                        target="_blank" 
                        className="p-2 text-muted-foreground hover:text-primary transition-colors hover:bg-muted rounded-lg"
                      >
                        <Globe size={16} />
                      </a>
                    )}
                  </div>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-muted-foreground hover:text-red-500 transition-colors hover:bg-red-500/10 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
             <p className="text-xs font-bold uppercase tracking-widest text-muted">No Broadcasts Active</p>
          </div>
        )}
      </div>
    </div>
  );
}
