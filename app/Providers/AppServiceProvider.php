<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(\App\Models\Order::class, \App\Policies\OrderPolicy::class);
        Gate::policy(\App\Models\ForumThread::class, \App\Policies\ForumThreadPolicy::class);
        Gate::policy(\App\Models\ForumReply::class, \App\Policies\ForumReplyPolicy::class);
        Gate::policy(\App\Models\ProjectComment::class, \App\Policies\ProjectCommentPolicy::class);
        Gate::policy(\App\Models\Rating::class, \App\Policies\RatingPolicy::class);
    }
}
