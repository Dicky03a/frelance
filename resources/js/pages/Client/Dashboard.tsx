import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Order, ForumThread, ServicePackage, SharedData } from '@/types/models';
import { StatCard } from '@/components/public/stat-card';
import { ShoppingBag, MessageSquare, Star, CheckCircle, ArrowRight, AlertCircle, Sparkles, Package } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCurrency } from '@/lib/currency';
import { cn } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';

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
            case 'completed': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
            case 'paid': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
            case 'pending': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
            case 'in_progress': return 'bg-primary/10 text-primary border-primary/20';
            case 'cancelled':
            case 'expired': return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
            default: return 'bg-muted/50 text-muted-foreground border-border';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard - DevPorto" />

            <div className="px-6 py-10 space-y-10">
                {has_unrated_orders && (
                    <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-md bg-primary/20 text-primary">
                                <AlertCircle size={20} />
                            </div>
                            <p className="text-sm font-medium text-foreground/80">{t('unrated_orders_alert')}</p>
                        </div>
                        <Button asChild variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/10">
                            <Link href={route('client.orders')}>
                                {t('rate_now')} <ArrowRight size={16} className="ml-2" />
                            </Link>
                        </Button>
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard 
                        value={stats.active_orders} 
                        label={t('stats.active_orders')} 
                    />
                    <StatCard 
                        value={stats.completed_orders} 
                        label={t('stats.completed_orders')} 
                    />
                    <StatCard 
                        value={stats.forum_posts} 
                        label={t('stats.forum_posts')} 
                    />
                    <StatCard 
                        value={stats.reviews_given} 
                        label={t('stats.reviews_given')} 
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Orders & Activity */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-[26px] font-normal tracking-[-0.325px] text-foreground flex items-center gap-2">
                                    
                                    {t('Recent Orders')}
                                </h2>
                            </div>
                            
                            <div className="space-y-3">
                                {recent_orders.map(order => (
                                    <Link 
                                        key={order.id} 
                                        href={route('orders.show', order.id)}
                                        className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-xl border border-border bg-card hover:bg-accent/50 transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">
                                                    {order.service_package?.service?.name} - {order.service_package?.name}
                                                </h4>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {t('order_card.code', { code: order.order_code })} • {new Date(order.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-4 md:mt-0 flex items-center justify-between md:justify-end gap-6">
                                            <div className="text-right">
                                                <p className="font-bold text-foreground">{format(order.total_idr)}</p>
                                                <Badge variant="outline" className={cn("mt-1 capitalize border", getStatusStyles(order.status))}>
                                                    {tOrders(`status_${order.status}`)}
                                                </Badge>
                                            </div>
                                            <ArrowRight size={18} className="text-muted/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </Link>
                                ))}
                                {recent_orders.length === 0 && (
                                    <div className="py-12 text-center rounded-xl border border-dashed border-border text-muted-foreground/50 italic">
                                        {t('no_recent_orders')}
                                    </div>
                                )}
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-[26px] font-normal tracking-[-0.325px] text-foreground flex items-center gap-2">
                                {t('Forum Activity')}
                            </h2>
                            <div className="space-y-3">
                                {forum_activity.map(thread => (
                                    <Link 
                                        key={thread.id} 
                                        href={route('forum.show', thread.slug)}
                                        className="block p-5 rounded-xl border border-border bg-card hover:bg-accent/50 transition-all group"
                                    >
                                        <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">
                                            {thread.title}
                                        </h4>
                                        <div className="flex items-center gap-4 mt-2">
                                            <span className="text-[10px] font-bold uppercase tracking-[0.88px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md">
                                                {thread.category.replace('_', ' ')}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {thread.replies_count} replies • {new Date(thread.updated_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                                {forum_activity.length === 0 && (
                                    <div className="py-12 text-center rounded-xl border border-dashed border-border text-muted-foreground/50 italic">
                                        {t('no_forum_activity')}
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Recommendations */}
                    <div className="space-y-6">
                        <div className="p-6 rounded-xl bg-accent/50 border border-border space-y-6">
                            <div className="flex items-center gap-3">
                                <h3 className="text-[22px] font-normal tracking-[-0.11px] text-foreground leading-tight">{t('Recommendations')}</h3>
                            </div>

                            <div className="space-y-4">
                                {recommendations.map(pkg => (
                                    <div key={pkg.id} className="p-4 rounded-lg bg-card border border-border space-y-3 hover:border-primary/30 transition-colors">
                                        <div>
                                            <h5 className="font-bold text-foreground text-sm">{pkg.name}</h5>
                                            <p className="text-[10px] text-primary font-medium mt-0.5 leading-relaxed">
                                                {pkg.recommendation_reason}
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between gap-4">
                                            <span className="font-black text-foreground">{format(pkg.price_idr)}</span>
                                            <Button size="sm" className="bg-primary hover:bg-primary/90 h-8 px-4 rounded-md text-[11px] font-bold">
                                                <Link href={route('services.index')}>
                                                    {tOrders('order_now')}
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-8 rounded-xl border border-border bg-card text-center space-y-4">
                            <h4 className="text-[22px] font-normal tracking-[-0.11px] text-foreground">Need custom solution?</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Feel free to contact me for special projects not listed in services.
                            </p>
                            <Button variant="outline" className="w-full border-border hover:bg-accent/50 rounded-md h-12 text-foreground" asChild>
                                <Link href={route('contact')}>Contact Me</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
