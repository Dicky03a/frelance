<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ForumThread;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ForumThreadController extends Controller
{
    public function index(Request $request): Response
    {
        $query = ForumThread::with('user');

        if ($request->filled('search')) {
            $query->where('title', 'like', "%{$request->search}%");
        }

        $threads = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('admin/forum/threads/index', [
            'threads' => $threads,
            'filters' => $request->only(['search']),
        ]);
    }

    public function show(ForumThread $thread): Response
    {
        return Inertia::render('admin/forum/threads/show', [
            'thread' => $thread->load(['user', 'replies.user']),
        ]);
    }

    public function update(Request $request, ForumThread $thread): RedirectResponse
    {
        $request->validate([
            'is_pinned' => 'boolean',
            'is_locked' => 'boolean',
            'is_hidden' => 'boolean',
        ]);

        $thread->update($request->only(['is_pinned', 'is_locked', 'is_hidden']));

        return redirect()->back()->with('success', 'Status thread berhasil diperbarui.');
    }

    public function destroy(ForumThread $thread): RedirectResponse
    {
        $thread->delete();
        return redirect()->route('admin.forum.threads.index')->with('success', 'Thread berhasil dihapus.');
    }
}
