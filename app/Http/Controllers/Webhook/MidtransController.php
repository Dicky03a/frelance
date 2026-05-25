<?php

namespace App\Http\Controllers\Webhook;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Jobs\SendOrderConfirmationJob;
use App\Models\Order;
use App\Services\MidtransService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MidtransController extends Controller
{
    public function __construct(
        protected MidtransService $midtransService
    ) {}

    public function handle(Request $request): JsonResponse
    {
        $payload = $request->all();
        Log::info('Midtrans Webhook Received', ['payload' => $payload]);

        // Step 1: Verify signature
        if (!$this->midtransService->verifyWebhookSignature($payload)) {
            Log::warning('Midtrans Webhook: Invalid Signature', ['payload' => $payload]);
            return response()->json(['message' => 'Invalid signature'], 403);
        }

        // Step 2: Find order
        $order = Order::where('midtrans_order_id', $payload['order_id'])->first();

        if (!$order) {
            // Handle Midtrans dashboard test notification
            if (str_starts_with($payload['order_id'], 'payment_notif_test')) {
                Log::info('Midtrans Webhook: Test notification received and acknowledged');
                return response()->json(['message' => 'Test notification received'], 200);
            }

            Log::error('Midtrans Webhook: Order Not Found', ['order_id' => $payload['order_id']]);
            return response()->json(['message' => 'Order not found'], 404);
        }

        Log::info('Midtrans Webhook: Processing Order', ['order_code' => $order->order_code, 'status' => $payload['transaction_status']]);

        // Step 3: Prevent duplicate processing (idempotency)
        if ($order->midtrans_transaction_id === $payload['transaction_id'] && $order->status === OrderStatus::PAID) {
            return response()->json(['message' => 'Order already processed'], 200);
        }

        // Step 4: Determine new status
        $newStatus = $this->midtransService->mapPaymentStatus(
            $payload['transaction_status'],
            $payload['fraud_status'] ?? 'accept'
        );

        // Step 5: Update order
        try {
            DB::transaction(function () use ($order, $payload, $newStatus) {
                $order->update([
                    'status' => $newStatus,
                    'midtrans_transaction_id' => $payload['transaction_id'],
                    'payment_type' => $payload['payment_type'],
                    'paid_at' => $newStatus === OrderStatus::PAID ? now() : $order->paid_at,
                ]);

                Log::info('Midtrans Webhook: Order Updated Successfully', ['order_code' => $order->order_code, 'new_status' => $newStatus->value]);

                // Step 6: If status is PAID, dispatch confirmation job
                if ($newStatus === OrderStatus::PAID) {
                    SendOrderConfirmationJob::dispatch($order);
                    Log::info('Midtrans Webhook: Confirmation Job Dispatched', ['order_code' => $order->order_code]);
                }
            });
        } catch (\Exception $e) {
            Log::error('Midtrans Webhook: Transaction Failed', ['order_code' => $order->order_code, 'error' => $e->getMessage()]);
            return response()->json(['message' => 'Internal Server Error'], 500);
        }

        return response()->json(['message' => 'OK'], 200);
    }
}
