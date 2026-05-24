<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class CurrencyService
{
    /**
     * Get exchange rate from USD to IDR.
     */
    public function getRate(string $from = 'USD', string $to = 'IDR'): float
    {
        $cacheKey = "currency_rate_{$from}_{$to}";

        return Cache::remember($cacheKey, 3600, function () use ($from, $to) {
            try {
                $response = Http::get("https://api.exchangerate-api.com/v4/latest/{$from}");
                
                if ($response->successful()) {
                    return (float) $response->json("rates.{$to}");
                }
            } catch (\Exception $e) {
                // Log error if needed
            }

            return (float) config('currency.fallback_rate', 15800);
        });
    }

    /**
     * Convert amount between currencies.
     */
    public function convert(float $amount, string $from, string $to): float
    {
        if ($from === $to) {
            return $amount;
        }

        $rate = $this->getRate($from, $to);
        return $amount * $rate;
    }

    /**
     * Format amount for display.
     */
    public function format(float $amount, string $currency): string
    {
        if ($currency === 'IDR') {
            return 'Rp ' . number_format($amount, 0, ',', '.');
        }

        return '$' . number_format($amount, 2);
    }
}
