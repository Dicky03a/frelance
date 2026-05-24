<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'admin'])->prefix('admin')->as('admin.')->group(function () {
    Route::get('/', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');

    Route::resource('projects', \App\Http\Controllers\Admin\ProjectController::class);
    Route::resource('services', \App\Http\Controllers\Admin\ServiceController::class);
    Route::resource('services.packages', \App\Http\Controllers\Admin\ServicePackageController::class)->shallow();
    
    Route::resource('orders', \App\Http\Controllers\Admin\OrderController::class)->only(['index', 'show', 'update', 'destroy']);
    
    Route::prefix('forum')->as('forum.')->group(function () {
        Route::resource('threads', \App\Http\Controllers\Admin\ForumThreadController::class)->only(['index', 'show', 'update', 'destroy']);
        Route::post('/replies/{reply}/hide', function () {
            // Logic to hide reply
        })->name('replies.hide');
    });

    Route::resource('skills', \App\Http\Controllers\Admin\SkillController::class);
    Route::post('/skills/order', [\App\Http\Controllers\Admin\SkillController::class, 'updateOrder'])->name('skills.order');
    
    Route::get('/users', [\App\Http\Controllers\Admin\UserController::class, 'index'])->name('users.index');
    Route::get('/users/{user}', [\App\Http\Controllers\Admin\UserController::class, 'show'])->name('users.show');
    Route::delete('/users/{user}', [\App\Http\Controllers\Admin\UserController::class, 'destroy'])->name('users.destroy');
    Route::post('/users/{user}/ban', [\App\Http\Controllers\Admin\UserController::class, 'ban'])->name('users.ban');

    Route::resource('calculator-configs', \App\Http\Controllers\Admin\CalculatorConfigController::class);
});
