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
            case 'completed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'paid': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'in_progress': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
            case 'cancelled':
            case 'expired': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
            default: return 'bg-white/5 text-white/40 border-white/10';
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
                        <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/10 mb-2">
                            <ShoppingBag size={28} />
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tight">{t('title')}</h1>
                        <p className="text-white/40 text-lg">
                            Manage and track your service orders.
                        </p>
                    </div>
                </header>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2 border-b border-white/5 pb-6">
                    {tabs.map(tab => (
                        <button
                            key={tab.value || 'all'}
                            onClick={() => handleFilter(tab.value)}
                            className={cn(
                                "px-6 py-2.5 rounded-full text-sm font-bold transition-all",
                                (filters.status || null) === tab.value
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                                    : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
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
                            className="group flex flex-col md:flex-row md:items-center justify-between p-6 rounded-[32px] border border-white/5 bg-[#1c1c28] hover:border-indigo-500/30 transition-all duration-300"
                        >
                            <div className="flex items-center gap-6">
                                <div className="hidden sm:flex w-16 h-16 rounded-[20px] bg-indigo-500/10 items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                                    <Package size={32} />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                                            {order.service_package?.service?.name}
                                        </h3>
                                        <Badge variant="outline" className="bg-white/5 border-white/10 text-white/50">
                                            {order.service_package?.name}
                                        </Badge>
                                    </div>
                                    <p className="text-xs font-mono text-white/20">
                                        {order.order_code} • {new Date(order.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 md:mt-0 flex flex-wrap items-center justify-between md:justify-end gap-8">
                                <div className="text-right">
                                    <p className="text-2xl font-black text-white">{format(order.total_idr)}</p>
                                    <Badge variant="outline" className={cn("mt-1 capitalize px-4 py-1 border", getStatusStyles(order.status))}>
                                        {t(`status_${order.status}`)}
                                    </Badge>
                                </div>

                                <div className="flex items-center gap-2">
                                    {order.status === 'pending' && order.midtrans_token && (
                                        <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-700 rounded-xl font-bold">
                                            <Link href={route('orders.payment', order.id)}>
                                                <CreditCard size={16} className="mr-2" /> Pay Now
                                            </Link>
                                        </Button>
                                    )}
                                    {order.status === 'completed' && !order.rating && (
                                        <Button variant="outline" size="sm" className="border-amber-500/20 bg-amber-500/5 text-amber-500 hover:bg-amber-500/10 rounded-xl font-bold">
                                            <Link href={route('orders.show', order.id)}>
                                                <Star size={16} className="mr-2" /> Rate
                                            </Link>
                                        </Button>
                                    )}
                                    <Button asChild variant="ghost" size="icon" className="rounded-xl hover:bg-white/5 text-white/20 hover:text-white">
                                        <Link href={route('orders.show', order.id)}>
                                            <ArrowRight size={20} />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {orders.data.length === 0 && (
                        <div className="py-32 text-center rounded-[40px] border border-dashed border-white/5 bg-white/[0.01]">
                            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 text-white/10">
                                <ShoppingBag size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{t('no_orders')}</h3>
                            <p className="text-white/30 mb-8">Start your first project with us today.</p>
                            <Button asChild className="bg-indigo-600 hover:bg-indigo-700 rounded-2xl h-12 px-8 font-bold">
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
                            <Button variant="ghost" asChild className="text-white/50 hover:text-white rounded-xl">
                                <Link href={orders.links.prev}>{tCommon('previous')}</Link>
                            </Button>
                        )}
                        <div className="px-5 py-2 rounded-xl bg-white/5 text-white/30 text-xs font-bold flex items-center">
                            {orders.meta.current_page} / {orders.meta.last_page}
                        </div>
                        {orders.links.next && (
                            <Button variant="ghost" asChild className="text-white/50 hover:text-white rounded-xl">
                                <Link href={orders.links.next}>{tCommon('next')}</Link>
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
