<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'admin'])->prefix('admin')->as('admin.')->group(function () {
    Route::get('/', function () {
        return Inertia::render('admin/dashboard');
    })->name('dashboard');

    Route::resource('projects', \App\Http\Controllers\Admin\ProjectController::class);
    Route::resource('services', \App\Http\Controllers\Admin\ServiceController::class);
    Route::resource('services/{service}/packages', \App\Http\Controllers\Admin\ServicePackageController::class);
    Route::resource('orders', \App\Http\Controllers\Admin\OrderController::class)->only(['index', 'show', 'update', 'destroy']);
    Route::resource('forum/threads', \App\Http\Controllers\Admin\ForumThreadController::class)->only(['index', 'show', 'update', 'destroy']);
    
    Route::post('/forum/replies/{reply}/hide', function () {
        // Logic to hide reply
    })->name('forum.replies.hide');

    Route::resource('skills', \App\Http\Controllers\Admin\SkillController::class);
    
    Route::get('/users', [\App\Http\Controllers\Admin\UserController::class, 'index'])->name('users.index');
    Route::get('/users/{user}', [\App\Http\Controllers\Admin\UserController::class, 'show'])->name('users.show');
    Route::delete('/users/{user}', [\App\Http\Controllers\Admin\UserController::class, 'destroy'])->name('users.destroy');
    Route::post('/users/{user}/ban', [\App\Http\Controllers\Admin\UserController::class, 'ban'])->name('users.ban');

    Route::resource('calculator-configs', \App\Http\Controllers\Admin\CalculatorConfigController::class);
});
