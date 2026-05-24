import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from '@/components/ui/table';
import { PaginatedResponse } from '@/types/pagination';
import { ForumThread } from '@/types/models';
import { Head, Link, router } from '@inertiajs/react';
import { Search, Eye, Trash2, Pin, Lock, MessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ForumThreadsIndexProps {
    threads: PaginatedResponse<ForumThread>;
    filters: {
        search?: string;
    };
}

export default function Index({ threads, filters }: ForumThreadsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== filters.search) {
                router.get(route('admin.forum.threads.index'), { search }, { preserveState: true, replace: true });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const handleDelete = (id: number) => {
        if (confirm('Hapus thread ini secara permanen?')) {
            router.delete(route('admin.forum.threads.destroy', id));
        }
    };

    return (
        <AppLayout>
            <Head title="Moderasi Forum" />
            
            <div className="space-y-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Forum Threads</h1>
                    <p className="text-white/50">Moderasi diskusi komunitas.</p>
                </div>

                <div className="rounded-[20px] border border-white/7 bg-[#1c1c28] p-6">
                    <div className="mb-6 flex items-center">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                            <Input 
                                placeholder="Cari judul thread..." 
                                className="pl-10 bg-white/5 border-white/10 rounded-xl"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-white/7">
                        <Table>
                            <TableHeader className="bg-white/5">
                                <TableRow className="border-white/7 hover:bg-transparent">
                                    <TableHead className="text-white/50">THREAD</TableHead>
                                    <TableHead className="text-white/50">PENULIS</TableHead>
                                    <TableHead className="text-white/50">KATEGORI</TableHead>
                                    <TableHead className="text-white/50 text-center">REPLIES</TableHead>
                                    <TableHead className="text-white/50 text-center">STATUS</TableHead>
                                    <TableHead className="text-right text-white/50">AKSI</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {threads.data.map((thread) => (
                                    <TableRow key={thread.id} className="border-white/7 hover:bg-white/5 transition-colors group">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                                    <MessageSquare size={16} />
                                                </div>
                                                <div className="font-medium text-white max-w-xs truncate">{thread.title}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-white/70">{thread.user?.name}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="capitalize border-white/10 text-white/40">
                                                {thread.category}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center text-white/50">{thread.replies_count}</TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex justify-center gap-1">
                                                {thread.is_pinned && <Pin size={14} className="text-amber-400" />}
                                                {thread.is_locked && <Lock size={14} className="text-rose-400" />}
                                                {!thread.is_pinned && !thread.is_locked && <span className="text-[10px] text-white/20">—</span>}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" asChild className="text-white/30 hover:text-indigo-400">
                                                    <Link href={`/forum/${thread.slug}`} target="_blank">
                                                        <Eye size={16} />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(thread.id)} className="text-white/30 hover:text-rose-400">
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                        <div className="text-sm text-white/30">
                            Halaman {threads.meta.current_page} dari {threads.meta.last_page}
                        </div>
                        <div className="flex gap-2">
                            {threads.links.prev && (
                                <Button variant="outline" size="sm" asChild className="border-white/10 bg-white/5 text-white">
                                    <Link href={threads.links.prev}>Prev</Link>
                                </Button>
                            )}
                            {threads.links.next && (
                                <Button variant="outline" size="sm" asChild className="border-white/10 bg-white/5 text-white">
                                    <Link href={threads.links.next}>Next</Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
