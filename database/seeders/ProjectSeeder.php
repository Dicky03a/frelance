<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\Skill;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $projects = [
            [
                'title' => 'E-Commerce Furniture Store',
                'description' => 'A full-featured e-commerce platform for a furniture brand.',
                'long_description' => 'Built with Laravel and React, this project features a custom shopping cart, Midtrans payment integration, and a sophisticated admin dashboard.',
                'tech_stack' => ['Laravel', 'React', 'Tailwind CSS', 'MySQL'],
                'category' => 'ecommerce',
                'status' => 'published',
                'price_from' => 15000000,
                'price_to' => 25000000,
                'duration_weeks' => 8,
                'is_featured' => true,
            ],
            [
                'title' => 'Personal Portfolio Template',
                'description' => 'A clean and modern portfolio template for developers.',
                'long_description' => 'Designed with a dark-first aesthetic, featuring glassmorphism and smooth animations.',
                'tech_stack' => ['React', 'Tailwind CSS', 'Framer Motion'],
                'category' => 'landing_page',
                'status' => 'published',
                'price_from' => 5000000,
                'price_to' => 8000000,
                'duration_weeks' => 2,
                'is_featured' => false,
            ],
            [
                'title' => 'Hospital Management System',
                'description' => 'Internal system for managing patient records and appointments.',
                'long_description' => 'A complex web application with role-based access control and detailed reporting.',
                'tech_stack' => ['Laravel', 'Vue.js', 'PostgreSQL'],
                'category' => 'web_app',
                'status' => 'published',
                'price_from' => 40000000,
                'price_to' => 60000000,
                'duration_weeks' => 12,
                'is_featured' => true,
            ],
            [
                'title' => 'RESTful API for Logistics',
                'description' => 'Scalable API for tracking shipments and managing fleet.',
                'long_description' => 'High-performance API built with Node.js and Redis for real-time tracking.',
                'tech_stack' => ['Node.js', 'Express', 'Redis', 'Docker'],
                'category' => 'api',
                'status' => 'published',
                'price_from' => 20000000,
                'price_to' => 35000000,
                'duration_weeks' => 6,
                'is_featured' => false,
            ],
            [
                'title' => 'Mobile App for Coffee Shop',
                'description' => 'Customer loyalty and ordering app for a local coffee chain.',
                'long_description' => 'Cross-platform mobile application developed using React Native.',
                'tech_stack' => ['React Native', 'Firebase'],
                'category' => 'mobile',
                'status' => 'draft',
                'price_from' => 25000000,
                'price_to' => 40000000,
                'duration_weeks' => 10,
                'is_featured' => false,
            ],
            [
                'title' => 'Legacy Blog System',
                'description' => 'Old blog project from the early days.',
                'long_description' => 'Simple PHP/MySQL blog system that has been archived.',
                'tech_stack' => ['PHP', 'MySQL', 'Bootstrap'],
                'category' => 'other',
                'status' => 'archived',
                'price_from' => 3000000,
                'price_to' => 5000000,
                'duration_weeks' => 3,
                'is_featured' => false,
            ],
        ];

        $allSkills = Skill::all();

        foreach ($projects as $p) {
            $project = Project::create(array_merge($p, [
                'slug' => Str::slug($p['title']),
            ]));

            // Attach 2-4 random skills
            $project->skills()->attach(
                $allSkills->random(rand(2, 4))->pluck('id')->toArray()
            );
        }
    }
}
