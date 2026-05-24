import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PaginatedResponse } from '@/types/pagination';
import { Skill, SkillCategory } from '@/types/models';
import { Head, useForm, router } from '@inertiajs/react';
import { 
    Plus, 
    Edit2, 
    Trash2, 
    GripVertical 
} from 'lucide-react';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

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
        color: '#6366F1',
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
            color: skill.color || '#6366F1',
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
            
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Skills</h1>
                        <p className="text-white/50">Kelola daftar kemampuan teknis Anda.</p>
                    </div>
                    <Button onClick={openCreate} className="bg-indigo-600 hover:bg-indigo-700 rounded-xl">
                        <Plus className="mr-2 h-4 w-4" /> Tambah Skill
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {skills.data.map((skill) => (
                        <div key={skill.id} className="rounded-[20px] border border-white/7 bg-[#1c1c28] p-5 group relative overflow-hidden">
                            <div 
                                className="absolute top-0 left-0 w-1 h-full" 
                                style={{ backgroundColor: skill.color || '#6366F1' }}
                            />
                            
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <Badge variant="outline" className="text-[10px] uppercase border-white/10 text-white/40">
                                        {skill.category}
                                    </Badge>
                                    <h3 className="font-bold text-white">{skill.name}</h3>
                                </div>
                                <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openEdit(skill)} className="p-2 text-white/30 hover:text-indigo-400">
                                        <Edit2 size={14} />
                                    </button>
                                    <button onClick={() => handleDelete(skill.id)} className="p-2 text-white/30 hover:text-rose-400">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>

                            <div className="mt-4 space-y-2">
                                <div className="flex items-center justify-between text-xs text-white/50">
                                    <span>Level</span>
                                    <span>{skill.level}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full rounded-full"
                                        style={{ 
                                            width: `${skill.level}%`,
                                            backgroundColor: skill.color || '#6366F1'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {skills.data.length === 0 && (
                    <div className="rounded-[20px] border border-white/7 bg-[#1c1c28] p-12 text-center">
                        <p className="text-white/30 italic">Belum ada data skill</p>
                    </div>
                )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-[#1c1c28] border-white/10 text-white max-w-md rounded-[20px]">
                    <DialogHeader>
                        <DialogTitle>{editingSkill ? 'Edit Skill' : 'Tambah Skill Baru'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Nama Skill</Label>
                            <Input 
                                value={data.name} 
                                onChange={e => setData('name', e.target.value)}
                                className="bg-white/5 border-white/10 rounded-xl"
                                placeholder="Contoh: React, Laravel, etc."
                            />
                            {errors.name && <p className="text-xs text-rose-500">{errors.name}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Kategori</Label>
                                <select 
                                    value={data.category} 
                                    onChange={e => setData('category', e.target.value as SkillCategory)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl text-white/70 px-3 py-2 focus:outline-none"
                                >
                                    {categories.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label>Level (%)</Label>
                                <Input 
                                    type="number"
                                    value={data.level} 
                                    onChange={e => setData('level', parseInt(e.target.value))}
                                    className="bg-white/5 border-white/10 rounded-xl"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Lucide Icon</Label>
                                <Input 
                                    value={data.icon} 
                                    onChange={e => setData('icon', e.target.value)}
                                    className="bg-white/5 border-white/10 rounded-xl"
                                    placeholder="code, database, etc."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Warna (HEX)</Label>
                                <div className="flex gap-2">
                                    <Input 
                                        type="color"
                                        value={data.color} 
                                        onChange={e => setData('color', e.target.value)}
                                        className="w-12 h-10 p-1 bg-white/5 border-white/10 rounded-lg cursor-pointer"
                                    />
                                    <Input 
                                        value={data.color} 
                                        onChange={e => setData('color', e.target.value)}
                                        className="bg-white/5 border-white/10 rounded-xl flex-1"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <Button 
                                type="submit" 
                                disabled={processing}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700 rounded-xl"
                            >
                                {editingSkill ? 'Perbarui' : 'Simpan'}
                            </Button>
                            <Button 
                                type="button" 
                                variant="ghost" 
                                onClick={() => setIsDialogOpen(false)}
                                className="flex-1 text-white/50"
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
