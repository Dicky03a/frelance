import PublicLayout from '@/layouts/public-layout';
import { Head, Link } from '@inertiajs/react';
import { Project } from '@/types/models';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
    Calendar, 
    Clock, 
    ExternalLink, 
    Github, 
    ArrowLeft,
    CheckCircle2,
    MessageSquare,
    Star,
    Layers,
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

            <div className="px-6 py-10">
                <Link 
                    href="/projects" 
                    className="inline-flex items-center gap-2 text-sm font-bold text-white/30 hover:text-white transition-colors mb-8 group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> {t('back_to_portfolio')}
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left Column: Content */}
                    <div className="lg:col-span-2 space-y-12">
                        <header className="space-y-6">
                            <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 px-4 py-1 rounded-full uppercase text-[10px] font-bold tracking-widest">
                                {project.category.replace('_', ' ')}
                            </Badge>
                            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
                                {project.title}
                            </h1>
                            <p className="text-xl text-white/60 leading-relaxed">
                                {project.description}
                            </p>
                        </header>

                        <div className="aspect-video w-full rounded-[32px] overflow-hidden border border-white/10 bg-white/5">
                            {project.thumbnail ? (
                                <img src={`/storage/${project.thumbnail}`} alt={project.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-indigo-500/20 to-violet-500/20" />
                            )}
                        </div>

                        <section className="space-y-6">
                            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                <Layers size={24} className="text-indigo-400" /> {t('technical_details')}
                            </h3>
                            <div className="prose prose-invert max-w-none text-white/70">
                                <p className="whitespace-pre-wrap leading-loose">
                                    {project.long_description || "Detailed case study coming soon."}
                                </p>
                            </div>
                        </section>

                        <section className="space-y-6">
                            <h3 className="text-sm font-black text-white/30 uppercase tracking-[0.2em]">{t('tech_stack')}</h3>
                            <div className="flex flex-wrap gap-3">
                                {project.tech_stack.map(tech => (
                                    <div key={tech} className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold text-white hover:border-indigo-500/50 transition-colors">
                                        {tech}
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Gallery Mockup */}
                        {project.images && project.images.length > 0 && (
                            <section className="space-y-6">
                                <h3 className="text-sm font-black text-white/30 uppercase tracking-[0.2em]">{t('gallery')}</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {project.images.map((img, i) => (
                                        <div key={i} className="aspect-video rounded-2xl overflow-hidden border border-white/5 bg-white/5">
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column: Sidebar Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            <div className="rounded-[32px] border border-white/10 bg-[#1c1c28] p-8 space-y-8 shadow-2xl shadow-black/50">
                                <div className="space-y-2 text-center">
                                    <p className="text-xs font-black text-white/20 uppercase tracking-widest">{t('value')}</p>
                                    <div className="text-3xl font-black text-white">
                                        {format(project.price_from ? Number(project.price_from) : 0)}+
                                    </div>
                                </div>

                                <div className="space-y-4 pt-8 border-t border-white/5 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-white/30 flex items-center gap-2"><Clock size={16} /> {t('duration')}</span>
                                        <span className="text-white font-bold">{t('weeks_count', { count: String(project.duration_weeks || 4) })}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-white/30 flex items-center gap-2"><CheckCircle2 size={16} /> {t('delivery')}</span>
                                        <span className="text-white font-bold text-emerald-400">{t('on_time')}</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {project.live_url && (
                                        <Button asChild className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
                                            <a href={project.live_url} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2">
                                                {t('live_preview')} <ExternalLink size={18} />
                                            </a>
                                        </Button>
                                    )}
                                    {project.github_url && (
                                        <Button variant="outline" asChild className="w-full h-14 rounded-2xl border-white/10 bg-white/5 text-white font-bold hover:bg-white/10">
                                            <a href={project.github_url} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2">
                                                {t('view_source')} <Github size={18} />
                                            </a>
                                        </Button>
                                    )}
                                    <Button asChild className="w-full h-14 rounded-2xl bg-white text-indigo-600 hover:bg-white/90 font-black text-lg shadow-xl shadow-white/5">
                                        <Link href="/services" className="flex items-center justify-center gap-2">
                                            {t('hire_similar')} <ShoppingCart size={20} />
                                        </Link>
                                    </Button>
                                </div>
                            </div>

                            {/* Brief Stats Card */}
                            <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-[#1c1c28] to-indigo-600/10 p-8 flex items-center gap-6">
                                <div className="flex-1 space-y-1">
                                    <div className="text-2xl font-black text-white">{project.views}</div>
                                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{t('total_views')}</p>
                                </div>
                                <div className="flex-1 space-y-1 border-l border-white/10 pl-6">
                                    <div className="text-2xl font-black text-white">{ratingsData.avg > 0 ? ratingsData.avg.toFixed(1) : 'N/A'}</div>
                                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{t('ratings_count', { count: String(ratingsData.count) })}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ratings Section at Bottom */}
                <div className="mt-20 space-y-12 max-w-4xl">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                <Star size={24} className="text-amber-400" /> {t('client_reviews')}
                            </h3>
                            <p className="text-white/40 text-sm">{t('client_reviews_desc')}</p>
                        </div>
                        {auth.user && (
                            <Button 
                                onClick={() => setIsRatingOpen(!isRatingOpen)}
                                variant="outline" 
                                className="rounded-xl border-indigo-500/20 bg-indigo-500/5 text-indigo-400"
                            >
                                {isRatingOpen ? t('common.cancel') : t('give_feedback')}
                            </Button>
                        )}
                    </div>

                    {isRatingOpen && (
                        <div className="rounded-[32px] border border-indigo-500/20 bg-indigo-500/[0.02] p-8 space-y-6">
                            <h4 className="font-bold text-white">{t('how_experience')}</h4>
                            <form onSubmit={handleSubmitRating} className="space-y-4">
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setData('score', s)}
                                            className={cn(
                                                "h-12 w-12 rounded-xl border flex items-center justify-center transition-all",
                                                data.score >= s ? "bg-amber-500/10 border-amber-500/30 text-amber-500" : "bg-white/5 border-white/5 text-white/20"
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
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 h-32"
                                />
                                <Button disabled={processing} className="bg-indigo-600 rounded-xl h-12 px-8 font-bold">
                                    {t('submit_review')}
                                </Button>
                            </form>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {ratingsData.items.map((r) => (
                            <div key={r.id} className="p-6 rounded-[24px] bg-[#1c1c28] border border-white/5 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center font-bold text-white/30 text-xs uppercase">
                                            {r.user?.name[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white">{r.user?.name}</p>
                                            <p className="text-[10px] text-white/20 uppercase font-bold tracking-widest">{t('verified_client')}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-0.5 text-amber-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={10} fill={i < r.score ? "currentColor" : "none"} className={i < r.score ? "" : "text-white/10"} />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-sm text-white/60 leading-relaxed italic">"{r.review}"</p>
                            </div>
                        ))}
                        {ratingsData.items.length === 0 && (
                            <div className="col-span-full py-12 text-center rounded-[32px] border border-dashed border-white/5">
                                <p className="text-white/20 text-sm">{t('no_reviews')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
