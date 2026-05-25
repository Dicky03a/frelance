<?php

use App\Http\Controllers\Webhook\MidtransController;
use Illuminate\Support\Facades\Route;

Route::post('/webhook/midtrans', [MidtransController::class, 'handle'])->name('webhook.midtrans');
