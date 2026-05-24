<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\User;
use App\Models\Skill;
use App\Models\ServicePackage;
use App\Models\ForumThread;
use App\Models\CalculatorConfig;
use App\Enums\UserRole;
use App\Enums\ProjectStatus;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $stats = [
            'projects_count' => Project::where('status', ProjectStatus::PUBLISHED->value)->count(),
            'clients_count' => User::where('role', UserRole::CLIENT->value)->count(),
            'years_experience' => config('app.experience_years', 5),
            'satisfaction_rate' => config('app.satisfaction_rate', 99),
        ];

        $featuredProjects = Project::where('status', ProjectStatus::PUBLISHED->value)
            ->where('is_featured', true)
            ->with('skills')
            ->take(3)
            ->get();

        $skillsByCategory = Skill::orderBy('sort_order')
            ->get()
            ->groupBy('category');

        $servicePackages = ServicePackage::with('service')
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        $forumPreview = ForumThread::where('is_hidden', false)
            ->with(['user', 'replies'])
            ->withCount(['replies as visible_replies_count' => function ($query) {
                $query->where('is_hidden', false);
            }])
            ->latest()
            ->take(3)
            ->get();

        $calculatorTypes = CalculatorConfig::where('is_active', true)
            ->get(['project_type', 'label']);

        return Inertia::render('public/home', [
            'stats' => $stats,
            'featured_projects' => $featuredProjects,
            'skills_by_category' => $skillsByCategory,
            'service_packages' => $servicePackages,
            'forum_preview' => $forumPreview,
            'calculator_types' => $calculatorTypes,
        ]);
    }
}
