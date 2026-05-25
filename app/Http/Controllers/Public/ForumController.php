<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\ForumThread;
use App\Enums\ForumCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

use App\Http\Resources\ForumThreadResource;

class ForumController extends Controller
{
    public function index(Request $request): Response
    {
        $query = ForumThread::where('is_hidden', false)
            ->with('user')
            ->withCount(['replies as visible_replies_count' => function ($query) {
                $query->where('is_hidden', false);
            }]);

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('search')) {
            $query->where('title', 'like', "%{$request->search}%");
        }

        $threads = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('public/forum/index', [
            'threads' => ForumThreadResource::collection($threads),
            'categories' => collect(ForumCategory::cases())->map(fn($c) => $c->value)->toArray(),
            'filters' => $request->only(['category', 'search']),
        ]);
    }

    public function show(ForumThread $thread): Response
    {
        if ($thread->is_hidden) {
            abort(404);
        }

        $thread->increment('views');

        return Inertia::render('public/forum/show', [
            'thread' => $thread->load([
                'user',
                'replies' => function ($query) {
                    $query->where('is_hidden', false);
                },
                'replies.user'
            ]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('public/forum/create', [
            'categories' => collect(ForumCategory::cases())->map(fn($c) => $c->value)->toArray(),
        ]);
    }
}
