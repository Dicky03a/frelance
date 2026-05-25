import PublicLayout from '@/layouts/public-layout';
import { Head } from '@inertiajs/react';
import { Skill } from '@/types/models';

import { useTranslation } from '@/lib/i18n';

export default function Skills({ skills_by_category }: { skills_by_category: Record<string, Skill[]> }) {
    const { t } = useTranslation('skills');

    return (
        <PublicLayout>
            <Head title={`${t('title')} - DevPorto`} />
            <div className="px-6 py-10 space-y-12">
                <header className="max-w-3xl space-y-4">
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Tech Stack</h1>
                    <p className="text-white/40 text-lg">{t('subtitle')}</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {Object.entries(skills_by_category).map(([category, skills]) => (
                        <div key={category} className="space-y-6">
                            <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.3em] pl-2 border-l-2 border-indigo-600">
                                {category}
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                                {skills.map(skill => (
                                    <div key={skill.id} className="p-5 rounded-[24px] border border-white/5 bg-[#1c1c28] flex items-center justify-between group hover:border-indigo-500/30 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-white/30 group-hover:text-indigo-400 transition-colors">
                                                <span className="font-bold text-xs">{skill.name[0]}</span>
                                            </div>
                                            <span className="font-bold text-white">{skill.name}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{skill.level}%</div>
                                            <div className="w-20 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${skill.level}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </PublicLayout>
    );
}
