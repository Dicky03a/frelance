import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Order, OrderStatus } from '@/types/models';
import { Head, useForm } from '@inertiajs/react';
import { 
    Calendar, 
    CreditCard, 
    User as UserIcon, 
    Package, 
    FileText,
    CheckCircle2,
    Clock,
    AlertCircle,
    Save,
    MessageSquare
} from 'lucide-react';

interface OrderShowProps {
    order: Order;
    statuses: string[];
}

export default function Show({ order, statuses }: OrderShowProps) {
    const { data, setData, put, processing, errors } = useForm({
        status: order.status,
        notes_admin: order.notes_admin || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.orders.update', order.id));
    };

    const getStatusIcon = (status: OrderStatus) => {
        switch (status) {
            case 'completed': return <CheckCircle2 size={24} className="text-emerald-500" />;
            case 'pending': return <Clock size={24} className="text-amber-500" />;
            case 'cancelled': return <AlertCircle size={24} className="text-destructive" />;
            default: return <Clock size={24} className="text-primary" />;
        }
    };

    return (
        <AppLayout>
            <Head title={`Detail Pesanan: ${order.order_code}`} />
            
            <div className="space-y-6 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground border border-border">
                            {getStatusIcon(order.status)}
                        </div>
                        <div>
                            <h1 className="text-[36px] font-normal tracking-[-0.72px] text-foreground">{order.order_code}</h1>
                            <p className="text-muted-foreground">Dibuat pada {new Date(order.created_at).toLocaleString('id-ID')}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="border-border bg-muted/50 text-foreground" onClick={() => window.history.back()}>
                            Kembali
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Detail */}
                        <div className="rounded-xl border border-border bg-card p-6 space-y-6">
                            <h3 className="text-[22px] font-normal tracking-[-0.11px] text-foreground flex items-center gap-2">
                                <Package size={20} className="text-primary" /> Informasi Layanan
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-xl bg-muted/50 border border-border">
                                <div>
                                    <Label className="text-muted-foreground text-xs uppercase tracking-wider">Layanan</Label>
                                    <p className="text-foreground font-medium mt-1">{order.service_package?.service?.name}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground text-xs uppercase tracking-wider">Paket</Label>
                                    <p className="text-foreground font-medium mt-1">{order.service_package?.name}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <Label className="text-muted-foreground text-xs uppercase tracking-wider">Persyaratan / Catatan Klien</Label>
                                    <p className="text-muted-foreground mt-1 whitespace-pre-wrap">{order.requirements || 'Tidak ada catatan.'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="rounded-xl border border-border bg-card p-6 space-y-6">
                            <h3 className="text-[22px] font-normal tracking-[-0.11px] text-foreground flex items-center gap-2">
                                <CreditCard size={20} className="text-primary" /> Informasi Pembayaran
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <Label className="text-muted-foreground text-xs uppercase tracking-wider">Total (IDR)</Label>
                                    <p className="text-foreground text-xl font-medium mt-1">Rp {order.total_idr.toLocaleString('id-ID')}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground text-xs uppercase tracking-wider">Metode</Label>
                                    <p className="text-foreground mt-1 capitalize">{order.payment_type?.replace('_', ' ') || '-'}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground text-xs uppercase tracking-wider">Status Bayar</Label>
                                    <div className="mt-1">
                                        <Badge variant="outline" className={order.paid_at ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 border-amber-500/20'}>
                                            {order.paid_at ? 'LUNAS' : 'MENUNGGU'}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                            {order.paid_at && (
                                <div className="text-xs text-muted-foreground pt-4 border-t border-border">
                                    Dibayar pada {new Date(order.paid_at).toLocaleString('id-ID')}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Client Info */}
                        <div className="rounded-xl border border-border bg-card p-6 space-y-6">
                            <h3 className="text-[22px] font-normal tracking-[-0.11px] text-foreground flex items-center gap-2">
                                <UserIcon size={20} className="text-primary" /> Informasi Klien
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div>
                                        <p className="text-foreground font-medium">{order.customer_name || order.user?.name}</p>
                                        <p className="text-xs text-muted-foreground">{order.user?.email}</p>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 gap-4 pt-4 border-t border-border">
                                    <div className="flex items-center gap-3">
                                        <div>
                                            <Label className="text-muted-foreground text-[10px] uppercase tracking-wider leading-none">WhatsApp</Label>
                                            <p className="text-foreground font-medium text-sm">
                                                <a href={`https://wa.me/${order.customer_whatsapp?.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 transition-colors">
                                                    {order.customer_whatsapp || '-'}
                                                </a>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div>
                                            <Label className="text-muted-foreground text-[10px] uppercase tracking-wider leading-none">Kategori</Label>
                                            <p className="text-foreground font-medium text-sm capitalize">{order.customer_category || '-'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Admin Action */}
                        <div className="rounded-xl border border-border bg-card p-6 space-y-6">
                            <h3 className="text-[22px] font-normal tracking-[-0.11px] text-foreground flex items-center gap-2">
                                <Save size={20} className="text-primary" /> Kelola Pesanan
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-muted-foreground">Status Pesanan</Label>
                                    <select 
                                        value={data.status}
                                        onChange={e => setData('status', e.target.value as OrderStatus)}
                                        className="w-full bg-muted/50 border border-border rounded-xl text-foreground px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    >
                                        {statuses.map(s => <option key={s} value={s}>{s.replace('_', ' ').toUpperCase()}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-muted-foreground">Catatan Admin (Internal)</Label>
                                    <textarea 
                                        rows={4}
                                        value={data.notes_admin}
                                        onChange={e => setData('notes_admin', e.target.value)}
                                        className="w-full bg-muted/50 border border-border rounded-xl text-foreground px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="Tambahkan catatan internal di sini..."
                                    />
                                </div>
                                <Button 
                                    disabled={processing}
                                    className="w-full bg-primary hover:bg-primary/90 rounded-xl"
                                >
                                    Simpan Perubahan
                                </Button>
                            </form>
                        </div>

                        {/* Rating if exists */}
                        {order.rating && (
                            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                                <h3 className="text-[22px] font-normal tracking-[-0.11px] text-foreground">Review Klien</h3>
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Badge key={i} variant="outline" className={i < order.rating!.score ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 'bg-muted/50 text-muted-foreground border-border'}>★</Badge>
                                    ))}
                                </div>
                                <p className="text-sm text-muted-foreground italic">"{order.rating.review}"</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
