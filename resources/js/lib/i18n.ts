import { usePage } from '@inertiajs/react';
import { SharedProps } from '../types/inertia';

export function useTranslation(namespace: string) {
    const { translations } = usePage<SharedProps>().props;

    return {
        t: (key: string, params?: Record<string, string>): string => {
            let str = translations[namespace]?.[key] ?? key;
            if (params) {
                Object.entries(params).forEach(([k, v]) => {
                    str = str.replace(`:${k}`, v);
                });
            }
            return str;
        },
    };
}
