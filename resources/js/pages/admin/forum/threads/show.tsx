import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
    MessageSquare, 
    User, 
    Clock, 
    Pin, 
    Lock, 
    EyeOff, 
    Eye,
    Trash2,
    ArrowLeft,
    CheckCircle2,
    ShieldAlert
} from 'lucide-react';
import { ForumThread, ForumReply } from '@/types/models';
import { Head, Link, router } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface ForumThreadShowProps {
    thread: ForumThread;
}

export default function Show({ thread }: ForumThreadShowProps) {
    const toggleStatus = (field: 'is_pinned' | 'is_locked' | 'is_hidden') => {
        router.patch(route('admin.forum.threads.update', thread.id), {
            [field]: !thread[field]
        });
    };

    const handleDelete = () => {
        if (confirm('Hapus thread ini secara permanen?')) {
            router.delete(route('admin.forum.threads.destroy', thread.id));
        }
    };

    const toggleReplyVisibility = (replyId: number) => {
        router.post(route('admin.forum.replies.hide', replyId));
    };

    return (
        <AppLayout>
            <Head title={`Moderasi: ${thread.title}`} />

            <div className="space-y-6 p-6 max-w-5xl mx-auto">
                <Link 
                    href={route('admin.forum.threads.index')} 
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft size={16} /> Kembali ke daftar
                </Link>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="capitalize border-border text-primary bg-primary/5">
                                {thread.category}
                            </Badge>
                            {thread.is_pinned && <Badge className="bg-amber-500 text-black border-none"><Pin size={10} className="mr-1" /> Pinned</Badge>}
                            {thread.is_locked && <Badge className="bg-rose-500 text-white border-none"><Lock size={10} className="mr-1" /> Locked</Badge>}
                            {thread.is_hidden && <Badge className="bg-muted text-foreground border-none"><EyeOff size={10} className="mr-1" /> Hidden</Badge>}
                        </div>
                        <h1 className="text-[36px] font-normal tracking-[-0.72px] text-foreground">{thread.title}</h1>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-border bg-muted/50 text-foreground hover:bg-muted"
                            onClick={() => toggleStatus('is_pinned')}
                        >
                            {thread.is_pinned ? 'Unpin' : 'Pin Thread'}
                        </Button>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-border bg-muted/50 text-foreground hover:bg-muted"
                            onClick={() => toggleStatus('is_locked')}
                        >
                            {thread.is_locked ? 'Unlock' : 'Lock Thread'}
                        </Button>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-border bg-muted/50 text-foreground hover:bg-muted"
                            onClick={() => toggleStatus('is_hidden')}
                        >
                            {thread.is_hidden ? 'Unhide' : 'Hide Thread'}
                        </Button>
                        <Button 
                            variant="destructive" 
                            size="sm" 
                            className="bg-destructive hover:bg-destructive/90"
                            onClick={handleDelete}
                        >
                            <Trash2 size={16} className="mr-2" /> Hapus
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Main Content Card */}
                        <Card className="border-border bg-card p-6 space-y-6 rounded-xl">
                            <div className="flex items-center gap-4 pb-6 border-b border-border">
                                <div className="h-10 w-10 rounded-full bg-muted/50 flex items-center justify-center border border-border text-muted-foreground">
                                    <User size={20} />
                                </div>
                                <div>
                                    <p className="font-medium text-foreground">{thread.user?.name}</p>
                                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Original Poster</p>
                                </div>
                                <div className="ml-auto text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock size={12} /> {formatDistanceToNow(new Date(thread.created_at))} ago
                                </div>
                            </div>
                            <div className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                                {thread.body}
                            </div>
                        </Card>

                        {/* Replies Section */}
                        <div className="space-y-4 pt-4">
                            <div className="flex items-center gap-3 px-2">
                                <MessageSquare className="text-primary" size={20} />
                                <h3 className="text-[22px] font-normal tracking-[-0.11px] text-foreground">{thread.replies?.length || 0} Tanggapan</h3>
                            </div>

                            <div className="space-y-4">
                                {thread.replies?.map((reply: ForumReply) => (
                                    <div 
                                        key={reply.id} 
                                        className={cn(
                                            "rounded-lg border p-5 space-y-4 transition-all",
                                            reply.is_hidden 
                                                ? "border-border bg-muted/50 opacity-60" 
                                                : "border-border bg-card"
                                        )}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center text-xs font-bold text-muted-foreground">
                                                    {reply.user?.name[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-foreground">{reply.user?.name}</p>
                                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                                                        {formatDistanceToNow(new Date(reply.created_at))} ago
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                {reply.is_best_answer && (
                                                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                                                        <CheckCircle2 size={10} className="mr-1" /> Best Answer
                                                    </Badge>
                                                )}
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                                    onClick={() => toggleReplyVisibility(reply.id)}
                                                    title={reply.is_hidden ? 'Tampilkan' : 'Sembunyikan'}
                                                >
                                                    {reply.is_hidden ? <Eye size={14} /> : <EyeOff size={14} />}
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap pl-11">
                                            {reply.body}
                                        </div>
                                    </div>
                                ))}

                                {(!thread.replies || thread.replies.length === 0) && (
                                    <div className="py-12 text-center rounded-lg border border-dashed border-border">
                                        <p className="text-muted-foreground text-sm">Belum ada tanggapan.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <Card className="border-border bg-card p-6 space-y-4 rounded-xl">
                            <h4 className="text-xs font-black text-muted-foreground uppercase tracking-widest">Thread Info</h4>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Views</span>
                                    <span className="text-foreground font-medium">{thread.views}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Replies</span>
                                    <span className="text-foreground font-medium">{thread.replies_count}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Created At</span>
                                    <span className="text-foreground font-medium">{new Date(thread.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </Card>

                        <Card className="border-destructive/20 bg-destructive/5 p-6 space-y-4 rounded-xl">
                            <div className="flex items-center gap-2 text-destructive">
                                <ShieldAlert size={18} />
                                <h4 className="text-sm font-bold uppercase tracking-wider">Moderation Zone</h4>
                            </div>
                            <p className="text-xs text-destructive/60 leading-relaxed">
                                Tindakan moderasi bersifat permanen. Gunakan "Hide" jika Anda hanya ingin menyembunyikan konten dari publik untuk sementara.
                            </p>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
