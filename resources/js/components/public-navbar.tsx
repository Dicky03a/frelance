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
        <nav className="fixed top-0 left-0 right-0 z-50 h-14 bg-[#09090f]/80 backdrop-blur-md border-b border-white/5 px-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button onClick={toggleSidebar} className="p-2 text-white/50 hover:text-white md:hidden">
                    <Menu size={20} />
                </button>
                <Link href={route('home')} className="flex items-center gap-2">
                    <AppLogo className="h-8 w-8" />
                    <span className="font-bold text-white hidden sm:inline-block">DevPorto</span>
                </Link>
            </div>

            <div className="hidden md:flex items-center gap-6">
                <Link href={route('projects.index')} className="text-sm text-white/50 hover:text-white transition-colors">{t('projects')}</Link>
                <Link href={route('services.index')} className="text-sm text-white/50 hover:text-white transition-colors">{t('services')}</Link>
                <Link href={route('forum.index')} className="text-sm text-white/50 hover:text-white transition-colors">{t('forum')}</Link>
            </div>

            <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 mr-2">
                    <LanguageSwitcher />
                    <CurrencySwitcher />
                </div>

                {auth.user ? (
                    <Button variant="ghost" size="sm" asChild className="text-white/70 hover:text-white hover:bg-white/5 rounded-full">
                        <Link href={route('dashboard')}>
                            <User size={18} className="mr-2" />
                            <span className="hidden sm:inline">{t('dashboard')}</span>
                        </Link>
                    </Button>
                ) : (
                    <Button variant="default" size="sm" asChild className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-5">
                        <Link href={route('login')}>
                            <LogIn size={16} className="mr-2" /> {t('login')}
                        </Link>
                    </Button>
                )}
            </div>
        </nav>
    );
}
