import PublicLayout from '@/layouts/public-layout';
import { Head } from '@inertiajs/react';
import { User } from 'lucide-react';

import { useTranslation } from '@/lib/i18n';

export default function About() {
    const { t } = useTranslation('about');

    return (
        <PublicLayout>
            <Head title={`${t('title')} - DevPorto`} />
            <div className="px-12 py-16 max-w-4xl mx-auto space-y-20">
                <header className="space-y-8 text-center">
                    <h1 className="text-[48px] md:text-[56px] font-normal text-cursor-ink leading-[1.1] tracking-[-1.5px]">{t('hero_title')}</h1>
                    <p className="text-cursor-body text-[20px] max-w-2xl mx-auto leading-relaxed font-normal">
                        {t('hero_subtitle')}
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="p-10 rounded-cursor-lg border border-cursor-hairline bg-cursor-surface-card space-y-6">
                        <h3 className="text-[22px] font-normal text-cursor-ink tracking-[-0.11px]">{t('vision_title')}</h3>
                        <p className="text-cursor-body text-[15px] leading-relaxed font-normal">
                            {t('vision_desc')}
                        </p>
                    </div>
                    <div className="p-10 rounded-cursor-lg border border-cursor-hairline bg-cursor-surface-card space-y-6">
                        <h3 className="text-[22px] font-normal text-cursor-ink tracking-[-0.11px]">{t('dedication_title')}</h3>
                        <p className="text-cursor-body text-[15px] leading-relaxed font-normal">
                            {t('dedication_desc')}
                        </p>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
