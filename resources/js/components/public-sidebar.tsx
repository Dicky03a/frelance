import { Link, usePage } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    Folder, 
    Package, 
    Calculator, 
    MessageSquare, 
    Star, 
    User, 
    Code, 
    Mail 
} from 'lucide-react';
import { cn } from '@/lib/utils';

import { useTranslation } from '@/lib/i18n';

export function PublicSidebar({ isOpen }: { isOpen: boolean }) {
    const { url } = usePage();
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
                { title: t('home'), href: route('home'), icon: LayoutDashboard },
                { title: t('projects'), href: route('projects.index'), icon: Folder },
                { title: t('services'), href: route('services.index'), icon: Package },
            ]
        },
        {
            title: t('tools', { default: 'Tools' }),
            items: [
                { title: t('calculator', { default: 'Calculator' }), href: '/#calculator', icon: Calculator },
                { title: t('forum'), href: route('forum.index'), icon: MessageSquare },
                { title: t('reviews'), href: route('reviews.index'), icon: Star },
            ]
        },
        {
            title: t('info', { default: 'Info' }),
            items: [
                { title: t('about'), href: route('about'), icon: User },
                { title: t('skills'), href: route('skills.public'), icon: Code },
                { title: t('contact'), href: route('contact'), icon: Mail },
            ]
        }
    ];

    return (
        <aside className={cn(
            "fixed left-0 top-14 bottom-0 z-40 w-52 bg-[#09090f] border-r border-white/5 transition-transform md:translate-x-0",
            isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
            <div className="h-full py-6 px-4 space-y-8 overflow-y-auto custom-scrollbar">
                {sections.map((section, i) => (
                    <div key={i} className="space-y-3">
                        <h4 className="px-2 text-[10px] font-bold uppercase tracking-wider text-white/20">
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
                                            "flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all group",
                                            isActive 
                                                ? "bg-indigo-500/10 text-indigo-400 font-medium" 
                                                : "text-white/40 hover:text-white hover:bg-white/5"
                                        )}
                                    >
                                        <item.icon size={18} className={cn(
                                            "transition-colors",
                                            isActive ? "text-indigo-400" : "text-white/20 group-hover:text-white/50"
                                        )} />
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
