<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Enums\ProjectStatus;
use App\Enums\ProjectCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Resources\ProjectResource;

class ProjectController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Project::where('status', ProjectStatus::PUBLISHED->value)
            ->with('skills');

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        $projects = $query->latest()->paginate(12)->withQueryString();

        return Inertia::render('public/projects/index', [
            'projects' => ProjectResource::collection($projects),
            'categories' => ProjectCategory::cases(),
            'filters' => $request->only(['category']),
        ]);
    }

    public function show(Project $project): Response
    {
        if ($project->status !== ProjectStatus::PUBLISHED->value) {
            abort(404);
        }

        $project->increment('views');

        return Inertia::render('public/projects/show', [
            'project' => $project->load(['skills', 'comments.user', 'ratings.user']),
        ]);
    }
}
