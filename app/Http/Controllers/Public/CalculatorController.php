<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\CalculatorConfig;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CalculatorController extends Controller
{
    public function estimate(Request $request): JsonResponse
    {
        $request->validate([
            'project_type' => 'required|string|exists:calculator_configs,project_type',
            'selected_features' => 'nullable|array',
            'selected_features.*' => 'string',
            'timeline_weeks' => 'required|integer|min:1',
        ]);

        $result = app(\App\Services\PriceCalculatorService::class)->calculate(
            $request->project_type,
            $request->selected_features ?? [],
            $request->timeline_weeks
        );

        return response()->json($result);
    }
}
