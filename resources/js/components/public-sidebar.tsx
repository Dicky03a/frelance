import { Link, usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { SharedData } from '@/types';

import { useTranslation } from '@/lib/i18n';

export function PublicSidebar({ isOpen }: { isOpen: boolean }) {
    const { url, props } = usePage<SharedData>();
    const { auth } = props;
    const { t } = useTranslation('nav');

    const getPathname = (itemUrl: string) => {
        try {
            return new URL(itemUrl).pathname;
        } catch (e) {
            return itemUrl;
        }
    };

    const isUrlActive = (itemUrl: string) => {
        const pathname = getPathname(itemUrl);
        if (pathname === url) return true;
        if (pathname !== '/' && url.startsWith(pathname)) return true;
        return false;
    };

    const sections = [
        {
            title: t('overview', { default: 'Overview' }),
            items: [
                { title: t('home'), href: route('home') },
                { title: t('projects'), href: route('projects.index') },
                { title: t('services'), href: route('services.index') },
            ]
        },
        {
            title: t('tools', { default: 'Tools' }),
            items: [
                { title: t('calculator', { default: 'Calculator' }), href: '/#calculator' },
                { title: t('forum'), href: route('forum.index') },
                { title: t('reviews'), href: route('reviews.index') },
            ]
        },
        {
            title: t('info', { default: 'Info' }),
            items: [
                { title: t('about'), href: route('about') },
                { title: t('skills'), href: route('skills.public') },
                { title: t('contact'), href: route('contact') },
            ]
        }
    ];

    return (
        <aside className={cn(
            "fixed left-0 top-16 bottom-0 z-40 w-52 bg-cursor-canvas border-r border-cursor-hairline transition-transform md:translate-x-0",
            isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
            <div className="h-full py-8 px-5 space-y-10 overflow-y-auto custom-scrollbar">
                {sections.map((section, i) => (
                    <div key={i} className="space-y-4">
                        <h4 className="px-3 text-[11px] font-semibold uppercase tracking-[0.88px] text-cursor-muted">
                            {section.title}
                        </h4>
                        <div className="space-y-1">
                            {section.items.map((item, j) => {
                                const isActive = isUrlActive(item.href);
                                return (
                                    <Link
                                        key={j}
                                        href={getPathname(item.href)}
                                        className={cn(
                                            "flex items-center px-3 py-2 rounded-cursor-md text-sm font-medium transition-all",
                                            isActive 
                                                ? "bg-cursor-surface-strong text-cursor-ink" 
                                                : "text-cursor-muted hover:text-cursor-ink hover:bg-cursor-hairline-soft"
                                        )}
                                    >
                                        {item.title}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
}
