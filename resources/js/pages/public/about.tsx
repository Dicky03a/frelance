import PublicLayout from '@/layouts/public-layout';
import { Head } from '@inertiajs/react';
import { User, Code, Rocket } from 'lucide-react';

import { useTranslation } from '@/lib/i18n';

export default function About() {
    const { t } = useTranslation('about');

    return (
        <PublicLayout>
            <Head title={`${t('title')} - DevPorto`} />
            <div className="px-6 py-10 max-w-4xl mx-auto space-y-16">
                <header className="space-y-6 text-center">
                    <div className="mx-auto w-32 h-32 rounded-[40px] bg-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-500/20">
                        <User size={64} className="text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">{t('hero_title')}</h1>
                    <p className="text-white/50 text-xl max-w-2xl mx-auto leading-relaxed">
                        {t('hero_subtitle')}
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-[32px] border border-white/5 bg-[#1c1c28] space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                            <Code size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white">{t('vision_title')}</h3>
                        <p className="text-white/40 text-sm leading-relaxed">
                            {t('vision_desc')}
                        </p>
                    </div>
                    <div className="p-8 rounded-[32px] border border-white/5 bg-[#1c1c28] space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                            <Rocket size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white">{t('dedication_title')}</h3>
                        <p className="text-white/40 text-sm leading-relaxed">
                            {t('dedication_desc')}
                        </p>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
