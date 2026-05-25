import PublicLayout from '@/layouts/public-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
    MessageSquare, 
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

            <div className="px-6 py-10 max-w-3xl mx-auto space-y-8">
                <Link 
                    href={route('forum.index')} 
                    className="inline-flex items-center gap-2 text-sm font-bold text-white/30 hover:text-white transition-colors group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> BACK TO FORUM
                </Link>

                <div className="space-y-2">
                    <h1 className="text-3xl font-black text-white leading-tight">Mulai Diskusi Baru</h1>
                    <p className="text-white/40">Bagikan pertanyaan atau ide Anda kepada komunitas.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4 rounded-[32px] border border-white/10 bg-[#1c1c28] p-8">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-white/30 uppercase tracking-widest px-1">Judul Diskusi</label>
                            <Input 
                                value={data.title}
                                onChange={e => setData('title', e.target.value)}
                                placeholder="Apa yang ingin Anda diskusikan?"
                                className={cn(
                                    "h-14 bg-white/5 border-white/10 rounded-2xl focus:border-indigo-500/50",
                                    errors.title && "border-rose-500/50 focus:border-rose-500/50"
                                )}
                            />
                            {errors.title && <p className="text-xs text-rose-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.title}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-white/30 uppercase tracking-widest px-1">Kategori</label>
                            <div className="flex flex-wrap gap-2">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setData('category', cat)}
                                        className={cn(
                                            "px-4 py-2 rounded-xl text-sm font-bold transition-all border capitalize",
                                            data.category === cat 
                                                ? "bg-indigo-500/20 border-indigo-500 text-indigo-400" 
                                                : "bg-white/5 border-white/5 text-white/40 hover:border-white/10 hover:text-white"
                                        )}
                                    >
                                        {cat.replace('_', ' ')}
                                    </button>
                                ))}
                            </div>
                            {errors.category && <p className="text-xs text-rose-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.category}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-white/30 uppercase tracking-widest px-1">Isi Diskusi</label>
                            <textarea 
                                rows={8}
                                value={data.body}
                                onChange={e => setData('body', e.target.value)}
                                placeholder="Jelaskan lebih detail mengenai topik yang ingin Anda bahas..."
                                className={cn(
                                    "w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 min-h-[200px]",
                                    errors.body && "border-rose-500/50 focus:ring-rose-500/20"
                                )}
                            />
                            {errors.body && <p className="text-xs text-rose-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.body}</p>}
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button 
                            type="button" 
                            variant="ghost" 
                            asChild 
                            className="rounded-2xl h-12 px-8 font-bold text-white/40"
                        >
                            <Link href={route('forum.index')}>Batal</Link>
                        </Button>
                        <Button 
                            disabled={processing} 
                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl h-12 px-8 font-bold shadow-lg shadow-indigo-600/20"
                        >
                            <Send size={18} className="mr-2" /> Publikasikan
                        </Button>
                    </div>
                </form>
            </div>
        </PublicLayout>
    );
}
