import PublicLayout from '@/layouts/public-layout';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { Service, ServicePackage } from '@/types/models';
import { ServicePackageCard } from '@/components/public/service-package-card';
import { SharedProps } from '@/types/inertia';
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

import { useTranslation } from '@/lib/i18n';

interface ServicesIndexProps {
    services: Service[];
}

export default function Index({ services }: ServicesIndexProps) {
    const { auth } = usePage<SharedProps>().props;
    const { t } = useTranslation('services');
    const { t: tCommon } = useTranslation('common');
    
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
            <Head title={`${t('title')} - DevPorto`} />

            <div className="px-12 py-16 space-y-cursor-section">
                <header className="max-w-3xl space-y-6">
                    <h1 className="text-[48px] md:text-[56px] font-normal text-cursor-ink leading-[1.1] tracking-[-1.5px]">{t('title')}</h1>
                    <p className="text-cursor-body text-[20px] leading-relaxed font-normal">
                        {t('subtitle')}
                    </p>
                </header>

                <div className="space-y-24">
                    {services.map((service) => (
                        <section key={service.id} className="space-y-12">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-cursor-hairline pb-8">
                                <div className="space-y-3">
                                    <h2 className="text-[36px] font-normal text-cursor-ink tracking-[-0.72px]">{service.name}</h2>
                                    <p className="text-cursor-body text-lg max-w-xl font-normal leading-relaxed">{service.description}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                {service.packages?.map((pkg) => (
                                    <ServicePackageCard 
                                        key={pkg.id} 
                                        pkg={pkg} 
                                        onSelect={handleSelectPackage}
                                    />
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                {/* Order Dialog */}
                <Dialog open={!!selectedPackage} onOpenChange={(open) => !open && setSelectedPackage(null)}>
                    <DialogContent className="sm:max-w-[500px] bg-cursor-surface-card border-cursor-hairline rounded-cursor-lg shadow-2xl p-0 overflow-hidden">
                        <div className="p-8 md:p-10 space-y-8">
                            <DialogHeader>
                                <DialogTitle className="text-[26px] font-normal text-cursor-ink tracking-[-0.325px]">{t('confirm_order')}</DialogTitle>
                                <DialogDescription className="text-cursor-body text-sm font-normal pt-2">
                                    {t('confirm_order_desc', { 
                                        package: selectedPackage?.name ?? '', 
                                        service: selectedPackage?.service?.name ?? '' 
                                    })}
                                </DialogDescription>
                            </DialogHeader>
                            
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-3">
                                    <Label htmlFor="requirements" className="text-[11px] font-semibold text-cursor-muted uppercase tracking-[0.88px] ml-1">
                                        {t('requirements_label')}
                                    </Label>
                                    <Textarea
                                        id="requirements"
                                        placeholder={t('requirements_placeholder')}
                                        className="min-h-[150px] bg-cursor-canvas-soft border-cursor-hairline text-cursor-ink placeholder:text-cursor-muted/40 rounded-cursor-md focus:border-cursor-hairline-strong transition-colors p-4 resize-none"
                                        value={data.requirements}
                                        onChange={e => setData('requirements', e.target.value)}
                                        required
                                    />
                                    {errors.requirements && (
                                        <p className="text-xs text-red-500 mt-2 ml-1">{errors.requirements}</p>
                                    )}
                                </div>

                                <div className="p-5 rounded-cursor-md bg-cursor-canvas-soft border border-cursor-hairline">
                                    <p className="text-xs text-cursor-body leading-relaxed font-normal">
                                        {t('payment_info')}
                                    </p>
                                </div>

                                <DialogFooter className="gap-4">
                                    <Button 
                                        type="button" 
                                        variant="ghost" 
                                        onClick={() => setSelectedPackage(null)}
                                        className="h-11 rounded-cursor-md font-medium text-cursor-muted hover:text-cursor-ink hover:bg-cursor-hairline-soft transition-all"
                                    >
                                        {tCommon('cancel')}
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        disabled={processing}
                                        className="h-11 bg-cursor-primary hover:bg-cursor-primary-active text-white font-medium rounded-cursor-md px-8 border-none shadow-none transition-all"
                                    >
                                        {processing ? tCommon('loading') : t('continue_to_payment')}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* FAQ / Trust Section */}
                <section className="rounded-cursor-lg border border-cursor-hairline bg-cursor-surface-card p-10 md:p-16 flex flex-col md:flex-row gap-16 items-center">
                    <div className="flex-1 space-y-8">
                        <h2 className="text-[36px] font-normal text-cursor-ink tracking-[-0.72px] leading-tight">{t('custom_solution_title')}</h2>
                        <p className="text-cursor-body leading-relaxed text-lg font-normal">
                            {t('custom_solution_desc')}
                        </p>
                        <div className="pt-4">
                            <Button asChild className="bg-cursor-ink text-white hover:bg-cursor-ink/90 rounded-cursor-md h-12 px-10 font-medium border-none shadow-none">
                                <Link href="/contact">{t('contact_me')}</Link>
                            </Button>
                        </div>
                    </div>
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-8 w-full">
                        <div className="space-y-4">
                            <h4 className="text-[18px] font-normal text-cursor-ink tracking-[-0.11px]">{t('dedicated_support')}</h4>
                            <p className="text-sm text-cursor-body leading-relaxed font-normal">{t('dedicated_support_desc')}</p>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-[18px] font-normal text-cursor-ink tracking-[-0.11px]">{t('high_performance')}</h4>
                            <p className="text-sm text-cursor-body leading-relaxed font-normal">{t('high_performance_desc')}</p>
                        </div>
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
}
