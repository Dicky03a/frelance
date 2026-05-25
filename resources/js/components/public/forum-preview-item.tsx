import { ForumThread } from '@/types/models';
import { Link } from '@inertiajs/react';
import { MessageSquare, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

import { useTranslation } from '@/lib/i18n';

export function ForumPreviewItem({ thread }: { thread: ForumThread }) {
    const { t } = useTranslation('forum');
    
    return (
        <Link 
            href={`/forum/${thread.slug}`}
            className="flex gap-6 py-6 transition-all group hover:bg-cursor-hairline-soft/50 px-4 -mx-4 rounded-cursor-md"
        >
            <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-3">
                    <span className="text-[11px] font-semibold text-cursor-muted uppercase tracking-[0.88px]">
                        {thread.category.replace('_', ' ')}
                    </span>
                    <span className="text-cursor-muted/40">•</span>
                    <span className="text-[11px] font-medium text-cursor-muted">
                        {formatDistanceToNow(new Date(thread.created_at))} ago
                    </span>
                </div>
                
                <h4 className="text-[18px] font-normal text-cursor-ink group-hover:text-cursor-primary transition-colors truncate tracking-[-0.11px]">
                    {thread.title}
                </h4>
                
                <div className="flex items-center gap-6">
                    <div className="text-[13px] text-cursor-body font-medium flex items-center gap-2">
                        <MessageSquare size={14} className="text-cursor-primary" />
                        <span>{thread.replies_count ?? 0} {t('replies')}</span>
                    </div>
                    <div className="text-[13px] text-cursor-muted font-normal">
                        by <span className="text-cursor-ink font-medium">{thread.user?.name}</span>
                    </div>
                </div>
            </div>
            
            <div className="hidden sm:flex items-center">
                <ArrowRight size={20} className="text-cursor-hairline-strong group-hover:text-cursor-primary transition-colors group-hover:translate-x-1 transition-transform" />
            </div>
        </Link>
    );
}
