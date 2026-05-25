import PublicLayout from '@/layouts/public-layout';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

import { useTranslation } from '@/lib/i18n';

export default function Contact() {
    const { t } = useTranslation('contact');

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
                                <div className="text-cursor-ink font-normal text-lg">+62 812-3456-7890</div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="p-10 md:p-12 rounded-cursor-lg border border-cursor-hairline bg-cursor-surface-card">
                            <form className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-semibold text-cursor-muted uppercase tracking-[0.88px] ml-1">{t('name_label')}</label>
                                        <input className="w-full bg-cursor-canvas-soft border border-cursor-hairline rounded-cursor-md p-4 text-cursor-ink focus:outline-none focus:border-cursor-hairline-strong transition-colors" placeholder="John Doe" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-semibold text-cursor-muted uppercase tracking-[0.88px] ml-1">{t('email_label')}</label>
                                        <input className="w-full bg-cursor-canvas-soft border border-cursor-hairline rounded-cursor-md p-4 text-cursor-ink focus:outline-none focus:border-cursor-hairline-strong transition-colors" placeholder="john@example.com" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[11px] font-semibold text-cursor-muted uppercase tracking-[0.88px] ml-1">{t('message_label')}</label>
                                    <textarea rows={6} className="w-full bg-cursor-canvas-soft border border-cursor-hairline rounded-cursor-md p-4 text-cursor-ink focus:outline-none focus:border-cursor-hairline-strong transition-colors" placeholder={t('message_placeholder')} />
                                </div>
                                <Button className="w-full h-12 rounded-cursor-md bg-cursor-primary hover:bg-cursor-primary-active text-white font-medium text-sm border-none shadow-none">
                                    {t('send_btn')}
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
