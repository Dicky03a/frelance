<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\ProjectComment;
use App\Models\Rating;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    public function storeComment(Request $request, Project $project): RedirectResponse
    {
        $validated = $request->validate([
            'body' => 'required|string',
        ]);

        $project->comments()->create([
            'user_id' => Auth::id(),
            'body' => $validated['body'],
        ]);

        return redirect()->back()->with('success', 'Komentar berhasil ditambahkan.');
    }

    public function storeRating(Request $request, Project $project): RedirectResponse
    {
        $validated = $request->validate([
            'score' => 'required|integer|min:1|max:5',
            'review' => 'nullable|string',
        ]);

        // Check if user already rated this project
        $existing = Rating::where('user_id', Auth::id())
            ->where('project_id', $project->id)
            ->first();

        if ($existing) {
            $existing->update($validated);
            return redirect()->back()->with('success', 'Ulasan Anda berhasil diperbarui.');
        }

        Rating::create([
            'user_id' => Auth::id(),
            'project_id' => $project->id,
            'score' => $validated['score'],
            'review' => $validated['review'],
            'is_visible' => true,
        ]);

        return redirect()->back()->with('success', 'Terima kasih atas ulasan Anda!');
    }
}
