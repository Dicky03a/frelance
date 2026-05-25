<?php

namespace App\Models;

use App\Enums\ForumCategory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class ForumThread extends Model
{
    /** @use HasFactory<\Database\Factories\ForumThreadFactory> */
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'title',
        'slug',
        'body',
        'category',
        'is_pinned',
        'is_locked',
        'is_hidden',
        'views',
        'replies_count',
    ];

    /**
     * Boot the model.
     */
    protected static function booted(): void
    {
        static::creating(function (ForumThread $thread) {
            if (! $thread->slug) {
                $thread->slug = Str::slug($thread->title) . '-' . Str::random(6);
            }
        });
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_pinned' => 'boolean',
            'is_locked' => 'boolean',
            'is_hidden' => 'boolean',
            'category' => ForumCategory::class,
        ];
    }

    /**
     * Get the user that created the thread.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the replies for the thread.
     */
    public function replies(): HasMany
    {
        return $this->hasMany(ForumReply::class, 'thread_id');
    }
}
