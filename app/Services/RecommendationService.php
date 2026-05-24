<?php

namespace App\Services;

use App\Models\ServicePackage;
use App\Models\User;
use App\Enums\OrderStatus;
use Illuminate\Support\Collection;

class RecommendationService
{
    /**
     * Get service package recommendations for a user.
     */
    public function getForUser(User $user, int $limit = 3): Collection
    {
        $orders = $user->orders()->with('servicePackage.service')->get();

        if ($orders->isEmpty()) {
            return ServicePackage::where('is_popular', true)
                ->where('is_active', true)
                ->limit($limit)
                ->get()
                ->each(function ($package) {
                    $package->recommendation_reason = 'Our most popular choice for new clients.';
                });
        }

        $hasCompleted = $orders->contains('status', OrderStatus::COMPLETED->value);
        $hasActive = $orders->contains(fn($order) => in_array($order->status, [
            OrderStatus::PAID->value,
            OrderStatus::IN_PROGRESS->value
        ]));

        if ($hasActive) {
            // Recommend maintenance packages
            return ServicePackage::whereHas('service', fn($q) => $q->where('name', 'like', '%Maintenance%'))
                ->where('is_active', true)
                ->limit($limit)
                ->get()
                ->each(function ($package) {
                    $package->recommendation_reason = 'Keep your active project running smoothly.';
                });
        }

        if ($hasCompleted) {
            // Recommend next tier or related services
            return ServicePackage::where('is_active', true)
                ->whereNotIn('id', $orders->pluck('service_package_id'))
                ->orderBy('price_idr', 'desc')
                ->limit($limit)
                ->get()
                ->each(function ($package) {
                    $package->recommendation_reason = 'Scale your project with our advanced packages.';
                });
        }

        return ServicePackage::where('is_active', true)
            ->limit($limit)
            ->get()
            ->each(function ($package) {
                $package->recommendation_reason = 'Recommended based on your interests.';
            });
    }
}
