<?php

namespace App\Policies;

use App\Models\ForumThread;
use App\Models\User;
use App\Enums\UserRole;

class ForumThreadPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(?User $user): bool
    {
        return auth()->check();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ForumThread $forumThread): bool
    {
        return $user->id === $forumThread->user_id || $user->role === UserRole::ADMIN->value;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ForumThread $forumThread): bool
    {
        return $user->id === $forumThread->user_id || $user->role === UserRole::ADMIN->value;
    }

    /**
     * Determine whether the user can moderate the model.
     */
    public function moderate(User $user): bool
    {
        return $user->role === UserRole::ADMIN->value;
    }
}
