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
        $config = CalculatorConfig::where('project_type', $projectType)
            ->where('is_active', true)
            ->first();

        if (!$config) {
            return ['error' => 'Invalid project type'];
        }

        $basePrice = (float) $config->base_price;
        $featuresTotal = 0;

        foreach ($config->features as $feature) {
            if (in_array($feature['key'], $selectedFeatures)) {
                $featuresTotal += (float) $feature['price_add'];
            }
        }

        $multiplier = 1.0;
        $timelineLabel = '';
        
        // Find closest timeline weeks
        $closestDiff = null;
        foreach ($config->timeline_multipliers as $tm) {
            $diff = abs($tm['weeks'] - $timelineWeeks);
            if ($closestDiff === null || $diff < $closestDiff) {
                $closestDiff = $diff;
                $multiplier = (float) $tm['multiplier'];
                $timelineLabel = $tm['label'];
            }
        }

        $total = ($basePrice + $featuresTotal) * $multiplier;
        
        $min = $total * 0.9;
        $max = $total * 1.1;

        // Round to nearest 100k
        $roundedMin = round($min, -5);
        $roundedMax = round($max, -5);

        return [
            'project_type' => $projectType,
            'base_price' => $basePrice,
            'features_total' => $featuresTotal,
            'multiplier' => $multiplier,
            'timeline_label' => $timelineLabel,
            'min' => $roundedMin,
            'max' => $roundedMax,
            'currency' => 'IDR',
            'formatted_min' => 'Rp ' . number_format($roundedMin, 0, ',', '.'),
            'formatted_max' => 'Rp ' . number_format($roundedMax, 0, ',', '.'),
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
