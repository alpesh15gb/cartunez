'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
    const { signup } = useAuth();
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    name: formData.name
                }),
            });

            const data = await response.json();

            if (response.ok) {
                signup(data.token, data.user);
                router.push('/');
            } else {
                setError(data.message || 'Signup failed');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
            console.error('Signup error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-6 py-20 flex justify-center items-center min-h-[70vh]">
            <div className="w-full max-w-md bg-card border border-border p-10 rounded-xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-secondary" />

                <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-2">Join <span className="text-secondary italic">The Club</span></h1>
                <p className="text-muted text-xs font-bold uppercase tracking-widest mb-8">Create Your Performance Profile</p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 text-[10px] font-bold uppercase p-4 mb-6 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted">Full Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-background border border-border p-4 rounded focus:border-secondary outline-none transition-colors text-sm"
                            placeholder="John Racer"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted">Email Address</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-background border border-border p-4 rounded focus:border-secondary outline-none transition-colors text-sm"
                            placeholder="driver@cartunez.com"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted">Password</label>
                        <input
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full bg-background border border-border p-4 rounded focus:border-secondary outline-none transition-colors text-sm"
                            placeholder="••••••••"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted">Confirm Password</label>
                        <input
                            type="password"
                            required
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            className="w-full bg-background border border-border p-4 rounded focus:border-secondary outline-none transition-colors text-sm"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-secondary text-black font-black uppercase italic tracking-widest py-4 mt-6 hover:shadow-[0_0_20px_var(--secondary)] transition-all clip-path-slant disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Join The Race'}
                    </button>
                </form>

                <style jsx>{`
            .clip-path-slant {
                clip-path: polygon(5% 0, 100% 0, 95% 100%, 0 100%);
            }
        `}</style>

                <div className="mt-8 pt-8 border-t border-border flex justify-center text-[10px] font-bold uppercase tracking-widest text-muted">
                    <Link href="/login" className="hover:text-primary transition-colors">Already a Member? Login</Link>
                </div>
            </div>
        </div>
    );
}
