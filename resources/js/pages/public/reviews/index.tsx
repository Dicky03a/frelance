import PublicLayout from '@/layouts/public-layout';
import { Head } from '@inertiajs/react';
import { Rating } from '@/types/models';
import { PaginatedResponse } from '@/types/pagination';
import { Star } from 'lucide-react';

export default function Index({ reviews }: { reviews: PaginatedResponse<Rating> }) {
    return (
        <PublicLayout>
            <Head title="Ulasan Klien - DevPorto" />
            <div className="px-12 py-16 space-y-16">
                <header className="max-w-3xl space-y-6">
                    <h1 className="text-[48px] md:text-[56px] font-normal text-cursor-ink leading-[1.1] tracking-[-1.5px]">Klien Berbicara</h1>
                    <p className="text-cursor-body text-[20px] font-normal leading-relaxed">Apa yang dikatakan mereka yang telah bekerja sama dengan saya.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {reviews.data.map((review) => (
                        <div key={review.id} className="rounded-cursor-lg border border-cursor-hairline bg-cursor-surface-card p-10 space-y-8 relative transition-all hover:border-cursor-hairline-strong">
                            <div className="flex gap-1 text-cursor-primary">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Star key={i} size={14} fill={i <= review.score ? "currentColor" : "none"} className={i > review.score ? "text-cursor-hairline" : ""} />
                                ))}
                            </div>
                            <p className="text-cursor-body text-base leading-relaxed font-normal italic">"{review.review}"</p>
                            <div className="pt-8 border-t border-cursor-hairline flex items-center gap-4">
                                
                                <div>
                                    <div className="font-semibold text-cursor-ink text-sm">{review.user?.name || review.manual_client_name}</div>
                                    <div className="text-[11px] text-cursor-muted uppercase font-semibold tracking-[0.88px] mt-0.5">
                                        {review.order?.service_package?.service?.name || review.manual_project_name || 'General Feedback'}
                                    </div>
                                    {review.project && (
                                        <div className="text-[10px] text-cursor-primary font-medium mt-1">
                                            Proyek: {review.project.title}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </PublicLayout>
    );
}
