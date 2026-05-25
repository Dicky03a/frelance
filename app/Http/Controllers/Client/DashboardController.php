<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\RecommendationService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = auth()->user();
        
        $stats = [
            'active_orders' => $user->orders()->whereIn('status', ['pending', 'paid', 'in_progress'])->count(),
            'completed_orders' => $user->orders()->where('status', 'completed')->count(),
            'forum_posts' => $user->forumThreads()->count() + $user->forumReplies()->count(),
            'reviews_given' => $user->projectComments()->count(), // Assuming ratings are linked via project comments or ratings table
        ];

        // Recalculate reviews_given from ratings table if needed
        $stats['reviews_given'] = $user->orders()->whereHas('rating')->count();

        $recent_orders = $user->orders()
            ->with(['servicePackage.service', 'rating'])
            ->latest()
            ->take(3)
            ->get();

        $forum_activity = $user->forumThreads()
            ->with(['replies' => fn($q) => $q->latest()->take(1)])
            ->latest()
            ->take(3)
            ->get();

        $recommendations = app(RecommendationService::class)->getForUser($user);

        $has_unrated_orders = $user->orders()
            ->where('status', 'completed')
            ->doesntHave('rating')
            ->exists();

        return Inertia::render('Client/Dashboard', [
            'stats' => $stats,
            'recent_orders' => \App\Http\Resources\OrderResource::collection($recent_orders)->resolve(),
            'forum_activity' => $forum_activity,
            'recommendations' => $recommendations,
            'has_unrated_orders' => $has_unrated_orders,
        ]);
    }
}
