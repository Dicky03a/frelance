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
            'features' => 'array',
            'timeline_weeks' => 'integer',
        ]);

        $config = CalculatorConfig::where('project_type', $request->project_type)
            ->where('is_active', true)
            ->firstOrFail();

        $basePrice = (float) $config->base_price;
        $featurePrice = 0;

        foreach ($config->features as $feature) {
            if (in_array($feature['key'], $request->features ?? [])) {
                $featurePrice += (float) $feature['price_add'];
            }
        }

        $subtotal = $basePrice + $featurePrice;
        $multiplier = 1.0;

        foreach ($config->timeline_multipliers as $tm) {
            if ($tm['weeks'] == $request->timeline_weeks) {
                $multiplier = (float) $tm['multiplier'];
                break;
            }
        }

        $total = $subtotal * $multiplier;

        return response()->json([
            'min' => $total * 0.9,
            'max' => $total * 1.1,
            'currency' => 'IDR',
        ]);
    }
}
