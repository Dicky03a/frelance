import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from '@/components/ui/table';
import { Service } from '@/types/models';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Plus, Edit2, Trash2, Package } from 'lucide-react';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface ServicesIndexProps {
    services: Service[];
}

export default function Index({ services }: ServicesIndexProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        description: '',
        icon: '',
        is_active: true,
        sort_order: 0,
    });

    const openCreate = () => {
        setEditingService(null);
        reset();
        setIsDialogOpen(true);
    };

    const openEdit = (service: Service) => {
        setEditingService(service);
        setData({
            name: service.name,
            description: service.description,
            icon: service.icon || '',
            is_active: service.is_active,
            sort_order: service.sort_order,
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingService) {
            put(route('admin.services.update', editingService.id), {
                onSuccess: () => setIsDialogOpen(false),
            });
        } else {
            post(route('admin.services.store'), {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    reset();
                },
            });
        }
    };

    return (
        <AppLayout>
            <Head title="Manajemen Layanan" />
            
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Layanan</h1>
                        <p className="text-white/50">Kelola kategori layanan utama Anda.</p>
                    </div>
                    <Button onClick={openCreate} className="bg-indigo-600 hover:bg-indigo-700 rounded-xl">
                        <Plus className="mr-2 h-4 w-4" /> Tambah Layanan
                    </Button>
                </div>

                <div className="rounded-[20px] border border-white/7 bg-[#1c1c28] overflow-hidden">
                    <Table>
                        <TableHeader className="bg-white/5">
                            <TableRow className="border-white/7 hover:bg-transparent">
                                <TableHead className="text-white/50">NAMA LAYANAN</TableHead>
                                <TableHead className="text-white/50 text-center">PAKET</TableHead>
                                <TableHead className="text-white/50 text-center">STATUS</TableHead>
                                <TableHead className="text-right text-white/50">AKSI</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {services.map((service) => (
                                <TableRow key={service.id} className="border-white/7 hover:bg-white/5 transition-colors group">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                                <Package size={20} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-white">{service.name}</div>
                                                <div className="text-xs text-white/30 truncate max-w-xs">{service.description}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Button variant="link" asChild className="text-indigo-400 font-bold p-0">
                                            <Link href={route('admin.services.packages.index', service.id)}>
                                                {service.packages_count || 0} Paket
                                            </Link>
                                        </Button>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span className={cn(
                                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border",
                                            service.is_active 
                                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                                                : "bg-white/5 text-white/30 border-white/10"
                                        )}>
                                            {service.is_active ? 'AKTIF' : 'NONAKTIF'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => openEdit(service)} className="text-white/30 hover:text-indigo-400">
                                                <Edit2 size={16} />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                onClick={() => {
                                                    if(confirm('Hapus layanan ini?')) router.delete(route('admin.services.destroy', service.id))
                                                }} 
                                                className="text-white/30 hover:text-rose-400"
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {services.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-32 text-center text-white/30 italic">
                                        Belum ada data layanan
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-[#1c1c28] border-white/10 text-white max-w-md rounded-[20px]">
                    <DialogHeader>
                        <DialogTitle>{editingService ? 'Edit Layanan' : 'Tambah Layanan Baru'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Nama Layanan</Label>
                            <Input 
                                value={data.name} 
                                onChange={e => setData('name', e.target.value)}
                                className="bg-white/5 border-white/10 rounded-xl"
                            />
                            {errors.name && <p className="text-xs text-rose-500">{errors.name}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Deskripsi</Label>
                            <textarea 
                                value={data.description} 
                                onChange={e => setData('description', e.target.value)}
                                rows={3}
                                className="w-full bg-white/5 border border-white/10 rounded-xl text-white px-3 py-2"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Lucide Icon</Label>
                                <Input 
                                    value={data.icon} 
                                    onChange={e => setData('icon', e.target.value)}
                                    className="bg-white/5 border-white/10 rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Urutan</Label>
                                <Input 
                                    type="number"
                                    value={data.sort_order} 
                                    onChange={e => setData('sort_order', parseInt(e.target.value))}
                                    className="bg-white/5 border-white/10 rounded-xl"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                            <input 
                                type="checkbox" 
                                checked={data.is_active} 
                                onChange={e => setData('is_active', e.target.checked)}
                                className="rounded bg-white/5 border-white/10 text-indigo-600"
                            />
                            <Label>Aktif</Label>
                        </div>
                        <div className="pt-4 flex gap-3">
                            <Button type="submit" disabled={processing} className="flex-1 bg-indigo-600 rounded-xl">Simpan</Button>
                            <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="flex-1 text-white/50">Batal</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
