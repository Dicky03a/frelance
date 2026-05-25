import { usePage } from '@inertiajs/react';
import { SharedProps } from '../types/inertia';

export function formatCurrency(amount: number, currency: 'IDR' | 'USD', exchangeRate: number): string {
    if (currency === 'IDR') {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(amount);
    } else {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount / exchangeRate);
    }
}

export function useCurrency() {
    const { currency, exchange_rate } = usePage<SharedProps>().props;

    return {
        format: (amountIDR: number) => formatCurrency(amountIDR, currency, exchange_rate),
        currency,
        exchangeRate: exchange_rate,
    };
}
