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
            case 'completed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'paid': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'in_progress': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
            case 'cancelled':
            case 'expired': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
            default: return 'bg-white/5 text-white/40 border-white/10';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard - DevPorto" />

            <div className="px-6 py-10 space-y-10">
                {/* Header */}
                <header className="space-y-2">
                    <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                        {t('welcome', { name: auth.user.name })}
                    </h1>
                    <p className="text-white/40 text-lg">
                        {t('subtitle')}
                    </p>
                </header>

                {/* Unrated Orders Alert */}
                {has_unrated_orders && (
                    <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                                <AlertCircle size={20} />
                            </div>
                            <p className="text-sm font-medium text-white/80">{t('unrated_orders_alert')}</p>
                        </div>
                        <Button asChild variant="ghost" className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10">
                            <Link href={route('client.orders')}>
                                {t('rate_now')} <ArrowRight size={16} className="ml-2" />
                            </Link>
                        </Button>
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard 
                        icon={ShoppingBag} 
                        value={stats.active_orders} 
                        label={t('stats.active_orders')} 
                        color="indigo" 
                    />
                    <StatCard 
                        icon={CheckCircle} 
                        value={stats.completed_orders} 
                        label={t('stats.completed_orders')} 
                        color="emerald" 
                    />
                    <StatCard 
                        icon={MessageSquare} 
                        value={stats.forum_posts} 
                        label={t('stats.forum_posts')} 
                        color="sky" 
                    />
                    <StatCard 
                        icon={Star} 
                        value={stats.reviews_given} 
                        label={t('stats.reviews_given')} 
                        color="amber" 
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Orders & Activity */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <ShoppingBag size={20} className="text-indigo-400" />
                                    {t('recent_orders')}
                                </h2>
                                <Link href={route('client.orders')} className="text-xs font-bold text-white/30 hover:text-indigo-400 transition-colors uppercase tracking-widest">
                                    {t('view_all_orders')} →
                                </Link>
                            </div>
                            
                            <div className="space-y-3">
                                {recent_orders.map(order => (
                                    <Link 
                                        key={order.id} 
                                        href={route('orders.show', order.id)}
                                        className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-[24px] border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                                <Package size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white group-hover:text-indigo-400 transition-colors">
                                                    {order.service_package?.service?.name} - {order.service_package?.name}
                                                </h4>
                                                <p className="text-xs text-white/30 mt-1">
                                                    {t('order_card.code', { code: order.order_code })} • {new Date(order.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-4 md:mt-0 flex items-center justify-between md:justify-end gap-6">
                                            <div className="text-right">
                                                <p className="font-bold text-white">{format(order.total_idr)}</p>
                                                <Badge variant="outline" className={cn("mt-1 capitalize border", getStatusStyles(order.status))}>
                                                    {tOrders(`status_${order.status}`)}
                                                </Badge>
                                            </div>
                                            <ArrowRight size={18} className="text-white/10 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </Link>
                                ))}
                                {recent_orders.length === 0 && (
                                    <div className="py-12 text-center rounded-[24px] border border-dashed border-white/5 text-white/20 italic">
                                        {t('no_recent_orders')}
                                    </div>
                                )}
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <MessageSquare size={20} className="text-sky-400" />
                                {t('forum_activity')}
                            </h2>
                            <div className="space-y-3">
                                {forum_activity.map(thread => (
                                    <Link 
                                        key={thread.id} 
                                        href={route('forum.show', thread.slug)}
                                        className="block p-5 rounded-[24px] border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all group"
                                    >
                                        <h4 className="font-bold text-white group-hover:text-sky-400 transition-colors">
                                            {thread.title}
                                        </h4>
                                        <div className="flex items-center gap-4 mt-2">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/20 bg-white/5 px-2 py-0.5 rounded-md">
                                                {thread.category.replace('_', ' ')}
                                            </span>
                                            <span className="text-xs text-white/30">
                                                {thread.replies_count} replies • {new Date(thread.updated_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                                {forum_activity.length === 0 && (
                                    <div className="py-12 text-center rounded-[24px] border border-dashed border-white/5 text-white/20 italic">
                                        {t('no_forum_activity')}
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Recommendations */}
                    <div className="space-y-6">
                        <div className="p-6 rounded-[32px] bg-gradient-to-br from-indigo-600/20 to-violet-600/10 border border-indigo-500/20 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400">
                                    <Sparkles size={24} />
                                </div>
                                <h3 className="font-bold text-white text-lg leading-tight">{t('recommendations')}</h3>
                            </div>

                            <div className="space-y-4">
                                {recommendations.map(pkg => (
                                    <div key={pkg.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3 hover:border-indigo-500/30 transition-colors">
                                        <div>
                                            <h5 className="font-bold text-white text-sm">{pkg.name}</h5>
                                            <p className="text-[10px] text-indigo-400 font-medium mt-0.5 leading-relaxed">
                                                {pkg.recommendation_reason}
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between gap-4">
                                            <span className="font-black text-white">{format(pkg.price_idr)}</span>
                                            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 h-8 px-4 rounded-xl text-[11px] font-bold">
                                                <Link href={route('services.index')}>
                                                    {tOrders('order_now')}
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-8 rounded-[32px] border border-white/5 bg-[#1c1c28] text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto text-indigo-400">
                                <Star size={32} />
                            </div>
                            <h4 className="font-bold text-white">Need custom solution?</h4>
                            <p className="text-sm text-white/40 leading-relaxed">
                                Feel free to contact me for special projects not listed in services.
                            </p>
                            <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 rounded-2xl h-12" asChild>
                                <Link href={route('contact')}>Contact Me</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
