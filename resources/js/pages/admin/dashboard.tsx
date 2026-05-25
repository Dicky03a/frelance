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
    <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
            <div className="rounded-lg bg-primary/10 p-3 text-primary">
                <Icon size={24} />
            </div>
            {trend && (
                <div className={`flex items-center gap-1 text-sm ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    {trendValue}%
                </div>
            )}
        </div>
        <div className="mt-4">
            <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.88px]">{title}</h3>
            <p className="mt-1 text-2xl font-bold text-foreground">
                {prefix}{typeof value === 'number' ? value.toLocaleString('id-ID') : value}
            </p>
        </div>
    </div>
);

export default function Dashboard({ stats, pending_orders, recent_threads, monthly_revenue, top_services }: DashboardProps) {
    return (
        <AppLayout>
            <Head title="Admin Dashboard" />
            
            <div className="space-y-8 p-6">
                <div>
                    <h1 className="text-[36px] font-normal tracking-[-0.72px] text-foreground">Dashboard Overview</h1>
                    <p className="text-muted-foreground">Selamat datang kembali, Admin.</p>
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

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6">
                        <h3 className="mb-6 text-[22px] font-normal tracking-[-0.11px] text-foreground">Statistik Pendapatan (6 Bulan Terakhir)</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthly_revenue}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e6e5e0" vertical={false} />
                                    <XAxis 
                                        dataKey="month" 
                                        stroke="#807d72" 
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis 
                                        stroke="#807d72" 
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `Rp ${value / 1000000}jt`}
                                    />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e6e5e0', borderRadius: '12px' }}
                                        itemStyle={{ color: '#f54e00' }}
                                        cursor={{ fill: '#f7f7f4' }}
                                    />
                                    <Bar dataKey="revenue" fill="#f54e00" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-6">
                        <h3 className="mb-6 text-[22px] font-normal tracking-[-0.11px] text-foreground">Layanan Terlaris</h3>
                        <div className="space-y-6">
                            {top_services.map((service, i) => (
                                <div key={service.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">{service.name}</p>
                                            <p className="text-xs text-muted-foreground">{service.orders_count} Pesanan</p>
                                        </div>
                                    </div>
                                    <div className="text-right text-sm font-medium text-primary">
                                        Rp {(service.price_idr / 1000000).toFixed(1)}jt
                                    </div>
                                </div>
                            ))}
                            {top_services.length === 0 && (
                                <p className="text-center text-muted-foreground/30 py-4 italic">Belum ada data</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="rounded-xl border border-border bg-card overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b border-border">
                            <h3 className="text-[22px] font-normal tracking-[-0.11px] text-foreground">Pesanan Terbaru</h3>
                            <button className="text-sm text-primary hover:text-primary/80">Lihat Semua</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-muted/50 text-xs font-medium text-muted-foreground">
                                    <tr>
                                        <th className="px-6 py-3 uppercase tracking-[0.88px]">KODE</th>
                                        <th className="px-6 py-3 uppercase tracking-[0.88px]">KLIEN</th>
                                        <th className="px-6 py-3 uppercase tracking-[0.88px]">PAKET</th>
                                        <th className="px-6 py-3 uppercase tracking-[0.88px]">STATUS</th>
                                        <th className="px-6 py-3 uppercase tracking-[0.88px]">TOTAL</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border text-sm text-foreground/70">
                                    {pending_orders.data.map(order => (
                                        <tr key={order.id} className="hover:bg-muted/50 transition-colors cursor-pointer">
                                            <td className="px-6 py-4 font-mono text-xs">{order.order_code}</td>
                                            <td className="px-6 py-4">{order.user?.name}</td>
                                            <td className="px-6 py-4">{order.service_package?.name}</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600 border border-amber-500/20">
                                                    Pending
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-foreground">
                                                Rp {order.total_idr.toLocaleString('id-ID')}
                                            </td>
                                        </tr>
                                    ))}
                                    {pending_orders.data.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground/30 italic">Belum ada pesanan masuk</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-[22px] font-normal tracking-[-0.11px] text-foreground">Thread Forum Terbaru</h3>
                            <MessageSquare className="text-muted-foreground/20" size={20} />
                        </div>
                        <div className="space-y-4">
                            {recent_threads.map(thread => (
                                <div key={thread.id} className="flex gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer group">
                                    <div className="h-10 w-10 rounded-full bg-muted flex-shrink-0 flex items-center justify-center text-muted-foreground">
                                        <Users size={20} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">{thread.title}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-muted-foreground">{thread.user?.name}</span>
                                            <span className="text-muted-foreground/10">•</span>
                                            <span className="text-xs text-muted-foreground/50">{new Date(thread.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <ExternalLink size={16} className="text-muted-foreground/20" />
                                </div>
                            ))}
                            {recent_threads.length === 0 && (
                                <p className="text-center text-muted-foreground/30 py-8 italic">Belum ada diskusi baru</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
