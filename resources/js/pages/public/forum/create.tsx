import PublicLayout from '@/layouts/public-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
    ArrowLeft, 
    Send,
    AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ForumCreateProps {
    categories: string[];
}

export default function Create({ categories }: ForumCreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        category: '',
        body: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('forum.threads.store'));
    };

    return (
        <PublicLayout>
            <Head title="Buat Diskusi Baru" />

            <div className="px-12 py-16 max-w-4xl mx-auto space-y-12">
                <Link 
                    href={route('forum.index')} 
                    className="inline-flex items-center gap-2 text-sm font-medium text-cursor-muted hover:text-cursor-ink transition-colors mb-8 group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> BACK TO FORUM
                </Link>

                <header className="space-y-4">
                    <h1 className="text-[36px] md:text-[48px] font-normal text-cursor-ink leading-[1.1] tracking-[-1.5px]">Mulai Diskusi Baru</h1>
                    <p className="text-cursor-body text-lg font-normal">Bagikan pertanyaan atau ide Anda kepada komunitas.</p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="space-y-10 rounded-xl border border-cursor-hairline bg-cursor-surface-card p-10 md:p-12">
                        <div className="space-y-3">
                            <label className="text-[11px] font-semibold text-cursor-muted uppercase tracking-[0.88px] ml-1">Judul Diskusi</label>
                            <Input 
                                value={data.title}
                                onChange={e => setData('title', e.target.value)}
                                placeholder="Apa yang ingin Anda diskusikan?"
                                className={cn(
                                    "h-14 bg-cursor-canvas-soft border-cursor-hairline rounded-cursor-md focus:border-cursor-hairline-strong text-cursor-ink placeholder:text-cursor-muted/40 transition-colors",
                                    errors.title && "border-destructive focus:border-destructive"
                                )}
                            />
                            {errors.title && <p className="text-xs text-destructive mt-2 ml-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.title}</p>}
                        </div>

                        <div className="space-y-4">
                            <label className="text-[11px] font-semibold text-cursor-muted uppercase tracking-[0.88px] ml-1">Kategori</label>
                            <div className="flex flex-wrap gap-3">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setData('category', cat)}
                                        className={cn(
                                            "px-6 py-2 rounded-cursor-md text-sm font-medium transition-all border capitalize",
                                            data.category === cat 
                                                ? "bg-cursor-ink border-cursor-ink text-white" 
                                                : "bg-cursor-surface-card border-cursor-hairline text-cursor-muted hover:border-cursor-hairline-strong hover:text-cursor-ink"
                                        )}
                                    >
                                        {cat.replace('_', ' ')}
                                    </button>
                                ))}
                            </div>
                            {errors.category && <p className="text-xs text-destructive mt-2 ml-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.category}</p>}
                        </div>

                        <div className="space-y-3">
                            <label className="text-[11px] font-semibold text-cursor-muted uppercase tracking-[0.88px] ml-1">Isi Diskusi</label>
                            <textarea 
                                rows={10}
                                value={data.body}
                                onChange={e => setData('body', e.target.value)}
                                placeholder="Jelaskan lebih detail mengenai topik yang ingin Anda bahas..."
                                className={cn(
                                    "w-full bg-cursor-canvas-soft border border-cursor-hairline rounded-cursor-md p-6 text-cursor-ink placeholder:text-cursor-muted/40 focus:outline-none focus:border-cursor-hairline-strong min-h-[250px] transition-colors resize-none",
                                    errors.body && "border-destructive"
                                )}
                            />
                            {errors.body && <p className="text-xs text-destructive mt-2 ml-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.body}</p>}
                        </div>
                    </div>

                    <div className="flex justify-end gap-6">
                        <Button 
                            type="button" 
                            variant="ghost" 
                            asChild 
                            className="rounded-cursor-md h-12 px-10 font-medium text-cursor-muted hover:text-cursor-ink hover:bg-cursor-hairline-soft"
                        >
                            <Link href={route('forum.index')}>Batal</Link>
                        </Button>
                        <Button 
                            disabled={processing} 
                            className="bg-cursor-primary hover:bg-cursor-primary-active text-white rounded-cursor-md h-12 px-10 font-medium border-none shadow-none transition-all"
                        >
                            Publikasikan
                        </Button>
                    </div>
                </form>
            </div>
        </PublicLayout>
    );
}
