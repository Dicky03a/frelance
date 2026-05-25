<?php

namespace App\Services;

use App\Enums\OrderStatus;
use App\Models\Order;
use Midtrans\Config;
use Midtrans\Snap;

class MidtransService
{
    public function __construct()
    {
        $serverKey = config('midtrans.server_key');
        
        if (empty($serverKey)) {
            throw new \RuntimeException('Midtrans server key is not configured.');
        }

        Config::$serverKey = $serverKey;
        Config::$isProduction = config('midtrans.is_production');
        Config::$isSanitized = true;
        Config::$is3ds = true;
    }

    /**
     * Create Snap Token for an order.
     */
    public function createSnapToken(Order $order): string
    {
        $params = [
            'transaction_details' => [
                'order_id' => $order->order_code,
                'gross_amount' => (int) $order->total_idr,
            ],
            'item_details' => [
                [
                    'id' => $order->service_package_id,
                    'price' => (int) $order->total_idr,
                    'quantity' => 1,
                    'name' => $order->servicePackage->name,
                ],
            ],
            'customer_details' => [
                'first_name' => $order->user->name,
                'email' => $order->user->email,
            ],
            'callbacks' => [
                'finish' => route('orders.show', $order->id),
            ],
        ];

        try {
            return Snap::getSnapToken($params);
        } catch (\Exception $e) {
            throw new \RuntimeException('Failed to create Midtrans Snap token: ' . $e->getMessage());
        }
    }

    /**
     * Verify Midtrans webhook signature.
     */
    public function verifyWebhookSignature(array $payload): bool
    {
        $signatureKey = hash('sha512', 
            $payload['order_id'] . 
            $payload['status_code'] . 
            $payload['gross_amount'] . 
            config('midtrans.server_key')
        );

        $isValid = $signatureKey === $payload['signature_key'];

        if (!$isValid) {
            \Illuminate\Support\Facades\Log::warning('Midtrans Signature Mismatch', [
                'expected' => $signatureKey,
                'received' => $payload['signature_key'] ?? 'none',
                'order_id' => $payload['order_id'] ?? 'none',
                'status_code' => $payload['status_code'] ?? 'none',
                'gross_amount' => $payload['gross_amount'] ?? 'none',
            ]);
        }

        return $isValid;
    }

    /**
     * Get transaction status from Midtrans API.
     */
    public function getTransactionStatus(string $orderId): array
    {
        try {
            return (array) \Midtrans\Transaction::status($orderId);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Midtrans API Error: Failed to fetch status', [
                'order_id' => $orderId,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Map Midtrans status to OrderStatus enum.
     */
    public function mapPaymentStatus(string $transactionStatus, string $fraudStatus): OrderStatus
    {
        return match ($transactionStatus) {
            'capture' => ($fraudStatus == 'challenge') ? OrderStatus::PENDING : OrderStatus::PAID,
            'settlement' => OrderStatus::PAID,
            'pending' => OrderStatus::PENDING,
            'deny', 'expire', 'cancel' => OrderStatus::CANCELLED,
            default => OrderStatus::PENDING,
        };
    }
}
