<?php

namespace App\Jobs;

use App\Models\Order;
use App\Mail\OrderConfirmedMail;
use App\Mail\NewOrderAdminMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;

class SendOrderConfirmationJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(protected Order $order)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $this->order->load(['user', 'servicePackage.service']);

        // Send to client
        Mail::to($this->order->user->email)->send(new OrderConfirmedMail($this->order));

        // Send to admin if configured
        $adminEmail = config('mail.admin_email');
        if ($adminEmail) {
            Mail::to($adminEmail)->send(new NewOrderAdminMail($this->order));
        }
    }
}
