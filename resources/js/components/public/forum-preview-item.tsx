import { ForumThread } from '@/types/models';
import { Badge } from '@/components/ui/badge';
import { Link } from '@inertiajs/react';
import { MessageSquare, Clock, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function ForumPreviewItem({ thread }: { thread: ForumThread }) {
    return (
        <Link 
            href={`/forum/${thread.slug}`}
            className="flex gap-4 p-4 rounded-[20px] bg-white/5 hover:bg-white/10 border border-white/5 hover:border-indigo-500/20 transition-all group"
        >
            <div className="h-10 w-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/10 flex-shrink-0">
                <User size={20} />
            </div>
            
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-[9px] uppercase border-white/10 text-white/40 h-4 px-1.5">
                        {thread.category}
                    </Badge>
                    <span className="text-[10px] text-white/20 flex items-center gap-1">
                        <Clock size={10} /> {formatDistanceToNow(new Date(thread.created_at))} ago
                    </span>
                </div>
                
                <h4 className="font-bold text-white group-hover:text-indigo-400 transition-colors truncate">
                    {thread.title}
                </h4>
                
                <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1.5 text-[11px] text-white/30 font-medium">
                        <MessageSquare size={12} className="text-indigo-500" />
                        <span>{thread.replies_count ?? 0} Replies</span>
                    </div>
                    <div className="text-[11px] text-white/30">
                        By <span className="text-white/60">{thread.user?.name}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
