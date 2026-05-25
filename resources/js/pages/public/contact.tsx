import PublicLayout from '@/layouts/public-layout';
import { Head } from '@inertiajs/react';
import { Mail, MessageCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { useTranslation } from '@/lib/i18n';

export default function Contact() {
    const { t } = useTranslation('contact');

    return (
        <PublicLayout>
            <Head title={`${t('title')} - DevPorto`} />
            <div className="px-6 py-10 space-y-12 max-w-6xl mx-auto">
                <header className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">{t('title')}</h1>
                    <p className="text-white/40 text-lg max-w-2xl mx-auto">
                        {t('subtitle')}
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-4">
                        <div className="p-8 rounded-[32px] border border-white/5 bg-[#1c1c28] space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-white/20 uppercase tracking-widest mb-1">Email</div>
                                    <div className="text-white font-medium">hello@devporto.id</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
                                    <MessageCircle size={24} />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-white/20 uppercase tracking-widest mb-1">WhatsApp</div>
                                    <div className="text-white font-medium">+62 812-3456-7890</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="p-8 md:p-10 rounded-[40px] border border-white/5 bg-[#1c1c28]">
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-white/30 uppercase tracking-widest ml-2">{t('name_label')}</label>
                                        <input className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-indigo-500/50" placeholder="John Doe" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-white/30 uppercase tracking-widest ml-2">{t('email_label')}</label>
                                        <input className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-indigo-500/50" placeholder="john@example.com" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/30 uppercase tracking-widest ml-2">{t('message_label')}</label>
                                    <textarea rows={6} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-indigo-500/50" placeholder={t('message_placeholder')} />
                                </div>
                                <Button className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg">
                                    {t('send_btn')} <Send size={20} className="ml-2" />
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
