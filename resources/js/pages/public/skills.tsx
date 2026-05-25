import PublicLayout from '@/layouts/public-layout';
import { Head } from '@inertiajs/react';
import { Skill } from '@/types/models';

import { useTranslation } from '@/lib/i18n';

export default function Skills({ skills_by_category }: { skills_by_category: Record<string, Skill[]> }) {
    const { t } = useTranslation('skills');

    return (
        <PublicLayout>
            <Head title={`${t('title')} - DevPorto`} />
            <div className="px-12 py-16 space-y-16">
                <header className="max-w-3xl space-y-6">
                    <h1 className="text-[48px] md:text-[56px] font-normal text-cursor-ink leading-[1.1] tracking-[-1.5px]">Tech Stack</h1>
                    <p className="text-cursor-body text-[20px] leading-relaxed font-normal">{t('subtitle')}</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    {Object.entries(skills_by_category).map(([category, skills]) => (
                        <div key={category} className="space-y-8">
                            <h3 className="text-[11px] font-semibold text-cursor-muted uppercase tracking-[0.88px] pl-4 border-l border-cursor-primary">
                                {category}
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                                {skills.map(skill => (
                                    <div key={skill.id} className="p-6 rounded-cursor-md border border-cursor-hairline bg-cursor-surface-card flex items-center justify-between group hover:border-cursor-hairline-strong transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-cursor-md bg-cursor-canvas-soft flex items-center justify-center text-cursor-muted group-hover:text-cursor-ink transition-colors border border-cursor-hairline">
                                                <span className="font-semibold text-xs">{skill.name[0]}</span>
                                            </div>
                                            <span className="font-medium text-cursor-ink">{skill.name}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-[11px] font-semibold text-cursor-muted uppercase tracking-[0.88px]">{skill.level}%</div>
                                            <div className="w-24 h-1 bg-cursor-canvas-soft rounded-cursor-pill overflow-hidden border border-cursor-hairline/50">
                                                <div className="h-full bg-cursor-ink rounded-cursor-pill" style={{ width: `${skill.level}%` }} />
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
