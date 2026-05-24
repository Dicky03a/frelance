<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'avatar',
        'locale',
        'is_banned',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_banned' => 'boolean',
        ];
    }

    /**
     * Get the orders for the user.
     */
    public function orders(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Get the forum threads for the user.
     */
    public function forumThreads(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(ForumThread::class);
    }

    /**
     * Get the forum replies for the user.
     */
    public function forumReplies(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(ForumReply::class);
    }

    /**
     * Get the project comments for the user.
     */
    public function projectComments(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(ProjectComment::class);
    }

    /**
     * Check if the user is an admin.
     */
    public function isAdmin(): bool
    {
        return $this->role === \App\Enums\UserRole::ADMIN->value;
    }
}
