<?php

namespace App\Policies;

use App\Models\Order;
use App\Models\Rating;
use App\Models\User;
use App\Enums\OrderStatus;

class RatingPolicy
{
    /**
     * Determine whether the user can create models.
     */
    public function create(User $user, Order $order): bool
    {
        return $user->id === $order->user_id 
            && $order->status === OrderStatus::COMPLETED->value 
            && $order->rating === null;
    }
}
