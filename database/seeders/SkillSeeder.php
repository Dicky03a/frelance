<?php

namespace Database\Seeders;

use App\Models\Skill;
use Illuminate\Database\Seeder;

class SkillSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $skills = [
            // Frontend
            ['name' => 'React', 'icon' => 'react', 'category' => 'frontend', 'level' => 95, 'color' => '#61DAFB', 'sort_order' => 1],
            ['name' => 'TypeScript', 'icon' => 'type', 'category' => 'frontend', 'level' => 88, 'color' => '#3178C6', 'sort_order' => 2],
            ['name' => 'Tailwind CSS', 'icon' => 'wind', 'category' => 'frontend', 'level' => 90, 'color' => '#06B6D4', 'sort_order' => 3],
            ['name' => 'Vue.js', 'icon' => 'v', 'category' => 'frontend', 'level' => 75, 'color' => '#4FC08D', 'sort_order' => 4],

            // Backend
            ['name' => 'Laravel', 'icon' => 'database', 'category' => 'backend', 'level' => 95, 'color' => '#FF2D20', 'sort_order' => 5],
            ['name' => 'PHP', 'icon' => 'code', 'category' => 'backend', 'level' => 90, 'color' => '#777BB4', 'sort_order' => 6],
            ['name' => 'Node.js', 'icon' => 'server', 'category' => 'backend', 'level' => 70, 'color' => '#339933', 'sort_order' => 7],

            // Database
            ['name' => 'MySQL', 'icon' => 'database', 'category' => 'database', 'level' => 88, 'color' => '#4479A1', 'sort_order' => 8],
            ['name' => 'PostgreSQL', 'icon' => 'database', 'category' => 'database', 'level' => 72, 'color' => '#336791', 'sort_order' => 9],
            ['name' => 'Redis', 'icon' => 'zap', 'category' => 'database', 'level' => 65, 'color' => '#DC382D', 'sort_order' => 10],

            // DevOps
            ['name' => 'Docker', 'icon' => 'container', 'category' => 'devops', 'level' => 70, 'color' => '#2496ED', 'sort_order' => 11],
            ['name' => 'Git', 'icon' => 'git-branch', 'category' => 'devops', 'level' => 90, 'color' => '#F05032', 'sort_order' => 12],
        ];

        foreach ($skills as $skill) {
            Skill::create($skill);
        }
    }
}
