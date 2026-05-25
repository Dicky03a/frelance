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
        <div className="flex items-center gap-1 rounded-cursor-md border border-cursor-hairline bg-cursor-surface-card p-1">
            <Button
                variant="ghost"
                size="sm"
                className={cn(
                    'h-7 rounded-cursor-sm px-3 text-xs font-medium transition-all',
                    locale === 'id' ? 'bg-cursor-ink text-cursor-canvas hover:bg-cursor-ink/90' : 'text-cursor-muted hover:text-cursor-ink'
                )}
                onClick={() => setLocale('id')}
            >
                ID
            </Button>
            <Button
                variant="ghost"
                size="sm"
                className={cn(
                    'h-7 rounded-cursor-sm px-3 text-xs font-medium transition-all',
                    locale === 'en' ? 'bg-cursor-ink text-cursor-canvas hover:bg-cursor-ink/90' : 'text-cursor-muted hover:text-cursor-ink'
                )}
                onClick={() => setLocale('en')}
            >
                EN
            </Button>
        </div>
    );
}
