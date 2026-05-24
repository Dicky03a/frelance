import PublicLayout from '@/layouts/public-layout';
import { Head } from '@inertiajs/react';
import { Rating } from '@/types/models';
import { PaginatedResponse } from '@/types/pagination';
import { Star, Quote } from 'lucide-react';

export default function Index({ reviews }: { reviews: PaginatedResponse<Rating> }) {
    return (
        <PublicLayout>
            <Head title="Ulasan Klien - DevPorto" />
            <div className="px-6 py-10 space-y-12">
                <header className="max-w-3xl space-y-4">
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Klien Berbicara</h1>
                    <p className="text-white/40 text-lg">Apa yang dikatakan mereka yang telah bekerja sama dengan saya.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reviews.data.map((review) => (
                        <div key={review.id} className="rounded-[32px] border border-white/5 bg-[#1c1c28] p-8 space-y-6 relative group">
                            <Quote className="absolute top-6 right-8 text-white/5 group-hover:text-indigo-500/10 transition-colors" size={64} />
                            <div className="flex gap-1 text-amber-400">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Star key={i} size={16} fill={i <= review.score ? "currentColor" : "none"} className={i > review.score ? "text-white/10" : ""} />
                                ))}
                            </div>
                            <p className="text-white/70 leading-relaxed italic">"{review.review}"</p>
                            <div className="pt-6 border-t border-white/5 flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center font-bold text-white/30">
                                    {review.user?.name[0]}
                                </div>
                                <div>
                                    <div className="font-bold text-white">{review.user?.name}</div>
                                    <div className="text-[10px] text-white/20 uppercase font-bold tracking-widest">
                                        {review.order?.service_package?.service?.name}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </PublicLayout>
    );
}
