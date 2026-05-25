import PublicLayout from '@/layouts/public-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ForumThread, ForumReply } from '@/types/models';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
    MessageSquare, 
    ArrowLeft, 
    Clock, 
    User as UserIcon,
    CheckCircle2,
    Send
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

import { useTranslation } from '@/lib/i18n';

interface ForumShowProps {
    thread: ForumThread;
}

export default function Show({ thread }: ForumShowProps) {
    const { t } = useTranslation('forum');
    
    const { data, setData, post, processing, reset } = useForm({
        body: '',
    });

    const handleSubmitReply = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('forum.replies.store', thread.slug), {
            onSuccess: () => reset(),
        });
    };

    return (
        <PublicLayout>
            <Head title={thread.title} />

            <div className="px-6 py-10 max-w-4xl mx-auto space-y-8">
                <Link 
                    href="/forum" 
                    className="inline-flex items-center gap-2 text-sm font-bold text-white/30 hover:text-white transition-colors group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> {t('back_to_forum')}
                </Link>

                <div className="space-y-6">
                    <header className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 px-3 py-0.5 rounded-lg uppercase text-[10px] font-bold tracking-widest">
                                {thread.category}
                            </Badge>
                            <span className="text-[10px] text-white/20 flex items-center gap-1">
                                <Clock size={10} /> {formatDistanceToNow(new Date(thread.created_at))} ago
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">
                            {thread.title}
                        </h1>
                    </header>

                    {/* Main Thread Content */}
                    <div className="rounded-[32px] border border-white/10 bg-[#1c1c28] p-8 space-y-6">
                        <div className="flex items-center gap-4 pb-6 border-b border-white/5">
                            <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center border border-white/5 text-white/40">
                                <UserIcon size={24} />
                            </div>
                            <div>
                                <p className="font-bold text-white">{thread.user?.name}</p>
                                <p className="text-xs text-white/30 uppercase tracking-widest font-bold">{t('author')}</p>
                            </div>
                        </div>
                        <div className="prose prose-invert max-w-none text-white/80 leading-relaxed text-lg whitespace-pre-wrap">
                            {thread.body}
                        </div>
                    </div>

                    {/* Replies Section */}
                    <div className="space-y-6 pt-10">
                        <div className="flex items-center gap-3 px-4">
                            <MessageSquare className="text-indigo-400" size={20} />
                            <h3 className="text-xl font-bold text-white">{thread.replies?.length || 0} {t('responses')}</h3>
                        </div>

                        <div className="space-y-4">
                            {thread.replies?.map((reply: ForumReply) => (
                                <div key={reply.id} className="rounded-[24px] border border-white/5 bg-white/[0.02] p-6 space-y-4 relative">
                                    {reply.is_best_answer && (
                                        <div className="absolute -top-3 -right-3 bg-emerald-500 text-white p-2 rounded-full shadow-lg shadow-emerald-500/20">
                                            <CheckCircle2 size={16} />
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold text-white/30">
                                            {reply.user?.name[0]}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-white">{reply.user?.name}</p>
                                            <p className="text-[10px] text-white/20 uppercase font-bold tracking-widest">
                                                {formatDistanceToNow(new Date(reply.created_at))} ago
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-white/70 leading-relaxed whitespace-pre-wrap pl-11">
                                        {reply.body}
                                    </div>
                                </div>
                            ))}

                            {(!thread.replies || thread.replies.length === 0) && (
                                <div className="py-20 text-center rounded-[32px] border border-dashed border-white/5">
                                    <p className="text-white/20 italic">{t('no_replies')}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Reply Form */}
                    <div className="pt-10">
                        <div className="rounded-[32px] border border-indigo-500/20 bg-indigo-500/5 p-8 space-y-6">
                            <h4 className="text-lg font-bold text-white">{t('write_reply')}</h4>
                            <form onSubmit={handleSubmitReply} className="space-y-4">
                                <textarea 
                                    rows={5}
                                    value={data.body}
                                    onChange={e => setData('body', e.target.value)}
                                    placeholder={t('reply_placeholder_input')}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                                />
                                <div className="flex justify-end">
                                    <Button 
                                        disabled={processing || !data.body.trim()} 
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8 h-12 font-bold"
                                    >
                                        <Send size={18} className="mr-2" /> {t('post_reply')}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
