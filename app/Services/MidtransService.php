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

        return $signatureKey === $payload['signature_key'];
    }

    /**
     * Map Midtrans status to OrderStatus enum.
     */
    public function mapPaymentStatus(string $transactionStatus, string $fraudStatus): OrderStatus
    {
        if ($transactionStatus == 'capture') {
            if ($fraudStatus == 'challenge') {
                return OrderStatus::PENDING;
            } else if ($fraudStatus == 'accept') {
                return OrderStatus::PAID;
            }
        } else if ($transactionStatus == 'settlement') {
            return OrderStatus::PAID;
        } else if ($transactionStatus == 'cancel' || $transactionStatus == 'deny' || $transactionStatus == 'expire') {
            return OrderStatus::CANCELLED;
        } else if ($transactionStatus == 'pending') {
            return OrderStatus::PENDING;
        }

        return OrderStatus::PENDING;
    }
}
