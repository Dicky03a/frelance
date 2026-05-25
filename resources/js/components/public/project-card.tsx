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
        <div className="group relative rounded-cursor-lg border border-cursor-hairline bg-cursor-surface-card overflow-hidden transition-all duration-300 hover:border-cursor-hairline-strong">
            {/* Image Section */}
            <div className="aspect-[16/10] overflow-hidden relative border-b border-cursor-hairline">
                {project.thumbnail ? (
                    <img 
                        src={`/storage/${project.thumbnail}`} 
                        alt={project.title} 
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="h-full w-full bg-cursor-canvas-soft flex items-center justify-center">
                        <span className="text-cursor-muted/20 font-bold text-lg">DEV PORTO</span>
                    </div>
                )}
                
                <div className="absolute top-4 left-4">
                    <Badge className="bg-cursor-surface-card/90 backdrop-blur-sm text-cursor-ink border border-cursor-hairline capitalize rounded-cursor-md px-3 py-1 font-medium shadow-none">
                        {project.category.replace('_', ' ')}
                    </Badge>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-8">
                <div className="flex flex-wrap gap-3 mb-4">
                    {project.tech_stack.slice(0, 3).map((tech, i) => (
                        <span key={i} className="text-[11px] font-semibold uppercase tracking-[0.88px] text-cursor-muted">
                            {tech}
                        </span>
                    ))}
                </div>

                <h3 className="text-[22px] font-normal text-cursor-ink mb-3 tracking-[-0.11px]">
                    <Link href={`/projects/${project.slug}`} className="hover:text-cursor-primary transition-colors">
                        {project.title}
                    </Link>
                </h3>
                
                <p className="text-[14px] text-cursor-body line-clamp-2 mb-8 h-10 font-normal leading-relaxed">
                    {project.description}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-cursor-hairline">
                    <div className="text-xs">
                        <span className="text-cursor-muted block mb-1 font-medium uppercase tracking-[0.88px] text-[10px]">Investment</span>
                        <span className="text-cursor-ink font-semibold text-sm">
                            {format(project.price_from ? Number(project.price_from) : 0)}
                        </span>
                    </div>
                    
                    <Link 
                        href={`/projects/${project.slug}`}
                        className="flex items-center gap-2 text-[13px] font-medium text-cursor-primary hover:opacity-80 transition-opacity"
                    >
                        {t('view')} <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
