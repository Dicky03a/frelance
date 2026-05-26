import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
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
import { SharedProps } from '@/types/inertia';
import { BreadcrumbItem } from '@/types';

import { useTranslation } from '@/lib/i18n';
import { useCurrency } from '@/lib/currency';

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
            name: string;
        };
    };
    rating?: {
        score: number;
        review: string;
    };
}

interface Props {
    order: Order;
}

export default function Show({ order }: Props) {
    const { t } = useTranslation('orders');
    const { t: tCommon } = useTranslation('common');
    const { t: tNav } = useTranslation('nav');
    const { format } = useCurrency();
    const { locale } = usePage<SharedProps>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'My Orders',
            href: route('client.orders'),
        },
        {
            title: order.order_code,
            href: route('orders.show', order.id),
        },
    ];

    const statusConfig = {
        pending: { label: t('status_pending'), color: 'bg-amber-500/10 text-amber-600 border-amber-500/20', icon: Clock },
        paid: { label: t('status_paid'), color: 'bg-blue-500/10 text-blue-600 border-blue-500/20', icon: CheckCircle2 },
        in_progress: { label: t('status_in_progress'), color: 'bg-primary/10 text-primary border-primary/20', icon: Clock },
        completed: { label: t('status_completed'), color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20', icon: CheckCircle2 },
        cancelled: { label: t('status_cancelled'), color: 'bg-rose-500/10 text-rose-600 border-rose-500/20', icon: AlertCircle },
        expired: { label: t('status_expired'), color: 'bg-muted text-muted-foreground border-border', icon: Clock },
    };

    const steps = [
        { key: 'pending', label: t('status_pending') },
        { key: 'paid', label: t('status_paid') },
        { key: 'in_progress', label: t('status_in_progress') },
        { key: 'completed', label: t('status_completed') },
    ];

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
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('details')} ${order.order_code}`} />

            <div className="container mx-auto py-8 px-4 max-w-5xl">
                <Link 
                    href={route('dashboard')} 
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {tCommon('back')}
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Order Status & Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Status Banner */}
                        <Card className="border-border bg-card overflow-hidden">
                            <div className={cn("px-6 py-4 flex items-center justify-between border-b border-border", config.color)}>
                                <div className="flex items-center gap-3">
                                    <StatusIcon className="w-5 h-5" />
                                    <span className="font-bold uppercase tracking-[0.88px] text-[11px]">{config.label}</span>
                                </div>
                                <span className="text-sm font-medium">{order.order_code}</span>
                            </div>
                            <CardContent className="pt-8">
                                {/* Progress Steps */}
                                <div className="relative flex justify-between mb-8 px-4">
                                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 z-0" />
                                    {steps.map((step, index) => {
                                        const isActive = index <= currentStepIndex;
                                        const isCurrent = index === currentStepIndex;
                                        return (
                                            <div key={step.key} className="relative z-10 flex flex-col items-center gap-2">
                                                <div className={cn(
                                                    "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                                                    isActive 
                                                        ? "bg-primary border-primary text-white" 
                                                        : "bg-card border-border text-muted-foreground",
                                                    isCurrent && "ring-4 ring-primary/20"
                                                )}>
                                                    {isActive ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
                                                </div>
                                                <span className={cn(
                                                    "text-xs font-medium",
                                                    isActive ? "text-foreground" : "text-muted-foreground"
                                                )}>
                                                    {step.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="space-y-6 pt-6 border-t border-border">
                                    <div>
                                        <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.88px] mb-4 flex items-center gap-2">
                                            <FileText className="w-4 h-4" />
                                            {t('requirements')}
                                        </h3>
                                        <div className="bg-white rounded-lg p-4 border border-border whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                                            {order.requirements}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Rating Section */}
                        {order.status === 'completed' && (
                            <Card className="border-primary/20 bg-primary/5">
                                <CardHeader>
                                    <CardTitle className="text-[22px] font-normal tracking-[-0.11px] text-foreground">{t('give_review', { default: 'Berikan Ulasan Anda' })}</CardTitle>
                                    <CardDescription>{t('give_review_desc', { default: 'Bantu kami meningkatkan layanan dengan memberikan rating dan ulasan.' })}</CardDescription>
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
                                                            star <= order.rating!.score ? "fill-amber-500 text-amber-500" : "text-muted-foreground/30"
                                                        )} 
                                                    />
                                                ))}
                                            </div>
                                            <p className="italic text-muted-foreground">"{order.rating.review}"</p>
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
                                                                        ? "fill-amber-500 text-amber-500" 
                                                                        : "text-muted-foreground/30"
                                                                )} 
                                                            />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="review">{t('review_label', { default: 'Ulasan (Opsional)' })}</Label>
                                                <Textarea 
                                                    id="review"
                                                    placeholder={t('review_placeholder', { default: 'Bagaimana pengalaman Anda menggunakan layanan ini?' })}
                                                    value={data.review}
                                                    onChange={e => setData('review', e.target.value)}
                                                    className="bg-card border-border text-foreground"
                                                />
                                            </div>
                                            <Button 
                                                type="submit" 
                                                disabled={processing}
                                                className="bg-primary hover:bg-primary/90 text-white"
                                            >
                                                {tCommon('submit')}
                                            </Button>
                                        </form>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right Column: Order Summary & Info */}
                    <div className="space-y-6">
                        <Card className="border-border bg-card">
                            <CardHeader>
                                <CardTitle className="text-[22px] font-normal tracking-[-0.11px] text-foreground flex items-center gap-2">
                                    {t('Summary', { default: 'Ringkasan Layanan' })}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">{tNav('services')}</p>
                                    <p className="font-semibold text-foreground">{order.service_package.service.name}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">{t('package')}</p>
                                    <p className="font-semibold text-foreground">{order.service_package.name}</p>
                                </div>
                                <div className="pt-4 border-t border-border space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">{tCommon('currency')}</span>
                                        <span className="font-bold text-lg text-primary">
                                            {format(parseFloat(order.total_idr))}
                                        </span>
                                    </div>
                                    {order.paid_at && (
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-muted-foreground flex items-center gap-1">
                                                <CreditCard className="w-3 h-3" />
                                                {tCommon('actions')}
                                            </span>
                                            <span className="capitalize text-foreground">{order.payment_type?.replace(/_/g, ' ') || 'Midtrans'}</span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-border bg-card">
                            <CardContent className="pt-6 space-y-4">
                                <div className="flex items-start gap-3">
                                    <Clock className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.88px]">{t('date')}</p>
                                        <p className="text-sm text-foreground">{new Date(order.created_at).toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>
                                {order.paid_at && (
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.88px]">{t('status_paid')}</p>
                                            <p className="text-sm text-foreground">{new Date(order.paid_at).toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {order.status === 'pending' && (
                            <Button 
                                asChild
                                className="w-full bg-primary hover:bg-primary/90 h-12 text-white"
                            >
                                <Link href={route('orders.payment', order.id)}>
                                    {t('continue_to_payment', { default: 'Lanjut ke Pembayaran' })}
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
