import PublicLayout from '@/layouts/public-layout';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { Service, ServicePackage } from '@/types/models';
import { ServicePackageCard } from '@/components/public/service-package-card';
import { SharedProps } from '@/types/inertia';
import { Wrench, Rocket, ShieldCheck, HeartHandshake, Zap, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

interface ServicesIndexProps {
    services: Service[];
}

export default function Index({ services }: ServicesIndexProps) {
    const { currency, auth } = usePage<SharedProps>().props;
    const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        service_package_id: 0,
        requirements: '',
    });

    const handleSelectPackage = (pkg: ServicePackage) => {
        if (!auth.user) {
            router.get(route('login'), { 
                redirect: window.location.pathname 
            });
            return;
        }
        setSelectedPackage(pkg);
        setData('service_package_id', pkg.id);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('orders.store'), {
            onSuccess: () => {
                setSelectedPackage(null);
                reset();
            },
        });
    };

    return (
        <PublicLayout>
            <Head title="Layanan & Paket Harga - DevPorto" />

            <div className="px-6 py-10 space-y-20">
                <header className="max-w-3xl space-y-4">
                    <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/10 mb-2">
                        <Wrench size={28} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Layanan Kami</h1>
                    <p className="text-white/40 text-lg leading-relaxed">
                        Solusi pengembangan web profesional dengan harga transparan. Pilih paket yang paling sesuai dengan kebutuhan bisnis Anda.
                    </p>
                </header>

                <div className="space-y-32">
                    {services.map((service) => (
                        <section key={service.id} className="space-y-12">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-bold text-white">{service.title}</h2>
                                    <p className="text-white/50 max-w-xl">{service.description}</p>
                                </div>
                                <div className="flex gap-4 text-xs font-bold text-white/20 uppercase tracking-widest">
                                    <span className="flex items-center gap-2"><Rocket size={14} /> Fast Delivery</span>
                                    <span className="flex items-center gap-2"><ShieldCheck size={14} /> Secure Code</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                                {service.packages?.map((pkg) => (
                                    <ServicePackageCard 
                                        key={pkg.id} 
                                        pkg={pkg} 
                                        currency={currency as 'IDR' | 'USD'} 
                                        onSelect={handleSelectPackage}
                                    />
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                {/* Order Dialog */}
                <Dialog open={!!selectedPackage} onOpenChange={(open) => !open && setSelectedPackage(null)}>
                    <DialogContent className="sm:max-w-[500px] bg-[#111118] border-white/10">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">Konfirmasi Pesanan</DialogTitle>
                            <DialogDescription className="text-white/50">
                                Anda memilih paket <span className="text-white font-semibold">{selectedPackage?.name}</span> untuk layanan <span className="text-white font-semibold">{selectedPackage?.service?.title}</span>.
                            </DialogDescription>
                        </DialogHeader>
                        
                        <form onSubmit={handleSubmit} className="space-y-6 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="requirements" className="text-white font-medium">
                                    Persyaratan & Detail Proyek
                                </Label>
                                <Textarea
                                    id="requirements"
                                    placeholder="Jelaskan kebutuhan proyek Anda secara detail (minimal 20 karakter)..."
                                    className="min-h-[150px] bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-indigo-500 transition-colors"
                                    value={data.requirements}
                                    onChange={e => setData('requirements', e.target.value)}
                                    required
                                />
                                {errors.requirements && (
                                    <p className="text-xs text-red-400 mt-1">{errors.requirements}</p>
                                )}
                            </div>

                            <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex gap-3">
                                <Info className="text-indigo-400 shrink-0" size={20} />
                                <p className="text-xs text-indigo-200/60 leading-relaxed">
                                    Setelah menekan tombol di bawah, Anda akan diarahkan ke halaman pembayaran Midtrans yang aman untuk menyelesaikan transaksi.
                                </p>
                            </div>

                            <DialogFooter>
                                <Button 
                                    type="button" 
                                    variant="ghost" 
                                    onClick={() => setSelectedPackage(null)}
                                    className="rounded-xl hover:bg-white/5 text-white/50 hover:text-white"
                                >
                                    Batal
                                </Button>
                                <Button 
                                    type="submit" 
                                    disabled={processing}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl h-11 px-6 transition-all"
                                >
                                    {processing ? 'Memproses...' : 'Lanjutkan ke Pembayaran'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* FAQ / Trust Section */}
                <section className="rounded-[40px] border border-white/7 bg-[#1c1c28] p-8 md:p-16 flex flex-col md:flex-row gap-12 items-center">
                    <div className="flex-1 space-y-6">
                        <h2 className="text-3xl font-bold text-white">Butuh Solusi Kustom?</h2>
                        <p className="text-white/50 leading-relaxed text-lg">
                            Jika kebutuhan proyek Anda tidak tercakup dalam paket di atas, saya selalu terbuka untuk diskusi mengenai solusi kustom yang dirancang khusus untuk skala bisnis Anda.
                        </p>
                        <div className="flex gap-4 pt-4">
                            <Button asChild className="bg-white text-indigo-600 hover:bg-white/90 rounded-2xl h-12 px-8 font-bold">
                                <Link href="/contact">Hubungi Saya</Link>
                            </Button>
                        </div>
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-4 w-full">
                        <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-2">
                            <HeartHandshake className="text-indigo-400 mb-2" size={24} />
                            <h4 className="font-bold text-white">Dedicated Support</h4>
                            <p className="text-xs text-white/30">Dukungan penuh selama dan sesudah masa pengembangan.</p>
                        </div>
                        <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-2">
                            <Zap className="text-amber-400 mb-2" size={24} />
                            <h4 className="font-bold text-white">High Performance</h4>
                            <p className="text-xs text-white/30">Optimasi kecepatan dan SEO untuk hasil terbaik.</p>
                        </div>
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
}
