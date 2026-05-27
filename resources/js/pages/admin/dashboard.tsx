import AppLayout from '@/layouts/app-layout';
import { SharedProps } from '@/types/inertia';
import { Order, ForumThread, ServicePackage } from '@/types/models';
import { Head } from '@inertiajs/react';
import { 
    Banknote, 
    ShoppingCart, 
    Users, 
    Clock, 
    TrendingUp, 
    TrendingDown,
    MessageSquare,
    ExternalLink
} from 'lucide-react';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    Cell
} from 'recharts';

interface DashboardProps extends SharedProps {
    stats: {
        total_revenue_idr: number;
        total_orders: number;
        orders_this_month: number;
        new_clients_this_month: number;
    };
    pending_orders: { data: Order[] };
    recent_threads: ForumThread[];
    monthly_revenue: Array<{ month: string; revenue: number }>;
    top_services: ServicePackage[];
}

const StatCard = ({ title, value, icon: Icon, trend, trendValue, prefix = '' }: any) => (
    <div className="rounded-cursor-lg border border-hairline bg-surface-card p-6 flex flex-col transition-all hover:border-hairline-strong group">
        <div className="flex items-center justify-between">
            <div className="rounded-cursor-md bg-primary/5 dark:bg-primary/10 p-3 text-primary">
                <Icon size={20} />
            </div>
            {trend && (
                <div className={`flex items-center gap-1 text-[11px] font-bold tracking-wider ${trend === 'up' ? 'text-emerald-600 dark:text-emerald-500' : 'text-rose-600 dark:text-rose-500'}`}>
                    {trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {trendValue}%
                </div>
            )}
        </div>
        <div className="mt-6">
            <div className="text-[32px] font-normal text-ink leading-none tracking-[-0.325px]">
                {prefix}{typeof value === 'number' ? value.toLocaleString('id-ID') : value}
            </div>
            <div className="text-[11px] font-semibold text-muted uppercase tracking-[0.88px] mt-3">
                {title}
            </div>
        </div>
    </div>
);

export default function Dashboard({ stats, pending_orders, recent_threads, monthly_revenue, top_services }: DashboardProps) {
    return (
        <AppLayout>
            <Head title="Admin Dashboard" />
            
            <div className="space-y-12 p-8 max-w-7xl mx-auto">
                <div>
                    <h1 className="text-[36px] font-normal tracking-[-0.72px] text-ink">Dashboard Overview</h1>
                    <p className="text-body mt-2">Selamat datang kembali, Admin.</p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard 
                        title="Total Pendapatan" 
                        value={stats.total_revenue_idr} 
                        icon={Banknote} 
                        prefix="Rp "
                        trend="up"
                        trendValue={12}
                    />
                    <StatCard 
                        title="Total Pesanan" 
                        value={stats.total_orders} 
                        icon={ShoppingCart}
                        trend="up"
                        trendValue={8}
                    />
                    <StatCard 
                        title="Klien Baru" 
                        value={stats.new_clients_this_month} 
                        icon={Users}
                        trend="up"
                        trendValue={24}
                    />
                    <StatCard 
                        title="Pesanan Tertunda" 
                        value={pending_orders.data.length} 
                        icon={Clock}
                    />
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2 rounded-cursor-lg border border-hairline bg-surface-card p-8">
                        <h3 className="mb-8 text-[22px] font-normal tracking-[-0.11px] text-ink">Statistik Pendapatan</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthly_revenue}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} opacity={0.5} />
                                    <XAxis 
                                        dataKey="month" 
                                        stroke="var(--muted-foreground)" 
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                        tick={{ dy: 10 }}
                                    />
                                    <YAxis 
                                        stroke="var(--muted-foreground)" 
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `Rp ${value / 1000000}jt`}
                                    />
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: 'var(--card)', 
                                            border: '1px solid var(--border)', 
                                            borderRadius: '8px',
                                            boxShadow: 'none',
                                            fontSize: '12px'
                                        }}
                                        itemStyle={{ color: 'var(--primary)' }}
                                        cursor={{ fill: 'var(--muted)', opacity: 0.05 }}
                                    />
                                    <Bar dataKey="revenue" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="rounded-cursor-lg border border-hairline bg-surface-card p-8">
                        <h3 className="mb-8 text-[22px] font-normal tracking-[-0.11px] text-ink">Layanan Terlaris</h3>
                        <div className="space-y-6">
                            {top_services.map((service, i) => (
                                <div key={service.id} className="flex items-center justify-between group cursor-default">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-cursor-md bg-canvas dark:bg-muted text-muted-soft font-mono text-xs">
                                            {String(i + 1).padStart(2, '0')}
                                        </div>
                                        <div>
                                            <p className="font-bold text-ink text-sm group-hover:text-primary transition-colors">{service.name}</p>
                                            <p className="text-[10px] text-muted uppercase tracking-wider mt-0.5">{service.orders_count} Pesanan</p>
                                        </div>
                                    </div>
                                    <div className="text-right text-xs font-mono font-bold text-ink">
                                        Rp {(service.price_idr / 1000000).toFixed(1)}jt
                                    </div>
                                </div>
                            ))}
                            {top_services.length === 0 && (
                                <p className="text-center text-muted/30 py-4 italic text-sm">Belum ada data</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <div className="rounded-cursor-lg border border-hairline bg-surface-card overflow-hidden">
                        <div className="flex items-center justify-between p-8 border-b border-hairline">
                            <h3 className="text-[22px] font-normal tracking-[-0.11px] text-ink">Pesanan Terbaru</h3>
                            <button className="text-xs font-bold uppercase tracking-wider text-primary hover:text-primary-active transition-colors">Lihat Semua</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-canvas dark:bg-muted/30 text-[10px] font-bold text-muted uppercase tracking-[0.88px]">
                                    <tr>
                                        <th className="px-8 py-4">KODE</th>
                                        <th className="px-8 py-4">KLIEN</th>
                                        <th className="px-8 py-4">STATUS</th>
                                        <th className="px-8 py-4 text-right">TOTAL</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-hairline text-sm text-body">
                                    {pending_orders.data.map(order => (
                                        <tr key={order.id} className="hover:bg-canvas-soft dark:hover:bg-muted/10 transition-colors cursor-pointer group">
                                            <td className="px-8 py-5 font-mono text-[11px] text-muted-soft group-hover:text-primary transition-colors uppercase tracking-tight">{order.order_code}</td>
                                            <td className="px-8 py-5 font-medium text-ink">{order.user?.name}</td>
                                            <td className="px-8 py-5">
                                                <span className="inline-flex items-center rounded-cursor-pill bg-amber-500/5 dark:bg-amber-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500 border border-amber-500/10">
                                                    Pending
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 font-mono font-bold text-ink text-right">
                                                Rp {order.total_idr.toLocaleString('id-ID')}
                                            </td>
                                        </tr>
                                    ))}
                                    {pending_orders.data.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-8 py-12 text-center text-muted/30 italic text-sm border-none">Belum ada pesanan masuk</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="rounded-cursor-lg border border-hairline bg-surface-card p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-[22px] font-normal tracking-[-0.11px] text-ink">Thread Forum Terbaru</h3>
                            <MessageSquare className="text-muted/20" size={20} />
                        </div>
                        <div className="space-y-4">
                            {recent_threads.map(thread => (
                                <div key={thread.id} className="flex gap-4 p-5 rounded-cursor-md border border-hairline bg-canvas-soft dark:bg-muted/10 hover:border-hairline-strong transition-all cursor-pointer group">
                                    <div className="h-10 w-10 rounded-full bg-surface-card dark:bg-muted flex-shrink-0 flex items-center justify-center text-muted-soft border border-hairline shadow-sm">
                                        <Users size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-ink truncate group-hover:text-primary transition-colors text-sm">{thread.title}</h4>
                                        <div className="flex items-center gap-3 mt-1.5">
                                            <span className="text-[11px] font-medium text-muted">{thread.user?.name}</span>
                                            <span className="text-muted/10">•</span>
                                            <span className="text-[11px] text-muted-soft">{new Date(thread.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <ExternalLink size={14} className="text-muted/20 group-hover:text-primary transition-colors" />
                                </div>
                            ))}
                            {recent_threads.length === 0 && (
                                <p className="text-center text-muted/30 py-12 italic text-sm">Belum ada diskusi baru</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
