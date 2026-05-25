import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
    CheckCircle2, 
    Clock, 
    CreditCard, 
    FileText, 
    Package, 
    Star, 
    AlertCircle,
    ChevronRight,
    ArrowLeft
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Order {
    id: number;
    order_code: string;
    status: 'pending' | 'paid' | 'in_progress' | 'completed' | 'cancelled' | 'expired';
    requirements: string;
    total_idr: string;
    total_usd: string;
    payment_type?: string;
    paid_at?: string;
    created_at: string;
    service_package: {
        name: string;
        service: {
            id: number;
            title: string;
        };
    };
    rating?: {
        rating: number;
        comment: string;
    };
}

interface Props {
    order: Order;
}

const statusConfig = {
    pending: { label: 'Menunggu Pembayaran', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20', icon: Clock },
    paid: { label: 'Dibayar', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20', icon: CheckCircle2 },
    in_progress: { label: 'Sedang Dikerjakan', color: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20', icon: Clock },
    completed: { label: 'Selesai', color: 'bg-green-500/10 text-green-500 border-green-500/20', icon: CheckCircle2 },
    cancelled: { label: 'Dibatalkan', color: 'bg-red-500/10 text-red-500 border-red-500/20', icon: AlertCircle },
    expired: { label: 'Kadaluarsa', color: 'bg-gray-500/10 text-gray-500 border-gray-500/20', icon: Clock },
};

const steps = [
    { key: 'pending', label: 'Dipesan' },
    { key: 'paid', label: 'Dibayar' },
    { key: 'in_progress', label: 'Proses' },
    { key: 'completed', label: 'Selesai' },
];

export default function Show({ order }: Props) {
    const config = statusConfig[order.status];
    const StatusIcon = config.icon;

    const { data, setData, post, processing, errors } = useForm({
        rating: 5,
        review: '',
    });

    const [hoverRating, setHoverRating] = useState(0);

    const submitRating = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('orders.ratings.store', order.id));
    };

    const currentStepIndex = steps.findIndex(step => {
        if (order.status === 'pending') return step.key === 'pending';
        if (order.status === 'paid') return step.key === 'paid';
        if (order.status === 'in_progress') return step.key === 'in_progress';
        if (order.status === 'completed') return step.key === 'completed';
        return false;
    });

    return (
        <AppLayout>
            <Head title={`Pesanan ${order.order_code}`} />

            <div className="container mx-auto py-8 px-4 max-w-5xl">
                <Link 
                    href={route('dashboard')} 
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Kembali ke Dashboard
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Order Status & Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Status Banner */}
                        <Card className="border-white/10 bg-surface/50 overflow-hidden">
                            <div className={cn("px-6 py-4 flex items-center justify-between border-b border-white/5", config.color)}>
                                <div className="flex items-center gap-3">
                                    <StatusIcon className="w-5 h-5" />
                                    <span className="font-bold uppercase tracking-wider">{config.label}</span>
                                </div>
                                <span className="text-sm font-medium">{order.order_code}</span>
                            </div>
                            <CardContent className="pt-8">
                                {/* Progress Steps */}
                                <div className="relative flex justify-between mb-8 px-4">
                                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/5 -translate-y-1/2 z-0" />
                                    {steps.map((step, index) => {
                                        const isActive = index <= currentStepIndex;
                                        const isCurrent = index === currentStepIndex;
                                        return (
                                            <div key={step.key} className="relative z-10 flex flex-col items-center gap-2">
                                                <div className={cn(
                                                    "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                                                    isActive 
                                                        ? "bg-indigo-600 border-indigo-600 text-white" 
                                                        : "bg-surface border-white/10 text-muted-foreground",
                                                    isCurrent && "ring-4 ring-indigo-500/20"
                                                )}>
                                                    {isActive ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
                                                </div>
                                                <span className={cn(
                                                    "text-xs font-medium",
                                                    isActive ? "text-white" : "text-muted-foreground"
                                                )}>
                                                    {step.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="space-y-6 pt-6 border-t border-white/5">
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <FileText className="w-4 h-4" />
                                            Persyaratan Pesanan
                                        </h3>
                                        <div className="bg-black/20 rounded-lg p-4 border border-white/5 whitespace-pre-wrap text-sm leading-relaxed">
                                            {order.requirements}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Rating Section */}
                        {order.status === 'completed' && (
                            <Card className="border-indigo-500/20 bg-indigo-500/5">
                                <CardHeader>
                                    <CardTitle className="text-lg">Berikan Ulasan Anda</CardTitle>
                                    <CardDescription>Bantu kami meningkatkan layanan dengan memberikan rating dan ulasan.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {order.rating ? (
                                        <div className="space-y-4">
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star 
                                                        key={star} 
                                                        className={cn(
                                                            "w-6 h-6",
                                                            star <= order.rating!.rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground/30"
                                                        )} 
                                                    />
                                                ))}
                                            </div>
                                            <p className="italic text-muted-foreground">"{order.rating.comment}"</p>
                                        </div>
                                    ) : (
                                        <form onSubmit={submitRating} className="space-y-4">
                                            <div className="space-y-2">
                                                <Label>Rating</Label>
                                                <div className="flex gap-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button
                                                            key={star}
                                                            type="button"
                                                            onClick={() => setData('rating', star)}
                                                            onMouseEnter={() => setHoverRating(star)}
                                                            onMouseLeave={() => setHoverRating(0)}
                                                            className="focus:outline-none transition-transform hover:scale-110"
                                                        >
                                                            <Star 
                                                                className={cn(
                                                                    "w-8 h-8",
                                                                    star <= (hoverRating || data.rating) 
                                                                        ? "fill-yellow-500 text-yellow-500" 
                                                                        : "text-muted-foreground/30"
                                                                )} 
                                                            />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="review">Ulasan (Opsional)</Label>
                                                <Textarea 
                                                    id="review"
                                                    placeholder="Bagaimana pengalaman Anda menggunakan layanan ini?"
                                                    value={data.review}
                                                    onChange={e => setData('review', e.target.value)}
                                                    className="bg-black/20 border-white/10"
                                                />
                                            </div>
                                            <Button 
                                                type="submit" 
                                                disabled={processing}
                                                className="bg-indigo-600 hover:bg-indigo-700"
                                            >
                                                Kirim Ulasan
                                            </Button>
                                        </form>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right Column: Order Summary & Info */}
                    <div className="space-y-6">
                        <Card className="border-white/10 bg-surface/50">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Package className="w-5 h-5 text-indigo-500" />
                                    Ringkasan Layanan
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Layanan Utama</p>
                                    <p className="font-semibold">{order.service_package.service.title}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Paket</p>
                                    <p className="font-semibold">{order.service_package.name}</p>
                                </div>
                                <div className="pt-4 border-t border-white/5 space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">Harga</span>
                                        <span className="font-bold text-lg text-indigo-400">
                                            Rp {new Intl.NumberFormat('id-ID').format(parseFloat(order.total_idr))}
                                        </span>
                                    </div>
                                    {order.paid_at && (
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-muted-foreground flex items-center gap-1">
                                                <CreditCard className="w-3 h-3" />
                                                Metode
                                            </span>
                                            <span className="capitalize">{order.payment_type?.replace(/_/g, ' ') || 'Midtrans'}</span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-white/10 bg-surface/50">
                            <CardContent className="pt-6 space-y-4">
                                <div className="flex items-start gap-3">
                                    <Clock className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Tanggal Pesan</p>
                                        <p className="text-sm">{new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>
                                {order.paid_at && (
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Tanggal Bayar</p>
                                            <p className="text-sm">{new Date(order.paid_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {order.status === 'pending' && (
                            <Button 
                                asChild
                                className="w-full bg-indigo-600 hover:bg-indigo-700 h-12"
                            >
                                <Link href={route('orders.payment', order.id)}>
                                    Lanjut ke Pembayaran
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
