<?php

use App\Http\Controllers\Webhook\MidtransController;
use Illuminate\Support\Facades\Route;

Route::post('/webhook/midtrans', [MidtransController::class, 'handle'])->name('webhook.midtrans');
Route::get('/webhook/midtrans', function () {
    return response()->json([
        'status' => 'active',
        'message' => 'Midtrans Webhook endpoint is ready. Use POST method to send notifications.',
        'timestamp' => now()->toIso8601String()
    ]);
});
