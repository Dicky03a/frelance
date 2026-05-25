import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { cn } from '@/lib/utils';

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
            
            <div className="space-y-8 p-10">
                <div className="flex items-center justify-between border-b border-border pb-8">
                    <div>
                        <h1 className="text-[36px] font-normal tracking-[-0.72px] text-foreground">Layanan</h1>
                        <p className="text-muted-foreground mt-2 font-normal">Kelola kategori layanan utama Anda.</p>
                    </div>
                    <Button onClick={openCreate} className="bg-primary hover:bg-primary/90 rounded-md h-11 px-8 font-medium border-none shadow-none">
                        Tambah Layanan
                    </Button>
                </div>

                <div className="rounded-xl border border-border bg-card overflow-hidden transition-all">
                    <Table>
                        <TableHeader className="bg-accent/50">
                            <TableRow className="border-border hover:bg-transparent">
                                <TableHead className="text-muted-foreground font-semibold uppercase tracking-[0.88px] text-[10px] h-14 pl-8">NAMA LAYANAN</TableHead>
                                <TableHead className="text-muted-foreground font-semibold uppercase tracking-[0.88px] text-[10px] h-14 text-center">PAKET</TableHead>
                                <TableHead className="text-muted-foreground font-semibold uppercase tracking-[0.88px] text-[10px] h-14 text-center">STATUS</TableHead>
                                <TableHead className="text-right text-muted-foreground font-semibold uppercase tracking-[0.88px] text-[10px] h-14 pr-8">AKSI</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {services.map((service) => (
                                <TableRow key={service.id} className="border-border hover:bg-accent/30 transition-colors group">
                                    <TableCell className="py-5 pl-8">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-md bg-accent border border-border flex items-center justify-center text-primary">
                                                <Package size={20} />
                                            </div>
                                            <div>
                                                <div className="font-medium text-foreground">{service.name}</div>
                                                <div className="text-xs text-muted-foreground truncate max-w-xs">{service.description}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Button variant="link" asChild className="text-primary font-medium p-0 hover:opacity-80 transition-opacity">
                                            <Link href={route('admin.services.packages.index', service.id)}>
                                                {service.packages_count || 0} Paket
                                            </Link>
                                        </Button>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline" className={cn(
                                            "rounded-cursor-pill h-6 px-3 border-none",
                                            service.is_active 
                                                ? "bg-emerald-100 text-emerald-700" 
                                                : "bg-muted text-muted-foreground"
                                        )}>
                                            {service.is_active ? 'AKTIF' : 'NONAKTIF'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right pr-8">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => openEdit(service)} className="text-muted-foreground hover:text-primary transition-colors h-9 w-9">
                                                <Edit2 size={18} />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                onClick={() => {
                                                    if(confirm('Hapus layanan ini?')) router.delete(route('admin.services.destroy', service.id))
                                                }} 
                                                className="text-muted-foreground hover:text-destructive transition-colors h-9 w-9"
                                            >
                                                <Trash2 size={18} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-card border-border text-foreground max-w-md rounded-xl p-0 overflow-hidden shadow-2xl">
                    <div className="p-10 space-y-8">
                        <DialogHeader>
                            <DialogTitle className="text-[26px] font-normal tracking-[-0.325px]">{editingService ? 'Edit Layanan' : 'Tambah Layanan Baru'}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.88px] ml-1">Nama Layanan</Label>
                                <Input 
                                    value={data.name} 
                                    onChange={e => setData('name', e.target.value)}
                                    className="bg-accent border-border rounded-md h-12 px-4 focus:border-muted-foreground/30 transition-colors"
                                />
                                {errors.name && <p className="text-xs text-destructive mt-2 ml-1">{errors.name}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.88px] ml-1">Deskripsi</Label>
                                <textarea 
                                    value={data.description} 
                                    onChange={e => setData('description', e.target.value)}
                                    rows={3}
                                    className="w-full bg-accent border border-border rounded-md text-foreground px-4 py-3 focus:outline-none focus:border-muted-foreground/30 transition-colors resize-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.88px] ml-1">Lucide Icon</Label>
                                    <Input 
                                        value={data.icon} 
                                        onChange={e => setData('icon', e.target.value)}
                                        className="bg-accent border-border rounded-md h-12 px-4 focus:border-muted-foreground/30 transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.88px] ml-1">Urutan</Label>
                                    <Input 
                                        type="number"
                                        value={data.sort_order} 
                                        onChange={e => setData('sort_order', parseInt(e.target.value))}
                                        className="bg-accent border-border rounded-md h-12 px-4 focus:border-muted-foreground/30 transition-colors"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-3 pt-2">
                                <input 
                                    type="checkbox" 
                                    checked={data.is_active} 
                                    onChange={e => setData('is_active', e.target.checked)}
                                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
                                />
                                <Label className="text-sm font-medium text-foreground cursor-pointer">Aktif</Label>
                            </div>
                            <div className="pt-6 flex gap-4">
                                <Button type="submit" disabled={processing} className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-md h-12 font-medium border-none shadow-none">Simpan</Button>
                                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="flex-1 text-muted-foreground font-medium hover:text-foreground hover:bg-muted">Batal</Button>
                            </div>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
