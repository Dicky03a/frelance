import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { SharedProps } from '@/types/inertia';
import { Link, usePage } from '@inertiajs/react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { auth } = usePage<SharedProps>().props;
    const isAdmin = auth.user?.role === 'admin';

    const mainNavItems: NavItem[] = [];

    const clientNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            url: route('dashboard'),
        },
        {
            title: 'My Orders',
            url: route('client.orders'),
        },
        {
            title: 'Forum',
            url: route('forum.index'),
        },
    ];

    const adminNavItems: NavItem[] = [
        {
            title: 'Statistics',
            url: route('admin.dashboard'),
        },
        {
            title: 'Proyek',
            url: route('admin.projects.index'),
        },
        {
            title: 'Layanan',
            url: route('admin.services.index'),
        },
        {
            title: 'Pesanan',
            url: route('admin.orders.index'),
        },
        {
            title: 'Calculator',
            url: route('admin.calculator-configs.index'),
        },
        {
            title: 'Forum',
            url: route('admin.forum.threads.index'),
        },
        {
            title: 'Ulasan',
            url: route('admin.reviews.index'),
        },
        {
            title: 'Skills',
            url: route('admin.skills.index'),
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
                {isAdmin && <NavMain items={adminNavItems} label="Administration" />}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
