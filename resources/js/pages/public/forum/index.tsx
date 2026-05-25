import PublicLayout from '@/layouts/public-layout';
import { Head, Link, router } from '@inertiajs/react';
import { ForumThread } from '@/types/models';
import { PaginatedResponse } from '@/types/pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ForumPreviewItem } from '@/components/public/forum-preview-item';
import { MessageSquare, Search, Plus, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ForumIndexProps {
    threads: PaginatedResponse<ForumThread>;
    categories: string[];
    filters: {
        category?: string;
        search?: string;
    };
}

export default function Index({ threads, categories, filters }: ForumIndexProps) {
    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== filters.search) {
                router.get(route('forum.index'), { ...filters, search }, { preserveState: true, replace: true });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    return (
        <PublicLayout>
            <Head title="Forum Diskusi & Bantuan Teknis" />

            <div className="px-6 py-10 space-y-10">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="max-w-2xl space-y-4">
                        <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/10 mb-2">
                            <MessageSquare size={28} />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Community</h1>
                        <p className="text-white/40 text-lg">
                            Tempat berbagi ide, bertanya mengenai teknis, atau sekadar berdiskusi mengenai tren teknologi terbaru.
                        </p>
                    </div>
                    <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl h-12 px-8 font-bold shadow-lg shadow-indigo-600/20">
                        <Link href={route('forum.create')}>
                            <Plus size={18} className="mr-2" /> Buat Diskusi
                        </Link>
                    </Button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Filters */}
                    <div className="lg:col-span-1 space-y-8 order-2 lg:order-1">
                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-white/30 uppercase tracking-widest px-2">Kategori</h3>
                            <div className="flex flex-col gap-1">
                                <button 
                                    onClick={() => router.get(route('forum.index'), { ...filters, category: null })}
                                    className={cn(
                                        "w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all",
                                        !filters.category ? "bg-white/5 text-indigo-400 font-bold" : "text-white/40 hover:bg-white/5 hover:text-white"
                                    )}
                                >
                                    Semua Topik
                                </button>
                                {categories.map(cat => (
                                    <button 
                                        key={cat}
                                        onClick={() => router.get(route('forum.index'), { ...filters, category: cat })}
                                        className={cn(
                                            "w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all capitalize",
                                            filters.category === cat ? "bg-white/5 text-indigo-400 font-bold" : "text-white/40 hover:bg-white/5 hover:text-white"
                                        )}
                                    >
                                        {cat.replace('_', ' ')}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 rounded-[24px] bg-gradient-to-br from-indigo-600/20 to-violet-600/10 border border-indigo-500/20 space-y-4">
                            <TrendingUp className="text-indigo-400" size={24} />
                            <h4 className="font-bold text-white">Butuh Bantuan?</h4>
                            <p className="text-xs text-white/50 leading-relaxed">
                                Moderator kami siap membantu menjawab pertanyaan teknis Anda seputar layanan kami.
                            </p>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-6 order-1 lg:order-2">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
                            <Input 
                                placeholder="Cari judul diskusi..." 
                                className="pl-12 h-14 bg-white/5 border-white/5 rounded-2xl focus:border-indigo-500/50"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="space-y-4">
                            {threads.data.map(thread => (
                                <ForumPreviewItem key={thread.id} thread={thread} />
                            ))}

                            {threads.data.length === 0 && (
                                <div className="py-32 text-center rounded-[32px] border border-dashed border-white/5 bg-white/[0.01]">
                                    <MessageSquare size={48} className="mx-auto text-white/5 mb-4" />
                                    <p className="text-white/20 italic">Belum ada diskusi di kategori ini.</p>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {threads.meta.last_page > 1 && (
                            <div className="flex justify-center gap-2 pt-6">
                                {threads.links.prev && (
                                    <Button variant="ghost" asChild className="text-white/50 hover:text-white">
                                        <Link href={threads.links.prev}>Previous</Link>
                                    </Button>
                                )}
                                <div className="px-4 py-2 rounded-xl bg-white/5 text-white/30 text-xs font-bold flex items-center">
                                    {threads.meta.current_page} / {threads.meta.last_page}
                                </div>
                                {threads.links.next && (
                                    <Button variant="ghost" asChild className="text-white/50 hover:text-white">
                                        <Link href={threads.links.next}>Next</Link>
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
