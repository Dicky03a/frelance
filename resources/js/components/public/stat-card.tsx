import { useEffect, useState } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
    icon: LucideIcon;
    value: number;
    label: string;
    suffix?: string;
    color?: 'indigo' | 'emerald' | 'sky' | 'violet' | 'amber' | 'rose';
}

export function StatCard({ icon: Icon, value, label, suffix = '', color = 'indigo' }: StatCardProps) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const start = 0;
        const duration = 1500; // 1.5s
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            // Ease out expo
            const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            
            setCount(Math.floor(easedProgress * value));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [value]);

    const colorClasses = {
        indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
        emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        sky: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
        violet: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
        amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    };

    return (
        <div className="rounded-[20px] border border-white/7 bg-[#1c1c28] p-5 flex items-center gap-4 transition-transform hover:scale-[1.02] duration-300">
            <div className={cn("p-3 rounded-2xl border", colorClasses[color])}>
                <Icon size={24} />
            </div>
            <div>
                <div className="text-2xl font-bold text-white leading-none">
                    {count}{suffix}
                </div>
                <div className="text-xs font-medium text-white/30 uppercase tracking-wider mt-1">
                    {label}
                </div>
            </div>
        </div>
    );
}
