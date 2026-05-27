import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ServicePackage } from '@/types/models';
import { Check, ShieldCheck } from 'lucide-react';
import { useCurrency } from '@/lib/currency';
import { useTranslation } from '@/lib/i18n';

export function ServicePackageCard({ 
    pkg, 
    onSelect 
}: { 
    pkg: ServicePackage; 
    onSelect: (pkg: ServicePackage) => void;
}) {
    const { format } = useCurrency();
    const { t } = useTranslation('home');
    const { t: tOrders } = useTranslation('orders');
    
    // We always use price_idr as the source and format it based on selected currency
    const formattedPrice = format(pkg.price_idr);

    return (
        <div
            className={cn(
                'relative flex flex-col rounded-cursor-lg border p-10 transition-all duration-300',
                pkg.is_popular
                    ? 'z-10 scale-[1.05] border-cursor-ink bg-cursor-ink text-cursor-canvas'
                    : 'border-cursor-hairline bg-cursor-surface-card text-cursor-ink hover:border-cursor-hairline-strong',
            )}
        >
            {pkg.is_popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-cursor-pill bg-cursor-primary px-4 py-1.5 text-[11px] font-semibold tracking-[0.88px] text-white uppercase shadow-none">
                    {t('popular_badge') || 'Most Popular'}
                </div>
            )}

            <div className="mb-10">
                <h3 className={cn('mb-3 text-[26px] font-normal tracking-[-0.325px]', pkg.is_popular ? 'text-cursor-canvas' : 'text-cursor-ink')}>{pkg.name}</h3>
                <p className={cn('text-[14px] font-normal leading-relaxed', pkg.is_popular ? 'text-cursor-canvas/60' : 'text-cursor-body')}>{pkg.description}</p>
            </div>

            <div className="mb-10">
                <div className="flex items-baseline gap-1">
                    <span className={cn('text-[36px] font-normal tracking-[-0.72px]', pkg.is_popular ? 'text-cursor-canvas' : 'text-cursor-ink')}>{formattedPrice}</span>
                    <span className={cn('text-xs font-medium uppercase tracking-[0.88px]', pkg.is_popular ? 'text-cursor-canvas/40' : 'text-cursor-muted')}>/ project</span>
                </div>
            </div>

            <div className="mb-12 flex-1 space-y-5">
                {pkg.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-4">
                        <Check size={16} className={cn('mt-0.5 shrink-0', pkg.is_popular ? 'text-cursor-primary' : 'text-cursor-primary')} />
                        <span className={cn('text-[14px] font-normal', pkg.is_popular ? 'text-cursor-canvas/80' : 'text-cursor-body')}>{feature}</span>
                    </div>
                ))}
            </div>

            <Button
                onClick={() => onSelect(pkg)}
                className={cn(
                    'h-11 w-full rounded-cursor-md font-medium transition-all duration-300 border-none shadow-none',
                    pkg.is_popular ? 'bg-cursor-canvas text-cursor-ink hover:bg-cursor-canvas/90' : 'bg-cursor-primary text-white hover:bg-cursor-primary-active',
                )}
            >
                {tOrders('order_now')}
            </Button>

            <div className="mt-4 flex items-center justify-center gap-1.5 opacity-50">
                <ShieldCheck size={12} className={pkg.is_popular ? 'text-cursor-canvas' : 'text-cursor-muted'} />
                <span className={cn('text-[10px] font-medium uppercase tracking-[0.5px]', pkg.is_popular ? 'text-cursor-canvas' : 'text-cursor-muted')}>
                    {tOrders('payment_secure_title')}
                </span>
            </div>
        </div>
    );
}
