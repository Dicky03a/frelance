<?php

namespace App\Policies;

use App\Models\ProjectComment;
use App\Models\User;
use App\Enums\UserRole;

class ProjectCommentPolicy
{
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
    public function update(User $user, ProjectComment $projectComment): bool
    {
        return $user->id === $projectComment->user_id || $user->role === UserRole::ADMIN->value;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ProjectComment $projectComment): bool
    {
        return $user->id === $projectComment->user_id || $user->role === UserRole::ADMIN->value;
    }
}
