'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/config';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                login(data.token, data.user);
                router.push('/');
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-6 py-20 flex justify-center items-center min-h-[70vh]">
            <div className="w-full max-w-md bg-card border border-border p-10 rounded-xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-primary" />

                <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-2">Login</h1>
                <p className="text-muted text-xs font-bold uppercase tracking-widest mb-8">Access Your Performance Dashboard</p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 text-[10px] font-bold uppercase p-4 mb-6 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-background border border-border p-4 rounded focus:border-primary outline-none transition-colors text-sm"
                            placeholder="driver@cartunez.com"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-background border border-border p-4 rounded focus:border-primary outline-none transition-colors text-sm"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary py-4 mt-4 text-sm disabled:opacity-50"
                    >
                        {loading ? 'Initiating...' : 'Engage Dashboard'}
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-border flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted">
                    <span>Forgot Gear?</span>
                    <Link href="/signup" className="text-primary hover:underline underline-offset-4">New Driver? Signup</Link>
                </div>
            </div>
        </div>
    );
}
