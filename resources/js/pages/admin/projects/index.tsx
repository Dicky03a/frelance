import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Project } from '@/types/models';
import { PaginatedResponse } from '@/types/pagination';
import { Head, Link, router } from '@inertiajs/react';
import { Briefcase, Edit2, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ProjectsIndexProps {
    projects: PaginatedResponse<Project>;
    filters: {
        search?: string;
        status?: string;
        category?: string;
    };
    categories: string[];
    statuses: string[];
}

export default function Index({ projects, filters, categories, statuses }: ProjectsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');

    // Simple debounce logic for search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== filters.search) {
                router.get(route('admin.projects.index'), { ...filters, search }, { preserveState: true, replace: true });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus proyek ini?')) {
            router.delete(route('admin.projects.destroy', id));
        }
    };

    return (
        <AppLayout>
            <Head title="Manajemen Proyek" />

            <div className="space-y-6 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-[36px] font-normal tracking-[-0.72px] text-foreground">Proyek</h1>
                        <p className="text-muted-foreground">Kelola portofolio dan proyek Anda.</p>
                    </div>
                    <Button asChild className="rounded-xl bg-primary hover:bg-primary/90">
                        <Link href={route('admin.projects.create')}>
                            <Plus className="mr-2 h-4 w-4" /> Tambah Proyek
                        </Link>
                    </Button>
                </div>

                <div className="rounded-xl border border-border bg-card p-6">
                    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
                        <div className="relative flex-1">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Cari judul proyek..."
                                className="rounded-xl border-border bg-muted/50 pl-10 focus:ring-primary/20"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <select
                                className="rounded-xl border-border bg-muted/50 px-4 py-2 text-sm text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                value={filters.category || ''}
                                onChange={(e) => router.get(route('admin.projects.index'), { ...filters, category: e.target.value })}
                            >
                                <option value="">Semua Kategori</option>
                                {categories.map((c) => (
                                    <option key={c} value={c}>
                                        {c.replace('_', ' ').toUpperCase()}
                                    </option>
                                ))}
                            </select>
                            <select
                                className="rounded-xl border-border bg-muted/50 px-4 py-2 text-sm text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                value={filters.status || ''}
                                onChange={(e) => router.get(route('admin.projects.index'), { ...filters, status: e.target.value })}
                            >
                                <option value="">Semua Status</option>
                                {statuses.map((s) => (
                                    <option key={s} value={s}>
                                        {s.toUpperCase()}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-border">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow className="border-border hover:bg-transparent">
                                    <TableHead className="text-muted-foreground">PROYEK</TableHead>
                                    <TableHead className="text-muted-foreground">KATEGORI</TableHead>
                                    <TableHead className="text-muted-foreground">STATUS</TableHead>
                                    <TableHead className="text-muted-foreground">VIEW</TableHead>
                                    <TableHead className="text-muted-foreground">DIBUAT</TableHead>
                                    <TableHead className="text-right text-muted-foreground">AKSI</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {projects.data.map((project) => (
                                    <TableRow key={project.id} className="group border-border transition-colors hover:bg-muted/50">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-16 overflow-hidden rounded-lg bg-muted/50">
                                                    {project.thumbnail ? (
                                                        <img src={`/storage/${project.thumbnail}`} alt="" className="h-full w-full object-cover" />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center text-muted-foreground/20">
                                                            <Briefcase size={20} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="font-medium text-foreground">{project.title}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="border-border text-muted-foreground capitalize">
                                                {project.category.replace('_', ' ')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={
                                                    project.status === 'published'
                                                        ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600'
                                                        : project.status === 'draft'
                                                          ? 'border-amber-500/20 bg-amber-500/10 text-amber-600'
                                                          : 'border-destructive/20 bg-destructive/10 text-destructive'
                                                }
                                            >
                                                {project.status.toUpperCase()}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">{project.views}</TableCell>
                                        <TableCell className="text-muted-foreground">{new Date(project.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    asChild
                                                    className="text-muted-foreground hover:bg-primary/10 hover:text-primary"
                                                >
                                                    <Link href={route('admin.projects.edit', project.id)}>
                                                        <Edit2 size={16} />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(project.id)}
                                                    className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {projects.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-32 text-center text-muted-foreground italic">
                                            Belum ada data proyek
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Menampilkan {projects.meta.from} - {projects.meta.to} dari {projects.meta.total} proyek
                        </div>
                        <div className="flex gap-2">
                            {projects.links.prev && (
                                <Button variant="outline" size="sm" asChild className="border-border bg-muted/50 text-foreground hover:bg-muted">
                                    <Link href={projects.links.prev}>Previous</Link>
                                </Button>
                            )}
                            {projects.links.next && (
                                <Button variant="outline" size="sm" asChild className="border-border bg-muted/50 text-foreground hover:bg-muted">
                                    <Link href={projects.links.next}>Next</Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
