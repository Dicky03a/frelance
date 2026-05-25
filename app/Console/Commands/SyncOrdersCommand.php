<?php

namespace App\Console\Commands;

use App\Models\Order;
use App\Services\MidtransService;
use Illuminate\Console\Command;

class SyncOrdersCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'orders:sync';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync pending orders status with Midtrans API';

    /**
     * Execute the console command.
     */
    public function handle(MidtransService $midtransService)
    {
        $orders = Order::where('status', \App\Enums\OrderStatus::PENDING)
            ->whereNotNull('midtrans_order_id')
            ->get();

        if ($orders->isEmpty()) {
            $this->info('No pending orders found.');
            return;
        }

        $this->info("Syncing {$orders->count()} orders...");

        $bar = $this->output->createProgressBar($orders->count());
        $bar->start();

        foreach ($orders as $order) {
            try {
                $status = $midtransService->getTransactionStatus($order->midtrans_order_id);
                $newStatus = $midtransService->mapPaymentStatus(
                    $status['transaction_status'],
                    $status['fraud_status'] ?? 'accept'
                );

                if ($newStatus !== $order->status) {
                    $order->update([
                        'status' => $newStatus,
                        'midtrans_transaction_id' => $status['transaction_id'],
                        'payment_type' => $status['payment_type'],
                        'paid_at' => $newStatus === \App\Enums\OrderStatus::PAID ? now() : $order->paid_at,
                    ]);

                    if ($newStatus === \App\Enums\OrderStatus::PAID) {
                        \App\Jobs\SendOrderConfirmationJob::dispatch($order);
                    }
                }
            } catch (\Exception $e) {
                // Skip if error (order might not exist yet in midtrans or API down)
            }
            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info('Sync completed.');
    }
}
