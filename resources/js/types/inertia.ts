import { PageProps } from '@inertiajs/core';
import { User } from './models';

export interface SharedProps extends PageProps {
    auth: {
        user: User | null;
    };
    locale: 'id' | 'en';
    currency: 'IDR' | 'USD';
    exchange_rate: number;
    flash: {
        success?: string;
        error?: string;
        warning?: string;
    };
}
