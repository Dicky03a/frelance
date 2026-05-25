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
import { Rating } from '@/types/models';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select';
import { User, Order } from '@/types/models';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Search, Trash2, Eye, EyeOff, Star, Plus, AlertCircle, Layers } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import axios from 'axios';

interface ReviewsIndexProps {
    reviews: PaginatedResponse<Rating>;
    users: User[];
    projects: Project[];
    filters: {
        search?: string;
        score?: string;
    };
}

export default function Index({ reviews, users, projects, filters }: ReviewsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [userOrders, setUserOrders] = useState<Order[]>([]);

    const { data, setData, post, processing, errors, reset } = useForm({
        is_manual: false,
        user_id: '',
        order_id: '',
        project_id: '',
        manual_client_name: '',
        manual_project_name: '',
        score: '5',
        review: '',
        is_visible: true,
    });

    useEffect(() => {
        if (!data.is_manual && data.user_id) {
            axios.get(route('admin.reviews.user-orders', data.user_id))
                .then(res => setUserOrders(res.data))
                .catch(() => setUserOrders([]));
        } else {
            setUserOrders([]);
        }
    }, [data.user_id, data.is_manual]);

    const handleToggleVisibility = (id: number, current: boolean) => {
        router.patch(route('admin.reviews.update', id), {
            is_visible: !current
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Hapus ulasan ini secara permanen?')) {
            router.delete(route('admin.reviews.destroy', id));
        }
    };

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.reviews.store'), {
            onSuccess: () => {
                setIsCreateOpen(false);
                reset();
            }
        });
    };

    return (
        <AppLayout>
            <Head title="Manajemen Ulasan" />
            
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Ulasan Klien</h1>
                        <p className="text-white/50">Kelola ulasan dan rating dari klien.</p>
                    </div>
                    <Button onClick={() => setIsCreateOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 rounded-xl">
                        <Plus size={18} className="mr-2" /> Tambah Ulasan
                    </Button>
                </div>

                <div className="rounded-[20px] border border-white/7 bg-[#1c1c28] p-6">
                    <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative flex-1 max-w-md w-full">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                            <Input 
                                placeholder="Cari nama klien atau isi ulasan..." 
                                className="pl-10 bg-white/5 border-white/10 rounded-xl"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 w-full md:w-auto">
                            {[null, '5', '4', '3', '2', '1'].map((score) => (
                                <button
                                    key={score || 'all'}
                                    onClick={() => router.get(route('admin.reviews.index'), { ...filters, score: score })}
                                    className={cn(
                                        "px-4 py-2 rounded-xl text-xs font-bold border transition-all whitespace-nowrap",
                                        (filters.score === score || (!filters.score && score === null))
                                            ? "bg-indigo-600 border-indigo-500 text-white"
                                            : "bg-white/5 border-white/5 text-white/40 hover:border-white/10"
                                    )}
                                >
                                    {score ? `${score} Stars` : 'Semua Rating'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-white/7">
                        <Table>
                            <TableHeader className="bg-white/5">
                                <TableRow className="border-white/7 hover:bg-transparent">
                                    <TableHead className="text-white/50">KLIEN & LAYANAN</TableHead>
                                    <TableHead className="text-white/50">RATING</TableHead>
                                    <TableHead className="text-white/50 w-1/3">ULASAN</TableHead>
                                    <TableHead className="text-white/50 text-center">STATUS</TableHead>
                                    <TableHead className="text-right text-white/50">AKSI</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reviews.data.map((review) => (
                                    <TableRow key={review.id} className="border-white/7 hover:bg-white/5 transition-colors group">
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <div className="font-bold text-white">
                                                    {review.user?.name || review.manual_client_name}
                                                </div>
                                                <div className="text-[10px] text-indigo-400/70 uppercase font-bold tracking-widest truncate max-w-[200px]">
                                                    {review.order?.service_package?.service?.name || review.manual_project_name}
                                                </div>
                                                {review.project && (
                                                    <div className="text-[9px] text-white/20 mt-0.5 italic flex items-center gap-1">
                                                        <Layers size={8} /> Linked to: {review.project.title}
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-0.5 text-amber-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star 
                                                        key={i} 
                                                        size={14} 
                                                        fill={i < review.score ? "currentColor" : "none"} 
                                                        className={i < review.score ? "" : "text-white/10"}
                                                    />
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm text-white/70 italic line-clamp-2">
                                                "{review.review || 'Tanpa ulasan teks'}"
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge 
                                                variant="outline" 
                                                className={cn(
                                                    "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                                                    review.is_visible 
                                                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                                                        : "bg-white/5 text-white/30 border-white/10"
                                                )}
                                            >
                                                {review.is_visible ? 'Visible' : 'Hidden'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    onClick={() => handleToggleVisibility(review.id, review.is_visible)}
                                                    className="text-white/30 hover:text-indigo-400"
                                                    title={review.is_visible ? 'Sembunyikan' : 'Tampilkan'}
                                                >
                                                    {review.is_visible ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    onClick={() => handleDelete(review.id)} 
                                                    className="text-white/30 hover:text-rose-400"
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {reviews.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-32 text-center text-white/30 italic">
                                            Belum ada ulasan klien.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {reviews.meta.last_page > 1 && (
                        <div className="mt-6 flex items-center justify-between">
                            <div className="text-sm text-white/30">
                                Halaman {reviews.meta.current_page} dari {reviews.meta.last_page}
                            </div>
                            <div className="flex gap-2">
                                {reviews.links.prev && (
                                    <Button variant="outline" size="sm" asChild className="border-white/10 bg-white/5 text-white">
                                        <Link href={reviews.links.prev}>Prev</Link>
                                    </Button>
                                )}
                                {reviews.links.next && (
                                    <Button variant="outline" size="sm" asChild className="border-white/10 bg-white/5 text-white">
                                        <Link href={reviews.links.next}>Next</Link>
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Dialog open={isCreateOpen} onOpenChange={(val) => {
                setIsCreateOpen(val);
                if(!val) reset();
            }}>
                <DialogContent className="bg-[#1c1c28] border-white/10 text-white max-w-lg rounded-[24px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Tambah Ulasan Baru</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateSubmit} className="space-y-5 py-4">
                        <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5">
                            <button
                                type="button"
                                onClick={() => setData('is_manual', !data.is_manual)}
                                className={cn(
                                    "w-10 h-6 rounded-full relative transition-colors",
                                    data.is_manual ? "bg-amber-600" : "bg-white/10"
                                )}
                            >
                                <div className={cn(
                                    "absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform",
                                    data.is_manual ? "translate-x-4" : "translate-x-0"
                                )} />
                            </button>
                            <div>
                                <Label className="text-sm font-bold cursor-pointer" onClick={() => setData('is_manual', !data.is_manual)}>
                                    Input Manual (Bypass Database User)
                                </Label>
                                <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Aktifkan untuk mengisi nama klien secara manual</p>
                            </div>
                        </div>

                        {!data.is_manual ? (
                            <>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-white/40">Klien</Label>
                                    <Select 
                                        value={data.user_id} 
                                        onValueChange={(val) => setData('user_id', val)}
                                    >
                                        <SelectTrigger className="bg-white/5 border-white/10 rounded-xl h-12">
                                            <SelectValue placeholder="Pilih Klien" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#1c1c28] border-white/10 text-white">
                                            {users.map(u => (
                                                <SelectItem key={u.id} value={u.id.toString()}>{u.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.user_id && <p className="text-xs text-rose-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.user_id}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-white/40">Pesanan (Completed)</Label>
                                    <Select 
                                        value={data.order_id} 
                                        onValueChange={(val) => setData('order_id', val)}
                                        disabled={!data.user_id || userOrders.length === 0}
                                    >
                                        <SelectTrigger className="bg-white/5 border-white/10 rounded-xl h-12">
                                            <SelectValue placeholder={data.user_id ? (userOrders.length > 0 ? "Pilih Pesanan" : "Tidak ada pesanan selesai") : "Pilih Klien terlebih dahulu"} />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#1c1c28] border-white/10 text-white">
                                            {userOrders.map(o => (
                                                <SelectItem key={o.id} value={o.id.toString()}>
                                                    {o.order_code} - {o.service_package?.service?.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.order_id && <p className="text-xs text-rose-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.order_id}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-white/40">Hubungkan ke Portfolio (Opsional)</Label>
                                    <Select 
                                        value={data.project_id} 
                                        onValueChange={(val) => setData('project_id', val === 'none' ? '' : val)}
                                    >
                                        <SelectTrigger className="bg-white/5 border-white/10 rounded-xl h-12">
                                            <SelectValue placeholder="Pilih Proyek Portfolio" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#1c1c28] border-white/10 text-white">
                                            <SelectItem value="none">Tidak dihubungkan</SelectItem>
                                            {projects.map(p => (
                                                <SelectItem key={p.id} value={p.id.toString()}>{p.title}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-white/40">Nama Klien</Label>
                                    <Input 
                                        value={data.manual_client_name}
                                        onChange={e => setData('manual_client_name', e.target.value)}
                                        placeholder="Contoh: John Doe"
                                        className="bg-white/5 border-white/10 h-12 rounded-xl"
                                    />
                                    {errors.manual_client_name && <p className="text-xs text-rose-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.manual_client_name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-white/40">Nama Proyek / Layanan</Label>
                                    <Input 
                                        value={data.manual_project_name}
                                        onChange={e => setData('manual_project_name', e.target.value)}
                                        placeholder="Contoh: E-Commerce Website"
                                        className="bg-white/5 border-white/10 h-12 rounded-xl"
                                    />
                                    {errors.manual_project_name && <p className="text-xs text-rose-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.manual_project_name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-white/40">Hubungkan ke Portfolio (Opsional)</Label>
                                    <Select 
                                        value={data.project_id} 
                                        onValueChange={(val) => setData('project_id', val === 'none' ? '' : val)}
                                    >
                                        <SelectTrigger className="bg-white/5 border-white/10 rounded-xl h-12">
                                            <SelectValue placeholder="Pilih Proyek Portfolio" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#1c1c28] border-white/10 text-white">
                                            <SelectItem value="none">Tidak dihubungkan</SelectItem>
                                            {projects.map(p => (
                                                <SelectItem key={p.id} value={p.id.toString()}>{p.title}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </>
                        )}

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-white/40">Rating Bintang</Label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setData('score', star.toString())}
                                        className={cn(
                                            "h-10 w-10 rounded-xl flex items-center justify-center transition-all border",
                                            parseInt(data.score) >= star 
                                                ? "bg-amber-500/10 border-amber-500/30 text-amber-500" 
                                                : "bg-white/5 border-white/5 text-white/20"
                                        )}
                                    >
                                        <Star size={18} fill={parseInt(data.score) >= star ? "currentColor" : "none"} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-white/40">Isi Ulasan</Label>
                            <textarea 
                                value={data.review} 
                                onChange={e => setData('review', e.target.value)}
                                rows={4}
                                placeholder="Tuliskan ulasan klien di sini..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                            />
                            {errors.review && <p className="text-xs text-rose-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.review}</p>}
                        </div>

                        <div className="flex items-center gap-3 py-2">
                            <button
                                type="button"
                                onClick={() => setData('is_visible', !data.is_visible)}
                                className={cn(
                                    "w-10 h-6 rounded-full relative transition-colors",
                                    data.is_visible ? "bg-indigo-600" : "bg-white/10"
                                )}
                            >
                                <div className={cn(
                                    "absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform",
                                    data.is_visible ? "translate-x-4" : "translate-x-0"
                                )} />
                            </button>
                            <Label className="text-sm font-medium cursor-pointer" onClick={() => setData('is_visible', !data.is_visible)}>
                                Tampilkan secara publik
                            </Label>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <Button 
                                type="submit" 
                                disabled={processing} 
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700 h-12 rounded-xl font-bold"
                            >
                                Simpan Ulasan
                            </Button>
                            <Button 
                                type="button" 
                                variant="ghost" 
                                onClick={() => setIsCreateOpen(false)} 
                                className="flex-1 text-white/50 h-12 rounded-xl"
                            >
                                Batal
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
