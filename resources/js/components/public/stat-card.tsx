import { useEffect, useState } from 'react';

interface StatCardProps {
    value: number;
    label: string;
    suffix?: string;
}

export function StatCard({ value, label, suffix = '' }: StatCardProps) {
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

    return (
        <div className="rounded-cursor-md border border-cursor-hairline bg-cursor-surface-card p-6 flex flex-col transition-all hover:border-cursor-hairline-strong group">
            <div className="text-[32px] font-normal text-cursor-ink leading-none tracking-[-0.325px]">
                {count}{suffix}
            </div>
            <div className="text-[11px] font-semibold text-cursor-muted uppercase tracking-[0.88px] mt-3">
                {label}
            </div>
        </div>
    );
}
