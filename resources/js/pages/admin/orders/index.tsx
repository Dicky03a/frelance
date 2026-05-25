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
            pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
            paid: 'bg-primary/10 text-primary border-primary/20',
            in_progress: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
            completed: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
            cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
            expired: 'bg-muted/50 text-muted-foreground border-border',
        };
        return (
            <Badge variant="outline" className={styles[status]}>
                {status.replace('_', ' ').toUpperCase()}
            </Badge>
        );
    };

    return (
        <AppLayout>
            <Head title="Manajemen Pesanan" />
            
            <div className="space-y-6 p-6">
                <div>
                    <h1 className="text-[36px] font-normal tracking-[-0.72px] text-foreground">Pesanan</h1>
                    <p className="text-muted-foreground">Pantau dan kelola semua pesanan klien.</p>
                </div>

                <div className="rounded-xl border border-border bg-card p-6">
                    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input 
                                placeholder="Cari kode order atau nama klien..." 
                                className="pl-10 bg-muted/50 border-border rounded-xl"
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

                    <div className="overflow-hidden rounded-xl border border-border">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow className="border-border hover:bg-transparent">
                                    <TableHead className="text-muted-foreground">ORDER CODE</TableHead>
                                    <TableHead className="text-muted-foreground">KLIEN</TableHead>
                                    <TableHead className="text-muted-foreground">LAYANAN</TableHead>
                                    <TableHead className="text-muted-foreground">TOTAL</TableHead>
                                    <TableHead className="text-muted-foreground">STATUS</TableHead>
                                    <TableHead className="text-muted-foreground">TANGGAL</TableHead>
                                    <TableHead className="text-right text-muted-foreground">AKSI</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.data.map((order) => (
                                    <TableRow key={order.id} className="border-border hover:bg-muted/50 transition-colors group">
                                        <TableCell className="font-mono text-xs font-bold text-primary">
                                            {order.order_code}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="h-6 w-6 rounded-full bg-muted/50 flex items-center justify-center text-[10px] text-muted-foreground">
                                                    {order.user?.name[0]}
                                                </div>
                                                <span className="text-foreground">{order.user?.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-muted-foreground">{order.service_package?.service?.name}</div>
                                            <div className="text-[10px] text-muted-foreground uppercase">{order.service_package?.name}</div>
                                        </TableCell>
                                        <TableCell className="font-medium text-foreground">
                                            Rp {order.total_idr.toLocaleString('id-ID')}
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(order.status)}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-xs">
                                            {new Date(order.created_at).toLocaleDateString('id-ID')}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" asChild className="text-muted-foreground hover:text-primary">
                                                <Link href={route('admin.orders.show', order.id)}>
                                                    <Eye size={16} />
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {orders.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-32 text-center text-muted-foreground italic">
                                            Belum ada data pesanan
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Menampilkan {orders.meta.from} - {orders.meta.to} dari {orders.meta.total} pesanan
                        </div>
                        <div className="flex gap-2">
                            {orders.links.prev && (
                                <Button variant="outline" size="sm" asChild className="border-border bg-muted/50 text-foreground hover:bg-muted">
                                    <Link href={orders.links.prev}>Previous</Link>
                                </Button>
                            )}
                            {orders.links.next && (
                                <Button variant="outline" size="sm" asChild className="border-border bg-muted/50 text-foreground hover:bg-muted">
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
