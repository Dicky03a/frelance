import PublicLayout from '@/layouts/public-layout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n';
import { toast } from 'sonner';

export default function Contact() {
    const { t } = useTranslation('contact');

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('contact.store'), {
            onSuccess: () => {
                toast.success('Pesan terkirim via WhatsApp!');
                reset();
            },
            onError: () => {
                toast.error('Gagal mengirim pesan.');
            },
        });
    };

    return (
        <PublicLayout>
            <Head title={`${t('title')} - DevPorto`} />
            <div className="px-12 py-16 space-y-16 max-w-6xl mx-auto">
                <header className="text-center space-y-6">
                    <h1 className="text-[48px] md:text-[56px] font-normal text-cursor-ink leading-[1.1] tracking-[-1.5px]">{t('title')}</h1>
                    <p className="text-cursor-body text-[20px] max-w-2xl mx-auto font-normal">
                        {t('subtitle')}
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-1 space-y-6">
                        <div className="p-10 rounded-cursor-lg border border-cursor-hairline bg-cursor-surface-card space-y-8">
                            <div className="space-y-2">
                                <div className="text-[11px] font-semibold text-cursor-muted uppercase tracking-[0.88px]">Email</div>
                                <div className="text-cursor-ink font-normal text-lg">hello@devporto.id</div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-[11px] font-semibold text-cursor-muted uppercase tracking-[0.88px]">WhatsApp</div>
                                <div className="text-cursor-ink font-normal text-lg">+62 851-8252-9291</div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="p-10 md:p-12 rounded-cursor-lg border border-cursor-hairline bg-cursor-surface-card">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-semibold text-cursor-muted uppercase tracking-[0.88px] ml-1">{t('name_label')}</label>
                                        <input
                                            className="w-full bg-cursor-canvas-soft border border-cursor-hairline rounded-cursor-md p-4 text-cursor-ink focus:outline-none focus:border-cursor-hairline-strong transition-colors"
                                            placeholder="John Doe"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                        />
                                        {errors.name && <div className="text-xs text-red-500 ml-1">{errors.name}</div>}
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-semibold text-cursor-muted uppercase tracking-[0.88px] ml-1">{t('email_label')}</label>
                                        <input
                                            type="email"
                                            className="w-full bg-cursor-canvas-soft border border-cursor-hairline rounded-cursor-md p-4 text-cursor-ink focus:outline-none focus:border-cursor-hairline-strong transition-colors"
                                            placeholder="john@example.com"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            required
                                        />
                                        {errors.email && <div className="text-xs text-red-500 ml-1">{errors.email}</div>}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[11px] font-semibold text-cursor-muted uppercase tracking-[0.88px] ml-1">{t('message_label')}</label>
                                    <textarea
                                        rows={6}
                                        className="w-full bg-cursor-canvas-soft border border-cursor-hairline rounded-cursor-md p-4 text-cursor-ink focus:outline-none focus:border-cursor-hairline-strong transition-colors"
                                        placeholder={t('message_placeholder')}
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        required
                                    />
                                    {errors.message && <div className="text-xs text-red-500 ml-1">{errors.message}</div>}
                                </div>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full h-12 rounded-cursor-md bg-cursor-primary hover:bg-cursor-primary-active text-white font-medium text-sm border-none shadow-none"
                                >
                                    {processing ? 'Sending...' : t('send_btn')}
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
