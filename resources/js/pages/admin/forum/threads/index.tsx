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
                    <h1 className="text-[36px] font-normal tracking-[-0.72px] text-foreground">Forum Threads</h1>
                    <p className="text-muted-foreground">Moderasi diskusi komunitas.</p>
                </div>

                <div className="rounded-xl border border-border bg-card p-6">
                    <div className="mb-6 flex items-center">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input 
                                placeholder="Cari judul thread..." 
                                className="pl-10 bg-muted/50 border-border rounded-xl"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-border">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow className="border-border hover:bg-transparent">
                                    <TableHead className="text-muted-foreground">THREAD</TableHead>
                                    <TableHead className="text-muted-foreground">PENULIS</TableHead>
                                    <TableHead className="text-muted-foreground">KATEGORI</TableHead>
                                    <TableHead className="text-muted-foreground text-center">REPLIES</TableHead>
                                    <TableHead className="text-muted-foreground text-center">STATUS</TableHead>
                                    <TableHead className="text-right text-muted-foreground">AKSI</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {threads.data.map((thread) => (
                                    <TableRow key={thread.id} className="border-border hover:bg-muted/50 transition-colors group">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                                    <MessageSquare size={16} />
                                                </div>
                                                <div className="font-medium text-foreground max-w-xs truncate">{thread.title}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">{thread.user?.name}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="capitalize border-border text-muted-foreground">
                                                {thread.category}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center text-muted-foreground">{thread.replies_count}</TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex justify-center gap-1">
                                                {thread.is_pinned && <Pin size={14} className="text-amber-400" />}
                                                {thread.is_locked && <Lock size={14} className="text-rose-400" />}
                                                {!thread.is_pinned && !thread.is_locked && <span className="text-[10px] text-muted-foreground">—</span>}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" asChild className="text-muted-foreground hover:text-primary">
                                                    <Link href={route('admin.forum.threads.show', thread.id)}>
                                                        <Eye size={16} />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(thread.id)} className="text-muted-foreground hover:text-rose-400">
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
                        <div className="text-sm text-muted-foreground">
                            Halaman {threads.meta.current_page} dari {threads.meta.last_page}
                        </div>
                        <div className="flex gap-2">
                            {threads.links.prev && (
                                <Button variant="outline" size="sm" asChild className="border-border bg-muted/50 text-foreground">
                                    <Link href={threads.links.prev}>Prev</Link>
                                </Button>
                            )}
                            {threads.links.next && (
                                <Button variant="outline" size="sm" asChild className="border-border bg-muted/50 text-foreground">
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
