import { StatCard } from '@/components/public/stat-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { useCurrency } from '@/lib/currency';
import { useTranslation } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import { ForumThread, Order, ServicePackage, SharedData } from '@/types/models';
import { Head, Link, usePage } from '@inertiajs/react';
import { AlertCircle, ArrowRight } from 'lucide-react';

interface DashboardProps {
    stats: {
        active_orders: number;
        completed_orders: number;
        forum_posts: number;
        reviews_given: number;
    };
    recent_orders: Order[];
    forum_activity: ForumThread[];
    recommendations: (ServicePackage & { recommendation_reason?: string })[];
    has_unrated_orders: boolean;
}

export default function Dashboard({ stats, recent_orders, forum_activity, recommendations, has_unrated_orders }: DashboardProps) {
    const { auth } = usePage<SharedData>().props;
    const { t } = useTranslation('dashboard');
    const { t: tOrders } = useTranslation('orders');
    const { format } = useCurrency();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: route('dashboard'),
        },
    ];

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-emerald-500/5 text-emerald-600 dark:text-emerald-500 border-emerald-500/10 dark:border-emerald-500/20';
            case 'paid':
                return 'bg-blue-500/5 text-blue-600 dark:text-blue-400 border-blue-500/10 dark:border-blue-500/20';
            case 'pending':
                return 'bg-amber-500/5 text-amber-600 dark:text-amber-500 border-amber-500/10 dark:border-amber-500/20';
            case 'in_progress':
                return 'bg-primary/5 text-primary border-primary/10 dark:border-primary/20';
            case 'cancelled':
            case 'expired':
                return 'bg-destructive/5 text-destructive border-destructive/10 dark:border-destructive/20';
            default:
                return 'bg-muted/30 text-muted-foreground border-border';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard - DevPorto" />

            <div className="space-y-12 px-8 py-12 max-w-7xl mx-auto">
                {has_unrated_orders && (
                    <div className="bg-primary/5 border-primary/10 dark:border-primary/20 flex items-center justify-between gap-4 rounded-cursor-md border p-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 text-primary rounded-sm p-2">
                                <AlertCircle size={18} />
                            </div>
                            <p className="text-foreground text-sm font-medium">{t('unrated_orders_alert')}</p>
                        </div>
                        <Button asChild variant="ghost" className="text-primary hover:text-primary-active hover:bg-primary/5 font-medium text-xs">
                            <Link href={route('client.orders')}>
                                {t('rate_now')} <ArrowRight size={14} className="ml-1.5" />
                            </Link>
                        </Button>
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard value={stats.active_orders} label={t('stats.active_orders')} />
                    <StatCard value={stats.completed_orders} label={t('stats.completed_orders')} />
                    <StatCard value={stats.forum_posts} label={t('stats.forum_posts')} />
                    <StatCard value={stats.reviews_given} label={t('stats.reviews_given')} />
                </div>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                    {/* Recent Orders & Activity */}
                    <div className="space-y-12 lg:col-span-2">
                        <section className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-foreground flex items-center gap-2 text-[26px] font-normal tracking-[-0.325px]">
                                    {t('Recent Orders')}
                                </h2>
                            </div>

                            <div className="space-y-4">
                                {recent_orders.map((order) => (
                                    <Link
                                        key={order.id}
                                        href={route('orders.show', order.id)}
                                        className="border-hairline bg-surface-card hover:border-hairline-strong group flex flex-col justify-between rounded-cursor-lg border p-6 transition-all md:flex-row md:items-center"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <h4 className="text-ink group-hover:text-primary font-bold transition-colors text-[16px]">
                                                    {order.service_package?.service?.name} - {order.service_package?.name}
                                                </h4>
                                                <p className="text-muted font-mono mt-1.5 text-[11px] uppercase tracking-wider">
                                                    {t('order_card.code', { code: order.order_code })} •{' '}
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex items-center justify-between gap-6 md:mt-0 md:justify-end">
                                            <div className="text-right">
                                                <p className="text-ink font-mono font-bold text-lg">{format(order.total_idr)}</p>
                                                <Badge variant="outline" className={cn('mt-2 border capitalize font-semibold text-[10px] tracking-wider py-0.5', getStatusStyles(order.status))}>
                                                    {tOrders(`status_${order.status}`)}
                                                </Badge>
                                            </div>
                                            <ArrowRight
                                                size={18}
                                                className="text-muted/20 group-hover:text-primary transition-all group-hover:translate-x-1"
                                            />
                                        </div>
                                    </Link>
                                ))}
                                {recent_orders.length === 0 && (
                                    <div className="border-hairline text-muted/40 rounded-cursor-lg border border-dashed py-16 text-center italic text-sm">
                                        {t('No Recent Orders')}
                                    </div>
                                )}
                            </div>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-foreground flex items-center gap-2 text-[26px] font-normal tracking-[-0.325px]">
                                {t('Forum Activity')}
                            </h2>
                            <div className="space-y-4">
                                {forum_activity.map((thread) => (
                                    <Link
                                        key={thread.id}
                                        href={route('forum.show', thread.slug)}
                                        className="border-hairline bg-surface-card hover:border-hairline-strong group block rounded-cursor-lg border p-6 transition-all"
                                    >
                                        <h4 className="text-ink group-hover:text-primary font-bold transition-colors text-[16px]">{thread.title}</h4>
                                        <div className="mt-3 flex items-center gap-6">
                                            <span className="text-muted font-mono text-[10px] font-bold tracking-[0.88px] uppercase px-2 py-0.5 bg-muted/5 rounded">
                                                {thread.category.replace('_', ' ')}
                                            </span>
                                            <span className="text-muted text-xs">
                                                {thread.replies_count} replies • {new Date(thread.updated_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                                {forum_activity.length === 0 && (
                                    <div className="border-hairline text-muted/40 rounded-cursor-lg border border-dashed py-16 text-center italic text-sm">
                                        {t('No Forum Activity')}
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Recommendations */}
                    <div className="space-y-8">
                        <div className="bg-canvas-soft border-hairline space-y-6 rounded-cursor-lg border p-8">
                            <div className="flex items-center gap-3">
                                <h3 className="text-ink text-[22px] leading-tight font-normal tracking-[-0.11px]">{t('Recommendations')}</h3>
                            </div>

                            <div className="space-y-5">
                                {recommendations.map((pkg) => (
                                    <div
                                        key={pkg.id}
                                        className="bg-surface-card border-hairline hover:border-hairline-strong space-y-4 rounded-cursor-md border p-5 transition-colors"
                                    >
                                        <div>
                                            <h5 className="text-ink text-sm font-bold">{pkg.name}</h5>
                                            <p className="text-primary mt-1 text-[11px] leading-relaxed font-medium uppercase tracking-tight">{pkg.recommendation_reason}</p>
                                        </div>
                                        <div className="flex items-center justify-between gap-4 pt-2 border-t border-hairline/50">
                                            <span className="text-ink font-mono font-bold">{format(pkg.price_idr)}</span>
                                            <Button size="sm" className="bg-primary hover:bg-primary-active h-8 rounded-cursor-md px-4 text-[11px] font-bold border-none shadow-none text-white">
                                                <Link href={route('services.index')}>{tOrders('order_now')}</Link>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="border-hairline bg-surface-card space-y-6 rounded-cursor-lg border p-10 text-center">
                            <h4 className="text-ink text-[22px] font-normal tracking-[-0.11px]">Need custom solution?</h4>
                            <p className="text-body text-sm leading-relaxed">
                                Feel free to contact me for special projects not listed in services.
                            </p>
                            <Button variant="outline" className="border-hairline hover:bg-canvas-soft text-ink h-11 w-full rounded-cursor-md border-hairline-strong font-medium transition-all" asChild>
                                <Link href={route('contact')}>Contact Me</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
