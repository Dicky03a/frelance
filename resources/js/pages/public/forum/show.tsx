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

            <div className="px-12 py-16 max-w-4xl mx-auto space-y-12">
                <Link 
                    href="/forum" 
                    className="inline-flex items-center gap-2 text-sm font-medium text-cursor-muted hover:text-cursor-ink transition-colors mb-4 group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> {t('back_to_forum')}
                </Link>

                <div className="space-y-10">
                    <header className="space-y-6 border-b border-cursor-hairline pb-10">
                        <div className="flex items-center gap-3">
                            <Badge variant="primary" className="px-3 py-0.5 rounded-cursor-pill uppercase text-[10px] font-semibold tracking-[0.88px]">
                                {thread.category.replace('_', ' ')}
                            </Badge>
                            <span className="text-[11px] font-medium text-cursor-muted">
                                {formatDistanceToNow(new Date(thread.created_at))} ago
                            </span>
                        </div>
                        <h1 className="text-[36px] md:text-[48px] font-normal text-cursor-ink leading-[1.1] tracking-[-1.5px]">
                            {thread.title}
                        </h1>
                    </header>

                    {/* Main Thread Content */}
                    <div className="rounded-xl border border-cursor-hairline bg-cursor-surface-card p-10 md:p-12 space-y-10">
                        <div className="flex items-center gap-4 pb-10 border-b border-cursor-hairline">
                            <div className="h-12 w-12 rounded-md bg-cursor-canvas-soft flex items-center justify-center border border-cursor-hairline text-cursor-muted">
                                <UserIcon size={24} />
                            </div>
                            <div>
                                <p className="font-semibold text-cursor-ink">{thread.user?.name}</p>
                                <p className="text-[11px] text-cursor-muted uppercase tracking-[0.88px] font-semibold">{t('author')}</p>
                            </div>
                        </div>
                        <div className="prose prose-slate max-w-none text-cursor-body leading-relaxed text-lg whitespace-pre-wrap font-normal">
                            {thread.body}
                        </div>
                    </div>

                    {/* Replies Section */}
                    <div className="space-y-10 pt-16">
                        <div className="flex items-center gap-3 px-4 border-l-2 border-cursor-primary">
                            <h3 className="text-[22px] font-normal text-cursor-ink tracking-[-0.11px]">{thread.replies?.length || 0} {t('responses')}</h3>
                        </div>

                        <div className="space-y-6">
                            {thread.replies?.map((reply: ForumReply) => (
                                <div key={reply.id} className="rounded-xl border border-cursor-hairline bg-cursor-surface-card p-8 space-y-6 relative transition-all hover:border-cursor-hairline-strong">
                                    {reply.is_best_answer && (
                                        <div className="absolute -top-3 -right-3 bg-emerald-500 text-white p-2.5 rounded-full shadow-lg">
                                            <CheckCircle2 size={16} />
                                        </div>
                                    )}
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-md bg-cursor-canvas-soft border border-cursor-hairline flex items-center justify-center text-xs font-semibold text-cursor-muted">
                                            {reply.user?.name[0]}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-cursor-ink">{reply.user?.name}</p>
                                            <p className="text-[11px] text-cursor-muted uppercase font-semibold tracking-[0.88px]">
                                                {formatDistanceToNow(new Date(reply.created_at))} ago
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-cursor-body leading-relaxed whitespace-pre-wrap pl-14 font-normal">
                                        {reply.body}
                                    </div>
                                </div>
                            ))}

                            {(!thread.replies || thread.replies.length === 0) && (
                                <div className="py-24 text-center rounded-xl border border-dashed border-cursor-hairline bg-cursor-canvas-soft">
                                    <p className="text-cursor-muted italic font-normal">{t('no_replies')}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Reply Form */}
                    <div className="pt-16">
                        <div className="rounded-xl border border-cursor-hairline bg-cursor-canvas-soft p-10 space-y-8">
                            <h4 className="text-[18px] font-normal text-cursor-ink tracking-[-0.11px]">{t('write_reply')}</h4>
                            <form onSubmit={handleSubmitReply} className="space-y-6">
                                <textarea 
                                    rows={6}
                                    value={data.body}
                                    onChange={e => setData('body', e.target.value)}
                                    placeholder={t('reply_placeholder_input')}
                                    className="w-full bg-cursor-surface-card border border-cursor-hairline rounded-cursor-md p-6 text-cursor-ink placeholder:text-cursor-muted/40 focus:outline-none focus:border-cursor-hairline-strong transition-colors resize-none"
                                />
                                <div className="flex justify-end">
                                    <Button 
                                        disabled={processing || !data.body.trim()} 
                                        className="bg-cursor-primary hover:bg-cursor-primary-active text-white rounded-cursor-md px-10 h-12 font-medium border-none shadow-none transition-all"
                                    >
                                        {t('post_reply')}
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
