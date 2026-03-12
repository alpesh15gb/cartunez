'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function VehicleSelector() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [makes, setMakes] = useState<any[]>([]);
    const [models, setModels] = useState<any[]>([]);
    const [years, setYears] = useState<number[]>([]);
    
    const [selectedMake, setSelectedMake] = useState(searchParams.get('makeId') || '');
    const [selectedModel, setSelectedModel] = useState(searchParams.get('modelId') || '');
    const [selectedYear, setSelectedYear] = useState(searchParams.get('year') || '');

    useEffect(() => {
        const fetchMakes = async () => {
            const res = await fetch('http://localhost:5000/api/vehicles/makes');
            const data = await res.json();
            setMakes(data);
        };
        fetchMakes();
    }, []);

    useEffect(() => {
        if (selectedMake) {
            const fetchModels = async () => {
                const res = await fetch(`http://localhost:5000/api/vehicles/makes/${selectedMake}/models`);
                const data = await res.json();
                setModels(data);
            };
            fetchModels();
        } else {
            setModels([]);
            setSelectedModel('');
        }
    }, [selectedMake]);

    useEffect(() => {
        if (selectedModel) {
            const fetchYears = async () => {
                const res = await fetch(`http://localhost:5000/api/vehicles/models/${selectedModel}/years`);
                const data = await res.json();
                setYears(data);
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
        
        if (selectedMake) params.set('makeId', selectedMake);
        else params.delete('makeId');

        router.push(`/shop?${params.toString()}`);
    };

    return (
        <div className="bg-card border border-border p-4 rounded-xl flex flex-wrap items-center gap-4 shadow-sm mb-8">
            <div className="flex-1 min-w-[150px]">
                <label className="block text-[9px] font-black uppercase text-primary mb-1">Make</label>
                <select 
                    value={selectedMake} 
                    onChange={(e) => setSelectedMake(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
                >
                    <option value="">Select Make</option>
                    {makes.map(make => (
                        <option key={make.id} value={make.id}>{make.name}</option>
                    ))}
                </select>
            </div>
            
            <div className="flex-1 min-w-[150px]">
                <label className="block text-[9px] font-black uppercase text-primary mb-1">Model</label>
                <select 
                    value={selectedModel} 
                    onChange={(e) => setSelectedModel(e.target.value)}
                    disabled={!selectedMake}
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
