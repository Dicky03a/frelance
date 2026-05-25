import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ServicePackage } from '@/types/models';
import { Check } from 'lucide-react';
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
                'relative flex flex-col rounded-[32px] border p-8 transition-all duration-500',
                pkg.is_popular
                    ? 'z-10 scale-[1.02] border-indigo-500 bg-indigo-600 shadow-2xl shadow-indigo-500/20'
                    : 'border-white/7 bg-[#1c1c28] hover:border-white/20',
            )}
        >
            {pkg.is_popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-white px-4 py-1.5 text-[10px] font-bold tracking-widest text-indigo-600 uppercase shadow-lg">
                    {t('popular_badge') || 'Most Popular'}
                </div>
            )}

            <div className="mb-8">
                <h3 className={cn('mb-2 text-xl font-bold', pkg.is_popular ? 'text-white' : 'text-white')}>{pkg.name}</h3>
                <p className={cn('text-sm', pkg.is_popular ? 'text-indigo-100' : 'text-white/50')}>{pkg.description}</p>
            </div>

            <div className="mb-8">
                <div className="flex items-baseline gap-1">
                    <span className={cn('text-4xl font-black', pkg.is_popular ? 'text-white' : 'text-white')}>{formattedPrice}</span>
                    <span className={cn('text-sm font-medium', pkg.is_popular ? 'text-indigo-200' : 'text-white/30')}>/ project</span>
                </div>
            </div>

            <div className="mb-10 flex-1 space-y-4">
                {pkg.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                        <div
                            className={cn(
                                'mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full',
                                pkg.is_popular ? 'bg-white/20 text-white' : 'bg-indigo-500/10 text-indigo-400',
                            )}
                        >
                            <Check size={12} strokeWidth={3} />
                        </div>
                        <span className={cn('text-sm', pkg.is_popular ? 'text-indigo-50' : 'text-white/70')}>{feature}</span>
                    </div>
                ))}
            </div>

            <Button
                onClick={() => onSelect(pkg)}
                className={cn(
                    'h-12 w-full rounded-2xl font-bold transition-all duration-300',
                    pkg.is_popular ? 'bg-white text-indigo-600 hover:bg-indigo-50' : 'border border-white/10 bg-white/5 text-white hover:bg-white/10',
                )}
            >
                {tOrders('order_now')}
            </Button>
        </div>
    );
}
