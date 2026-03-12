import Link from 'next/link';

export default function TopBar() {
    const items = [
        { label: 'FREE SHIPPING', sub: 'On all orders over ₹5,000', icon: '🚚' },
        { label: '24/7 SUPPORT', sub: 'Assistance whenever you need', icon: '🎧' },
        { label: 'BIG SAVING', sub: 'Weekend discount up to 20%', icon: '💰' },
        { label: 'ONLINE PAYMENT', sub: 'Secure payment gateway', icon: '💳' },
    ];

    return (
        <div className="hidden lg:block bg-card border-b border-border py-3">
            <div className="container mx-auto px-6 flex justify-between">
                {items.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                        <span className="text-xl">{item.icon}</span>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest text-foreground">
                                {item.label}
                            </span>
                            <span className="text-[9px] text-muted font-bold uppercase tracking-tight">
                                {item.sub}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
