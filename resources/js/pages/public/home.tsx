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

            <div className="px-6 py-10 space-y-20">
                {/* SECTION 1: HERO BENTO */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 relative rounded-[32px] border border-white/10 bg-[#1c1c28] p-8 md:p-12 overflow-hidden group">
                        {/* Background Decoration */}
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-600/10 blur-[80px] rounded-full group-hover:bg-indigo-600/20 transition-colors duration-700" />
                        
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <Badge className="mb-6 bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20 gap-2 px-3 py-1 rounded-full">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    {t('hero_badge')}
                                </Badge>
                                <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight">
                                    {t('hero_title_1', { default: 'Building Digital' })} <br />
                                    <span className="text-indigo-400">{t('hero_title_2', { default: 'Experiences' })}</span> {t('hero_title_3', { default: 'That Matter.' })}
                                </h1>
                                <p className="mt-6 text-lg text-white/50 max-w-lg leading-relaxed">
                                    {t('hero_description')}
                                </p>
                            </div>
                            
                            <div className="mt-12 flex flex-wrap gap-4">
                                <Button asChild className="h-14 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg shadow-xl shadow-indigo-600/20">
                                    <Link href="/services">{t('hire_me')}</Link>
                                </Button>
                                <Button variant="ghost" asChild className="h-14 px-8 rounded-2xl border border-white/10 text-white font-bold hover:bg-white/5">
                                    <Link href="/projects">{t('view_projects')}</Link>
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex-1 rounded-[32px] border border-white/10 bg-[#1c1c28] p-8 flex flex-col justify-center items-center text-center">
                            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                                <Award size={32} />
                            </div>
                            <div className="text-4xl font-black text-white">4.9</div>
                            <div className="flex gap-1 mt-2 text-amber-400">
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                            </div>
                            <p className="mt-2 text-sm font-medium text-white/30 uppercase tracking-widest">{t('stats_sat')}</p>
                        </div>
                        <div className="flex-1 rounded-[32px] border border-white/10 bg-indigo-600 p-8 flex flex-col justify-center items-center text-center group cursor-pointer overflow-hidden relative">
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative z-10">
                                <div className="text-5xl font-black text-white mb-2 leading-none">
                                    {stats.projects_count}+
                                </div>
                                <p className="text-white/80 font-bold uppercase tracking-widest text-xs">{t('stats_projects')}</p>
                                <ArrowRight className="mt-4 mx-auto text-white/40 group-hover:translate-x-2 transition-transform" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 2: STATS */}
                <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard icon={Briefcase} value={stats.projects_count} label={t('stats_projects')} color="indigo" />
                    <StatCard icon={Users} value={stats.clients_count} label={t('stats_clients')} color="emerald" />
                    <StatCard icon={Award} value={stats.years_experience} label={t('stats_years')} suffix="+" color="violet" />
                    <StatCard icon={Zap} value={stats.satisfaction_rate} label={t('stats_sat')} suffix="%" color="amber" />
                </section>

                {/* SECTION 3: PROJECTS */}
                <section id="projects" className="space-y-8">
                    <div className="flex items-end justify-between px-2">
                        <div>
                            <h2 className="text-3xl font-black text-white">{t('featured_projects')}</h2>
                            <p className="text-white/40 mt-2">{t('featured_projects_subtitle', { default: 'Selection of my best works from various industries.' })}</p>
                        </div>
                        <Link href="/projects" className="text-indigo-400 font-bold flex items-center gap-2 hover:text-indigo-300 transition-colors">
                            {tCommon('view')} {tCommon('all')} <ChevronRight size={20} />
                        </Link>
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {['all', 'web_app', 'landing_page', 'ecommerce'].map(filter => (
                            <button
                                key={filter}
                                onClick={() => setProjectFilter(filter)}
                                className={cn(
                                    "px-6 py-2.5 rounded-full text-sm font-bold border transition-all whitespace-nowrap",
                                    projectFilter === filter 
                                        ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20" 
                                        : "bg-white/5 border-white/5 text-white/40 hover:border-white/10"
                                )}
                            >
                                {filter === 'all' ? tCommon('all').toUpperCase() : filter.replace('_', ' ').toUpperCase()}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProjects.map(project => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                        {filteredProjects.length === 0 && (
                            <div className="col-span-full py-20 text-center rounded-[32px] border border-dashed border-white/10">
                                <p className="text-white/20 italic">{t('no_projects', { default: 'No projects found in this category.' })}</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* SECTION 4: CALCULATOR */}
                <section id="calculator" className="relative">
                    <div className="rounded-[40px] border border-white/7 bg-[#1c1c28] overflow-hidden p-8 md:p-16">
                        <div className="max-w-3xl mx-auto space-y-12">
                            <div className="text-center space-y-4">
                                <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-2">
                                    <Calculator size={32} />
                                </div>
                                <h2 className="text-4xl font-black text-white tracking-tight">{t('calc_title')}</h2>
                                <p className="text-white/40 text-lg">{t('calc_subtitle', { default: 'Calculate an instant estimate for your next project.' })}</p>
                            </div>

                            {/* Wizard Steps */}
                            <div className="flex justify-center items-center gap-4">
                                {[1, 2, 3].map(step => (
                                    <div 
                                        key={step}
                                        className={cn(
                                            "w-12 h-1.5 rounded-full transition-colors",
                                            calcStep >= step ? "bg-indigo-500" : "bg-white/5"
                                        )}
                                    />
                                ))}
                            </div>

                            <div className="bg-white/5 rounded-[32px] p-8 md:p-10 border border-white/5">
                                {calcStep === 1 && (
                                    <div className="space-y-6">
                                        <h3 className="text-xl font-bold text-white text-center">{t('calc_step_1', { default: 'What are we building?' })}</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {calculator_configs.map(config => (
                                                <button
                                                    key={config.project_type}
                                                    onClick={() => handleTypeSelect(config.project_type)}
                                                    className="p-6 rounded-2xl border border-white/10 bg-white/5 text-left hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all group"
                                                >
                                                    <span className="block font-bold text-white group-hover:text-indigo-400">{config.label}</span>
                                                    <span className="text-xs text-white/30 mt-1 uppercase tracking-widest font-medium">{tCommon('view')}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {calcStep === 2 && calcConfig && (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-xl font-bold text-white">{t('calc_step_2', { default: 'Select Features' })}</h3>
                                            <button onClick={() => setCalcStep(1)} className="text-sm text-indigo-400 font-bold">{t('calc_change_type', { default: 'Change Type' })}</button>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {calcConfig.features.map((f) => (
                                                <label key={f.key} className={cn(
                                                    "flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer",
                                                    selectedFeatures.includes(f.key) 
                                                        ? "bg-indigo-500/10 border-indigo-500/30 text-white" 
                                                        : "bg-white/5 border-white/5 text-white/40 hover:border-white/10"
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
                                                        "w-5 h-5 rounded flex items-center justify-center border transition-colors",
                                                        selectedFeatures.includes(f.key) ? "bg-indigo-500 border-indigo-500" : "border-white/20"
                                                    )}>
                                                        {selectedFeatures.includes(f.key) && <Check size={12} />}
                                                    </div>
                                                    <span className="text-sm font-medium">{f.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                        <Button onClick={() => setCalcStep(3)} className="w-full h-12 bg-indigo-600 rounded-xl font-bold">
                                            {t('next', { default: 'Next' })}: {t('timeline', { default: 'Timeline' })}
                                        </Button>
                                    </div>
                                )}

                                {calcStep === 3 && calcConfig && (
                                    <div className="space-y-8 text-center">
                                        <h3 className="text-xl font-bold text-white">{t('calc_step_3', { default: 'Project Timeline' })}</h3>
                                        <div className="flex flex-wrap justify-center gap-4">
                                            {calcConfig.timeline_multipliers.map((m) => (
                                                <button
                                                    key={m.weeks}
                                                    onClick={() => setTimelineWeeks(m.weeks)}
                                                    className={cn(
                                                        "px-6 py-4 rounded-2xl border transition-all min-w-[120px]",
                                                        timelineWeeks === m.weeks 
                                                            ? "bg-indigo-600 border-indigo-500 text-white" 
                                                            : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10"
                                                    )}
                                                >
                                                    <span className="block font-bold">{m.label}</span>
                                                    <span className="text-[10px] opacity-50 uppercase tracking-widest">{m.weeks} {t('weeks', { default: 'Weeks' })}</span>
                                                </button>
                                            ))}
                                        </div>

                                        <div className="pt-8 border-t border-white/10 relative min-h-[140px] flex flex-col justify-center">
                                            {calcLoading ? (
                                                <div className="flex items-center justify-center gap-3 text-indigo-400">
                                                    <Zap className="animate-pulse" />
                                                    <span className="font-bold animate-pulse">Calculating estimate...</span>
                                                </div>
                                            ) : estimate ? (
                                                <>
                                                    <p className="text-sm text-white/30 mb-2 font-bold uppercase tracking-widest">{t('calc_est_title', { default: 'Estimated Investment' })}</p>
                                                    <div className="text-4xl md:text-5xl font-black text-indigo-400">
                                                        {estimate.formatted_min} – {estimate.formatted_max}
                                                    </div>
                                                </>
                                            ) : (
                                                <p className="text-white/20 italic">Select a timeline to see estimate.</p>
                                            )}
                                            
                                            <p className="text-xs text-white/20 mt-4 max-w-sm mx-auto">
                                                {t('calc_disclaimer', { default: '*This is a rough estimate based on your selections. Final pricing may vary after detailed discussion.' })}
                                            </p>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                            <Button asChild className="flex-1 h-14 rounded-2xl bg-white text-indigo-600 font-black text-lg hover:bg-white/90">
                                                <Link href="/contact">{t('calc_cta_contact')}</Link>
                                            </Button>
                                            <Button onClick={() => setCalcStep(1)} variant="ghost" className="flex-1 h-14 rounded-2xl text-white/50 font-bold hover:text-white">
                                                {t('restart', { default: 'Restart' })}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 5: SERVICES */}
                <section id="services" className="space-y-12">
                    <div className="text-center max-w-2xl mx-auto space-y-4">
                        <h2 className="text-4xl font-black text-white tracking-tight">{t('services_title')}</h2>
                        <p className="text-white/40 text-lg">{t('services_subtitle')}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
                        {service_packages.slice(0, 3).map(pkg => (
                            <ServicePackageCard key={pkg.id} pkg={pkg} onSelect={() => router.visit(route('services.index'))} />
                        ))}
                    </div>
                    
                    <div className="text-center">
                        <Button variant="ghost" asChild className="text-indigo-400 font-bold gap-2 hover:text-indigo-300">
                            <Link href="/services">{t('view_all_services', { default: 'View All Services & Add-ons' })} <ArrowRight size={18} /></Link>
                        </Button>
                    </div>
                </section>

                {/* SECTION 6: FORUM PREVIEW */}
                <section id="forum" className="max-w-4xl mx-auto">
                    <div className="rounded-[32px] border border-white/7 bg-[#1c1c28] p-8 md:p-12 space-y-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                    <MessageSquare size={24} />
                                </div>
                                <h2 className="text-2xl font-bold text-white tracking-tight">{tForum('title')}</h2>
                            </div>
                            <Link href="/forum" className="text-xs font-black text-white/30 uppercase tracking-widest hover:text-white transition-colors">
                                {tForum('browse_forum', { default: 'Browse Forum' })} →
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {forum_preview.map(thread => (
                                <ForumPreviewItem key={thread.id} thread={thread} />
                            ))}
                            {forum_preview.length === 0 && (
                                <div className="py-10 text-center">
                                    <p className="text-white/20 italic">{tForum('no_threads')}</p>
                                </div>
                            )}
                        </div>

                        <div className="pt-6 text-center border-t border-white/5">
                            <p className="text-sm text-white/30 mb-4">{tForum('have_question', { default: 'Have a question or need technical advice?' })}</p>
                            <Button asChild variant="outline" className="rounded-xl border-indigo-500/20 bg-indigo-500/5 text-indigo-400 font-bold hover:bg-indigo-500/10">
                                <Link href="/forum/create">{tForum('new_thread')}</Link>
                            </Button>
                        </div>
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
}
