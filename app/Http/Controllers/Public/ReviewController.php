<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Rating;
use Inertia\Inertia;
use Inertia\Response;

use App\Http\Resources\RatingResource;

class ReviewController extends Controller
{
    public function index(): Response
    {
        $reviews = Rating::where('is_visible', true)
            ->with(['user', 'order.servicePackage.service', 'project'])
            ->latest()
            ->paginate(12);

        return Inertia::render('public/reviews/index', [
            'reviews' => RatingResource::collection($reviews),
        ]);
    }
}
