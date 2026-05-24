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
                        <h1 className="text-2xl font-bold text-white">Proyek</h1>
                        <p className="text-white/50">Kelola portofolio dan proyek Anda.</p>
                    </div>
                    <Button asChild className="rounded-xl bg-indigo-600 hover:bg-indigo-700">
                        <Link href={route('admin.projects.create')}>
                            <Plus className="mr-2 h-4 w-4" /> Tambah Proyek
                        </Link>
                    </Button>
                </div>

                <div className="rounded-[20px] border border-white/7 bg-[#1c1c28] p-6">
                    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
                        <div className="relative flex-1">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-white/30" />
                            <Input
                                placeholder="Cari judul proyek..."
                                className="rounded-xl border-white/10 bg-white/5 pl-10 focus:ring-indigo-500/20"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <select
                                className="rounded-xl border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
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
                                className="rounded-xl border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
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

                    <div className="overflow-hidden rounded-xl border border-white/7">
                        <Table>
                            <TableHeader className="bg-white/5">
                                <TableRow className="border-white/7 hover:bg-transparent">
                                    <TableHead className="text-white/50">PROYEK</TableHead>
                                    <TableHead className="text-white/50">KATEGORI</TableHead>
                                    <TableHead className="text-white/50">STATUS</TableHead>
                                    <TableHead className="text-white/50">VIEW</TableHead>
                                    <TableHead className="text-white/50">DIBUAT</TableHead>
                                    <TableHead className="text-right text-white/50">AKSI</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {projects.data.map((project) => (
                                    <TableRow key={project.id} className="group border-white/7 transition-colors hover:bg-white/5">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-16 overflow-hidden rounded-lg bg-white/5">
                                                    {project.thumbnail ? (
                                                        <img src={`/storage/${project.thumbnail}`} alt="" className="h-full w-full object-cover" />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center text-white/10">
                                                            <Briefcase size={20} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="font-medium text-white">{project.title}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="border-white/10 text-white/70 capitalize">
                                                {project.category.replace('_', ' ')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                className={
                                                    project.status === 'published'
                                                        ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                                                        : project.status === 'draft'
                                                          ? 'border-amber-500/20 bg-amber-500/10 text-amber-400'
                                                          : 'border-rose-500/20 bg-rose-500/10 text-rose-400'
                                                }
                                            >
                                                {project.status.toUpperCase()}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-white/50">{project.views}</TableCell>
                                        <TableCell className="text-white/50">{new Date(project.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    asChild
                                                    className="text-white/30 hover:bg-indigo-500/10 hover:text-indigo-400"
                                                >
                                                    <Link href={route('admin.projects.edit', project.id)}>
                                                        <Edit2 size={16} />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(project.id)}
                                                    className="text-white/30 hover:bg-rose-500/10 hover:text-rose-400"
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {projects.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-32 text-center text-white/30 italic">
                                            Belum ada data proyek
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                        <div className="text-sm text-white/30">
                            Menampilkan {projects.meta.from} - {projects.meta.to} dari {projects.meta.total} proyek
                        </div>
                        <div className="flex gap-2">
                            {projects.links.prev && (
                                <Button variant="outline" size="sm" asChild className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                                    <Link href={projects.links.prev}>Previous</Link>
                                </Button>
                            )}
                            {projects.links.next && (
                                <Button variant="outline" size="sm" asChild className="border-white/10 bg-white/5 text-white hover:bg-white/10">
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
