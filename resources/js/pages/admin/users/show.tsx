import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { User, Order, ForumThread } from '@/types/models';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
    User as UserIcon, 
    ShoppingCart, 
    MessageSquare, 
    ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserShowProps {
    user: User & {
        orders?: Order[];
        forum_threads?: ForumThread[];
    };
}

export default function Show({ user }: UserShowProps) {
    return (
        <AppLayout>
            <Head title={`Detail Pengguna: ${user.name}`} />

            <div className="px-12 py-16 space-y-12">
                <Link 
                    href={route('admin.users.index')} 
                    className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> KEMBALI KE DAFTAR
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Sidebar: User Info */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="rounded-xl border border-border bg-card p-10 text-center space-y-8 transition-all">
                            <div className="mx-auto h-24 w-24 rounded-md bg-accent flex items-center justify-center border border-border">
                                <UserIcon size={40} className="text-muted-foreground" />
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-[26px] font-normal text-foreground tracking-[-0.325px]">{user.name}</h1>
                                <p className="text-muted-foreground font-normal">{user.email}</p>
                            </div>
                            <div className="flex justify-center gap-3">
                                <Badge variant="outline" className={cn(
                                    "rounded-cursor-pill h-6 px-3 border-none",
                                    user.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                                )}>
                                    {user.role}
                                </Badge>
                                {user.is_banned && (
                                    <Badge variant="outline" className="bg-destructive/10 text-destructive border-none rounded-cursor-pill h-6 px-3">DIBLOKIR</Badge>
                                )}
                            </div>
                            <div className="pt-8 border-t border-border space-y-4 text-left">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground font-normal">Terdaftar</span>
                                    <span className="text-foreground font-medium">{new Date(user.created_at).toLocaleDateString('id-ID')}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground font-normal">Locale</span>
                                    <span className="text-foreground font-medium uppercase">{user.locale}</span>
                                </div>
                            </div>
                            <div className="pt-6">
                                {user.role !== 'admin' && (
                                    <Button 
                                        variant={user.is_banned ? 'outline' : 'destructive'} 
                                        className="w-full h-11 rounded-md font-medium border-none shadow-none"
                                        onClick={() => router.post(route('admin.users.ban', user.id))}
                                    >
                                        {user.is_banned ? 'Aktifkan User' : 'Blokir User'}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Main Content: Activity */}
                    <div className="lg:col-span-2 space-y-12">
                        <div className="grid grid-cols-2 gap-8">
                            <div className="p-8 rounded-xl border border-border bg-card flex items-center gap-6 transition-all">
                                <div className="h-12 w-12 rounded-md bg-accent flex items-center justify-center border border-border">
                                    <ShoppingCart size={24} className="text-primary" />
                                </div>
                                <div>
                                    <div className="text-[26px] font-normal text-foreground leading-none tracking-[-0.325px]">{user.orders?.length || 0}</div>
                                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.88px] mt-2">Total Pesanan</p>
                                </div>
                            </div>
                            <div className="p-8 rounded-xl border border-border bg-card flex items-center gap-6 transition-all">
                                <div className="h-12 w-12 rounded-md bg-accent flex items-center justify-center border border-border">
                                    <MessageSquare size={24} className="text-primary" />
                                </div>
                                <div>
                                    <div className="text-[26px] font-normal text-foreground leading-none tracking-[-0.325px]">{user.forum_threads?.length || 0}</div>
                                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.88px] mt-2">Thread Forum</p>
                                </div>
                            </div>
                        </div>

                        {/* Recent Orders Table */}
                        <div className="rounded-xl border border-border bg-card overflow-hidden">
                            <div className="p-8 border-b border-border flex items-center justify-between">
                                <h3 className="text-[22px] font-normal text-foreground tracking-[-0.11px]">Riwayat Pesanan</h3>
                            </div>
                            <div className="p-0">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-accent/50 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.88px]">
                                        <tr>
                                            <th className="px-8 py-4">KODE</th>
                                            <th className="px-8 py-4">STATUS</th>
                                            <th className="px-8 py-4 text-right">TOTAL</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border text-foreground">
                                        {user.orders?.map(order => (
                                            <tr key={order.id} className="hover:bg-accent/30 transition-colors cursor-pointer group" onClick={() => router.get(route('admin.orders.show', order.id))}>
                                                <td className="px-8 py-5 font-mono text-xs text-muted-foreground group-hover:text-foreground transition-colors">{order.order_code}</td>
                                                <td className="px-8 py-5">
                                                     <Badge variant="outline" className="rounded-cursor-pill h-6 px-3 border-none bg-muted text-muted-foreground capitalize">
                                                        {order.status}
                                                     </Badge>
                                                </td>
                                                <td className="px-8 py-5 text-right font-medium">Rp {order.total_idr.toLocaleString('id-ID')}</td>
                                            </tr>
                                        ))}
                                        {(!user.orders || user.orders.length === 0) && (
                                            <tr>
                                                <td colSpan={3} className="px-8 py-16 text-center text-muted-foreground italic font-normal">Belum ada pesanan.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
