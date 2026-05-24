import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { toast, Toaster } from 'sonner';
import { SharedProps } from '@/types/inertia';

export function FlashMessages() {
    const { flash } = usePage<SharedProps>().props;

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
        if (flash.error) {
            toast.error(flash.error);
        }
        if (flash.warning) {
            toast.warning(flash.warning);
        }
    }, [flash]);

    return <Toaster theme="dark" position="top-right" closeButton />;
}
