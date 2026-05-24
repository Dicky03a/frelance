<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Skill;
use App\Enums\SkillCategory;
use Inertia\Inertia;
use Inertia\Response;

class SkillController extends Controller
{
    public function index(): Response
    {
        $skills = Skill::orderBy('sort_order')->get()->groupBy('category');

        return Inertia::render('public/skills', [
            'skills_by_category' => $skills,
            'categories' => SkillCategory::cases(),
        ]);
    }
}
