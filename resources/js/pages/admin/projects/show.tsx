import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Project } from '@/types/models';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
    Eye, 
    ArrowLeft, 
    Edit2, 
    Trash2, 
    MessageSquare, 
    Star, 
    Calendar,
    Globe,
    Github
} from 'lucide-react';

interface ProjectShowProps {
    project: Project;
}

export default function Show({ project }: ProjectShowProps) {
    return (
        <AppLayout>
            <Head title={`Detail Proyek: ${project.title}`} />

            <div className="px-6 py-10 space-y-8">
                <div className="flex items-center justify-between">
                    <Link 
                        href={route('admin.projects.index')} 
                        className="inline-flex items-center gap-2 text-sm font-bold text-white/30 hover:text-white transition-colors group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> KEMBALI KE DAFTAR
                    </Link>
                    <div className="flex gap-3">
                        <Button variant="outline" asChild className="border-white/10 bg-white/5 text-white hover:bg-white/10 rounded-xl">
                            <Link href={route('admin.projects.edit', project.id)}>
                                <Edit2 size={16} className="mr-2" /> Edit Proyek
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Hero Image */}
                        <div className="aspect-video w-full rounded-[32px] overflow-hidden border border-white/10 bg-[#1c1c28]">
                            {project.thumbnail ? (
                                <img src={`/storage/${project.thumbnail}`} alt={project.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white/5">
                                    <Eye size={64} />
                                </div>
                            )}
                        </div>

                        {/* Details */}
                        <div className="rounded-[32px] border border-white/10 bg-[#1c1c28] p-8 space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 capitalize">
                                        {project.category.replace('_', ' ')}
                                    </Badge>
                                    <Badge className={
                                        project.status === 'published' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-white/30'
                                    }>
                                        {project.status.toUpperCase()}
                                    </Badge>
                                </div>
                                <h1 className="text-3xl font-black text-white">{project.title}</h1>
                                <p className="text-white/60 leading-relaxed text-lg">{project.description}</p>
                            </div>

                            <div className="pt-8 border-t border-white/5">
                                <h3 className="text-xs font-black text-white/20 uppercase tracking-widest mb-4">Tech Stack</h3>
                                <div className="flex flex-wrap gap-2">
                                    {project.tech_stack.map(tech => (
                                        <Badge key={tech} variant="outline" className="bg-white/5 border-white/10 text-white/50 px-3 py-1">
                                            {tech}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {project.long_description && (
                                <div className="pt-8 border-t border-white/5">
                                    <h3 className="text-xs font-black text-white/20 uppercase tracking-widest mb-4">Case Study / Content</h3>
                                    <div className="prose prose-invert max-w-none text-white/70">
                                        <p className="whitespace-pre-wrap">{project.long_description}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Stats & Links Card */}
                        <div className="rounded-[32px] border border-white/10 bg-[#1c1c28] p-8 space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-white/30 flex items-center gap-2"><Eye size={14} /> Views</span>
                                    <span className="text-white font-bold">{project.views}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-white/30 flex items-center gap-2"><Calendar size={14} /> Dibuat</span>
                                    <span className="text-white font-bold">{new Date(project.created_at).toLocaleDateString('id-ID')}</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {project.live_url && (
                                    <Button variant="outline" asChild className="w-full h-12 rounded-xl border-white/10 text-white gap-2">
                                        <a href={project.live_url} target="_blank"><Globe size={16} /> Live Demo</a>
                                    </Button>
                                )}
                                {project.github_url && (
                                    <Button variant="outline" asChild className="w-full h-12 rounded-xl border-white/10 text-white gap-2">
                                        <a href={project.github_url} target="_blank"><Github size={16} /> Source Code</a>
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Engagement Summary */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 rounded-[24px] border border-white/10 bg-[#1c1c28] text-center space-y-2">
                                <MessageSquare className="mx-auto text-indigo-400" size={20} />
                                <div className="text-xl font-bold text-white">0</div>
                                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Komentar</p>
                            </div>
                            <div className="p-6 rounded-[24px] border border-white/10 bg-[#1c1c28] text-center space-y-2">
                                <Star className="mx-auto text-amber-400" size={20} />
                                <div className="text-xl font-bold text-white">4.9</div>
                                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Rating</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
