<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreServicePackageRequest;
use App\Http\Requests\Admin\UpdateServicePackageRequest;
use App\Models\Service;
use App\Models\ServicePackage;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ServicePackageController extends Controller
{
    public function index(Service $service): Response
    {
        return Inertia::render('admin/services/packages/index', [
            'service' => $service,
            'packages' => $service->packages()->orderBy('sort_order')->get(),
        ]);
    }

    public function store(StoreServicePackageRequest $request, Service $service): RedirectResponse
    {
        $service->packages()->create($request->validated());
        return redirect()->back()->with('success', 'Paket layanan berhasil ditambahkan.');
    }

    public function update(UpdateServicePackageRequest $request, ServicePackage $package): RedirectResponse
    {
        $package->update($request->validated());
        return redirect()->back()->with('success', 'Paket layanan berhasil diperbarui.');
    }

    public function destroy(ServicePackage $package): RedirectResponse
    {
        $package->delete();
        return redirect()->back()->with('success', 'Paket layanan berhasil dihapus.');
    }
}
