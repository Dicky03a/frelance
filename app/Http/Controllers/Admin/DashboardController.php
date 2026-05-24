<?php

namespace App\Http\Controllers\Admin;

use App\Enums\OrderStatus;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\ForumThread;
use App\Models\Order;
use App\Models\ServicePackage;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

use App\Http\Resources\OrderResource;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $paidStatuses = [
            OrderStatus::PAID->value,
            OrderStatus::IN_PROGRESS->value,
            OrderStatus::COMPLETED->value,
        ];

        $totalRevenue = Order::whereIn('status', $paidStatuses)->sum('total_idr');
        $totalOrders = Order::count();
        $ordersThisMonth = Order::whereMonth('created_at', Carbon::now()->month)->count();
        $newClientsThisMonth = User::where('role', UserRole::CLIENT->value)
            ->whereMonth('created_at', Carbon::now()->month)
            ->count();

        $pendingOrders = Order::where('status', OrderStatus::PENDING->value)
            ->with(['user', 'servicePackage.service'])
            ->latest()
            ->take(5)
            ->get();

        $recentThreads = ForumThread::where('is_hidden', false)
            ->with('user')
            ->latest()
            ->take(5)
            ->get();

        // Monthly revenue for the last 6 months
        $monthlyRevenue = collect(range(5, 0))->map(function ($i) use ($paidStatuses) {
            $date = Carbon::now()->subMonths($i);
            $revenue = Order::whereIn('status', $paidStatuses)
                ->whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->sum('total_idr');

            return [
                'month' => $date->format('M'),
                'revenue' => (float) $revenue,
            ];
        });

        $topServices = ServicePackage::withCount('orders')
            ->orderByDesc('orders_count')
            ->take(3)
            ->get();

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'total_revenue_idr' => (float) $totalRevenue,
                'total_orders' => $totalOrders,
                'orders_this_month' => $ordersThisMonth,
                'new_clients_this_month' => $newClientsThisMonth,
            ],
            'pending_orders' => OrderResource::collection($pendingOrders),
            'recent_threads' => $recentThreads,
            'monthly_revenue' => $monthlyRevenue,
            'top_services' => $topServices,
        ]);
    }
}
