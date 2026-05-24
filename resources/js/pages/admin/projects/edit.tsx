import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import ProjectForm from './form';
import { Project, Skill } from '@/types/models';

interface EditProps {
    project: Project;
    skills: Skill[];
    categories: string[];
    statuses: string[];
}

export default function Edit({ project, skills, categories, statuses }: EditProps) {
    return (
        <AppLayout>
            <Head title={`Edit Proyek: ${project.title}`} />
            
            <div className="space-y-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Edit Proyek</h1>
                    <p className="text-white/50">Perbarui informasi proyek {project.title}.</p>
                </div>

                <ProjectForm 
                    project={project}
                    skills={skills} 
                    categories={categories} 
                    statuses={statuses} 
                />
            </div>
        </AppLayout>
    );
}
