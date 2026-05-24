<?php

namespace App\Http\Controllers\Admin;

use App\Enums\SkillCategory;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreSkillRequest;
use App\Http\Requests\Admin\UpdateSkillRequest;
use App\Models\Skill;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SkillController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/skills/index', [
            'skills' => Skill::orderBy('sort_order')->paginate(20),
            'categories' => SkillCategory::cases(),
        ]);
    }

    public function store(StoreSkillRequest $request): RedirectResponse
    {
        Skill::create($request->validated());
        return redirect()->route('admin.skills.index')->with('success', 'Skill berhasil ditambahkan.');
    }

    public function update(UpdateSkillRequest $request, Skill $skill): RedirectResponse
    {
        $skill->update($request->validated());
        return redirect()->route('admin.skills.index')->with('success', 'Skill berhasil diperbarui.');
    }

    public function destroy(Skill $skill): RedirectResponse
    {
        $skill->delete();
        return redirect()->route('admin.skills.index')->with('success', 'Skill berhasil dihapus.');
    }

    public function updateOrder(Request $request): RedirectResponse
    {
        $request->validate([
            'skills' => 'required|array',
            'skills.*.id' => 'required|exists:skills,id',
            'skills.*.sort_order' => 'required|integer',
        ]);

        foreach ($request->skills as $s) {
            Skill::where('id', $s['id'])->update(['sort_order' => $s['sort_order']]);
        }

        return redirect()->back()->with('success', 'Urutan skill berhasil diperbarui.');
    }
}
