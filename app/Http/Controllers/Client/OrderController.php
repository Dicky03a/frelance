<?php

namespace App\Http\Controllers\Client;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Models\Order;
use App\Models\ServicePackage;
use App\Services\CurrencyService;
use App\Services\MidtransService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function __construct(
        protected MidtransService $midtransService,
        protected CurrencyService $currencyService
    ) {}

    public function store(StoreOrderRequest $request): RedirectResponse
    {
        $package = ServicePackage::with('service')->findOrFail($request->service_package_id);

        // Check user has < 3 pending orders
        $pendingOrdersCount = auth()->user()->orders()
            ->whereIn('status', [OrderStatus::PENDING])
            ->count();

        if ($pendingOrdersCount >= 3) {
            return back()->with('error', 'You have too many pending orders. Please complete or cancel them first.');
        }

        $exchangeRate = $this->currencyService->getRate();

        $order = DB::transaction(function () use ($request, $package, $exchangeRate) {
            $order = Order::create([
                'user_id' => auth()->id(),
                'customer_name' => $request->customer_name,
                'customer_whatsapp' => $request->customer_whatsapp,
                'customer_category' => $request->customer_category,
                'service_package_id' => $package->id,
                'requirements' => $request->requirements,
                'total_idr' => $package->price_idr,
                'total_usd' => $package->price_usd,
                'exchange_rate' => $exchangeRate,
                'status' => OrderStatus::PENDING,
                'expired_at' => now()->addHours(24),
            ]);

            $snapToken = $this->midtransService->createSnapToken($order);

            $order->update([
                'midtrans_order_id' => $order->order_code,
                'midtrans_token' => $snapToken,
            ]);

            return $order;
        });

        return redirect()->route('orders.payment', $order->id);
    }

    public function payment(Order $order): Response|RedirectResponse
    {
        Gate::authorize('view', $order);

        if ($order->status !== OrderStatus::PENDING) {
            return redirect()->route('orders.show', $order->id);
        }

        return Inertia::render('Client/Orders/Payment', [
            'order' => $order->load('servicePackage.service'),
            'snap_token' => $order->midtrans_token,
            'client_key' => config('midtrans.client_key'),
            'snap_url' => config('midtrans.snap_url'),
        ]);
    }

    public function show(Order $order): Response
    {
        Gate::authorize('view', $order);

        // Auto-sync if pending
        if ($order->status === OrderStatus::PENDING) {
            try {
                $status = $this->midtransService->getTransactionStatus($order->midtrans_order_id);
                $newStatus = $this->midtransService->mapPaymentStatus(
                    $status['transaction_status'],
                    $status['fraud_status'] ?? 'accept'
                );

                if ($newStatus !== $order->status) {
                    $order->update([
                        'status' => $newStatus,
                        'midtrans_transaction_id' => $status['transaction_id'],
                        'payment_type' => $status['payment_type'],
                        'paid_at' => $newStatus === OrderStatus::PAID ? now() : $order->paid_at,
                    ]);

                    if ($newStatus === OrderStatus::PAID) {
                        \App\Jobs\SendOrderConfirmationJob::dispatch($order);
                    }
                }
            } catch (\Exception $e) {
                // Silently fail, just show the current data
            }
        }

        return Inertia::render('Client/Orders/Show', [
            'order' => $order->load(['user', 'servicePackage.service', 'rating']),
        ]);
    }

    public function myOrders(Request $request): Response
    {
        $status = $request->query('status');
        
        $query = auth()->user()->orders()
            ->with(['servicePackage.service', 'rating'])
            ->latest();

        if ($status === 'active') {
            $query->whereIn('status', [OrderStatus::PENDING, OrderStatus::PAID, OrderStatus::IN_PROGRESS]);
        } elseif ($status === 'completed') {
            $query->where('status', OrderStatus::COMPLETED);
        } elseif ($status === 'cancelled') {
            $query->whereIn('status', [OrderStatus::CANCELLED, OrderStatus::EXPIRED]);
        }

        $orders = $query->paginate(10)->withQueryString();

        return Inertia::render('Client/Orders/Index', [
            'orders' => \App\Http\Resources\OrderResource::collection($orders),
            'filters' => [
                'status' => $status,
            ],
        ]);
    }

    public function invoice(Order $order)
    {
        Gate::authorize('view', $order);

        $order->load(['user', 'servicePackage.service']);

        $pdf = Pdf::loadView('invoices.order', compact('order'));

        return $pdf->download("invoice-{$order->order_code}.pdf");
    }
}
