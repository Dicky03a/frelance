import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PaginatedResponse } from '@/types/pagination';
import { Skill, SkillCategory } from '@/types/models';
import { Head, useForm, router } from '@inertiajs/react';
import { 
    Plus, 
    Edit2, 
    Trash2 
} from 'lucide-react';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface SkillsIndexProps {
    skills: PaginatedResponse<Skill>;
    categories: string[];
}

export default function Index({ skills, categories }: SkillsIndexProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        category: 'frontend' as SkillCategory,
        level: 80,
        icon: '',
        color: '#f54e00',
    });

    const openCreate = () => {
        setEditingSkill(null);
        reset();
        setIsDialogOpen(true);
    };

    const openEdit = (skill: Skill) => {
        setEditingSkill(skill);
        setData({
            name: skill.name,
            category: skill.category,
            level: skill.level,
            icon: skill.icon || '',
            color: skill.color || '#f54e00',
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingSkill) {
            put(route('admin.skills.update', editingSkill.id), {
                onSuccess: () => setIsDialogOpen(false),
            });
        } else {
            post(route('admin.skills.store'), {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Hapus skill ini?')) {
            router.delete(route('admin.skills.destroy', id));
        }
    };

    return (
        <AppLayout>
            <Head title="Manajemen Skills" />
            
            <div className="space-y-8 p-10">
                <div className="flex items-center justify-between border-b border-border pb-8">
                    <div>
                        <h1 className="text-[36px] font-normal text-foreground tracking-[-0.72px]">Skills</h1>
                        <p className="text-muted-foreground mt-2 font-normal">Kelola daftar kemampuan teknis Anda.</p>
                    </div>
                    <Button onClick={openCreate} className="bg-primary hover:bg-primary/90 rounded-md h-11 px-8 font-medium">
                        Tambah Skill
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {skills.data.map((skill) => (
                        <div key={skill.id} className="rounded-xl border border-border bg-card p-8 group relative overflow-hidden transition-all hover:border-muted-foreground/30">
                            <div 
                                className="absolute top-0 left-0 w-1 h-full" 
                                style={{ backgroundColor: skill.color || '#f54e00' }}
                            />
                            
                            <div className="flex items-start justify-between">
                                <div className="space-y-3">
                                    <Badge variant="outline" className="text-[10px] uppercase font-semibold tracking-[0.88px]">
                                        {skill.category}
                                    </Badge>
                                    <h3 className="text-[18px] font-normal text-foreground tracking-[-0.11px]">{skill.name}</h3>
                                </div>
                                <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openEdit(skill)} className="p-2 text-muted-foreground hover:text-primary transition-colors">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(skill.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="mt-8 space-y-3">
                                <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.88px]">
                                    <span>Level</span>
                                    <span>{skill.level}%</span>
                                </div>
                                <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                                    <div 
                                        className="h-full rounded-full"
                                        style={{ 
                                            width: `${skill.level}%`,
                                            backgroundColor: skill.color || '#f54e00'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {skills.data.length === 0 && (
                    <div className="rounded-xl border border-dashed border-border bg-muted/30 p-20 text-center">
                        <p className="text-muted-foreground italic font-normal">Belum ada data skill</p>
                    </div>
                )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-card border-border text-foreground max-w-md rounded-xl p-0 overflow-hidden shadow-2xl">
                    <div className="p-10 space-y-8">
                        <DialogHeader>
                            <DialogTitle className="text-[26px] font-normal tracking-[-0.325px]">{editingSkill ? 'Edit Skill' : 'Tambah Skill Baru'}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.88px] ml-1">Nama Skill</Label>
                                <Input 
                                    value={data.name} 
                                    onChange={e => setData('name', e.target.value)}
                                    className="bg-accent border-border rounded-md h-12 px-4 focus:border-muted-foreground/30 transition-colors"
                                    placeholder="Contoh: React, Laravel, etc."
                                />
                                {errors.name && <p className="text-xs text-destructive mt-2 ml-1">{errors.name}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.88px] ml-1">Kategori</Label>
                                    <select 
                                        value={data.category} 
                                        onChange={e => setData('category', e.target.value as SkillCategory)}
                                        className="w-full h-12 bg-accent border border-border rounded-md text-foreground px-4 focus:outline-none focus:border-muted-foreground/30 transition-colors appearance-none"
                                    >
                                        {categories.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.88px] ml-1">Level (%)</Label>
                                    <Input 
                                        type="number"
                                        value={data.level} 
                                        onChange={e => setData('level', parseInt(e.target.value))}
                                        className="bg-accent border-border rounded-md h-12 px-4 focus:border-muted-foreground/30 transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.88px] ml-1">Lucide Icon</Label>
                                    <Input 
                                        value={data.icon} 
                                        onChange={e => setData('icon', e.target.value)}
                                        className="bg-accent border-border rounded-md h-12 px-4 focus:border-muted-foreground/30 transition-colors"
                                        placeholder="code, database, etc."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.88px] ml-1">Warna (HEX)</Label>
                                    <div className="flex gap-2">
                                        <Input 
                                            type="color"
                                            value={data.color} 
                                            onChange={e => setData('color', e.target.value)}
                                            className="w-12 h-12 p-1 bg-accent border-border rounded-md cursor-pointer overflow-hidden"
                                        />
                                        <Input 
                                            value={data.color} 
                                            onChange={e => setData('color', e.target.value)}
                                            className="bg-accent border-border rounded-md h-12 px-4 flex-1 focus:border-muted-foreground/30 transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 flex gap-4">
                                <Button 
                                    type="submit" 
                                    disabled={processing}
                                    className="flex-1 bg-primary hover:bg-primary/90 rounded-md h-12 font-medium border-none shadow-none"
                                >
                                    {editingSkill ? 'Perbarui' : 'Simpan'}
                                </Button>
                                <Button 
                                    type="button" 
                                    variant="ghost" 
                                    onClick={() => setIsDialogOpen(false)}
                                    className="flex-1 text-muted-foreground font-medium hover:text-foreground hover:bg-muted"
                                >
                                    Batal
                                </Button>
                            </div>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
