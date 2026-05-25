import { useForm, usePage, router } from '@inertiajs/react';
import { Project, Skill } from '@/types/models';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Upload, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';

interface ProjectFormProps {
    project?: Project;
    skills: Skill[];
    categories: string[];
    statuses: string[];
}

export default function ProjectForm({ project, skills, categories, statuses }: ProjectFormProps) {
    const [techInput, setTechInput] = useState('');
    const [preview, setThumbnailPreview] = useState<string | null>(project?.thumbnail ? `/storage/${project.thumbnail}` : null);

    const { data, setData, post, processing, errors } = useForm({
        title: project?.title || '',
        category: project?.category || '',
        status: project?.status || 'draft',
        description: project?.description || '',
        long_description: project?.long_description || '',
        price_from: project?.price_from || '',
        price_to: project?.price_to || '',
        duration_weeks: project?.duration_weeks || '',
        tech_stack: project?.tech_stack || [],
        skill_ids: project?.skills?.map(s => s.id) || [],
        live_url: project?.live_url || '',
        github_url: project?.github_url || '',
        is_featured: project?.is_featured || false,
        thumbnail: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (project) {
            router.post(route('admin.projects.update', project.id), {
                ...data,
                _method: 'PUT'
            });
        } else {
            post(route('admin.projects.store'));
        }
    };

    const addTech = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && techInput.trim()) {
            e.preventDefault();
            if (!data.tech_stack.includes(techInput.trim())) {
                setData('tech_stack', [...data.tech_stack, techInput.trim()]);
            }
            setTechInput('');
        }
    };

    const removeTech = (tech: string) => {
        setData('tech_stack', data.tech_stack.filter(t => t !== tech));
    };

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('thumbnail', file);
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-8">
                    {/* Basic Info */}
                    <div className="rounded-xl border border-border bg-card p-6 space-y-6">
                        <h3 className="text-[22px] font-normal tracking-[-0.11px] text-foreground">Informasi Dasar</h3>
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-muted-foreground">Judul Proyek</Label>
                            <Input 
                                id="title"
                                value={data.title}
                                onChange={e => setData('title', e.target.value)}
                                className="bg-muted/50 border-border rounded-xl"
                            />
                            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="category" className="text-muted-foreground">Kategori</Label>
                                <select 
                                    id="category"
                                    value={data.category}
                                    onChange={e => setData('category', e.target.value)}
                                    className="w-full bg-muted/50 border border-border rounded-xl text-muted-foreground px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                >
                                    <option value="">Pilih Kategori</option>
                                    {categories.map(c => <option key={c} value={c}>{c.replace('_', ' ').toUpperCase()}</option>)}
                                </select>
                                {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status" className="text-muted-foreground">Status</Label>
                                <select 
                                    id="status"
                                    value={data.status}
                                    onChange={e => setData('status', e.target.value)}
                                    className="w-full bg-muted/50 border border-border rounded-xl text-muted-foreground px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                >
                                    {statuses.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                                </select>
                                {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <input 
                                type="checkbox" 
                                id="is_featured"
                                checked={data.is_featured}
                                onChange={e => setData('is_featured', e.target.checked)}
                                className="rounded border-border bg-muted/50 text-primary focus:ring-primary/20"
                            />
                            <Label htmlFor="is_featured" className="text-muted-foreground cursor-pointer">Tampilkan di Unggulan</Label>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="rounded-xl border border-border bg-card p-6 space-y-6">
                        <h3 className="text-[22px] font-normal tracking-[-0.11px] text-foreground">Deskripsi</h3>
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-muted-foreground">Deskripsi Singkat (Min. 50 Karakter)</Label>
                            <textarea 
                                id="description"
                                rows={3}
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                className="w-full bg-muted/50 border border-border rounded-xl text-foreground px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                            {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="long_description" className="text-muted-foreground">Deskripsi Lengkap</Label>
                            <textarea 
                                id="long_description"
                                rows={8}
                                value={data.long_description}
                                onChange={e => setData('long_description', e.target.value)}
                                className="w-full bg-muted/50 border border-border rounded-xl text-foreground px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                            {errors.long_description && <p className="text-sm text-destructive">{errors.long_description}</p>}
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="rounded-xl border border-border bg-card p-6 space-y-6">
                        <h3 className="text-[22px] font-normal tracking-[-0.11px] text-foreground">Harga & Durasi</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price_from" className="text-muted-foreground">Harga Mulai (IDR)</Label>
                                <Input 
                                    id="price_from"
                                    type="number"
                                    value={data.price_from}
                                    onChange={e => setData('price_from', e.target.value)}
                                    className="bg-muted/50 border-border rounded-xl"
                                />
                                {errors.price_from && <p className="text-sm text-destructive">{errors.price_from}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="price_to" className="text-muted-foreground">Harga Sampai (IDR)</Label>
                                <Input 
                                    id="price_to"
                                    type="number"
                                    value={data.price_to}
                                    onChange={e => setData('price_to', e.target.value)}
                                    className="bg-muted/50 border-border rounded-xl"
                                />
                                {errors.price_to && <p className="text-sm text-destructive">{errors.price_to}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="duration_weeks" className="text-muted-foreground">Durasi (Minggu)</Label>
                                <Input 
                                    id="duration_weeks"
                                    type="number"
                                    value={data.duration_weeks}
                                    onChange={e => setData('duration_weeks', e.target.value)}
                                    className="bg-muted/50 border-border rounded-xl"
                                />
                                {errors.duration_weeks && <p className="text-sm text-destructive">{errors.duration_weeks}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="rounded-xl border border-border bg-card p-6 space-y-6">
                        <h3 className="text-[22px] font-normal tracking-[-0.11px] text-foreground">Link Eksternal</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="live_url" className="text-muted-foreground">Live Demo URL</Label>
                                <Input 
                                    id="live_url"
                                    value={data.live_url}
                                    onChange={e => setData('live_url', e.target.value)}
                                    className="bg-muted/50 border-border rounded-xl"
                                    placeholder="https://..."
                                />
                                {errors.live_url && <p className="text-sm text-destructive">{errors.live_url}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="github_url" className="text-muted-foreground">GitHub URL</Label>
                                <Input 
                                    id="github_url"
                                    value={data.github_url}
                                    onChange={e => setData('github_url', e.target.value)}
                                    className="bg-muted/50 border-border rounded-xl"
                                    placeholder="https://github.com/..."
                                />
                                {errors.github_url && <p className="text-sm text-destructive">{errors.github_url}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Media */}
                    <div className="rounded-xl border border-border bg-card p-6 space-y-6">
                        <h3 className="text-[22px] font-normal tracking-[-0.11px] text-foreground">Thumbnail</h3>
                        <div className="space-y-4">
                            <div 
                                className="aspect-video w-full rounded-xl border-2 border-dashed border-border bg-muted/50 overflow-hidden flex items-center justify-center relative group"
                                onClick={() => document.getElementById('thumbnail-upload')?.click()}
                            >
                                {preview ? (
                                    <>
                                        <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                                            <Upload className="text-white" size={24} />
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-muted-foreground cursor-pointer">
                                        <ImageIcon size={40} />
                                        <p className="text-sm">Klik untuk upload</p>
                                    </div>
                                )}
                            </div>
                            <input 
                                type="file" 
                                id="thumbnail-upload" 
                                className="hidden" 
                                accept="image/*"
                                onChange={handleThumbnailChange}
                            />
                            <p className="text-xs text-muted-foreground text-center">Rekomendasi ukuran: 1200x675px. Max 5MB.</p>
                            {errors.thumbnail && <p className="text-sm text-destructive">{errors.thumbnail}</p>}
                        </div>
                    </div>

                    {/* Technical */}
                    <div className="rounded-xl border border-border bg-card p-6 space-y-6">
                        <h3 className="text-[22px] font-normal tracking-[-0.11px] text-foreground">Teknis</h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-muted-foreground">Tech Stack</Label>
                                <Input 
                                    placeholder="Ketik lalu tekan Enter..."
                                    value={techInput}
                                    onChange={e => setTechInput(e.target.value)}
                                    onKeyDown={addTech}
                                    className="bg-muted/50 border-border rounded-xl"
                                />
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {data.tech_stack.map(tech => (
                                        <Badge key={tech} variant="outline" className="bg-primary/10 text-primary border-primary/20 px-2 py-1">
                                            {tech}
                                            <button 
                                                type="button" 
                                                onClick={() => removeTech(tech)}
                                                className="ml-1 hover:text-foreground"
                                            >
                                                <X size={12} />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                                {errors.tech_stack && <p className="text-sm text-destructive">{errors.tech_stack}</p>}
                            </div>

                            <div className="space-y-3">
                                <Label className="text-muted-foreground">Skills Terkait</Label>
                                <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                    {skills.map(skill => (
                                        <label key={skill.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 cursor-pointer group">
                                            <input 
                                                type="checkbox" 
                                                checked={data.skill_ids.includes(skill.id)}
                                                onChange={e => {
                                                    const ids = e.target.checked 
                                                        ? [...data.skill_ids, skill.id]
                                                        : data.skill_ids.filter(id => id !== skill.id);
                                                    setData('skill_ids', ids);
                                                }}
                                                className="rounded border-border bg-muted/50 text-primary focus:ring-primary/20"
                                            />
                                            <span className="text-sm text-muted-foreground group-hover:text-foreground">{skill.name}</span>
                                        </label>
                                    ))}
                                </div>
                                {errors.skill_ids && <p className="text-sm text-destructive">{errors.skill_ids}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Button 
                            disabled={processing}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-12 text-lg font-medium shadow-none"
                        >
                            {project ? 'Perbarui Proyek' : 'Simpan Proyek'}
                        </Button>
                        <Button 
                            type="button"
                            variant="ghost" 
                            className="w-full text-muted-foreground hover:text-foreground"
                            onClick={() => window.history.back()}
                        >
                            Batal
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
}
