'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { API_URL } from '@/config';

export default function VehicleSelector({ onVehicleSelect }: { onVehicleSelect: (modelId: string, year: string) => void }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [categories, setCategories] = useState<any[]>([]);
    const [models, setModels] = useState<any[]>([]);
    const [years, setYears] = useState<string[]>([]); // Changed to string[]
    
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('makeId') || ''); // Renamed from selectedMake
    const [selectedModel, setSelectedModel] = useState(searchParams.get('modelId') || '');
    const [selectedYear, setSelectedYear] = useState(searchParams.get('year') || '');
    const [loading, setLoading] = useState(true); // Added loading state

    useEffect(() => {
        const fetchCategories = async () => { // Renamed from fetchMakes
            try {
                const res = await fetch(`${API_URL}/categories`); // Changed URL and API_URL
                const data = await res.json();
                setCategories(data); // Set categories instead of makes
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            const fetchModels = async () => {
                try {
                    const res = await fetch(`${API_URL}/vehicles/models?categoryId=${selectedCategory}`);
                    const data = await res.json();
                    setModels(data);
                } catch (error) {
                    console.error("Failed to fetch models:", error);
                }
            };
            fetchModels();
        } else {
            setModels([]);
            setSelectedModel('');
        }
    }, [selectedCategory]);

    useEffect(() => {
        if (selectedModel) {
            const fetchYears = async () => {
                try {
                    const response = await fetch(`${API_URL}/vehicles/years?modelId=${selectedModel}`);
                    const data = await response.json();
                    setYears(data);
                } catch (error) {
                    console.error("Failed to fetch years:", error);
                }
            };
            fetchYears();
        } else {
            setYears([]);
            setSelectedYear('');
        }
    }, [selectedModel]);

    const handleApply = () => {
        const params = new URLSearchParams(searchParams.toString());
        if (selectedModel) params.set('modelId', selectedModel);
        else params.delete('modelId');
        
        if (selectedYear) params.set('year', selectedYear);
        else params.delete('year');
        
        if (selectedCategory) params.set('categoryId', selectedCategory);
        else params.delete('categoryId');

        router.push(`/shop?${params.toString()}`);
    };

    return (
        <div className="bg-card border border-border p-4 rounded-xl flex flex-wrap items-center gap-4 shadow-sm mb-8">
            <div className="flex-1 min-w-[150px]">
                <label className="block text-[9px] font-black uppercase text-primary mb-1">Make</label>
                <select 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
                >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
            </div>
            
            <div className="flex-1 min-w-[150px]">
                <label className="block text-[9px] font-black uppercase text-primary mb-1">Model</label>
                <select 
                    value={selectedModel} 
                    onChange={(e) => setSelectedModel(e.target.value)}
                    disabled={!selectedCategory}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary disabled:opacity-50"
                >
                    <option value="">Select Model</option>
                    {models.map(model => (
                        <option key={model.id} value={model.id}>{model.name}</option>
                    ))}
                </select>
            </div>

            <div className="flex-1 min-w-[100px]">
                <label className="block text-[9px] font-black uppercase text-primary mb-1">Year</label>
                <select 
                    value={selectedYear} 
                    onChange={(e) => setSelectedYear(e.target.value)}
                    disabled={!selectedModel}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary disabled:opacity-50"
                >
                    <option value="">Year</option>
                    {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>

            <button 
                onClick={handleApply}
                className="bg-primary text-white text-[10px] font-black uppercase tracking-widest px-6 h-10 rounded-lg hover:bg-secondary transition-colors mt-4 self-end"
            >
                Find Parts
            </button>
        </div>
    );
}
