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
            
            <div className="space-y-8 p-10">
                <div className="flex items-center justify-between border-b border-border pb-8">
                    <div>
                        <h1 className="text-[36px] font-normal tracking-[-0.72px] text-foreground">Calculator Estimasi</h1>
                        <p className="text-muted-foreground mt-2 font-normal">Atur harga dasar dan fitur untuk kalkulator publik.</p>
                    </div>
                    <Button asChild className="bg-primary hover:bg-primary/90 rounded-md h-11 px-8 font-medium border-none shadow-none">
                        <Link href={route('admin.calculator-configs.create')}>
                            Tambah Config
                        </Link>
                    </Button>
                </div>

                <div className="rounded-xl border border-border bg-card overflow-hidden transition-all">
                    <Table>
                        <TableHeader className="bg-accent/50">
                            <TableRow className="border-border hover:bg-transparent">
                                <TableHead className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.88px] h-14 pl-8">TIPE PROYEK</TableHead>
                                <TableHead className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.88px] h-14">LABEL</TableHead>
                                <TableHead className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.88px] h-14">HARGA DASAR</TableHead>
                                <TableHead className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.88px] h-14 text-center">FITUR</TableHead>
                                <TableHead className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.88px] h-14 text-center">STATUS</TableHead>
                                <TableHead className="text-right text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.88px] h-14 pr-8">AKSI</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {configs.map((config) => (
                                <TableRow key={config.id} className="border-border hover:bg-accent/30 transition-colors group">
                                    <TableCell className="py-5 pl-8 font-mono text-xs text-primary">{config.project_type}</TableCell>
                                    <TableCell className="font-semibold text-foreground">{config.label}</TableCell>
                                    <TableCell className="text-muted-foreground">Rp {parseFloat(config.base_price as any).toLocaleString('id-ID')}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline" className="rounded-cursor-pill h-6 px-3 border-none bg-muted text-muted-foreground">
                                            {config.features.length} Pilihan
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <button 
                                            onClick={() => toggleActive(config)}
                                            className={cn(
                                                "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border-none transition-colors",
                                                config.is_active 
                                                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" 
                                                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                                            )}
                                        >
                                            {config.is_active ? 'AKTIF' : 'NONAKTIF'}
                                        </button>
                                    </TableCell>
                                    <TableCell className="text-right pr-8">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" asChild className="text-muted-foreground hover:text-primary h-9 w-9">
                                                <Link href={route('admin.calculator-configs.edit', { calculator_config: config.id })}>
                                                    <Edit2 size={18} />
                                                </Link>
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                onClick={() => deleteConfig(config.id)}
                                                className="text-muted-foreground hover:text-destructive h-9 w-9"
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
        </AppLayout>
    );
}
