import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Order } from '@/types/models';
import { PaginatedResponse } from '@/types/pagination';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/lib/i18n';
import { useCurrency } from '@/lib/currency';
import { 
    ShoppingBag, 
    ArrowRight, 
    CreditCard, 
    Star, 
    ExternalLink,
    Filter,
    Search,
    Package
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';

interface OrdersIndexProps {
    orders: PaginatedResponse<Order>;
    filters: {
        status?: string;
    };
}

export default function Index({ orders, filters }: OrdersIndexProps) {
    const { t } = useTranslation('orders');
    const { t: tCommon } = useTranslation('common');
    const { format } = useCurrency();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'My Orders',
            href: route('client.orders'),
        },
    ];

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
            case 'paid': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
            case 'pending': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
            case 'in_progress': return 'bg-primary/10 text-primary border-primary/20';
            case 'cancelled':
            case 'expired': return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
            default: return 'bg-muted/50 text-muted-foreground border-border';
        }
    };

    const handleFilter = (status: string | null) => {
        router.get(route('client.orders'), { status }, { preserveState: true });
    };

    const tabs = [
        { label: tCommon('all'), value: null },
        { label: 'Active', value: 'active' }, // Or use translations if available
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('title')} - DevPorto`} />

            <div className="px-6 py-10 space-y-8">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="max-w-2xl space-y-4">
                        <h1 className="text-[36px] font-normal tracking-[-0.72px] text-foreground">{t('title')}</h1>
                        <p className="text-muted-foreground text-lg">
                            Manage and track your service orders.
                        </p>
                    </div>
                </header>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2 border-b border-border pb-6">
                    {tabs.map(tab => (
                        <button
                            key={tab.value || 'all'}
                            onClick={() => handleFilter(tab.value)}
                            className={cn(
                                "px-6 py-2.5 rounded-full text-sm font-bold transition-all",
                                (filters.status || null) === tab.value
                                    ? "bg-primary text-white"
                                    : "bg-white text-black hover:bg-muted hover:text-foreground"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                    {orders.data.map(order => (
                        <div 
                            key={order.id} 
                            className="group flex flex-col md:flex-row md:items-center justify-between p-6 rounded-xl border border-border bg-card hover:border-primary/30 transition-all duration-300"
                        >
                            <div className="flex items-center gap-6">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-[22px] font-normal tracking-[-0.11px] text-foreground group-hover:text-primary transition-colors">
                                            {order.service_package?.service?.name}
                                        </h3>
                                        <Badge variant="outline" className="bg-white border-border text-muted-foreground">
                                            {order.service_package?.name}
                                        </Badge>
                                    </div>
                                    <p className="text-xs font-mono text-muted-foreground/40">
                                        {order.order_code} • {new Date(order.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 md:mt-0 flex flex-wrap items-center justify-between md:justify-end gap-8">
                                <div className="text-right">
                                    <p className="text-2xl font-black text-foreground">{format(order.total_idr)}</p>
                                    <Badge variant="outline" className={cn("mt-1 capitalize px-4 py-1 border", getStatusStyles(order.status))}>
                                        {t(`status_${order.status}`)}
                                    </Badge>
                                </div>

                                <div className="flex items-center gap-2">
                                    {order.status === 'pending' && order.midtrans_token && (
                                        <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-700 rounded-md font-bold text-white">
                                            <Link href={route('orders.payment', order.id)}>
                                                <CreditCard size={16} className="mr-2" /> Pay Now
                                            </Link>
                                        </Button>
                                    )}
                                    {order.status === 'completed' && !order.rating && (
                                        <Button variant="outline" size="sm" className="border-amber-500/20 bg-amber-500/5 text-amber-600 hover:bg-amber-500/10 rounded-md font-bold">
                                            <Link href={route('orders.show', order.id)}>
                                                <Star size={16} className="mr-2" /> Rate
                                            </Link>
                                        </Button>
                                    )}
                                    <Button asChild variant="ghost" size="icon" className="rounded-md hover:bg-muted text-muted-foreground hover:text-foreground">
                                        <Link href={route('orders.show', order.id)}>
                                            <ArrowRight size={20} />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {orders.data.length === 0 && (
                        <div className="py-32 text-center rounded-xl border border-dashed border-border bg-accent/30">
                            <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-6 text-muted-foreground/30">
                                <ShoppingBag size={40} />
                            </div>
                            <h3 className="text-[26px] font-normal tracking-[-0.325px] text-foreground mb-2">{t('no_orders')}</h3>
                            <p className="text-muted-foreground mb-8">Start your first project with us today.</p>
                            <Button asChild className="bg-primary hover:bg-primary/90 rounded-md h-12 px-8 font-bold text-white">
                                <Link href={route('services.index')}>
                                    Browse Services <ArrowRight size={18} className="ml-2" />
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {orders.meta.last_page > 1 && (
                    <div className="flex justify-center gap-2 pt-10">
                        {orders.links.prev && (
                            <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground rounded-md">
                                <Link href={orders.links.prev}>{tCommon('previous')}</Link>
                            </Button>
                        )}
                        <div className="px-5 py-2 rounded-md bg-muted/50 text-muted-foreground text-xs font-bold flex items-center">
                            {orders.meta.current_page} / {orders.meta.last_page}
                        </div>
                        {orders.links.next && (
                            <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground rounded-md">
                                <Link href={orders.links.next}>{tCommon('next')}</Link>
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
