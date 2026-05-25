<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CalculatorConfig;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CalculatorConfigController extends Controller
{
    public function index(): Response
    {
        $configs = CalculatorConfig::orderBy('project_type')->get();

        return Inertia::render('Admin/Calculator/Index', [
            'configs' => $configs,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Calculator/Form', [
            'config' => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'project_type' => 'required|string|unique:calculator_configs,project_type',
            'label' => 'required|string|max:100',
            'base_price' => 'required|numeric|min:0',
            'is_active' => 'boolean',
            'features' => 'required|array|min:1',
            'features.*.key' => 'required|string',
            'features.*.label' => 'required|string',
            'features.*.price_add' => 'required|numeric|min:0',
            'timeline_multipliers' => 'required|array|min:1',
            'timeline_multipliers.*.weeks' => 'required|integer|min:1',
            'timeline_multipliers.*.label' => 'required|string',
            'timeline_multipliers.*.multiplier' => 'required|numeric|min:0.5|max:3',
        ]);

        CalculatorConfig::create($validated);

        return redirect()->route('admin.calculator-configs.index')
            ->with('success', 'Calculator configuration created successfully.');
    }

    public function edit(CalculatorConfig $config): Response
    {
        return Inertia::render('Admin/Calculator/Form', [
            'config' => $config,
        ]);
    }

    public function update(Request $request, CalculatorConfig $config): RedirectResponse
    {
        // Handle partial update (e.g. toggle active from index)
        if ($request->has('is_active') && count($request->all()) <= 2) {
            $config->update($request->only('is_active'));
            return back()->with('success', 'Status updated.');
        }

        $validated = $request->validate([
            'project_type' => 'required|string|unique:calculator_configs,project_type,' . $config->id,
            'label' => 'required|string|max:100',
            'base_price' => 'required|numeric|min:0',
            'is_active' => 'boolean',
            'features' => 'required|array|min:1',
            'features.*.key' => 'required|string',
            'features.*.label' => 'required|string',
            'features.*.price_add' => 'required|numeric|min:0',
            'timeline_multipliers' => 'required|array|min:1',
            'timeline_multipliers.*.weeks' => 'required|integer|min:1',
            'timeline_multipliers.*.label' => 'required|string',
            'timeline_multipliers.*.multiplier' => 'required|numeric|min:0.5|max:3',
        ]);

        $config->update($validated);

        return redirect()->route('admin.calculator-configs.index')
            ->with('success', 'Calculator configuration updated successfully.');
    }

    public function destroy(CalculatorConfig $config): RedirectResponse
    {
        $config->delete();

        return redirect()->route('admin.calculator-configs.index')
            ->with('success', 'Calculator configuration deleted successfully.');
    }
}
