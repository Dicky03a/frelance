import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { SharedProps } from '@/types/inertia';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Briefcase, Settings2, ShieldCheck, ShoppingCart, MessageSquare, Wrench, Star } from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { auth } = usePage<SharedProps>().props;
    const isAdmin = auth.user?.role === 'admin';

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            url: route('dashboard'),
            icon: LayoutGrid,
        },
    ];

    const clientNavItems: NavItem[] = [
        {
            title: 'My Orders',
            url: route('client.orders'),
            icon: ShoppingCart,
        },
        {
            title: 'Forum',
            url: route('forum.index'),
            icon: MessageSquare,
        },
    ];

    const adminNavItems: NavItem[] = [
        {
            title: 'Admin Dashboard',
            url: route('admin.dashboard'),
            icon: ShieldCheck,
        },
        {
            title: 'Proyek',
            url: route('admin.projects.index'),
            icon: Briefcase,
        },
        {
            title: 'Layanan',
            url: route('admin.services.index'),
            icon: Wrench,
        },
        {
            title: 'Pesanan',
            url: route('admin.orders.index'),
            icon: ShoppingCart,
        },
        {
            title: 'Forum',
            url: route('admin.forum.threads.index'),
            icon: MessageSquare,
        },
        {
            title: 'Ulasan',
            url: route('admin.reviews.index'),
            icon: Star,
        },
        {
            title: 'Skills',
            url: route('admin.skills.index'),
            icon: Settings2,
        },
    ];

    const footerNavItems: NavItem[] = [
        {
            title: 'Repository',
            url: 'https://github.com/laravel/react-starter-kit',
            icon: Folder,
        },
        {
            title: 'Documentation',
            url: 'https://laravel.com/docs/starter-kits',
            icon: BookOpen,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={route('dashboard')} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                {!isAdmin && <NavMain items={clientNavItems} label="Client Area" />}
                {isAdmin && (
                    <NavMain items={adminNavItems} label="Administration" />
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
