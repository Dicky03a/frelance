import PublicLayout from '@/layouts/public-layout';
import { Head, Link, router } from '@inertiajs/react';
import { StatCard } from '@/components/public/stat-card';
import { ProjectCard } from '@/components/public/project-card';
import { ServicePackageCard } from '@/components/public/service-package-card';
import { ForumPreviewItem } from '@/components/public/forum-preview-item';
import { SharedProps } from '@/types/inertia';
import { Project, ForumThread, ServicePackage, CalculatorConfig } from '@/types/models';
import { 
    Check, 
    ChevronRight, 
    MessageSquare, 
    Zap, 
    Calculator,
    ArrowRight,
    Star,
    Award,
    Users,
    Briefcase
} from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import axios from 'axios';

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
        return calculator_configs.find(c => c.project_type === calcType);
    }, [calcType, calculator_configs]);

    const filteredProjects = useMemo(() => {
        if (projectFilter === 'all') return featured_projects;
        return featured_projects.filter(p => p.category === projectFilter);
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
                        timeline_weeks: timelineWeeks
                    });
                    setEstimate(response.data);
                } catch (error) {
                    console.error("Failed to fetch estimate", error);
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

            <div className="px-12 py-16 space-y-cursor-section">
                {/* SECTION 1: HERO BENTO */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 relative rounded-cursor-lg border border-cursor-hairline bg-cursor-surface-card p-10 md:p-16 overflow-hidden">
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <Badge className="mb-8 bg-cursor-surface-strong text-cursor-ink border-none hover:bg-cursor-surface-strong/80 gap-2 px-3 py-1 rounded-cursor-pill uppercase text-[11px] font-semibold tracking-[0.88px]">
                                    {t('hero_badge')}
                                </Badge>
                                <h1 className="text-[48px] md:text-[72px] font-normal text-cursor-ink leading-[1.1] tracking-[-2.16px] max-w-2xl">
                                    {t('hero_title_1')} <br />
                                    <span className="text-cursor-primary">{t('hero_title_2')}</span> {t('hero_title_3')}
                                </h1>
                                <p className="mt-8 text-[18px] text-cursor-body max-w-lg leading-relaxed font-normal">
                                    {t('hero_description')}
                                </p>
                            </div>
                            
                            <div className="mt-12 flex flex-wrap gap-4">
                                <Button asChild className="h-[44px] px-6 rounded-cursor-md bg-cursor-primary hover:bg-cursor-primary-active text-white font-medium text-sm shadow-none border-none transition-all">
                                    <Link href="/services">{t('hire_me')}</Link>
                                </Button>
                                <Button variant="ghost" asChild className="h-[44px] px-6 rounded-cursor-md border border-cursor-hairline text-cursor-ink font-medium hover:bg-cursor-hairline-soft transition-all">
                                    <Link href="/projects">{t('view_projects')}</Link>
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="flex-1 rounded-cursor-lg border border-cursor-hairline bg-cursor-surface-card p-10 flex flex-col justify-center items-center text-center">
                            <div className="text-[48px] font-normal text-cursor-ink tracking-[-0.72px]">4.9</div>
                            <div className="flex gap-1 mt-2 text-cursor-primary">
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                            </div>
                            <p className="mt-4 text-[11px] font-semibold text-cursor-muted uppercase tracking-[0.88px]">{t('stats_sat')}</p>
                        </div>
                        <div className="flex-1 rounded-cursor-lg border border-cursor-hairline bg-cursor-ink p-10 flex flex-col justify-center items-center text-center group cursor-pointer transition-all hover:bg-cursor-ink/95">
                            <div className="text-[56px] font-normal text-cursor-canvas mb-1 leading-none tracking-[-1.5px]">
                                {stats.projects_count}+
                            </div>
                            <p className="text-cursor-canvas/60 font-semibold uppercase tracking-[0.88px] text-[11px]">{t('stats_projects')}</p>
                            <ArrowRight size={20} className="mt-6 text-cursor-canvas/40 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </section>

                {/* SECTION 2: STATS */}
                <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard value={stats.projects_count} label={t('stats_projects')} />
                    <StatCard value={stats.clients_count} label={t('stats_clients')} />
                    <StatCard value={stats.years_experience} label={t('stats_years')} suffix="+" />
                    <StatCard value={stats.satisfaction_rate} label={t('stats_sat')} suffix="%" />
                </section>

                {/* SECTION 3: PROJECTS */}
                <section id="projects" className="space-y-10">
                    <div className="flex items-end justify-between border-b border-cursor-hairline pb-8">
                        <div>
                            <h2 className="text-[36px] font-normal text-cursor-ink tracking-[-0.72px]">{t('featured_projects')}</h2>
                            <p className="text-cursor-body mt-3 font-normal">{t('featured_projects_subtitle')}</p>
                        </div>
                        <Link href="/projects" className="text-cursor-primary font-medium flex items-center gap-2 hover:opacity-80 transition-opacity text-sm">
                            {tCommon('view')} {tCommon('all')} <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                        {['all', 'web_app', 'landing_page', 'ecommerce'].map(filter => (
                            <button
                                key={filter}
                                onClick={() => setProjectFilter(filter)}
                                className={cn(
                                    "px-6 py-2 rounded-cursor-md text-sm font-medium border transition-all whitespace-nowrap",
                                    projectFilter === filter 
                                        ? "bg-cursor-ink border-cursor-ink text-white" 
                                        : "bg-cursor-surface-card border-cursor-hairline text-cursor-muted hover:border-cursor-hairline-strong hover:text-cursor-ink"
                                )}
                            >
                                {filter === 'all' ? tCommon('all') : filter.replace('_', ' ')}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProjects.map(project => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                </section>

                {/* SECTION 4: CALCULATOR */}
                <section id="calculator" className="relative py-cursor-section border-y border-cursor-hairline">
                    <div className="max-w-3xl mx-auto space-y-12">
                        <div className="text-center space-y-4">
                            <h2 className="text-[36px] font-normal text-cursor-ink tracking-[-0.72px]">{t('calc_title')}</h2>
                            <p className="text-cursor-body text-lg font-normal">{t('calc_subtitle')}</p>
                        </div>

                        <div className="bg-cursor-surface-card rounded-cursor-lg p-10 md:p-12 border border-cursor-hairline">
                            {calcStep === 1 && (
                                <div className="space-y-8">
                                    <h3 className="text-[22px] font-normal text-cursor-ink text-center tracking-[-0.11px]">{t('calc_step_1')}</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {calculator_configs.map(config => (
                                            <button
                                                key={config.project_type}
                                                onClick={() => handleTypeSelect(config.project_type)}
                                                className="p-6 rounded-cursor-md border border-cursor-hairline bg-cursor-canvas-soft text-left hover:border-cursor-hairline-strong transition-all group"
                                            >
                                                <span className="block font-medium text-cursor-ink">{config.label}</span>
                                                <span className="text-[11px] text-cursor-muted mt-2 uppercase tracking-[0.88px] font-semibold">{tCommon('view')}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {calcStep === 2 && calcConfig && (
                                <div className="space-y-8">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-[22px] font-normal text-cursor-ink tracking-[-0.11px]">{t('calc_step_2')}</h3>
                                        <button onClick={() => setCalcStep(1)} className="text-sm text-cursor-primary font-medium">{t('calc_change_type')}</button>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {calcConfig.features.map((f) => (
                                            <label key={f.key} className={cn(
                                                "flex items-center gap-4 p-4 rounded-cursor-md border transition-all cursor-pointer",
                                                selectedFeatures.includes(f.key) 
                                                    ? "bg-cursor-ink/5 border-cursor-ink text-cursor-ink" 
                                                    : "bg-cursor-canvas-soft border-cursor-hairline text-cursor-muted hover:border-cursor-hairline-strong"
                                            )}>
                                                <input 
                                                    type="checkbox" 
                                                    className="hidden"
                                                    checked={selectedFeatures.includes(f.key)}
                                                    onChange={() => {
                                                        const newFeatures = selectedFeatures.includes(f.key)
                                                            ? selectedFeatures.filter(k => k !== f.key)
                                                            : [...selectedFeatures, f.key];
                                                        setSelectedFeatures(newFeatures);
                                                    }}
                                                />
                                                <div className={cn(
                                                    "w-5 h-5 rounded-sm flex items-center justify-center border transition-colors",
                                                    selectedFeatures.includes(f.key) ? "bg-cursor-ink border-cursor-ink" : "border-cursor-hairline-strong"
                                                )}>
                                                    {selectedFeatures.includes(f.key) && <Check size={12} className="text-white" />}
                                                </div>
                                                <span className="text-sm font-medium">{f.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <Button onClick={() => setCalcStep(3)} className="w-full h-12 bg-cursor-ink hover:bg-cursor-ink/90 text-white rounded-cursor-md font-medium border-none shadow-none">
                                        {t('next')}: {t('timeline')}
                                    </Button>
                                </div>
                            )}

                            {calcStep === 3 && calcConfig && (
                                <div className="space-y-10 text-center">
                                    <h3 className="text-[22px] font-normal text-cursor-ink tracking-[-0.11px]">{t('calc_step_3')}</h3>
                                    <div className="flex flex-wrap justify-center gap-4">
                                        {calcConfig.timeline_multipliers.map((m) => (
                                            <button
                                                key={m.weeks}
                                                onClick={() => setTimelineWeeks(m.weeks)}
                                                className={cn(
                                                    "px-6 py-4 rounded-cursor-md border transition-all min-w-[140px]",
                                                    timelineWeeks === m.weeks 
                                                        ? "bg-cursor-ink border-cursor-ink text-white" 
                                                        : "bg-cursor-canvas-soft border-cursor-hairline text-cursor-muted hover:bg-cursor-hairline-soft"
                                                )}
                                            >
                                                <span className="block font-medium">{m.label}</span>
                                                <span className="text-[11px] font-semibold opacity-50 uppercase tracking-[0.88px]">{m.weeks} {t('weeks')}</span>
                                            </button>
                                        ))}
                                    </div>

                                    <div className="pt-10 border-t border-cursor-hairline relative min-h-[140px] flex flex-col justify-center">
                                        {calcLoading ? (
                                            <div className="flex items-center justify-center gap-3 text-cursor-muted">
                                                <span className="font-medium animate-pulse text-sm">Calculating estimate...</span>
                                            </div>
                                        ) : estimate ? (
                                            <>
                                                <p className="text-[11px] text-cursor-muted mb-3 font-semibold uppercase tracking-[0.88px]">{t('calc_est_title')}</p>
                                                <div className="text-[36px] md:text-[48px] font-normal text-cursor-ink tracking-[-0.72px]">
                                                    {estimate.formatted_min} – {estimate.formatted_max}
                                                </div>
                                            </>
                                        ) : (
                                            <p className="text-cursor-muted italic text-sm">Select a timeline to see estimate.</p>
                                        )}
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                                        <Button asChild className="flex-1 h-12 rounded-cursor-md bg-cursor-primary hover:bg-cursor-primary-active text-white font-medium border-none shadow-none">
                                            <Link href="/contact">{t('calc_cta_contact')}</Link>
                                        </Button>
                                        <Button onClick={() => setCalcStep(1)} variant="ghost" className="flex-1 h-12 rounded-cursor-md text-cursor-muted font-medium hover:text-cursor-ink hover:bg-cursor-hairline-soft">
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
                    <div className="text-center max-w-2xl mx-auto space-y-4">
                        <h2 className="text-[36px] font-normal text-cursor-ink tracking-[-0.72px]">{t('services_title')}</h2>
                        <p className="text-cursor-body text-lg font-normal">{t('services_subtitle')}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {service_packages.slice(0, 3).map(pkg => (
                            <ServicePackageCard key={pkg.id} pkg={pkg} onSelect={() => router.visit(route('services.index'))} />
                        ))}
                    </div>
                    
                    <div className="text-center">
                        <Button variant="ghost" asChild className="text-cursor-primary font-medium gap-2 hover:opacity-80 transition-opacity">
                            <Link href="/services" className="flex items-center gap-2">{t('view_all_services')} <ArrowRight size={18} /></Link>
                        </Button>
                    </div>
                </section>

                {/* SECTION 6: FORUM PREVIEW */}
                <section id="forum" className="max-w-4xl mx-auto">
                    <div className="rounded-cursor-lg border border-cursor-hairline bg-cursor-surface-card p-10 md:p-12 space-y-10">
                        <div className="flex items-center justify-between">
                            <h2 className="text-[26px] font-normal text-cursor-ink tracking-[-0.325px]">{tForum('title')}</h2>
                            <Link href="/forum" className="text-[11px] font-semibold text-cursor-muted uppercase tracking-[0.88px] hover:text-cursor-ink transition-colors">
                                {tForum('browse_forum')} →
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 divide-y divide-cursor-hairline">
                            {forum_preview.map(thread => (
                                <ForumPreviewItem key={thread.id} thread={thread} />
                            ))}
                        </div>

                        <div className="pt-8 text-center border-t border-cursor-hairline">
                            <p className="text-sm text-cursor-body mb-6 font-normal">{tForum('have_question')}</p>
                            <Button asChild variant="outline" className="h-10 rounded-cursor-md border-cursor-hairline bg-cursor-canvas-soft text-cursor-ink font-medium hover:bg-cursor-hairline-soft px-8">
                                <Link href="/forum/create">{tForum('new_thread')}</Link>
                            </Button>
                        </div>
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
}
