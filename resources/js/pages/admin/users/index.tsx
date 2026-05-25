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
import { Search, Eye, UserX, UserCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

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
            
            <div className="space-y-8 p-10">
                <div className="border-b border-border pb-8">
                    <h1 className="text-[36px] font-normal text-foreground tracking-[-0.72px]">Users</h1>
                    <p className="text-muted-foreground mt-2 font-normal">Daftar semua pengguna terdaftar.</p>
                </div>

                <div className="rounded-xl border border-border bg-card p-10 space-y-10 transition-all">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input 
                                placeholder="Cari nama atau email..." 
                                className="pl-12 h-12 bg-accent border-border rounded-md focus:border-muted-foreground/30 transition-colors text-foreground placeholder:text-muted-foreground/40"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-3">
                            {roles.map(role => (
                                <Button 
                                    key={role}
                                    variant={filters.role === role ? 'secondary' : 'ghost'}
                                    size="sm"
                                    onClick={() => router.get(route('admin.users.index'), { ...filters, role: filters.role === role ? '' : role })}
                                    className={cn(
                                        "rounded-md h-10 px-6 font-medium capitalize transition-all",
                                        filters.role === role ? "bg-primary text-white hover:bg-primary/90" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                    )}
                                >
                                    {role}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-border">
                        <Table>
                            <TableHeader className="bg-accent/50">
                                <TableRow className="border-border hover:bg-transparent">
                                    <TableHead className="text-muted-foreground font-semibold uppercase tracking-[0.88px] text-[10px] h-14">PENGGUNA</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold uppercase tracking-[0.88px] text-[10px] h-14">ROLE</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold uppercase tracking-[0.88px] text-[10px] h-14">STATUS</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold uppercase tracking-[0.88px] text-[10px] h-14">TANGGAL DAFTAR</TableHead>
                                    <TableHead className="text-right text-muted-foreground font-semibold uppercase tracking-[0.88px] text-[10px] h-14 pr-8">AKSI</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.data.map((user) => (
                                    <TableRow key={user.id} className="border-border hover:bg-accent/30 transition-colors group">
                                        <TableCell className="py-5 pl-8">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-md bg-accent border border-border flex items-center justify-center font-semibold text-muted-foreground">
                                                    {user.name[0]}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-foreground">{user.name}</div>
                                                    <div className="text-xs text-muted-foreground">{user.email}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={cn(
                                                "rounded-cursor-pill h-6 px-3 border-none",
                                                user.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                                            )}>
                                                {user.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {user.is_banned ? (
                                                <Badge variant="outline" className="bg-destructive/10 text-destructive border-none rounded-cursor-pill h-6 px-3">DIBLOKIR</Badge>
                                            ) : (
                                                <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-none rounded-cursor-pill h-6 px-3">AKTIF</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {new Date(user.created_at).toLocaleDateString('id-ID')}
                                        </TableCell>
                                        <TableCell className="text-right pr-8">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" asChild className="text-muted-foreground hover:text-primary transition-colors h-9 w-9">
                                                    <Link href={route('admin.users.show', user.id)}>
                                                        <Eye size={18} />
                                                    </Link>
                                                </Button>
                                                {user.role !== 'admin' && (
                                                    <Button variant="ghost" size="icon" onClick={() => handleBan(user.id)} className="text-muted-foreground hover:text-destructive transition-colors h-9 w-9">
                                                        {user.is_banned ? <UserCheck size={18} /> : <UserX size={18} />}
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="mt-10 pt-10 border-t border-border flex items-center justify-between">
                        <div className="text-sm text-muted-foreground font-normal">
                            Total {users.meta.total} pengguna
                        </div>
                        <div className="flex gap-4">
                            {users.links.prev && (
                                <Button variant="outline" size="sm" asChild className="h-10 px-6 rounded-md border-border bg-accent text-foreground hover:bg-muted transition-all">
                                    <Link href={users.links.prev}>Prev</Link>
                                </Button>
                            )}
                            {users.links.next && (
                                <Button variant="outline" size="sm" asChild className="h-10 px-6 rounded-md border-border bg-accent text-foreground hover:bg-muted transition-all">
                                    <Link href={users.links.next}>Next</Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
