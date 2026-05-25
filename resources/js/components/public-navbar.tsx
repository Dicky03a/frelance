import { Link, usePage } from '@inertiajs/react';
import { SharedProps } from '@/types/inertia';
import { Menu, LogIn, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AppLogo from './app-logo';
import { LanguageSwitcher } from './public/language-switcher';
import { CurrencySwitcher } from './public/currency-switcher';
import { useTranslation } from '@/lib/i18n';

export function PublicNavbar({ toggleSidebar }: { toggleSidebar: () => void }) {
    const { auth } = usePage<SharedProps>().props;
    const { t } = useTranslation('nav');

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-cursor-canvas border-b border-cursor-hairline px-6 flex items-center justify-between">
            <div className="flex items-center gap-8">
                <button onClick={toggleSidebar} className="p-2 text-cursor-muted hover:text-cursor-ink md:hidden">
                    <Menu size={20} />
                </button>
                <Link href={route('home')} className="flex items-center">
                    <span className="font-sans text-[22px] font-medium tracking-[-0.11px] text-cursor-primary">DevPorto</span>
                </Link>
                
                <div className="hidden md:flex items-center gap-8 ml-4">
                    <Link href={route('projects.index')} className="text-sm font-medium text-cursor-muted hover:text-cursor-ink transition-colors">{t('projects')}</Link>
                    <Link href={route('services.index')} className="text-sm font-medium text-cursor-muted hover:text-cursor-ink transition-colors">{t('services')}</Link>
                    <Link href={route('forum.index')} className="text-sm font-medium text-cursor-muted hover:text-cursor-ink transition-colors">{t('forum')}</Link>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-4">
                    <LanguageSwitcher />
                    <CurrencySwitcher />
                </div>

                {auth.user ? (
                    <Button variant="ghost" size="sm" asChild className="text-cursor-muted hover:text-cursor-ink hover:bg-cursor-hairline-soft rounded-cursor-md px-4">
                        <Link href={route('dashboard')}>
                            <span className="text-sm font-medium">{t('dashboard')}</span>
                        </Link>
                    </Button>
                ) : (
                    <Button variant="default" size="sm" asChild className="bg-cursor-primary hover:bg-cursor-primary-active text-white rounded-cursor-md px-[18px] h-10 border-none shadow-none font-medium">
                        <Link href={route('login')}>
                            {t('login')}
                        </Link>
                    </Button>
                )}
            </div>
        </nav>
    );
}
