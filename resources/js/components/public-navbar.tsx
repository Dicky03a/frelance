import { Link, usePage } from '@inertiajs/react';
import { SharedProps } from '@/types/inertia';
import { Menu, LogIn, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AppLogo from './app-logo';

export function PublicNavbar({ toggleSidebar }: { toggleSidebar: () => void }) {
    const { auth, locale, currency } = usePage<SharedProps>().props;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 h-14 bg-[#09090f]/80 backdrop-blur-md border-b border-white/5 px-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button onClick={toggleSidebar} className="p-2 text-white/50 hover:text-white md:hidden">
                    <Menu size={20} />
                </button>
                <Link href="/" className="flex items-center gap-2">
                    <AppLogo className="h-8 w-8" />
                    <span className="font-bold text-white hidden sm:inline-block">DevPorto</span>
                </Link>
            </div>

            <div className="hidden md:flex items-center gap-6">
                <Link href="/projects" className="text-sm text-white/50 hover:text-white transition-colors">Portofolio</Link>
                <Link href="/services" className="text-sm text-white/50 hover:text-white transition-colors">Layanan</Link>
                <Link href="/forum" className="text-sm text-white/50 hover:text-white transition-colors">Forum</Link>
            </div>

            <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-white/50">
                    <span className={locale === 'id' ? 'text-indigo-400' : ''}>ID</span>
                    <span className="text-white/10">|</span>
                    <span className={locale === 'en' ? 'text-indigo-400' : ''}>EN</span>
                </div>
                
                <div className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-white/50 mr-2">
                    <span className={currency === 'IDR' ? 'text-emerald-400' : ''}>RP</span>
                    <span className="text-white/10">|</span>
                    <span className={currency === 'USD' ? 'text-emerald-400' : ''}>$</span>
                </div>

                {auth.user ? (
                    <Button variant="ghost" size="sm" asChild className="text-white/70 hover:text-white hover:bg-white/5 rounded-full">
                        <Link href="/dashboard">
                            <User size={18} className="mr-2" />
                            <span className="hidden sm:inline">Dashboard</span>
                        </Link>
                    </Button>
                ) : (
                    <Button variant="default" size="sm" asChild className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-5">
                        <Link href="/login">
                            <LogIn size={16} className="mr-2" /> Masuk
                        </Link>
                    </Button>
                )}
            </div>
        </nav>
    );
}
