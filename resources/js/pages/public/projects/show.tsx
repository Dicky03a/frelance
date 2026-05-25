import PublicLayout from '@/layouts/public-layout';
import { Head, Link } from '@inertiajs/react';
import { Project } from '@/types/models';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
    Clock, 
    ExternalLink, 
    Github, 
    ArrowLeft,
    CheckCircle2,
    Star,
    ShoppingCart
} from 'lucide-react';

import { useState, useMemo } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { SharedProps } from '@/types/inertia';
import { cn } from '@/lib/utils';

import { useTranslation } from '@/lib/i18n';
import { useCurrency } from '@/lib/currency';

export default function Show({ project }: { project: Project }) {
    const { auth } = usePage<SharedProps>().props;
    const { t } = useTranslation('projects');
    const { format } = useCurrency();
    
    const ratingsData = useMemo(() => {
        const items = project.ratings?.filter(r => r.is_visible) || [];
        const avg = items.length > 0 
            ? items.reduce((sum, r) => sum + r.score, 0) / items.length 
            : 0;
        return { items, avg, count: items.length };
    }, [project.ratings]);

    const { data, setData, post, processing, reset } = useForm({
        score: 5,
        review: '',
    });

    const [isRatingOpen, setIsRatingOpen] = useState(false);

    const handleSubmitRating = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('projects.ratings.store', project.id), {
            onSuccess: () => {
                setIsRatingOpen(false);
                reset();
            }
        });
    };
    return (
        <PublicLayout>
            <Head title={`${project.title} - ${t('title')}`} />

            <div className="px-12 py-16">
                <Link 
                    href="/projects" 
                    className="inline-flex items-center gap-2 text-sm font-medium text-cursor-muted hover:text-cursor-ink transition-colors mb-12 group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> {t('back_to_portfolio')}
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Left Column: Content */}
                    <div className="lg:col-span-2 space-y-16">
                        <header className="space-y-6">
                            <Badge variant="primary" className="px-4 py-1 rounded-cursor-pill">
                                {project.category.replace('_', ' ')}
                            </Badge>
                            <h1 className="text-[48px] md:text-[56px] font-normal text-cursor-ink leading-[1.1] tracking-[-1.5px]">
                                {project.title}
                            </h1>
                            <p className="text-[20px] text-cursor-body leading-relaxed font-normal">
                                {project.description}
                            </p>
                        </header>

                        <div className="aspect-video w-full rounded-cursor-lg overflow-hidden border border-cursor-hairline bg-cursor-canvas-soft">
                            {project.thumbnail ? (
                                <img src={`/storage/${project.thumbnail}`} alt={project.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-cursor-surface-strong" />
                            )}
                        </div>

                        <section className="space-y-8">
                            <h3 className="text-[26px] font-normal text-cursor-ink tracking-[-0.325px]">
                                {t('technical_details')}
                            </h3>
                            <div className="prose prose-slate max-w-none text-cursor-body">
                                <p className="whitespace-pre-wrap leading-loose font-normal">
                                    {project.long_description || "Detailed case study coming soon."}
                                </p>
                            </div>
                        </section>

                        <section className="space-y-8">
                            <h3 className="text-[11px] font-semibold text-cursor-muted uppercase tracking-[0.88px]">{t('tech_stack')}</h3>
                            <div className="flex flex-wrap gap-4">
                                {project.tech_stack.map(tech => (
                                    <div key={tech} className="px-6 py-3 rounded-cursor-md bg-cursor-surface-card border border-cursor-hairline text-sm font-medium text-cursor-ink">
                                        {tech}
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Gallery Mockup */}
                        {project.images && project.images.length > 0 && (
                            <section className="space-y-8">
                                <h3 className="text-[11px] font-semibold text-cursor-muted uppercase tracking-[0.88px]">{t('gallery')}</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    {project.images.map((img, i) => (
                                        <div key={i} className="aspect-video rounded-cursor-lg overflow-hidden border border-cursor-hairline bg-cursor-surface-card">
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column: Sidebar Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-8">
                            <div className="rounded-cursor-lg border border-cursor-hairline bg-cursor-surface-card p-10 space-y-10">
                                <div className="space-y-3 text-center">
                                    <p className="text-[11px] font-semibold text-cursor-muted uppercase tracking-[0.88px]">{t('value')}</p>
                                    <div className="text-[36px] font-normal text-cursor-ink tracking-[-0.72px]">
                                        {format(project.price_from ? Number(project.price_from) : 0)}+
                                    </div>
                                </div>

                                <div className="space-y-6 pt-10 border-t border-cursor-hairline text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-cursor-muted font-medium uppercase tracking-[0.88px] text-[10px]">{t('duration')}</span>
                                        <span className="text-cursor-ink font-semibold">{t('weeks_count', { count: String(project.duration_weeks || 4) })}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-cursor-muted font-medium uppercase tracking-[0.88px] text-[10px]">{t('delivery')}</span>
                                        <span className="text-emerald-600 font-semibold">{t('on_time')}</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {project.live_url && (
                                        <Button asChild className="w-full h-[44px] rounded-cursor-md bg-cursor-ink hover:bg-cursor-ink/90 text-white font-medium text-sm">
                                            <a href={project.live_url} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2">
                                                {t('live_preview')} <ExternalLink size={16} />
                                            </a>
                                        </Button>
                                    )}
                                    {project.github_url && (
                                        <Button variant="outline" asChild className="w-full h-[44px] rounded-cursor-md border-cursor-hairline bg-cursor-canvas-soft text-cursor-ink font-medium text-sm hover:bg-cursor-hairline-soft">
                                            <a href={project.github_url} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2">
                                                {t('view_source')} <Github size={16} />
                                            </a>
                                        </Button>
                                    )}
                                    <Button asChild className="w-full h-[44px] rounded-cursor-md bg-cursor-primary hover:bg-cursor-primary-active text-white font-medium text-sm">
                                        <Link href="/services" className="flex items-center justify-center gap-2">
                                            {t('hire_similar')}
                                        </Link>
                                    </Button>
                                </div>
                            </div>

                            {/* Brief Stats Card */}
                            <div className="rounded-cursor-lg border border-cursor-hairline bg-cursor-surface-strong p-10 flex items-center gap-10">
                                <div className="flex-1 space-y-2">
                                    <div className="text-[26px] font-normal text-cursor-ink leading-none tracking-[-0.325px]">{project.views}</div>
                                    <p className="text-[11px] font-semibold text-cursor-muted uppercase tracking-[0.88px]">{t('total_views')}</p>
                                </div>
                                <div className="flex-1 space-y-2 border-l border-cursor-hairline-strong pl-10">
                                    <div className="text-[26px] font-normal text-cursor-ink leading-none tracking-[-0.325px]">{ratingsData.avg > 0 ? ratingsData.avg.toFixed(1) : 'N/A'}</div>
                                    <p className="text-[11px] font-semibold text-cursor-muted uppercase tracking-[0.88px]">{t('ratings_count', { count: String(ratingsData.count) })}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ratings Section at Bottom */}
                <div className="mt-32 space-y-16 max-w-4xl">
                    <div className="flex items-center justify-between border-b border-cursor-hairline pb-8">
                        <div className="space-y-2">
                            <h3 className="text-[36px] font-normal text-cursor-ink tracking-[-0.72px]">
                                {t('client_reviews')}
                            </h3>
                            <p className="text-cursor-body font-normal">{t('client_reviews_desc')}</p>
                        </div>
                        {auth.user && (
                            <Button 
                                onClick={() => setIsRatingOpen(!isRatingOpen)}
                                variant="outline" 
                                className="h-10 rounded-cursor-md border-cursor-hairline bg-cursor-canvas-soft text-cursor-ink font-medium"
                            >
                                {isRatingOpen ? t('common.cancel') : t('give_feedback')}
                            </Button>
                        )}
                    </div>

                    {isRatingOpen && (
                        <div className="rounded-cursor-lg border border-cursor-hairline bg-cursor-canvas-soft p-10 space-y-8">
                            <h4 className="text-[18px] font-normal text-cursor-ink tracking-[-0.11px]">{t('how_experience')}</h4>
                            <form onSubmit={handleSubmitRating} className="space-y-6">
                                <div className="flex gap-3">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setData('score', s)}
                                            className={cn(
                                                "h-12 w-12 rounded-cursor-md border flex items-center justify-center transition-all",
                                                data.score >= s ? "bg-cursor-ink text-white border-cursor-ink" : "bg-cursor-surface-card border-cursor-hairline text-cursor-muted"
                                            )}
                                        >
                                            <Star size={20} fill={data.score >= s ? "currentColor" : "none"} />
                                        </button>
                                    ))}
                                </div>
                                <textarea 
                                    value={data.review}
                                    onChange={e => setData('review', e.target.value)}
                                    placeholder={t('write_review_placeholder')}
                                    className="w-full bg-cursor-surface-card border border-cursor-hairline rounded-cursor-md p-6 text-cursor-ink focus:outline-none focus:border-cursor-hairline-strong h-40 resize-none transition-colors"
                                />
                                <Button disabled={processing} className="bg-cursor-primary hover:bg-cursor-primary-active text-white rounded-cursor-md h-12 px-10 font-medium border-none shadow-none transition-all">
                                    {t('submit_review')}
                                </Button>
                            </form>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {ratingsData.items.map((r) => (
                            <div key={r.id} className="p-8 rounded-cursor-lg bg-cursor-surface-card border border-cursor-hairline space-y-6">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-cursor-md bg-cursor-canvas-soft border border-cursor-hairline flex items-center justify-center font-semibold text-cursor-muted text-xs uppercase">
                                            {r.user?.name[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-cursor-ink">{r.user?.name}</p>
                                            <p className="text-[11px] text-cursor-muted uppercase font-semibold tracking-[0.88px]">{t('verified_client')}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-1 text-cursor-primary">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={12} fill={i < r.score ? "currentColor" : "none"} className={i < r.score ? "" : "text-cursor-hairline-strong"} />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-sm text-cursor-body leading-relaxed font-normal italic">"{r.review}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
