<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ProjectCategory;
use App\Enums\ProjectStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProjectRequest;
use App\Http\Requests\Admin\UpdateProjectRequest;
use App\Models\Project;
use App\Models\Skill;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Project::with('skills');

        if ($request->filled('search')) {
            $query->where('title', 'like', "%{$request->search}%");
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        $projects = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('admin/projects/index', [
            'projects' => $projects,
            'filters' => $request->only(['search', 'status', 'category']),
            'categories' => ProjectCategory::cases(),
            'statuses' => ProjectStatus::cases(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/projects/create', [
            'skills' => Skill::orderBy('name')->get(),
            'categories' => ProjectCategory::cases(),
            'statuses' => ProjectStatus::cases(),
        ]);
    }

    public function store(StoreProjectRequest $request): RedirectResponse
    {
        return DB::transaction(function () use ($request) {
            $data = $request->validated();
            $data['slug'] = Str::slug($data['title']);
            
            if ($request->hasFile('thumbnail')) {
                $data['thumbnail'] = $request->file('thumbnail')->store('projects/thumbnails', 'public');
            }

            $project = Project::create($data);

            if ($request->filled('skill_ids')) {
                $project->skills()->sync($request->skill_ids);
            }

            return redirect()->route('admin.projects.index')->with('success', 'Proyek berhasil ditambahkan.');
        });
    }

    public function show(Project $project): Response
    {
        return Inertia::render('admin/projects/show', [
            'project' => $project->load(['skills', 'comments.user', 'ratings.user']),
        ]);
    }

    public function edit(Project $project): Response
    {
        return Inertia::render('admin/projects/edit', [
            'project' => $project->load('skills'),
            'skills' => Skill::orderBy('name')->get(),
            'categories' => ProjectCategory::cases(),
            'statuses' => ProjectStatus::cases(),
        ]);
    }

    public function update(UpdateProjectRequest $request, Project $project): RedirectResponse
    {
        return DB::transaction(function () use ($request, $project) {
            $data = $request->validated();
            $data['slug'] = Str::slug($data['title']);

            if ($request->hasFile('thumbnail')) {
                if ($project->thumbnail) {
                    Storage::disk('public')->delete($project->thumbnail);
                }
                $data['thumbnail'] = $request->file('thumbnail')->store('projects/thumbnails', 'public');
            }

            $project->update($data);

            if ($request->has('skill_ids')) {
                $project->skills()->sync($request->skill_ids);
            }

            return redirect()->route('admin.projects.index')->with('success', 'Proyek berhasil diperbarui.');
        });
    }

    public function destroy(Project $project): RedirectResponse
    {
        $project->delete();
        return redirect()->route('admin.projects.index')->with('success', 'Proyek berhasil dihapus.');
    }
}
