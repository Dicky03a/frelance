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
    pending_orders: Order[];
    recent_threads: ForumThread[];
    monthly_revenue: Array<{ month: string; revenue: number }>;
    top_services: ServicePackage[];
}

const StatCard = ({ title, value, icon: Icon, trend, trendValue, prefix = '' }: any) => (
    <div className="rounded-[20px] border border-white/7 bg-[#1c1c28] p-6">
        <div className="flex items-center justify-between">
            <div className="rounded-xl bg-indigo-500/10 p-3 text-indigo-400">
                <Icon size={24} />
            </div>
            {trend && (
                <div className={`flex items-center gap-1 text-sm ${trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    {trendValue}%
                </div>
            )}
        </div>
        <div className="mt-4">
            <h3 className="text-sm font-medium text-white/50">{title}</h3>
            <p className="mt-1 text-2xl font-bold text-white">
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
                    <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
                    <p className="text-white/50">Selamat datang kembali, Admin.</p>
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
                        value={pending_orders.length} 
                        icon={Clock}
                    />
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 rounded-[20px] border border-white/7 bg-[#1c1c28] p-6">
                        <h3 className="mb-6 text-lg font-bold text-white">Statistik Pendapatan (6 Bulan Terakhir)</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthly_revenue}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                    <XAxis 
                                        dataKey="month" 
                                        stroke="#ffffff50" 
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis 
                                        stroke="#ffffff50" 
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `Rp ${value / 1000000}jt`}
                                    />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#1c1c28', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                        itemStyle={{ color: '#818cf8' }}
                                        cursor={{ fill: '#ffffff05' }}
                                    />
                                    <Bar dataKey="revenue" fill="#6366f1" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="rounded-[20px] border border-white/7 bg-[#1c1c28] p-6">
                        <h3 className="mb-6 text-lg font-bold text-white">Layanan Terlaris</h3>
                        <div className="space-y-6">
                            {top_services.map((service, i) => (
                                <div key={service.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 font-bold">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">{service.name}</p>
                                            <p className="text-xs text-white/50">{service.orders_count} Pesanan</p>
                                        </div>
                                    </div>
                                    <div className="text-right text-sm font-medium text-indigo-400">
                                        Rp {(service.price_idr / 1000000).toFixed(1)}jt
                                    </div>
                                </div>
                            ))}
                            {top_services.length === 0 && (
                                <p className="text-center text-white/30 py-4 italic">Belum ada data</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="rounded-[20px] border border-white/7 bg-[#1c1c28] overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b border-white/7">
                            <h3 className="text-lg font-bold text-white">Pesanan Terbaru</h3>
                            <button className="text-sm text-indigo-400 hover:text-indigo-300">Lihat Semua</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white/5 text-xs font-medium text-white/50">
                                    <tr>
                                        <th className="px-6 py-3">KODE</th>
                                        <th className="px-6 py-3">KLIEN</th>
                                        <th className="px-6 py-3">PAKET</th>
                                        <th className="px-6 py-3">STATUS</th>
                                        <th className="px-6 py-3">TOTAL</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-sm text-white/70">
                                    {pending_orders.map(order => (
                                        <tr key={order.id} className="hover:bg-white/5 transition-colors cursor-pointer">
                                            <td className="px-6 py-4 font-mono text-xs">{order.order_code}</td>
                                            <td className="px-6 py-4">{order.user?.name}</td>
                                            <td className="px-6 py-4">{order.service_package?.name}</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-400 border border-amber-500/20">
                                                    Pending
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-white">
                                                Rp {order.total_idr.toLocaleString('id-ID')}
                                            </td>
                                        </tr>
                                    ))}
                                    {pending_orders.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-white/30 italic">Belum ada pesanan masuk</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="rounded-[20px] border border-white/7 bg-[#1c1c28] p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-white">Thread Forum Terbaru</h3>
                            <MessageSquare className="text-white/20" size={20} />
                        </div>
                        <div className="space-y-4">
                            {recent_threads.map(thread => (
                                <div key={thread.id} className="flex gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                                    <div className="h-10 w-10 rounded-full bg-white/10 flex-shrink-0 flex items-center justify-center text-white/50">
                                        <Users size={20} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-white truncate group-hover:text-indigo-400 transition-colors">{thread.title}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-white/50">{thread.user?.name}</span>
                                            <span className="text-white/10">•</span>
                                            <span className="text-xs text-white/30">{new Date(thread.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <ExternalLink size={16} className="text-white/20" />
                                </div>
                            ))}
                            {recent_threads.length === 0 && (
                                <p className="text-center text-white/30 py-8 italic">Belum ada diskusi baru</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
