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
import { CalculatorConfig } from '@/types/models';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n';

interface IndexProps {
    configs: CalculatorConfig[];
}

export default function Index({ configs }: IndexProps) {
    const { t: tCommon } = useTranslation('common');

    const deleteConfig = (id: number) => {
        if (confirm('Are you sure you want to delete this configuration?')) {
            router.delete(route('admin.calculator-configs.destroy', { calculator_config: id }));
        }
    };

    const toggleActive = (config: CalculatorConfig) => {
        router.patch(route('admin.calculator-configs.update', { calculator_config: config.id }), {
            is_active: !config.is_active
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Calculator', href: route('admin.calculator-configs.index') }]}>
            <Head title="Calculator Configuration" />
            
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Calculator Estimasi</h1>
                        <p className="text-white/50">Atur harga dasar dan fitur untuk kalkulator publik.</p>
                    </div>
                    <Button asChild className="bg-indigo-600 hover:bg-indigo-700 rounded-xl">
                        <Link href={route('admin.calculator-configs.create')}>
                            <Plus className="mr-2 h-4 w-4" /> Tambah Config
                        </Link>
                    </Button>
                </div>

                <div className="rounded-[20px] border border-white/7 bg-[#1c1c28] overflow-hidden">
                    <Table>
                        <TableHeader className="bg-white/5">
                            <TableRow className="border-white/7 hover:bg-transparent">
                                <TableHead className="text-white/50">TIPE PROYEK</TableHead>
                                <TableHead className="text-white/50">LABEL</TableHead>
                                <TableHead className="text-white/50">HARGA DASAR</TableHead>
                                <TableHead className="text-white/50 text-center">FITUR</TableHead>
                                <TableHead className="text-white/50 text-center">STATUS</TableHead>
                                <TableHead className="text-right text-white/50">AKSI</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {configs.map((config) => (
                                <TableRow key={config.id} className="border-white/7 hover:bg-white/5 transition-colors group">
                                    <TableCell className="font-mono text-xs text-indigo-400">{config.project_type}</TableCell>
                                    <TableCell className="font-bold text-white">{config.label}</TableCell>
                                    <TableCell className="text-white/70">Rp {parseFloat(config.base_price as any).toLocaleString('id-ID')}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline" className="border-white/10 text-white/40">
                                            {config.features.length} Pilihan
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <button 
                                            onClick={() => toggleActive(config)}
                                            className={cn(
                                                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border transition-colors",
                                                config.is_active 
                                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20" 
                                                    : "bg-white/5 text-white/30 border-white/10 hover:bg-white/10"
                                            )}
                                        >
                                            {config.is_active ? 'AKTIF' : 'NONAKTIF'}
                                        </button>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" asChild className="text-white/40 hover:text-white hover:bg-white/5">
                                                <Link href={route('admin.calculator-configs.edit', { calculator_config: config.id })}>
                                                    <Edit2 size={16} />
                                                </Link>
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                onClick={() => deleteConfig(config.id)}
                                                className="text-white/40 hover:text-red-400 hover:bg-red-500/5"
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
        </AppLayout>
    );
}
