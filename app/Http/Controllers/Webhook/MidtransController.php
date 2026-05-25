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

        // Step 1: Verify signature
        if (!$this->midtransService->verifyWebhookSignature($payload)) {
            return response()->json(['message' => 'Invalid signature'], 403);
        }

        // Step 2: Find order
        $order = Order::where('midtrans_order_id', $payload['order_id'])->first();

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

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
        DB::transaction(function () use ($order, $payload, $newStatus) {
            $order->update([
                'status' => $newStatus,
                'midtrans_transaction_id' => $payload['transaction_id'],
                'payment_type' => $payload['payment_type'],
                'paid_at' => $newStatus === OrderStatus::PAID ? now() : $order->paid_at,
            ]);

            // Step 6: If status is PAID, dispatch confirmation job
            if ($newStatus === OrderStatus::PAID) {
                SendOrderConfirmationJob::dispatch($order);
            }
        });

        return response()->json(['message' => 'OK'], 200);
    }
}
