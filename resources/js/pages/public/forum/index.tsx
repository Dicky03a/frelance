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

import { useTranslation } from '@/lib/i18n';

interface ForumIndexProps {
    threads: PaginatedResponse<ForumThread>;
    categories: string[];
    filters: {
        category?: string;
        search?: string;
    };
}

export default function Index({ threads, categories, filters }: ForumIndexProps) {
    const { t } = useTranslation('forum');
    const { t: tCommon } = useTranslation('common');
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
            <Head title={`${t('title')} - DevPorto`} />

            <div className="px-12 py-16 space-y-16">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-cursor-hairline pb-12">
                    <div className="max-w-2xl space-y-6">
                        <h1 className="text-[48px] md:text-[56px] font-normal text-cursor-ink leading-[1.1] tracking-[-1.5px]">{t('title_main')}</h1>
                        <p className="text-cursor-body text-[20px] font-normal leading-relaxed">
                            {t('subtitle_main')}
                        </p>
                    </div>
                    <Button asChild className="bg-cursor-primary hover:bg-cursor-primary-active text-white rounded-cursor-md h-12 px-10 font-medium border-none shadow-none transition-all">
                        <Link href={route('forum.create')}>
                            {t('new_thread_btn')}
                        </Link>
                    </Button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
                    {/* Sidebar Filters */}
                    <div className="lg:col-span-1 space-y-10 order-2 lg:order-1">
                        <div className="space-y-6">
                            <h3 className="text-[11px] font-semibold text-cursor-muted uppercase tracking-[0.88px] px-4">{t('categories')}</h3>
                            <div className="flex flex-col gap-1">
                                <button 
                                    onClick={() => router.get(route('forum.index'), { ...filters, category: null })}
                                    className={cn(
                                        "w-full text-left px-4 py-2.5 rounded-cursor-md text-sm font-medium transition-all",
                                        !filters.category ? "bg-cursor-surface-strong text-cursor-ink" : "text-cursor-muted hover:bg-cursor-hairline-soft hover:text-cursor-ink"
                                    )}
                                >
                                    {t('all_topics')}
                                </button>
                                {categories.map(cat => (
                                    <button 
                                        key={cat}
                                        onClick={() => router.get(route('forum.index'), { ...filters, category: cat })}
                                        className={cn(
                                            "w-full text-left px-4 py-2.5 rounded-cursor-md text-sm font-medium transition-all capitalize",
                                            filters.category === cat ? "bg-cursor-surface-strong text-cursor-ink" : "text-cursor-muted hover:bg-cursor-hairline-soft hover:text-cursor-ink"
                                        )}
                                    >
                                        {cat.replace('_', ' ')}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-8 rounded-cursor-lg border border-cursor-hairline bg-cursor-canvas-soft space-y-6">
                            <h4 className="text-[18px] font-normal text-cursor-ink tracking-[-0.11px]">{t('need_help')}</h4>
                            <p className="text-sm text-cursor-body leading-relaxed font-normal">
                                {t('need_help_desc')}
                            </p>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-10 order-1 lg:order-2">
                        <div className="relative">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-cursor-muted" size={18} />
                            <Input 
                                placeholder={t('search_threads')} 
                                className="pl-14 h-[56px] bg-cursor-surface-card border-cursor-hairline rounded-cursor-md focus:border-cursor-hairline-strong transition-colors text-cursor-ink placeholder:text-cursor-muted/40"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="divide-y divide-cursor-hairline">
                            {threads.data.map(thread => (
                                <ForumPreviewItem key={thread.id} thread={thread} />
                            ))}

                            {threads.data.length === 0 && (
                                <div className="py-32 text-center rounded-cursor-lg border border-dashed border-cursor-hairline bg-cursor-canvas-soft">
                                    <p className="text-cursor-muted italic font-normal">{t('no_threads')}</p>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {threads.meta.last_page > 1 && (
                            <div className="flex justify-center gap-4 pt-10 border-t border-cursor-hairline">
                                {threads.links.prev && (
                                    <Button variant="ghost" asChild className="h-10 rounded-cursor-md font-medium text-cursor-muted hover:text-cursor-ink hover:bg-cursor-hairline-soft">
                                        <Link href={threads.links.prev}>{tCommon('previous')}</Link>
                                    </Button>
                                )}
                                <div className="px-6 py-2 rounded-cursor-md bg-cursor-surface-strong text-cursor-ink text-sm font-medium flex items-center">
                                    {threads.meta.current_page} / {threads.meta.last_page}
                                </div>
                                {threads.links.next && (
                                    <Button variant="ghost" asChild className="h-10 rounded-cursor-md font-medium text-cursor-muted hover:text-cursor-ink hover:bg-cursor-hairline-soft">
                                        <Link href={threads.links.next}>{tCommon('next')}</Link>
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
