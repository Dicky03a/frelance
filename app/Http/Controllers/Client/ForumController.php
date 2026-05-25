<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\ForumThread;
use App\Models\ForumReply;
use App\Enums\ForumCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Enum;

class ForumController extends Controller
{
    public function storeThread(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'category' => ['required', new Enum(ForumCategory::class)],
        ]);

        $thread = Auth::user()->forumThreads()->create($validated);

        return redirect()->route('forum.show', $thread->slug)
            ->with('success', 'Thread berhasil dibuat.');
    }

    public function updateThread(Request $request, ForumThread $thread): RedirectResponse
    {
        $this->authorize('update', $thread);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'category' => ['required', new Enum(ForumCategory::class)],
        ]);

        $thread->update($validated);

        return redirect()->route('forum.show', $thread->slug)
            ->with('success', 'Thread berhasil diperbarui.');
    }

    public function destroyThread(ForumThread $thread): RedirectResponse
    {
        $this->authorize('delete', $thread);

        $thread->delete();

        return redirect()->route('forum.index')
            ->with('success', 'Thread berhasil dihapus.');
    }

    public function storeReply(Request $request, ForumThread $thread): RedirectResponse
    {
        if ($thread->is_locked) {
            return redirect()->back()->with('error', 'Thread ini sedang dikunci.');
        }

        $validated = $request->validate([
            'body' => 'required|string',
        ]);

        $thread->replies()->create([
            'user_id' => Auth::id(),
            'body' => $validated['body'],
        ]);

        return redirect()->back()->with('success', 'Balasan berhasil dikirim.');
    }

    public function updateReply(Request $request, ForumReply $reply): RedirectResponse
    {
        $this->authorize('update', $reply);

        $validated = $request->validate([
            'body' => 'required|string',
        ]);

        $reply->update($validated);

        return redirect()->back()->with('success', 'Balasan berhasil diperbarui.');
    }

    public function destroyReply(ForumReply $reply): RedirectResponse
    {
        $this->authorize('delete', $reply);

        $reply->delete();

        return redirect()->back()->with('success', 'Balasan berhasil dihapus.');
    }
}
