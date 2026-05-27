import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard, AlertCircle, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

interface Order {
    id: number;
    order_code: string;
    total_idr: string;
    requirements: string;
    service_package: {
        name: string;
        service: {
            name: string;
        };
    };
}

interface Props {
    order: Order;
    snap_token: string;
    client_key: string;
    snap_url: string;
}

declare global {
    interface Window {
        snap: any;
    }
}

export default function Payment({ order, snap_token, client_key, snap_url }: Props) {
    const { t } = useTranslation('orders');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const triggerPayment = () => {
        if (!window.snap) {
            setError('Payment gateway not ready. Please refresh the page.');
            return;
        }

        window.snap.pay(snap_token, {
            onSuccess: (result: any) => {
                router.visit(route('orders.show', order.id));
            },
            onPending: (result: any) => {
                router.visit(route('orders.show', order.id));
            },
            onError: (result: any) => {
                setError(result.status_message || 'Payment failed. Please try again.');
            },
            onClose: () => {
                setError('Payment window closed. You can try again by clicking "Bayar Sekarang".');
            }
        });
    };

    useEffect(() => {
        // Check if script is already loaded
        const existingScript = document.getElementById('midtrans-snap');
        
        if (existingScript) {
            setLoading(false);
            // Delay slightly to ensure snap is ready
            setTimeout(triggerPayment, 500);
            return;
        }

        const script = document.createElement('script');
        script.id = 'midtrans-snap';
        script.src = snap_url;
        script.setAttribute('data-client-key', client_key);
        script.async = true;
        
        script.onload = () => {
            setLoading(false);
            // Small delay helps with some browser origin issues
            setTimeout(triggerPayment, 500);
        };

        script.onerror = () => {
            setLoading(false);
            setError('Failed to load payment gateway. Please check your internet connection.');
        };

        document.body.appendChild(script);

        return () => {
            // We don't necessarily want to remove it if it might be reused, 
            // but for a single payment page it's usually fine.
            // However, removing it might cause issues if navigation is fast.
        };
    }, [snap_token, snap_url, client_key]);

    return (
        <AppLayout>
            <Head title="Pembayaran Pesanan" />
            
            <div className="container mx-auto py-12 px-4">
                <div className="max-w-2xl mx-auto">
                    <Card className="border-border bg-card">
                        <CardHeader>
                            <CardTitle className="text-[26px] font-normal tracking-[-0.325px] text-foreground flex items-center gap-2">
                                <CreditCard className="w-6 h-6 text-primary" />
                                Pembayaran Pesanan
                            </CardTitle>
                            <CardDescription className="text-muted-foreground">
                                Silakan selesaikan pembayaran untuk memproses pesanan Anda.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="p-4 rounded-lg bg-muted/50 border border-border space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.88px]">Layanan</p>
                                        <p className="text-lg font-semibold text-foreground">{order.service_package.service.name}</p>
                                        <p className="text-sm text-muted-foreground">{order.service_package.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.88px]">Total</p>
                                        <p className="text-xl font-bold text-primary">
                                            Rp {new Intl.NumberFormat('id-ID').format(parseFloat(order.total_idr))}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="pt-4 border-t border-border">
                                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.88px] mb-2">Kode Pesanan</p>
                                    <p className="font-mono bg-muted p-2 rounded inline-block text-sm text-foreground">{order.order_code}</p>
                                </div>
                            </div>

                            <div className="flex flex-col items-center justify-center py-8">
                                {loading && (
                                    <div className="flex flex-col items-center gap-4">
                                        <Loader2 className="w-12 h-12 text-primary animate-spin" />
                                        <p className="text-muted-foreground">Menyiapkan gerbang pembayaran...</p>
                                    </div>
                                )}

                                {error && (
                                    <div className="flex flex-col items-center gap-4 text-center">
                                        <AlertCircle className="w-12 h-12 text-rose-500" />
                                        <p className="text-rose-600 font-medium">{error}</p>
                                        <Button 
                                            variant="outline" 
                                            onClick={() => window.location.reload()}
                                            className="mt-2 text-foreground"
                                        >
                                            Coba Lagi
                                        </Button>
                                    </div>
                                )}

                                {!loading && !error && (
                                    <div className="text-center space-y-4">
                                        <p className="text-muted-foreground">
                                            Jendela pembayaran muncul secara otomatis. 
                                            Jika tidak muncul, silakan klik tombol di bawah ini.
                                        </p>
                                        <Button 
                                            onClick={triggerPayment}
                                            className="bg-primary hover:bg-primary/90 text-white"
                                        >
                                            Bayar Sekarang
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div className="pt-6 border-t border-border space-y-6">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/10 dark:border-emerald-500/20">
                                    <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-500">
                                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center">
                                            <ShieldCheck className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm leading-tight">{t('payment_secure_title')}</p>
                                            <p className="text-xs opacity-80 dark:text-emerald-500/80">{t('payment_secure_desc')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-zinc-900 border border-border shadow-sm">
                                        <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">SSL Encrypted</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30 dark:bg-muted/10">
                                        <CheckCircle2 className="w-5 h-5 text-primary dark:text-foreground" />
                                        <p className="text-[13px] font-medium text-foreground">{t('payment_trusted_partner')}</p>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30 dark:bg-muted/10">
                                        <div className="flex -space-x-1">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="w-6 h-6 rounded-full border-2 border-background bg-muted dark:bg-muted/20 flex items-center justify-center overflow-hidden">
                                                    <CreditCard className="w-3 h-3 text-muted-foreground" />
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-[13px] font-medium text-foreground">Multi-channel Payment</p>
                                    </div>
                                </div>
                            </div>

                            <div className="text-center">
                                <p className="text-sm text-muted-foreground">
                                    Hubungi kami jika Anda mengalami kendala dalam pembayaran.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
