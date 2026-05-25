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
                        <Button variant="ghost" size="icon" asChild className="text-muted-foreground hover:text-foreground">
                            <Link href={route('admin.services.index')}><ArrowLeft size={20} /></Link>
                        </Button>
                        <div>
                            <h1 className="text-[36px] font-normal tracking-[-0.72px] text-foreground">Paket: {service.name}</h1>
                            <p className="text-muted-foreground">Kelola paket harga untuk layanan ini.</p>
                        </div>
                    </div>
                    <Button onClick={openCreate} className="bg-primary hover:bg-primary/90 rounded-xl">
                        <Plus className="mr-2 h-4 w-4" /> Tambah Paket
                    </Button>
                </div>

                <div className="rounded-xl border border-border bg-card overflow-hidden">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow className="border-border hover:bg-transparent">
                                <TableHead className="text-muted-foreground">NAMA PAKET</TableHead>
                                <TableHead className="text-muted-foreground">HARGA (IDR)</TableHead>
                                <TableHead className="text-muted-foreground">HARGA (USD)</TableHead>
                                <TableHead className="text-muted-foreground text-center">STATUS</TableHead>
                                <TableHead className="text-right text-muted-foreground">AKSI</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {packages.map((pkg) => (
                                <TableRow key={pkg.id} className="border-border hover:bg-muted/50 transition-colors group">
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="font-medium text-foreground">{pkg.name}</div>
                                            {pkg.is_popular && (
                                                <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px]">POPULER</Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground font-mono">Rp {pkg.price_idr.toLocaleString('id-ID')}</TableCell>
                                    <TableCell className="text-muted-foreground font-mono">${pkg.price_usd}</TableCell>
                                    <TableCell className="text-center">
                                        <span className={cn(
                                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border",
                                            pkg.is_active 
                                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
                                                : "bg-muted/50 text-muted-foreground border-border"
                                        )}>
                                            {pkg.is_active ? 'AKTIF' : 'NONAKTIF'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => openEdit(pkg)} className="text-muted-foreground hover:text-primary">
                                                <Edit2 size={16} />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                onClick={() => {
                                                    if(confirm('Hapus paket ini?')) router.delete(route('admin.packages.destroy', pkg.id))
                                                }} 
                                                className="text-muted-foreground hover:text-destructive"
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
                <DialogContent className="bg-card border-border text-foreground max-w-lg rounded-xl">
                    <DialogHeader>
                        <DialogTitle className="text-[22px] font-normal tracking-[-0.325px]">{editingPackage ? 'Edit Paket' : 'Tambah Paket Baru'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label className="text-muted-foreground">Nama Paket</Label>
                            <Input 
                                value={data.name} 
                                onChange={e => setData('name', e.target.value)}
                                className="bg-muted/50 border-border rounded-xl"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-muted-foreground">Harga IDR</Label>
                                <Input 
                                    type="number"
                                    value={data.price_idr} 
                                    onChange={e => setData('price_idr', parseFloat(e.target.value))}
                                    className="bg-muted/50 border-border rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-muted-foreground">Harga USD</Label>
                                <Input 
                                    type="number"
                                    value={data.price_usd} 
                                    onChange={e => setData('price_usd', parseFloat(e.target.value))}
                                    className="bg-muted/50 border-border rounded-xl"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-muted-foreground">Fitur</Label>
                            <div className="flex gap-2">
                                <Input 
                                    value={featureInput}
                                    onChange={e => setFeatureInput(e.target.value)}
                                    placeholder="Tambah fitur..."
                                    className="bg-muted/50 border-border rounded-xl"
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
                                }} size="icon" className="bg-primary text-primary-foreground rounded-xl"><Plus size={16}/></Button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {data.features.map((f, i) => (
                                    <Badge key={i} variant="outline" className="bg-muted/50 text-muted-foreground border-border py-1 pl-3 pr-1 gap-2 rounded-lg">
                                        {f}
                                        <button onClick={() => setData('features', data.features.filter((_, idx) => idx !== i))} className="hover:text-destructive">
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
                                    className="rounded bg-muted/50 border-border text-primary"
                                />
                                <Label className="text-muted-foreground">Populer</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input 
                                    type="checkbox" 
                                    checked={data.is_active} 
                                    onChange={e => setData('is_active', e.target.checked)}
                                    className="rounded bg-muted/50 border-border text-primary"
                                />
                                <Label className="text-muted-foreground">Aktif</Label>
                            </div>
                        </div>
                        <div className="pt-4 flex gap-3">
                            <Button type="submit" disabled={processing} className="flex-1 bg-primary text-primary-foreground rounded-xl">Simpan</Button>
                            <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="flex-1 text-muted-foreground">Batal</Button>
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
