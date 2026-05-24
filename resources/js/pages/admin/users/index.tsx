import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from '@/components/ui/table';
import { PaginatedResponse } from '@/types/pagination';
import { User } from '@/types/models';
import { Head, Link, router } from '@inertiajs/react';
import { Search, Eye, Trash2, Shield, UserX, UserCheck } from 'lucide-react';
import { useState, useEffect } from 'react';

interface UsersIndexProps {
    users: PaginatedResponse<User>;
    filters: {
        search?: string;
        role?: string;
    };
    roles: string[];
}

export default function Index({ users, filters, roles }: UsersIndexProps) {
    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== filters.search) {
                router.get(route('admin.users.index'), { ...filters, search }, { preserveState: true, replace: true });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const handleBan = (id: number) => {
        if (confirm('Ubah status blokir user ini?')) {
            router.post(route('admin.users.ban', id));
        }
    };

    return (
        <AppLayout>
            <Head title="Manajemen Pengguna" />
            
            <div className="space-y-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Users</h1>
                    <p className="text-white/50">Daftar semua pengguna terdaftar.</p>
                </div>

                <div className="rounded-[20px] border border-white/7 bg-[#1c1c28] p-6">
                    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                            <Input 
                                placeholder="Cari nama atau email..." 
                                className="pl-10 bg-white/5 border-white/10 rounded-xl"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            {roles.map(role => (
                                <Button 
                                    key={role}
                                    variant={filters.role === role ? 'secondary' : 'ghost'}
                                    size="sm"
                                    onClick={() => router.get(route('admin.users.index'), { ...filters, role: filters.role === role ? '' : role })}
                                    className="rounded-lg capitalize"
                                >
                                    {role}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-white/7">
                        <Table>
                            <TableHeader className="bg-white/5">
                                <TableRow className="border-white/7 hover:bg-transparent">
                                    <TableHead className="text-white/50">PENGGUNA</TableHead>
                                    <TableHead className="text-white/50">ROLE</TableHead>
                                    <TableHead className="text-white/50">STATUS</TableHead>
                                    <TableHead className="text-white/50">TANGGAL DAFTAR</TableHead>
                                    <TableHead className="text-right text-white/50">AKSI</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.data.map((user) => (
                                    <TableRow key={user.id} className="border-white/7 hover:bg-white/5 transition-colors group">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-white/50">
                                                    {user.name[0]}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-white">{user.name}</div>
                                                    <div className="text-xs text-white/30">{user.email}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={user.role === 'admin' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-white/5 text-white/50 border-white/10'}>
                                                {user.role.toUpperCase()}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {user.is_banned ? (
                                                <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/20">DIBLOKIR</Badge>
                                            ) : (
                                                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">AKTIF</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-white/40 text-xs">
                                            {new Date(user.created_at).toLocaleDateString('id-ID')}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" asChild className="text-white/30 hover:text-indigo-400">
                                                    <Link href={route('admin.users.show', user.id)}>
                                                        <Eye size={16} />
                                                    </Link>
                                                </Button>
                                                {user.role !== 'admin' && (
                                                    <Button variant="ghost" size="icon" onClick={() => handleBan(user.id)} className="text-white/30 hover:text-rose-400">
                                                        {user.is_banned ? <UserCheck size={16} /> : <UserX size={16} />}
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="mt-6">
                         {/* Pagination reused logic */}
                         <div className="flex items-center justify-between">
                            <div className="text-sm text-white/30">
                                Total {users.meta.total} pengguna
                            </div>
                            <div className="flex gap-2">
                                {users.links.prev && (
                                    <Button variant="outline" size="sm" asChild className="border-white/10 bg-white/5 text-white">
                                        <Link href={users.links.prev}>Prev</Link>
                                    </Button>
                                )}
                                {users.links.next && (
                                    <Button variant="outline" size="sm" asChild className="border-white/10 bg-white/5 text-white">
                                        <Link href={users.links.next}>Next</Link>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
