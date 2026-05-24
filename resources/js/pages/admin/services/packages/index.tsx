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
import { Service, ServicePackage } from '@/types/models';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Plus, Edit2, Trash2, ArrowLeft, Check } from 'lucide-react';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';

interface PackagesIndexProps {
    service: Service;
    packages: ServicePackage[];
}

export default function Index({ service, packages }: PackagesIndexProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingPackage, setEditingPackage] = useState<ServicePackage | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        description: '',
        price_idr: 0,
        price_usd: 0,
        features: [] as string[],
        is_popular: false,
        is_active: true,
        sort_order: 0,
    });

    const [featureInput, setFeatureInput] = useState('');

    const openCreate = () => {
        setEditingPackage(null);
        reset();
        setIsDialogOpen(true);
    };

    const openEdit = (pkg: ServicePackage) => {
        setEditingPackage(pkg);
        setData({
            name: pkg.name,
            description: pkg.description || '',
            price_idr: pkg.price_idr,
            price_usd: pkg.price_usd,
            features: pkg.features,
            is_popular: pkg.is_popular,
            is_active: pkg.is_active,
            sort_order: pkg.sort_order,
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingPackage) {
            put(route('admin.packages.update', editingPackage.id), {
                onSuccess: () => setIsDialogOpen(false),
            });
        } else {
            post(route('admin.services.packages.store', service.id), {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    reset();
                },
            });
        }
    };

    return (
        <AppLayout>
            <Head title={`Paket Layanan: ${service.name}`} />
            
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild className="text-white/50 hover:text-white">
                            <Link href={route('admin.services.index')}><ArrowLeft size={20} /></Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Paket: {service.name}</h1>
                            <p className="text-white/50">Kelola paket harga untuk layanan ini.</p>
                        </div>
                    </div>
                    <Button onClick={openCreate} className="bg-indigo-600 hover:bg-indigo-700 rounded-xl">
                        <Plus className="mr-2 h-4 w-4" /> Tambah Paket
                    </Button>
                </div>

                <div className="rounded-[20px] border border-white/7 bg-[#1c1c28] overflow-hidden">
                    <Table>
                        <TableHeader className="bg-white/5">
                            <TableRow className="border-white/7 hover:bg-transparent">
                                <TableHead className="text-white/50">NAMA PAKET</TableHead>
                                <TableHead className="text-white/50">HARGA (IDR)</TableHead>
                                <TableHead className="text-white/50">HARGA (USD)</TableHead>
                                <TableHead className="text-white/50 text-center">STATUS</TableHead>
                                <TableHead className="text-right text-white/50">AKSI</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {packages.map((pkg) => (
                                <TableRow key={pkg.id} className="border-white/7 hover:bg-white/5 transition-colors group">
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="font-bold text-white">{pkg.name}</div>
                                            {pkg.is_popular && (
                                                <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[10px]">POPULER</Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-white/70 font-mono">Rp {pkg.price_idr.toLocaleString('id-ID')}</TableCell>
                                    <TableCell className="text-white/70 font-mono">${pkg.price_usd}</TableCell>
                                    <TableCell className="text-center">
                                        <span className={cn(
                                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border",
                                            pkg.is_active 
                                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                                                : "bg-white/5 text-white/30 border-white/10"
                                        )}>
                                            {pkg.is_active ? 'AKTIF' : 'NONAKTIF'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => openEdit(pkg)} className="text-white/30 hover:text-indigo-400">
                                                <Edit2 size={16} />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                onClick={() => {
                                                    if(confirm('Hapus paket ini?')) router.delete(route('admin.packages.destroy', pkg.id))
                                                }} 
                                                className="text-white/30 hover:text-rose-400"
                                            >
                                                <Trash2 size={16} />
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
                <DialogContent className="bg-[#1c1c28] border-white/10 text-white max-w-lg rounded-[20px]">
                    <DialogHeader>
                        <DialogTitle>{editingPackage ? 'Edit Paket' : 'Tambah Paket Baru'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Nama Paket</Label>
                            <Input 
                                value={data.name} 
                                onChange={e => setData('name', e.target.value)}
                                className="bg-white/5 border-white/10 rounded-xl"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Harga IDR</Label>
                                <Input 
                                    type="number"
                                    value={data.price_idr} 
                                    onChange={e => setData('price_idr', parseFloat(e.target.value))}
                                    className="bg-white/5 border-white/10 rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Harga USD</Label>
                                <Input 
                                    type="number"
                                    value={data.price_usd} 
                                    onChange={e => setData('price_usd', parseFloat(e.target.value))}
                                    className="bg-white/5 border-white/10 rounded-xl"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Fitur</Label>
                            <div className="flex gap-2">
                                <Input 
                                    value={featureInput}
                                    onChange={e => setFeatureInput(e.target.value)}
                                    placeholder="Tambah fitur..."
                                    className="bg-white/5 border-white/10 rounded-xl"
                                    onKeyDown={e => {
                                        if(e.key === 'Enter') {
                                            e.preventDefault();
                                            if(featureInput.trim()) {
                                                setData('features', [...data.features, featureInput.trim()]);
                                                setFeatureInput('');
                                            }
                                        }
                                    }}
                                />
                                <Button type="button" onClick={() => {
                                    if(featureInput.trim()) {
                                        setData('features', [...data.features, featureInput.trim()]);
                                        setFeatureInput('');
                                    }
                                }} size="icon" className="bg-indigo-600 rounded-xl"><Plus size={16}/></Button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {data.features.map((f, i) => (
                                    <Badge key={i} className="bg-white/5 text-white/70 border-white/10 py-1 pl-3 pr-1 gap-2 rounded-lg">
                                        {f}
                                        <button onClick={() => setData('features', data.features.filter((_, idx) => idx !== i))} className="hover:text-rose-400">
                                            <Trash2 size={12}/>
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                                <input 
                                    type="checkbox" 
                                    checked={data.is_popular} 
                                    onChange={e => setData('is_popular', e.target.checked)}
                                    className="rounded bg-white/5 border-white/10 text-indigo-600"
                                />
                                <Label>Populer</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input 
                                    type="checkbox" 
                                    checked={data.is_active} 
                                    onChange={e => setData('is_active', e.target.checked)}
                                    className="rounded bg-white/5 border-white/10 text-indigo-600"
                                />
                                <Label>Aktif</Label>
                            </div>
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
