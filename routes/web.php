<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public Routes
Route::get('/', [\App\Http\Controllers\Public\HomeController::class, 'index'])->name('home');

Route::get('/projects', [\App\Http\Controllers\Public\ProjectController::class, 'index'])->name('projects.index');
Route::get('/projects/{project:slug}', [\App\Http\Controllers\Public\ProjectController::class, 'show'])->name('projects.show');

Route::get('/services', [\App\Http\Controllers\Public\ServiceController::class, 'index'])->name('services.index');

Route::get('/forum', [\App\Http\Controllers\Public\ForumController::class, 'index'])->name('forum.index');
Route::get('/forum/create', [\App\Http\Controllers\Public\ForumController::class, 'create'])->name('forum.create')->middleware('auth');
Route::get('/forum/{thread:slug}', [\App\Http\Controllers\Public\ForumController::class, 'show'])->name('forum.show');

Route::get('/reviews', [\App\Http\Controllers\Public\ReviewController::class, 'index'])->name('reviews.index');
Route::get('/about', [\App\Http\Controllers\Public\AboutController::class, 'index'])->name('about');
Route::get('/skills', [\App\Http\Controllers\Public\SkillController::class, 'index'])->name('skills.public');
Route::get('/contact', [\App\Http\Controllers\Public\ContactController::class, 'index'])->name('contact');
Route::post('/contact', [\App\Http\Controllers\Public\ContactController::class, 'store'])->name('contact.store');

Route::get('/locale/{lang}', [\App\Http\Controllers\LocaleController::class, 'set'])->name('locale.set');
Route::get('/currency/{currency}', [\App\Http\Controllers\CurrencyController::class, 'set'])->name('currency.set');

Route::post('/calculator/estimate', [\App\Http\Controllers\Public\CalculatorController::class, 'estimate'])->name('calculator.estimate');

// Client Routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [\App\Http\Controllers\Client\DashboardController::class, 'index'])->name('dashboard');
    Route::get('/orders', [\App\Http\Controllers\Client\OrderController::class, 'myOrders'])->name('client.orders');
    Route::get('/orders/{order}/invoice', [\App\Http\Controllers\Client\OrderController::class, 'invoice'])->name('orders.invoice');

    Route::post('/orders', [\App\Http\Controllers\Client\OrderController::class, 'store'])->name('orders.store');
    Route::get('/orders/{order}', [\App\Http\Controllers\Client\OrderController::class, 'show'])->name('orders.show');
    Route::get('/orders/{order}/payment', [\App\Http\Controllers\Client\OrderController::class, 'payment'])->name('orders.payment');

    Route::post('/forum/threads', [\App\Http\Controllers\Client\ForumController::class, 'storeThread'])->name('forum.threads.store');
    Route::put('/forum/threads/{thread}', [\App\Http\Controllers\Client\ForumController::class, 'updateThread'])->name('forum.threads.update');
    Route::delete('/forum/threads/{thread}', [\App\Http\Controllers\Client\ForumController::class, 'destroyThread'])->name('forum.threads.destroy');

    Route::post('/forum/{thread:slug}/replies', [\App\Http\Controllers\Client\ForumController::class, 'storeReply'])->name('forum.replies.store');
    Route::put('/forum/replies/{reply}', [\App\Http\Controllers\Client\ForumController::class, 'updateReply'])->name('forum.replies.update');
    Route::delete('/forum/replies/{reply}', [\App\Http\Controllers\Client\ForumController::class, 'destroyReply'])->name('forum.replies.destroy');

    Route::post('/projects/{project}/comments', [\App\Http\Controllers\Client\ReviewController::class, 'storeComment'])->name('projects.comments.store');
    Route::post('/projects/{project}/ratings', [\App\Http\Controllers\Client\ReviewController::class, 'storeRating'])->name('projects.ratings.store');
    Route::post('/orders/{order}/ratings', [\App\Http\Controllers\Client\ReviewController::class, 'storeOrderRating'])->name('orders.ratings.store');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
