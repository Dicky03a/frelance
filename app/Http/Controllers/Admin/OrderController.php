<?php

namespace App\Http\Controllers\Admin;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Order::with(['user', 'servicePackage.service']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $query->where('order_code', 'like', "%{$request->search}%")
                ->orWhereHas('user', fn($q) => $q->where('name', 'like', "%{$request->search}%"));
        }

        $orders = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('admin/orders/index', [
            'orders' => $orders,
            'filters' => $request->only(['status', 'search']),
            'statuses' => OrderStatus::cases(),
        ]);
    }

    public function show(Order $order): Response
    {
        return Inertia::render('admin/orders/show', [
            'order' => $order->load(['user', 'servicePackage.service', 'rating']),
            'statuses' => OrderStatus::cases(),
        ]);
    }

    public function update(Request $request, Order $order): RedirectResponse
    {
        $request->validate([
            'status' => 'required|string',
            'notes_admin' => 'nullable|string',
        ]);

        // Simple validation for status transitions could be added here or in model
        $order->update($request->only(['status', 'notes_admin']));

        return redirect()->back()->with('success', 'Order berhasil diperbarui.');
    }

    public function markAsCompleted(Order $order): RedirectResponse
    {
        $order->update([
            'status' => OrderStatus::COMPLETED->value,
            'completed_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Order telah diselesaikan.');
    }
}
