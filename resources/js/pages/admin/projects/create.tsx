import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import ProjectForm from './form';
import { Skill } from '@/types/models';

interface CreateProps {
    skills: Skill[];
    categories: string[];
    statuses: string[];
}

export default function Create({ skills, categories, statuses }: CreateProps) {
    return (
        <AppLayout>
            <Head title="Tambah Proyek Baru" />
            
            <div className="space-y-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Tambah Proyek</h1>
                    <p className="text-white/50">Buat entri portofolio baru.</p>
                </div>

                <ProjectForm 
                    skills={skills} 
                    categories={categories} 
                    statuses={statuses} 
                />
            </div>
        </AppLayout>
    );
}
