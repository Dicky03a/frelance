import { router, usePage } from '@inertiajs/react';
import { SharedProps } from '@/types/inertia';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

export function LanguageSwitcher() {
    const { locale } = usePage<SharedProps>().props;

    const setLocale = (lang: string) => {
        router.get(route('locale.set', { lang }), {}, { 
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
                    locale === 'id' ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'text-zinc-400 hover:text-zinc-200'
                )}
                onClick={() => setLocale('id')}
            >
                ID
            </Button>
            <Button
                variant="ghost"
                size="sm"
                className={cn(
                    'h-7 rounded-full px-3 text-xs font-medium transition-all',
                    locale === 'en' ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'text-zinc-400 hover:text-zinc-200'
                )}
                onClick={() => setLocale('en')}
            >
                EN
            </Button>
        </div>
    );
}
