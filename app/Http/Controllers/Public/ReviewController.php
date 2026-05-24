<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Rating;
use Inertia\Inertia;
use Inertia\Response;

class ReviewController extends Controller
{
    public function index(): Response
    {
        $reviews = Rating::where('is_visible', true)
            ->with(['user', 'order.servicePackage.service'])
            ->latest()
            ->paginate(12);

        return Inertia::render('public/reviews/index', [
            'reviews' => $reviews,
        ]);
    }
}
