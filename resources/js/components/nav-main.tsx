import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [], label = 'Platform' }: { items: NavItem[]; label?: string }) {
    const page = usePage();
    
    // Check if the current URL matches the item's URL or starts with it (for nested routes)
    const isUrlActive = (url: string) => {
        if (url === page.url) return true;
        
        // Handle case where route helper provides absolute URL but page.url is relative
        try {
            const path = new URL(url).pathname;
            if (path === page.url) return true;
            if (path !== '/' && page.url.startsWith(path)) return true;
        } catch (e) {
            // URL is relative
            if (url !== '/' && page.url.startsWith(url)) return true;
        }
        
        return false;
    };

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>{label}</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={isUrlActive(item.url)}>
                            <Link href={item.url} prefetch>
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
