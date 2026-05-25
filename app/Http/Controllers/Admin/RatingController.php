<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Rating;
use App\Models\User;
use App\Models\Order;
use App\Models\Project;
use App\Enums\OrderStatus;
use App\Http\Resources\RatingResource;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RatingController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Rating::with(['user', 'order.servicePackage.service', 'project']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->whereHas('user', function ($uq) use ($search) {
                    $uq->where('name', 'like', "%{$search}%");
                })
                ->orWhere('review', 'like', "%{$search}%")
                ->orWhere('manual_client_name', 'like', "%{$search}%");
            });
        }

        if ($request->filled('score')) {
            $query->where('score', $request->score);
        }

        $ratings = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('admin/reviews/index', [
            'reviews' => RatingResource::collection($ratings),
            'filters' => $request->only(['search', 'score']),
            'users' => User::whereHas('orders', function ($q) {
                $q->where('status', OrderStatus::COMPLETED->value)
                  ->whereDoesntHave('rating');
            })->get(['id', 'name']),
            'projects' => Project::orderBy('title')->get(['id', 'title']),
        ]);
    }

    public function getOrders(User $user)
    {
        return $user->orders()
            ->where('status', OrderStatus::COMPLETED->value)
            ->whereDoesntHave('rating')
            ->with('servicePackage.service')
            ->get();
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'is_manual' => 'required|boolean',
            'user_id' => 'required_if:is_manual,false|nullable|exists:users,id',
            'order_id' => 'required_if:is_manual,false|nullable|exists:orders,id',
            'project_id' => 'nullable|exists:projects,id',
            'manual_client_name' => 'required_if:is_manual,true|nullable|string|max:255',
            'manual_project_name' => 'required_if:is_manual,true|nullable|string|max:255',
            'score' => 'required|integer|min:1|max:5',
            'review' => 'nullable|string',
            'is_visible' => 'boolean',
        ]);

        if (!$request->is_manual && Rating::where('order_id', $validated['order_id'])->exists()) {
            return redirect()->back()->with('error', 'Pesanan ini sudah memiliki ulasan.');
        }

        Rating::create($validated);

        return redirect()->route('admin.reviews.index')->with('success', 'Ulasan berhasil ditambahkan.');
    }

    public function update(Request $request, Rating $review): RedirectResponse
    {
        $request->validate([
            'is_visible' => 'required|boolean',
        ]);

        $review->update($request->only('is_visible'));

        $status = $review->is_visible ? 'ditampilkan' : 'disembunyikan';

        return redirect()->back()->with('success', "Ulasan berhasil {$status}.");
    }

    public function destroy(Rating $review): RedirectResponse
    {
        $review->delete();

        return redirect()->back()->with('success', 'Ulasan berhasil dihapus.');
    }
}
