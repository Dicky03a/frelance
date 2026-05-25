import { router, usePage } from '@inertiajs/react';
import { SharedProps } from '@/types/inertia';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

export function CurrencySwitcher() {
    const { currency } = usePage<SharedProps>().props;

    const setCurrency = (curr: string) => {
        router.get(route('currency.set', { currency: curr }), {}, { 
            preserveState: true, 
            preserveScroll: true 
        });
    };

    return (
        <div className="flex items-center gap-1 rounded-cursor-md border border-cursor-hairline bg-cursor-surface-card p-1">
            <Button
                variant="ghost"
                size="sm"
                className={cn(
                    'h-7 rounded-cursor-sm px-3 text-xs font-medium transition-all',
                    currency === 'IDR' ? 'bg-cursor-ink text-cursor-canvas hover:bg-cursor-ink/90' : 'text-cursor-muted hover:text-cursor-ink'
                )}
                onClick={() => setCurrency('IDR')}
            >
                Rp
            </Button>
            <Button
                variant="ghost"
                size="sm"
                className={cn(
                    'h-7 rounded-cursor-sm px-3 text-xs font-medium transition-all',
                    currency === 'USD' ? 'bg-cursor-ink text-cursor-canvas hover:bg-cursor-ink/90' : 'text-cursor-muted hover:text-cursor-ink'
                )}
                onClick={() => setCurrency('USD')}
            >
                $
            </Button>
        </div>
    );
}
