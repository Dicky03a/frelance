import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { User, Order, ForumThread } from '@/types/models';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
    User as UserIcon, 
    Mail, 
    Shield, 
    Calendar, 
    ShoppingCart, 
    MessageSquare, 
    ArrowLeft,
    UserX,
    UserCheck,
    Clock
} from 'lucide-react';

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

            <div className="px-6 py-10 space-y-8">
                <Link 
                    href={route('admin.users.index')} 
                    className="inline-flex items-center gap-2 text-sm font-bold text-white/30 hover:text-white transition-colors group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> KEMBALI KE DAFTAR
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sidebar: User Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="rounded-[32px] border border-white/10 bg-[#1c1c28] p-8 text-center space-y-6">
                            <div className="mx-auto h-24 w-24 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                                <UserIcon size={48} className="text-indigo-400" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                                <p className="text-white/40">{user.email}</p>
                            </div>
                            <div className="flex justify-center gap-2">
                                <Badge className={user.role === 'admin' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-white/5 text-white/50 border-white/10'}>
                                    {user.role.toUpperCase()}
                                </Badge>
                                {user.is_banned && (
                                    <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/20">DIBLOKIR</Badge>
                                )}
                            </div>
                            <div className="pt-6 border-t border-white/5 space-y-3 text-left">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-white/30 flex items-center gap-2"><Calendar size={14} /> Terdaftar</span>
                                    <span className="text-white/70 font-medium">{new Date(user.created_at).toLocaleDateString('id-ID')}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-white/30 flex items-center gap-2"><Clock size={14} /> Locale</span>
                                    <span className="text-white/70 font-medium uppercase">{user.locale}</span>
                                </div>
                            </div>
                            <div className="pt-4">
                                {user.role !== 'admin' && (
                                    <Button 
                                        variant={user.is_banned ? 'outline' : 'destructive'} 
                                        className="w-full rounded-xl"
                                        onClick={() => router.post(route('admin.users.ban', user.id))}
                                    >
                                        {user.is_banned ? (
                                            <><UserCheck size={18} className="mr-2" /> Aktifkan User</>
                                        ) : (
                                            <><UserX size={18} className="mr-2" /> Blokir User</>
                                        )}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Main Content: Activity */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 rounded-[24px] border border-white/10 bg-[#1c1c28] flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/10">
                                    <ShoppingCart size={24} />
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-white">{user.orders?.length || 0}</div>
                                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest leading-none mt-1">Total Pesanan</p>
                                </div>
                            </div>
                            <div className="p-6 rounded-[24px] border border-white/10 bg-[#1c1c28] flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-400 border border-violet-500/10">
                                    <MessageSquare size={24} />
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-white">{user.forum_threads?.length || 0}</div>
                                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest leading-none mt-1">Thread Forum</p>
                                </div>
                            </div>
                        </div>

                        {/* Recent Orders Table */}
                        <div className="rounded-[32px] border border-white/10 bg-[#1c1c28] overflow-hidden">
                            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                <h3 className="font-bold text-white">Riwayat Pesanan</h3>
                                <ShoppingCart size={18} className="text-white/20" />
                            </div>
                            <div className="p-0">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-white/5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                                        <tr>
                                            <th className="px-6 py-3">KODE</th>
                                            <th className="px-6 py-3">STATUS</th>
                                            <th className="px-6 py-3 text-right">TOTAL</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-white/70">
                                        {user.orders?.map(order => (
                                            <tr key={order.id} className="hover:bg-white/5 cursor-pointer" onClick={() => router.get(route('admin.orders.show', order.id))}>
                                                <td className="px-6 py-4 font-mono text-xs">{order.order_code}</td>
                                                <td className="px-6 py-4 capitalize">{order.status}</td>
                                                <td className="px-6 py-4 text-right font-bold text-white">Rp {order.total_idr.toLocaleString('id-ID')}</td>
                                            </tr>
                                        ))}
                                        {(!user.orders || user.orders.length === 0) && (
                                            <tr>
                                                <td colSpan={3} className="px-6 py-12 text-center text-white/20 italic">Belum ada pesanan.</td>
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

import { router } from '@inertiajs/react';
