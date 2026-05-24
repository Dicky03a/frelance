import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from '@/components/ui/table';
import { PaginatedResponse } from '@/types/pagination';
import { Order, OrderStatus } from '@/types/models';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Search, 
    Eye, 
    Filter,
    Calendar,
    User as UserIcon
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface OrdersIndexProps {
    orders: PaginatedResponse<Order>;
    filters: {
        status?: string;
        search?: string;
    };
    statuses: string[];
}

export default function Index({ orders, filters, statuses }: OrdersIndexProps) {
    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== filters.search) {
                router.get(route('admin.orders.index'), { ...filters, search }, { preserveState: true, replace: true });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const getStatusBadge = (status: OrderStatus) => {
        const styles: Record<OrderStatus, string> = {
            pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
            paid: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
            in_progress: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
            completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
            cancelled: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
            expired: 'bg-white/5 text-white/40 border-white/10',
        };
        return (
            <Badge className={styles[status]}>
                {status.replace('_', ' ').toUpperCase()}
            </Badge>
        );
    };

    return (
        <AppLayout>
            <Head title="Manajemen Pesanan" />
            
            <div className="space-y-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Pesanan</h1>
                    <p className="text-white/50">Pantau dan kelola semua pesanan klien.</p>
                </div>

                <div className="rounded-[20px] border border-white/7 bg-[#1c1c28] p-6">
                    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                            <Input 
                                placeholder="Cari kode order atau nama klien..." 
                                className="pl-10 bg-white/5 border-white/10 rounded-xl"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                            <Button 
                                variant={!filters.status ? 'secondary' : 'ghost'} 
                                size="sm"
                                onClick={() => router.get(route('admin.orders.index'), { ...filters, status: '' })}
                                className="rounded-lg"
                            >
                                Semua
                            </Button>
                            {statuses.map(status => (
                                <Button 
                                    key={status}
                                    variant={filters.status === status ? 'secondary' : 'ghost'}
                                    size="sm"
                                    onClick={() => router.get(route('admin.orders.index'), { ...filters, status })}
                                    className="rounded-lg whitespace-nowrap"
                                >
                                    {status.replace('_', ' ')}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-white/7">
                        <Table>
                            <TableHeader className="bg-white/5">
                                <TableRow className="border-white/7 hover:bg-transparent">
                                    <TableHead className="text-white/50">ORDER CODE</TableHead>
                                    <TableHead className="text-white/50">KLIEN</TableHead>
                                    <TableHead className="text-white/50">LAYANAN</TableHead>
                                    <TableHead className="text-white/50">TOTAL</TableHead>
                                    <TableHead className="text-white/50">STATUS</TableHead>
                                    <TableHead className="text-white/50">TANGGAL</TableHead>
                                    <TableHead className="text-right text-white/50">AKSI</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.data.map((order) => (
                                    <TableRow key={order.id} className="border-white/7 hover:bg-white/5 transition-colors group">
                                        <TableCell className="font-mono text-xs font-bold text-indigo-400">
                                            {order.order_code}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center text-[10px]">
                                                    {order.user?.name[0]}
                                                </div>
                                                <span className="text-white">{order.user?.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-white/70">{order.service_package?.service?.name}</div>
                                            <div className="text-[10px] text-white/30 uppercase">{order.service_package?.name}</div>
                                        </TableCell>
                                        <TableCell className="font-medium text-white">
                                            Rp {order.total_idr.toLocaleString('id-ID')}
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(order.status)}
                                        </TableCell>
                                        <TableCell className="text-white/40 text-xs">
                                            {new Date(order.created_at).toLocaleDateString('id-ID')}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" asChild className="text-white/30 hover:text-indigo-400">
                                                <Link href={route('admin.orders.show', order.id)}>
                                                    <Eye size={16} />
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {orders.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-32 text-center text-white/30 italic">
                                            Belum ada data pesanan
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination - Reuse the logic from projects if needed, or make it a component */}
                    <div className="mt-6 flex items-center justify-between">
                        <div className="text-sm text-white/30">
                            Menampilkan {orders.meta.from} - {orders.meta.to} dari {orders.meta.total} pesanan
                        </div>
                        <div className="flex gap-2">
                            {orders.links.prev && (
                                <Button variant="outline" size="sm" asChild className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                                    <Link href={orders.links.prev}>Previous</Link>
                                </Button>
                            )}
                            {orders.links.next && (
                                <Button variant="outline" size="sm" asChild className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                                    <Link href={orders.links.next}>Next</Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
