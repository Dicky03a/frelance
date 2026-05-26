import { ForumPreviewItem } from '@/components/public/forum-preview-item';
import { ProjectCard } from '@/components/public/project-card';
import { ServicePackageCard } from '@/components/public/service-package-card';
import { StatCard } from '@/components/public/stat-card';
import { Button } from '@/components/ui/button';
import PublicLayout from '@/layouts/public-layout';
import { SharedProps } from '@/types/inertia';
import { CalculatorConfig, ForumThread, Project, ServicePackage } from '@/types/models';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import { ArrowRight, Check } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { useTranslation } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface HomeProps extends SharedProps {
    stats: {
        projects_count: number;
        clients_count: number;
        years_experience: number;
        satisfaction_rate: number;
    };
    featured_projects: Project[];
    service_packages: ServicePackage[];
    forum_preview: ForumThread[];
    calculator_configs: CalculatorConfig[];
}

interface CalculationEstimate {
    project_type: string;
    base_price: number;
    features_total: number;
    multiplier: number;
    timeline_label: string;
    min: number;
    max: number;
    currency: string;
    formatted_min: string;
    formatted_max: string;
}

export default function Home({ stats, featured_projects, service_packages, forum_preview, calculator_configs }: HomeProps) {
    const { t } = useTranslation('home');
    const { t: tCommon } = useTranslation('common');
    const { t: tForum } = useTranslation('forum');

    const [projectFilter, setProjectFilter] = useState('all');

    // Calculator State
    const [calcStep, setCalcStep] = useState(1);
    const [calcType, setCalcType] = useState('');
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
    const [timelineWeeks, setTimelineWeeks] = useState(0);
    const [estimate, setEstimate] = useState<CalculationEstimate | null>(null);
    const [calcLoading, setCalcLoading] = useState(false);

    const calcConfig = useMemo(() => {
        return calculator_configs.find((c) => c.project_type === calcType);
    }, [calcType, calculator_configs]);

    const filteredProjects = useMemo(() => {
        if (projectFilter === 'all') return featured_projects;
        return featured_projects.filter((p) => p.category === projectFilter);
    }, [projectFilter, featured_projects]);

    // Handle Calculator logic
    const handleTypeSelect = (type: string) => {
        setCalcType(type);
        setCalcStep(2);
        setSelectedFeatures([]);
        setTimelineWeeks(0);
        setEstimate(null);
    };

    // Effect for fetching estimate
    useEffect(() => {
        if (calcStep === 3 && timelineWeeks > 0) {
            const fetchEstimate = async () => {
                setCalcLoading(true);
                try {
                    const response = await axios.post('/calculator/estimate', {
                        project_type: calcType,
                        selected_features: selectedFeatures,
                        timeline_weeks: timelineWeeks,
                    });
                    setEstimate(response.data);
                } catch (error) {
                    console.error('Failed to fetch estimate', error);
                    setEstimate(null);
                } finally {
                    setCalcLoading(false);
                }
            };

            const timer = setTimeout(fetchEstimate, 300);
            return () => clearTimeout(timer);
        }
    }, [calcStep, calcType, selectedFeatures, timelineWeeks]);

    return (
        <PublicLayout>
            <Head title="Freelance Portfolio & Services" />

            <div className="space-y-cursor-section px-12 py-16">
                {/* SECTION 1: HERO BENTO */}

                <div className="rounded-cursor-lg border-cursor-hairline bg-cursor-surface-card relative overflow-hidden border px-6 py-10 sm:px-8 sm:py-12 md:px-12 md:py-16 lg:px-16">
                    <div className="relative z-10 flex h-full flex-col justify-between">
                        <div>
                            <h1 className="text-cursor-ink max-w-2xl text-4xl leading-tight font-normal tracking-tight sm:text-5xl md:text-6xl lg:text-[72px] lg:tracking-[-2.16px]">
                                {t('hero_title_1')} <span className="text-cursor-primary">{t('hero_title_2')}</span> {t('hero_title_3')}
                            </h1>

                            <p className="text-cursor-body mt-6 max-w-lg text-base leading-relaxed font-normal sm:text-lg">{t('hero_description')}</p>
                        </div>

                        <div className="mt-10 flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
                            <Button
                                asChild
                                className="rounded-cursor-md bg-cursor-primary hover:bg-cursor-primary-active h-[44px] w-full border-none px-6 text-sm font-medium text-white shadow-none transition-all sm:w-auto"
                            >
                                <Link href="/services">{t('hire_me')}</Link>
                            </Button>

                            <Button
                                variant="ghost"
                                asChild
                                className="rounded-cursor-md border-cursor-hairline text-cursor-ink hover:bg-cursor-hairline-soft h-[44px] w-full border px-6 font-medium transition-all sm:w-auto"
                            >
                                <Link href="/projects">{t('view_projects')}</Link>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* SECTION 2: STATS */}
                <section className="grid grid-cols-2 gap-6 lg:grid-cols-4">
                    <StatCard value={stats.projects_count} label={t('stats_projects')} />
                    <StatCard value={stats.clients_count} label={t('stats_clients')} />
                    <StatCard value={stats.years_experience} label={t('stats_years')} suffix="+" />
                    <StatCard value={stats.satisfaction_rate} label={t('stats_sat')} suffix="%" />
                </section>

                {/* SECTION 3: PROJECTS */}
                <section id="projects" className="space-y-10">
                    <div className="border-cursor-hairline flex items-end justify-between border-b pb-8">
                        <div>
                            <h2 className="text-cursor-ink text-[36px] font-normal tracking-[-0.72px]">{t('featured_projects')}</h2>
                            <p className="text-cursor-body mt-3 font-normal">{t('featured_projects_subtitle')}</p>
                        </div>
                        <Link
                            href="/projects"
                            className="text-cursor-primary flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-80"
                        >
                            {tCommon('view')} {tCommon('all')} <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="no-scrollbar flex gap-4 overflow-x-auto pb-4">
                        {['all', 'web_app', 'landing_page', 'ecommerce'].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setProjectFilter(filter)}
                                className={cn(
                                    'rounded-cursor-md border px-6 py-2 text-sm font-medium whitespace-nowrap transition-all',
                                    projectFilter === filter
                                        ? 'bg-cursor-ink border-cursor-ink text-white'
                                        : 'bg-cursor-surface-card border-cursor-hairline text-cursor-muted hover:border-cursor-hairline-strong hover:text-cursor-ink',
                                )}
                            >
                                {filter === 'all' ? tCommon('all') : filter.replace('_', ' ')}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {filteredProjects.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                </section>

                {/* SECTION 4: CALCULATOR */}
                <section id="calculator" className="py-cursor-section border-cursor-hairline relative border-y">
                    <div className="mx-auto max-w-3xl space-y-12">
                        <div className="space-y-4 text-center">
                            <h2 className="text-cursor-ink text-[36px] font-normal tracking-[-0.72px]">{t('calc_title')}</h2>
                            <p className="text-cursor-body text-lg font-normal">{t('calc_subtitle')}</p>
                        </div>

                        <div className="bg-cursor-surface-card rounded-cursor-lg border-cursor-hairline border p-10 md:p-12">
                            {calcStep === 1 && (
                                <div className="space-y-8">
                                    <h3 className="text-cursor-ink text-center text-[22px] font-normal tracking-[-0.11px]">{t('calc_step_1')}</h3>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        {calculator_configs.map((config) => (
                                            <button
                                                key={config.project_type}
                                                onClick={() => handleTypeSelect(config.project_type)}
                                                className="rounded-cursor-md border-cursor-hairline bg-cursor-canvas-soft hover:border-cursor-hairline-strong group border p-6 text-left transition-all"
                                            >
                                                <span className="text-cursor-ink block font-medium">{config.label}</span>
                                                <span className="text-cursor-muted mt-2 text-[11px] font-semibold tracking-[0.88px] uppercase">
                                                    {tCommon('view')}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {calcStep === 2 && calcConfig && (
                                <div className="space-y-8">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-cursor-ink text-[22px] font-normal tracking-[-0.11px]">{t('calc_step_2')}</h3>
                                        <button onClick={() => setCalcStep(1)} className="text-cursor-primary text-sm font-medium">
                                            {t('calc_change_type')}
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        {calcConfig.features.map((f) => (
                                            <label
                                                key={f.key}
                                                className={cn(
                                                    'rounded-cursor-md flex cursor-pointer items-center gap-4 border p-4 transition-all',
                                                    selectedFeatures.includes(f.key)
                                                        ? 'bg-cursor-ink/5 border-cursor-ink text-cursor-ink'
                                                        : 'bg-cursor-canvas-soft border-cursor-hairline text-cursor-muted hover:border-cursor-hairline-strong',
                                                )}
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={selectedFeatures.includes(f.key)}
                                                    onChange={() => {
                                                        const newFeatures = selectedFeatures.includes(f.key)
                                                            ? selectedFeatures.filter((k) => k !== f.key)
                                                            : [...selectedFeatures, f.key];
                                                        setSelectedFeatures(newFeatures);
                                                    }}
                                                />
                                                <div
                                                    className={cn(
                                                        'flex h-5 w-5 items-center justify-center rounded-sm border transition-colors',
                                                        selectedFeatures.includes(f.key)
                                                            ? 'bg-cursor-ink border-cursor-ink'
                                                            : 'border-cursor-hairline-strong',
                                                    )}
                                                >
                                                    {selectedFeatures.includes(f.key) && <Check size={12} className="text-white" />}
                                                </div>
                                                <span className="text-sm font-medium">{f.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <Button
                                        onClick={() => setCalcStep(3)}
                                        className="bg-cursor-ink hover:bg-cursor-ink/90 rounded-cursor-md h-12 w-full border-none font-medium text-white shadow-none"
                                    >
                                        {t('next')}: {t('timeline')}
                                    </Button>
                                </div>
                            )}

                            {calcStep === 3 && calcConfig && (
                                <div className="space-y-10 text-center">
                                    <h3 className="text-cursor-ink text-[22px] font-normal tracking-[-0.11px]">{t('calc_step_3')}</h3>
                                    <div className="flex flex-wrap justify-center gap-4">
                                        {calcConfig.timeline_multipliers.map((m) => (
                                            <button
                                                key={m.weeks}
                                                onClick={() => setTimelineWeeks(m.weeks)}
                                                className={cn(
                                                    'rounded-cursor-md min-w-[140px] border px-6 py-4 transition-all',
                                                    timelineWeeks === m.weeks
                                                        ? 'bg-cursor-ink border-cursor-ink text-white'
                                                        : 'bg-cursor-canvas-soft border-cursor-hairline text-cursor-muted hover:bg-cursor-hairline-soft',
                                                )}
                                            >
                                                <span className="block font-medium">{m.label}</span>
                                                <span className="text-[11px] font-semibold tracking-[0.88px] uppercase opacity-50">
                                                    {m.weeks} {t('weeks')}
                                                </span>
                                            </button>
                                        ))}
                                    </div>

                                    <div className="border-cursor-hairline relative flex min-h-[140px] flex-col justify-center border-t pt-10">
                                        {calcLoading ? (
                                            <div className="text-cursor-muted flex items-center justify-center gap-3">
                                                <span className="animate-pulse text-sm font-medium">Calculating estimate...</span>
                                            </div>
                                        ) : estimate ? (
                                            <>
                                                <p className="text-cursor-muted mb-3 text-[11px] font-semibold tracking-[0.88px] uppercase">
                                                    {t('calc_est_title')}
                                                </p>
                                                <div className="text-cursor-ink text-[36px] font-normal tracking-[-0.72px] md:text-[48px]">
                                                    {estimate.formatted_min} – {estimate.formatted_max}
                                                </div>
                                            </>
                                        ) : (
                                            <p className="text-cursor-muted text-sm italic">Select a timeline to see estimate.</p>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-4 pt-6 sm:flex-row">
                                        <Button
                                            asChild
                                            className="rounded-cursor-md bg-cursor-primary hover:bg-cursor-primary-active h-12 flex-1 border-none font-medium text-white shadow-none"
                                        >
                                            <Link href="/contact">{t('calc_cta_contact')}</Link>
                                        </Button>
                                        <Button
                                            onClick={() => setCalcStep(1)}
                                            variant="ghost"
                                            className="rounded-cursor-md text-cursor-muted hover:text-cursor-ink hover:bg-cursor-hairline-soft h-12 flex-1 font-medium"
                                        >
                                            {t('restart')}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* SECTION 5: SERVICES */}
                <section id="services" className="space-y-12">
                    <div className="mx-auto max-w-2xl space-y-4 text-center">
                        <h2 className="text-cursor-ink text-[36px] font-normal tracking-[-0.72px]">{t('services_title')}</h2>
                        <p className="text-cursor-body text-lg font-normal">{t('services_subtitle')}</p>
                    </div>

                    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
                        {service_packages.slice(0, 3).map((pkg) => (
                            <ServicePackageCard key={pkg.id} pkg={pkg} onSelect={() => router.visit(route('services.index'))} />
                        ))}
                    </div>

                    <div className="text-center">
                        <Button variant="ghost" asChild className="text-cursor-primary gap-2 font-medium transition-opacity hover:opacity-80">
                            <Link href="/services" className="flex items-center gap-2">
                                {t('view_all_services')} <ArrowRight size={18} />
                            </Link>
                        </Button>
                    </div>
                </section>

                {/* SECTION 6: FORUM PREVIEW */}
                <section id="forum" className="mx-auto max-w-4xl">
                    <div className="rounded-cursor-lg border-cursor-hairline bg-cursor-surface-card space-y-10 border p-10 md:p-12">
                        <div className="flex items-center justify-between">
                            <h2 className="text-cursor-ink text-[26px] font-normal tracking-[-0.325px]">{tForum('title')}</h2>
                            <Link
                                href="/forum"
                                className="text-cursor-muted hover:text-cursor-ink text-[11px] font-semibold tracking-[0.88px] uppercase transition-colors"
                            >
                                {tForum('browse_forum')} →
                            </Link>
                        </div>

                        <div className="divide-cursor-hairline grid grid-cols-1 divide-y">
                            {forum_preview.map((thread) => (
                                <ForumPreviewItem key={thread.id} thread={thread} />
                            ))}
                        </div>

                        <div className="border-cursor-hairline border-t pt-8 text-center">
                            <p className="text-cursor-body mb-6 text-sm font-normal">{tForum('have_question')}</p>
                            <Button
                                asChild
                                variant="outline"
                                className="rounded-cursor-md border-cursor-hairline bg-cursor-canvas-soft text-cursor-ink hover:bg-cursor-hairline-soft h-10 px-8 font-medium"
                            >
                                <Link href="/forum/create">{tForum('new_thread')}</Link>
                            </Button>
                        </div>
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
}
