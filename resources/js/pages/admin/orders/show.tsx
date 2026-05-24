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
    Save
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
            case 'completed': return <CheckCircle2 size={24} className="text-emerald-400" />;
            case 'pending': return <Clock size={24} className="text-amber-400" />;
            case 'cancelled': return <AlertCircle size={24} className="text-rose-400" />;
            default: return <Clock size={24} className="text-indigo-400" />;
        }
    };

    return (
        <AppLayout>
            <Head title={`Detail Pesanan: ${order.order_code}`} />
            
            <div className="space-y-6 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center text-white/50 border border-white/10">
                            {getStatusIcon(order.status)}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">{order.order_code}</h1>
                            <p className="text-white/50">Dibuat pada {new Date(order.created_at).toLocaleString('id-ID')}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="border-white/10 bg-white/5 text-white" onClick={() => window.history.back()}>
                            Kembali
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Detail */}
                        <div className="rounded-[20px] border border-white/7 bg-[#1c1c28] p-6 space-y-6">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Package size={20} className="text-indigo-400" /> Informasi Layanan
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-xl bg-white/5 border border-white/5">
                                <div>
                                    <Label className="text-white/30 text-xs uppercase tracking-wider">Layanan</Label>
                                    <p className="text-white font-medium mt-1">{order.service_package?.service?.name}</p>
                                </div>
                                <div>
                                    <Label className="text-white/30 text-xs uppercase tracking-wider">Paket</Label>
                                    <p className="text-white font-medium mt-1">{order.service_package?.name}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <Label className="text-white/30 text-xs uppercase tracking-wider">Persyaratan / Catatan Klien</Label>
                                    <p className="text-white/70 mt-1 whitespace-pre-wrap">{order.requirements || 'Tidak ada catatan.'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="rounded-[20px] border border-white/7 bg-[#1c1c28] p-6 space-y-6">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <CreditCard size={20} className="text-indigo-400" /> Informasi Pembayaran
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <Label className="text-white/30 text-xs uppercase tracking-wider">Total (IDR)</Label>
                                    <p className="text-white text-xl font-bold mt-1">Rp {order.total_idr.toLocaleString('id-ID')}</p>
                                </div>
                                <div>
                                    <Label className="text-white/30 text-xs uppercase tracking-wider">Metode</Label>
                                    <p className="text-white mt-1 capitalize">{order.payment_type?.replace('_', ' ') || '-'}</p>
                                </div>
                                <div>
                                    <Label className="text-white/30 text-xs uppercase tracking-wider">Status Bayar</Label>
                                    <div className="mt-1">
                                        <Badge className={order.paid_at ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}>
                                            {order.paid_at ? 'LUNAS' : 'MENUNGGU'}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                            {order.paid_at && (
                                <div className="text-xs text-white/30 pt-4 border-t border-white/5">
                                    Dibayar pada {new Date(order.paid_at).toLocaleString('id-ID')}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Client Info */}
                        <div className="rounded-[20px] border border-white/7 bg-[#1c1c28] p-6 space-y-6">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <UserIcon size={20} className="text-indigo-400" /> Informasi Klien
                            </h3>
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center text-lg font-bold">
                                    {order.user?.name[0]}
                                </div>
                                <div>
                                    <p className="text-white font-medium">{order.user?.name}</p>
                                    <p className="text-xs text-white/40">{order.user?.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Admin Action */}
                        <div className="rounded-[20px] border border-white/7 bg-[#1c1c28] p-6 space-y-6">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Save size={20} className="text-indigo-400" /> Kelola Pesanan
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-white/50">Status Pesanan</Label>
                                    <select 
                                        value={data.status}
                                        onChange={e => setData('status', e.target.value as OrderStatus)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                    >
                                        {statuses.map(s => <option key={s} value={s}>{s.replace('_', ' ').toUpperCase()}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-white/50">Catatan Admin (Internal)</Label>
                                    <textarea 
                                        rows={4}
                                        value={data.notes_admin}
                                        onChange={e => setData('notes_admin', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                        placeholder="Tambahkan catatan internal di sini..."
                                    />
                                </div>
                                <Button 
                                    disabled={processing}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-xl"
                                >
                                    Simpan Perubahan
                                </Button>
                            </form>
                        </div>

                        {/* Rating if exists */}
                        {order.rating && (
                            <div className="rounded-[20px] border border-white/7 bg-[#1c1c28] p-6 space-y-4">
                                <h3 className="text-lg font-bold text-white">Review Klien</h3>
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Badge key={i} className={i < order.rating!.score ? 'bg-amber-500 text-amber-500' : 'bg-white/10 text-white/10'}>★</Badge>
                                    ))}
                                </div>
                                <p className="text-sm text-white/70 italic">"{order.rating.review}"</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
