import PublicLayout from '@/layouts/public-layout';
import { Head, router } from '@inertiajs/react';
import { ProjectCard } from '@/components/public/project-card';
import { Project } from '@/types/models';
import { PaginatedResponse } from '@/types/pagination';
import { cn } from '@/lib/utils';

import { useTranslation } from '@/lib/i18n';

interface ProjectsIndexProps {
    projects: PaginatedResponse<Project>;
    categories: string[];
    filters: {
        category?: string;
    };
}

export default function Index({ projects, categories, filters }: ProjectsIndexProps) {
    const { t } = useTranslation('projects');
    const { t: tCommon } = useTranslation('common');

    const handleCategoryFilter = (category: string) => {
        router.get(route('projects.index'), { category: category === filters.category ? null : category }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <PublicLayout>
            <Head title={`${t('title')} - Professional Works`} />

            <div className="px-12 py-16 space-y-16">
                <header className="max-w-3xl space-y-6">
                    <h1 className="text-[48px] md:text-[56px] font-normal text-cursor-ink leading-[1.1] tracking-[-1.5px]">{t('title')}</h1>
                    <p className="text-cursor-body text-[20px] leading-relaxed font-normal">
                        {t('subtitle')}
                    </p>
                </header>

                <div className="sticky top-16 z-20 bg-cursor-canvas/80 backdrop-blur-md py-6 -mx-4 px-4 border-y border-cursor-hairline flex gap-4 overflow-x-auto no-scrollbar">
                    <button
                        onClick={() => router.get(route('projects.index'))}
                        className={cn(
                            "px-6 py-2 rounded-cursor-md text-sm font-medium border transition-all whitespace-nowrap",
                            !filters.category 
                                ? "bg-cursor-ink border-cursor-ink text-white" 
                                : "bg-cursor-surface-card border-cursor-hairline text-cursor-muted hover:border-cursor-hairline-strong hover:text-cursor-ink"
                        )}
                    >
                        {t('all_projects')}
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => handleCategoryFilter(cat)}
                            className={cn(
                                "px-6 py-2 rounded-cursor-md text-sm font-medium border transition-all whitespace-nowrap",
                                filters.category === cat 
                                    ? "bg-cursor-ink border-cursor-ink text-white" 
                                    : "bg-cursor-surface-card border-cursor-hairline text-cursor-muted hover:border-cursor-hairline-strong hover:text-cursor-ink"
                            )}
                        >
                            {cat.replace('_', ' ')}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {projects.data.map(project => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>

                {projects.data.length === 0 && (
                    <div className="py-32 text-center rounded-cursor-lg border border-dashed border-cursor-hairline">
                        <h3 className="text-[22px] font-normal text-cursor-ink mb-3 tracking-[-0.11px]">{t('no_projects')}</h3>
                        <p className="text-cursor-muted italic font-normal">{t('no_projects_desc')}</p>
                    </div>
                )}

                {/* Pagination */}
                {projects.meta.last_page > 1 && (
                    <div className="flex justify-center gap-4 pt-16 border-t border-cursor-hairline">
                        {projects.links.prev && (
                            <button 
                                onClick={() => router.get(projects.links.prev!)}
                                className="px-8 py-3 rounded-cursor-md bg-cursor-surface-card border border-cursor-hairline text-cursor-muted font-medium hover:text-cursor-ink hover:bg-cursor-hairline-soft transition-all text-sm"
                            >
                                {tCommon('previous')}
                            </button>
                        )}
                        <div className="px-8 py-3 rounded-cursor-md bg-cursor-surface-strong text-cursor-ink font-medium text-sm">
                            {t('page_info', { current: String(projects.meta.current_page), last: String(projects.meta.last_page) })}
                        </div>
                        {projects.links.next && (
                            <button 
                                onClick={() => router.get(projects.links.next!)}
                                className="px-8 py-3 rounded-cursor-md bg-cursor-surface-card border border-cursor-hairline text-cursor-muted font-medium hover:text-cursor-ink hover:bg-cursor-hairline-soft transition-all text-sm"
                            >
                                {tCommon('next')}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
