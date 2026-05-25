import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard, AlertCircle } from 'lucide-react';

interface Order {
    id: number;
    order_code: string;
    total_idr: string;
    requirements: string;
    service_package: {
        name: string;
        service: {
            title: string;
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = snap_url;
        script.setAttribute('data-client-key', client_key);
        script.onload = () => {
            setLoading(false);
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
                    setError('Payment window closed. You can try again by refreshing the page.');
                }
            });
        };
        script.onerror = () => {
            setLoading(false);
            setError('Failed to load payment gateway. Please check your internet connection.');
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, [snap_token, snap_url, client_key, order.id]);

    return (
        <AppLayout>
            <Head title="Pembayaran Pesanan" />
            
            <div className="container mx-auto py-12 px-4">
                <div className="max-w-2xl mx-auto">
                    <Card className="border-white/10 bg-surface/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="w-6 h-6 text-indigo-500" />
                                Pembayaran Pesanan
                            </CardTitle>
                            <CardDescription>
                                Silakan selesaikan pembayaran untuk memproses pesanan Anda.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Layanan</p>
                                        <p className="text-lg font-semibold">{order.service_package.service.title}</p>
                                        <p className="text-sm text-muted-foreground">{order.service_package.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Total</p>
                                        <p className="text-xl font-bold text-indigo-400">
                                            Rp {new Intl.NumberFormat('id-ID').format(parseFloat(order.total_idr))}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="pt-4 border-t border-white/10">
                                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider mb-2">Kode Pesanan</p>
                                    <p className="font-mono bg-black/30 p-2 rounded inline-block text-sm">{order.order_code}</p>
                                </div>
                            </div>

                            <div className="flex flex-col items-center justify-center py-8">
                                {loading && (
                                    <div className="flex flex-col items-center gap-4">
                                        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                                        <p className="text-muted-foreground">Menyiapkan gerbang pembayaran...</p>
                                    </div>
                                )}

                                {error && (
                                    <div className="flex flex-col items-center gap-4 text-center">
                                        <AlertCircle className="w-12 h-12 text-red-500" />
                                        <p className="text-red-400 font-medium">{error}</p>
                                        <Button 
                                            variant="outline" 
                                            onClick={() => window.location.reload()}
                                            className="mt-2"
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
                                            onClick={() => window.snap.pay(snap_token)}
                                            className="bg-indigo-600 hover:bg-indigo-700"
                                        >
                                            Bayar Sekarang
                                        </Button>
                                    </div>
                                )}
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
