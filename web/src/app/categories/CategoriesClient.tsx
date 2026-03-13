'use client';

import Link from 'next/link';
import Image from 'next/image';

const CATEGORY_METADATA: Record<string, { image: string, description: string }> = {
    'CAR SPEAKERS': { image: '/lighting.png', description: 'Premium car audio systems for crystal clear sound.' },
    'SUBWOOFERS': { image: '/performance.png', description: 'Deep, powerful bass to feel your music.' },
    'CAR AMPLIFIERS': { image: '/wheels.png', description: 'Clean power delivery for your entire audio setup.' },
    'CAR STEREOS': { image: '/interior.png', description: 'Advanced infotainment systems with modern connectivity.' },
    'android frames': { image: '/interior.png', description: 'Custom fit frames for seamless stereo integration.' },
    'CAR LIGHTING': { image: '/lighting.png', description: 'High-performance LED systems for ultimate visibility.' },
    'CAR OEM PARTS': { image: '/wheels.png', description: 'Genuine replacement parts for perfect fitment.' },
};

export default function CategoriesClient({ categories }: { categories: any[] }) {
    return (
        <div className="container mx-auto px-6 py-20">
            <h1 className="text-6xl font-black italic uppercase tracking-tighter mb-4">The <span className="text-primary italic underline underline-offset-8 decoration-8 decoration-primary/30">Collections</span></h1>
            <p className="text-muted font-bold uppercase tracking-[0.3em] text-xs mb-16">Curated Gear For Every Aspect Of Your Drive</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {categories.map((cat) => {
                    const meta = CATEGORY_METADATA[cat.name] || {
                        image: '📦',
                        description: 'Explore our wide range of premium automotive components.'
                    };

                    return (
                        <Link
                            key={cat.id}
                            href={`/shop?category=${cat.id}`}
                            className="group relative h-96 bg-card border border-border p-12 flex flex-col justify-end overflow-hidden transition-all hover:border-primary border-b-4 border-b-primary/50"
                        >
                            <div className="absolute inset-0 grayscale opacity-20 group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700">
                                {meta.image.startsWith('/') ? (
                                    <Image
                                        src={meta.image}
                                        alt={cat.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-8xl">
                                        {meta.image}
                                    </div>
                                )}
                            </div>
                            <div className="relative z-10 space-y-4">
                                <h2 className="text-3xl font-black italic uppercase tracking-tighter group-hover:text-primary transition-colors">{cat.name}</h2>
                                <p className="text-muted text-sm font-medium leading-relaxed max-w-xs">{meta.description}</p>
                                <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary group-hover:translate-x-2 transition-transform">
                                    <span>Explore Collection</span>
                                    <span>→</span>
                                </div>
                            </div>
                            {/* Animated overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60" />
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
