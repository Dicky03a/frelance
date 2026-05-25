import { Project } from '@/types/models';
import { Badge } from '@/components/ui/badge';
import { Link } from '@inertiajs/react';
import { ArrowRight, Eye } from 'lucide-react';
import { useCurrency } from '@/lib/currency';
import { useTranslation } from '@/lib/i18n';

export function ProjectCard({ project }: { project: Project }) {
    const { format } = useCurrency();
    const { t } = useTranslation('common');
    
    return (
        <div className="group relative rounded-[24px] border border-white/7 bg-[#1c1c28] overflow-hidden transition-all duration-500 hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/10">
            {/* Image Section */}
            <div className="aspect-[16/10] overflow-hidden relative">
                {project.thumbnail ? (
                    <img 
                        src={`/storage/${project.thumbnail}`} 
                        alt={project.title} 
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="h-full w-full bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center">
                        <span className="text-white/10 font-bold text-lg">DEV PORTO</span>
                    </div>
                )}
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-[#09090f]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-3">
                    <Link 
                        href={`/projects/${project.slug}`}
                        className="h-12 w-12 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:scale-110 transition-transform"
                    >
                        <Eye size={20} />
                    </Link>
                </div>

                <div className="absolute top-4 left-4">
                    <Badge className="bg-black/60 backdrop-blur-md text-white/90 border-white/10 capitalize rounded-lg px-3 py-1">
                        {project.category.replace('_', ' ')}
                    </Badge>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech_stack.slice(0, 3).map((tech, i) => (
                        <span key={i} className="text-[10px] font-bold uppercase tracking-wider text-white/30">
                            {tech}
                        </span>
                    ))}
                    {project.tech_stack.length > 3 && (
                        <span className="text-[10px] font-bold text-indigo-400">
                            +{project.tech_stack.length - 3} {t('more')}
                        </span>
                    )}
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                    {project.title}
                </h3>
                
                <p className="text-sm text-white/50 line-clamp-2 mb-6 h-10">
                    {project.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="text-xs">
                        <span className="text-white/30 block mb-1">Starting from</span>
                        <span className="text-white font-bold text-sm">
                            {format(project.price_from ? Number(project.price_from) : 0)}
                        </span>
                    </div>
                    
                    <Link 
                        href={`/projects/${project.slug}`}
                        className="flex items-center gap-2 text-xs font-bold text-white/40 hover:text-white transition-colors group/link"
                    >
                        {t('view').toUpperCase()} <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
