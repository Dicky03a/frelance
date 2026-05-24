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
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Plus, Edit2, Trash2, Calculator } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';

interface CalculatorConfigsIndexProps {
    calculatorConfigs: { data: CalculatorConfig[] }; // Assuming it's wrapped in a resource or just raw
}

export default function Index({ calculatorConfigs }: any) {
    // Note: I'll use 'any' briefly to handle both paginated or raw list, 
    // but the goal is consistency. Let's assume it's data[] from a resource.
    const data = calculatorConfigs.data || calculatorConfigs;

    return (
        <AppLayout>
            <Head title="Konfigurasi Kalkulator" />
            
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Kalkulator Estimasi</h1>
                        <p className="text-white/50">Atur harga dasar dan fitur untuk kalkulator publik.</p>
                    </div>
                    <Button disabled className="bg-indigo-600/50 cursor-not-allowed rounded-xl">
                        <Plus className="mr-2 h-4 w-4" /> Tambah Config
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
                            {data.map((config: CalculatorConfig) => (
                                <TableRow key={config.id} className="border-white/7 hover:bg-white/5 transition-colors group">
                                    <TableCell className="font-mono text-xs text-indigo-400">{config.project_type}</TableCell>
                                    <TableCell className="font-bold text-white">{config.label}</TableCell>
                                    <TableCell className="text-white/70">Rp {config.base_price.toLocaleString('id-ID')}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline" className="border-white/10 text-white/40">
                                            {config.features.length} Pilihan
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span className={cn(
                                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border",
                                            config.is_active 
                                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                                                : "bg-white/5 text-white/30 border-white/10"
                                        )}>
                                            {config.is_active ? 'AKTIF' : 'NONAKTIF'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" disabled className="text-white/10">
                                                <Edit2 size={16} />
                                            </Button>
                                            <Button variant="ghost" size="icon" disabled className="text-white/10">
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs flex gap-3 items-center">
                    <Calculator size={16} />
                    <p>Edit & Create untuk Calculator Config saat ini sedang dalam pengembangan (Planned for Stage 12). Gunakan Seeder untuk memperbarui data saat ini.</p>
                </div>
            </div>
        </AppLayout>
    );
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
