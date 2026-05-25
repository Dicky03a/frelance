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
        <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
            <Button
                variant="ghost"
                size="sm"
                className={cn(
                    'h-7 rounded-full px-3 text-xs font-medium transition-all',
                    currency === 'IDR' ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'text-zinc-400 hover:text-zinc-200'
                )}
                onClick={() => setCurrency('IDR')}
            >
                Rp
            </Button>
            <Button
                variant="ghost"
                size="sm"
                className={cn(
                    'h-7 rounded-full px-3 text-xs font-medium transition-all',
                    currency === 'USD' ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'text-zinc-400 hover:text-zinc-200'
                )}
                onClick={() => setCurrency('USD')}
            >
                $
            </Button>
        </div>
    );
}
