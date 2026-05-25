import PublicLayout from '@/layouts/public-layout';
import { Head, router } from '@inertiajs/react';
import { ProjectCard } from '@/components/public/project-card';
import { Project } from '@/types/models';
import { PaginatedResponse } from '@/types/pagination';
import { cn } from '@/lib/utils';
import { Search, Briefcase } from 'lucide-react';

interface ProjectsIndexProps {
    projects: PaginatedResponse<Project>;
    categories: string[];
    filters: {
        category?: string;
    };
}

export default function Index({ projects, categories, filters }: ProjectsIndexProps) {
    const handleCategoryFilter = (category: string) => {
        router.get(route('projects.index'), { category: category === filters.category ? null : category }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <PublicLayout>
            <Head title="Portfolio - Professional Works" />

            <div className="px-6 py-10 space-y-12">
                <header className="max-w-3xl space-y-4">
                    <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/10 mb-2">
                        <Briefcase size={28} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Portfolio</h1>
                    <p className="text-white/40 text-lg leading-relaxed">
                        A showcase of my recent projects, featuring custom web applications, e-commerce solutions, and creative digital experiences.
                    </p>
                </header>

                <div className="sticky top-16 z-20 bg-[#09090f]/80 backdrop-blur-md py-4 -mx-2 px-2 border-y border-white/5 flex gap-2 overflow-x-auto no-scrollbar">
                    <button
                        onClick={() => router.get(route('projects.index'))}
                        className={cn(
                            "px-6 py-2.5 rounded-full text-xs font-bold border transition-all whitespace-nowrap",
                            !filters.category 
                                ? "bg-indigo-600 border-indigo-500 text-white" 
                                : "bg-white/5 border-white/5 text-white/40 hover:border-white/10"
                        )}
                    >
                        ALL PROJECTS
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => handleCategoryFilter(cat)}
                            className={cn(
                                "px-6 py-2.5 rounded-full text-xs font-bold border transition-all whitespace-nowrap",
                                filters.category === cat 
                                    ? "bg-indigo-600 border-indigo-500 text-white" 
                                    : "bg-white/5 border-white/5 text-white/40 hover:border-white/10"
                            )}
                        >
                            {cat.replace('_', ' ').toUpperCase()}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.data.map(project => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>

                {projects.data.length === 0 && (
                    <div className="py-32 text-center rounded-[40px] border border-dashed border-white/10">
                        <Search size={48} className="mx-auto text-white/10 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No projects found</h3>
                        <p className="text-white/30 italic">Try selecting a different category or check back later.</p>
                    </div>
                )}

                {/* Pagination */}
                {projects.meta.last_page > 1 && (
                    <div className="flex justify-center gap-2 pt-10">
                        {projects.links.prev && (
                            <button 
                                onClick={() => router.get(projects.links.prev!)}
                                className="px-6 py-3 rounded-2xl bg-white/5 border border-white/5 text-white/50 font-bold hover:text-white transition-all"
                            >
                                Previous
                            </button>
                        )}
                        <div className="px-6 py-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold">
                            Page {projects.meta.current_page} of {projects.meta.last_page}
                        </div>
                        {projects.links.next && (
                            <button 
                                onClick={() => router.get(projects.links.next!)}
                                className="px-6 py-3 rounded-2xl bg-white/5 border border-white/5 text-white/50 font-bold hover:text-white transition-all"
                            >
                                Next
                            </button>
                        )}
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
