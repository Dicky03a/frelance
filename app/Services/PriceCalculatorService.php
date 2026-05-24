<?php

namespace App\Services;

use App\Models\CalculatorConfig;

class PriceCalculatorService
{
    /**
     * Get configuration for a specific project type.
     */
    public function getConfig(string $projectType): ?CalculatorConfig
    {
        return CalculatorConfig::where('project_type', $projectType)
            ->where('is_active', true)
            ->first();
    }

    /**
     * Calculate project estimate.
     */
    public function calculate(string $projectType, array $selectedFeatures, int $timelineWeeks): array
    {
        $config = $this->getConfig($projectType);

        if (! $config) {
            throw new \RuntimeException("Calculator config for '{$projectType}' not found.");
        }

        $basePrice = (float) $config->base_price;
        $featurePrice = 0;
        $breakdown = [
            'base' => $basePrice,
            'features' => [],
        ];

        foreach ($config->features as $feature) {
            if (in_array($feature['key'], $selectedFeatures)) {
                $priceAdd = (float) $feature['price_add'];
                $featurePrice += $priceAdd;
                $breakdown['features'][] = [
                    'label' => $feature['label'],
                    'price' => $priceAdd,
                ];
            }
        }

        $subtotal = $basePrice + $featurePrice;
        $multiplier = 1.0;

        foreach ($config->timeline_multipliers as $tm) {
            if ($tm['weeks'] == $timelineWeeks) {
                $multiplier = (float) $tm['multiplier'];
                break;
            }
        }

        $total = $subtotal * $multiplier;

        return [
            'min' => $total * 0.9,
            'max' => $total * 1.1,
            'currency' => 'IDR',
            'breakdown' => $breakdown,
        ];
    }

    /**
     * Format result for display.
     */
    public function formatForDisplay(array $result, string $currency = 'IDR'): array
    {
        return [
            'min' => 'Rp ' . number_format($result['min'], 0, ',', '.'),
            'max' => 'Rp ' . number_format($result['max'], 0, ',', '.'),
        ];
    }
}
