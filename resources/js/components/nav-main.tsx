import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [], label = 'Platform' }: { items: NavItem[]; label?: string }) {
    const { url } = usePage();
    
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

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>{label}</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={isUrlActive(item.url)}>
                            <Link href={getPathname(item.url)}>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
