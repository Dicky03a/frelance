import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalculatorConfig } from '@/types/models';
import { Head, useForm, Link } from '@inertiajs/react';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';

interface FormProps {
    config: CalculatorConfig | null;
}

export default function Form({ config }: FormProps) {
    const isEdit = !!config;

    const { data, setData, post, patch, processing, errors } = useForm({
        project_type: config?.project_type || '',
        label: config?.label || '',
        base_price: config?.base_price || 0,
        is_active: config?.is_active ?? true,
        features: config?.features || [{ key: '', label: '', price_add: 0 }],
        timeline_multipliers: config?.timeline_multipliers || [{ weeks: 1, label: '', multiplier: 1 }],
    });

    const addFeature = () => {
        setData('features', [...data.features, { key: '', label: '', price_add: 0 }]);
    };

    const removeFeature = (index: number) => {
        const newFeatures = [...data.features];
        newFeatures.splice(index, 1);
        setData('features', newFeatures);
    };

    const addTimeline = () => {
        setData('timeline_multipliers', [...data.timeline_multipliers, { weeks: 1, label: '', multiplier: 1 }]);
    };

    const removeTimeline = (index: number) => {
        const newTimelines = [...data.timeline_multipliers];
        newTimelines.splice(index, 1);
        setData('timeline_multipliers', newTimelines);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            patch(route('admin.calculator-configs.update', config.id));
        } else {
            post(route('admin.calculator-configs.store'));
        }
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Calculator', href: route('admin.calculator-configs.index') },
            { title: isEdit ? 'Edit Config' : 'Tambah Config', href: '#' }
        ]}>
            <Head title={isEdit ? 'Edit Calculator Config' : 'Tambah Calculator Config'} />

            <div className="max-w-4xl mx-auto p-6 space-y-8">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild className="text-white/40 hover:text-white hover:bg-white/5 rounded-xl">
                        <Link href={route('admin.calculator-configs.index')}>
                            <ArrowLeft size={20} />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold text-white">{isEdit ? 'Edit Konfigurasi' : 'Tambah Konfigurasi Baru'}</h1>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <Card className="border-white/10 bg-[#1c1c28]">
                        <CardContent className="pt-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="project_type">Tipe Proyek (Key)</Label>
                                    <Input 
                                        id="project_type"
                                        value={data.project_type}
                                        onChange={e => setData('project_type', e.target.value)}
                                        placeholder="web_app"
                                        className="bg-white/5 border-white/10 text-white"
                                    />
                                    {errors.project_type && <p className="text-xs text-red-400">{errors.project_type}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="label">Label Tampilan</Label>
                                    <Input 
                                        id="label"
                                        value={data.label}
                                        onChange={e => setData('label', e.target.value)}
                                        placeholder="Web Application"
                                        className="bg-white/5 border-white/10 text-white"
                                    />
                                    {errors.label && <p className="text-xs text-red-400">{errors.label}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="base_price">Harga Dasar (IDR)</Label>
                                    <Input 
                                        id="base_price"
                                        type="number"
                                        value={data.base_price}
                                        onChange={e => setData('base_price', parseFloat(e.target.value))}
                                        className="bg-white/5 border-white/10 text-white"
                                    />
                                    {errors.base_price && <p className="text-xs text-red-400">{errors.base_price}</p>}
                                </div>
                                <div className="flex items-center gap-3 pt-8">
                                    <Checkbox 
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={checked => setData('is_active', !!checked)}
                                    />
                                    <Label htmlFor="is_active">Aktifkan di Kalkulator Publik</Label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-white">Daftar Fitur & Harga Tambahan</h3>
                            <Button type="button" onClick={addFeature} variant="outline" size="sm" className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 rounded-lg">
                                <Plus className="mr-2 h-4 w-4" /> Tambah Fitur
                            </Button>
                        </div>
                        
                        <div className="space-y-3">
                            {data.features.map((feature, index) => (
                                <div key={index} className="flex gap-3 items-start bg-white/5 p-4 rounded-xl border border-white/5">
                                    <div className="flex-1 space-y-2">
                                        <Label className="text-[10px] uppercase text-white/30">Key</Label>
                                        <Input 
                                            value={feature.key}
                                            onChange={e => {
                                                const newFeatures = [...data.features];
                                                newFeatures[index].key = e.target.value;
                                                setData('features', newFeatures);
                                            }}
                                            placeholder="auth"
                                            className="h-9 bg-black/20 border-white/10 text-xs"
                                        />
                                    </div>
                                    <div className="flex-[2] space-y-2">
                                        <Label className="text-[10px] uppercase text-white/30">Label</Label>
                                        <Input 
                                            value={feature.label}
                                            onChange={e => {
                                                const newFeatures = [...data.features];
                                                newFeatures[index].label = e.target.value;
                                                setData('features', newFeatures);
                                            }}
                                            placeholder="User Authentication"
                                            className="h-9 bg-black/20 border-white/10 text-xs"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <Label className="text-[10px] uppercase text-white/30">Tambah Harga</Label>
                                        <Input 
                                            type="number"
                                            value={feature.price_add}
                                            onChange={e => {
                                                const newFeatures = [...data.features];
                                                newFeatures[index].price_add = parseFloat(e.target.value);
                                                setData('features', newFeatures);
                                            }}
                                            className="h-9 bg-black/20 border-white/10 text-xs"
                                        />
                                    </div>
                                    <Button 
                                        type="button" 
                                        onClick={() => removeFeature(index)} 
                                        variant="ghost" 
                                        size="icon" 
                                        className="mt-6 text-white/20 hover:text-red-400"
                                        disabled={data.features.length === 1}
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-white">Timeline & Multiplier</h3>
                            <Button type="button" onClick={addTimeline} variant="outline" size="sm" className="border-violet-500/30 text-violet-400 hover:bg-violet-500/10 rounded-lg">
                                <Plus className="mr-2 h-4 w-4" /> Tambah Timeline
                            </Button>
                        </div>
                        
                        <div className="space-y-3">
                            {data.timeline_multipliers.map((m, index) => (
                                <div key={index} className="flex gap-3 items-start bg-white/5 p-4 rounded-xl border border-white/5">
                                    <div className="flex-1 space-y-2">
                                        <Label className="text-[10px] uppercase text-white/30">Weeks</Label>
                                        <Input 
                                            type="number"
                                            value={m.weeks}
                                            onChange={e => {
                                                const newTimelines = [...data.timeline_multipliers];
                                                newTimelines[index].weeks = parseInt(e.target.value);
                                                setData('timeline_multipliers', newTimelines);
                                            }}
                                            className="h-9 bg-black/20 border-white/10 text-xs"
                                        />
                                    </div>
                                    <div className="flex-[2] space-y-2">
                                        <Label className="text-[10px] uppercase text-white/30">Label</Label>
                                        <Input 
                                            value={m.label}
                                            onChange={e => {
                                                const newTimelines = [...data.timeline_multipliers];
                                                newTimelines[index].label = e.target.value;
                                                setData('timeline_multipliers', newTimelines);
                                            }}
                                            placeholder="Standard Delivery"
                                            className="h-9 bg-black/20 border-white/10 text-xs"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <Label className="text-[10px] uppercase text-white/30">Multiplier</Label>
                                        <Input 
                                            type="number"
                                            step="0.1"
                                            value={m.multiplier}
                                            onChange={e => {
                                                const newTimelines = [...data.timeline_multipliers];
                                                newTimelines[index].multiplier = parseFloat(e.target.value);
                                                setData('timeline_multipliers', newTimelines);
                                            }}
                                            className="h-9 bg-black/20 border-white/10 text-xs"
                                        />
                                    </div>
                                    <Button 
                                        type="button" 
                                        onClick={() => removeTimeline(index)} 
                                        variant="ghost" 
                                        size="icon" 
                                        className="mt-6 text-white/20 hover:text-red-400"
                                        disabled={data.timeline_multipliers.length === 1}
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-6 border-t border-white/5">
                        <Button type="button" variant="ghost" asChild className="text-white/40 rounded-xl px-8">
                            <Link href={route('admin.calculator-configs.index')}>Batal</Link>
                        </Button>
                        <Button disabled={processing} className="bg-indigo-600 hover:bg-indigo-700 rounded-xl px-12 font-bold shadow-lg shadow-indigo-600/20">
                            {processing ? 'Menyimpan...' : (
                                <><Save className="mr-2 h-4 w-4" /> Simpan Konfigurasi</>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
