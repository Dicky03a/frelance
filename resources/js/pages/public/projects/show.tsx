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

export default function Show({ project }: { project: Project }) {
    return (
        <PublicLayout>
            <Head title={`${project.title} - Portfolio`} />

            <div className="px-6 py-10">
                <Link 
                    href="/projects" 
                    className="inline-flex items-center gap-2 text-sm font-bold text-white/30 hover:text-white transition-colors mb-8 group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> BACK TO PORTFOLIO
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
                                <Layers size={24} className="text-indigo-400" /> Technical Details
                            </h3>
                            <div className="prose prose-invert max-w-none text-white/70">
                                <p className="whitespace-pre-wrap leading-loose">
                                    {project.long_description || "Detailed case study coming soon."}
                                </p>
                            </div>
                        </section>

                        <section className="space-y-6">
                            <h3 className="text-sm font-black text-white/30 uppercase tracking-[0.2em]">Technology Stack</h3>
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
                                <h3 className="text-sm font-black text-white/30 uppercase tracking-[0.2em]">Project Gallery</h3>
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
                                    <p className="text-xs font-black text-white/20 uppercase tracking-widest">Project Value</p>
                                    <div className="text-3xl font-black text-white">
                                        Rp {(project.price_from ? project.price_from / 1000000 : 0).toFixed(1)}jt+
                                    </div>
                                </div>

                                <div className="space-y-4 pt-8 border-t border-white/5 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-white/30 flex items-center gap-2"><Clock size={16} /> Duration</span>
                                        <span className="text-white font-bold">{project.duration_weeks || 4} Weeks</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-white/30 flex items-center gap-2"><CheckCircle2 size={16} /> Delivery</span>
                                        <span className="text-white font-bold text-emerald-400">On Time</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {project.live_url && (
                                        <Button asChild className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
                                            <a href={project.live_url} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2">
                                                Live Preview <ExternalLink size={18} />
                                            </a>
                                        </Button>
                                    )}
                                    {project.github_url && (
                                        <Button variant="outline" asChild className="w-full h-14 rounded-2xl border-white/10 bg-white/5 text-white font-bold hover:bg-white/10">
                                            <a href={project.github_url} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2">
                                                View Source <Github size={18} />
                                            </a>
                                        </Button>
                                    )}
                                    <Button asChild className="w-full h-14 rounded-2xl bg-white text-indigo-600 hover:bg-white/90 font-black text-lg shadow-xl shadow-white/5">
                                        <Link href="/services" className="flex items-center justify-center gap-2">
                                            Hire Me For Similar <ShoppingCart size={20} />
                                        </Link>
                                    </Button>
                                </div>
                            </div>

                            {/* Brief Stats Card */}
                            <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-[#1c1c28] to-indigo-600/10 p-8 flex items-center gap-6">
                                <div className="flex-1 space-y-1">
                                    <div className="text-2xl font-black text-white">{project.views}</div>
                                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Total Views</p>
                                </div>
                                <div className="flex-1 space-y-1 border-l border-white/10 pl-6">
                                    <div className="text-2xl font-black text-white">4.9</div>
                                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Avg. Rating</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
