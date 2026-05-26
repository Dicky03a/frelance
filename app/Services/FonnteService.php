<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FonnteService
{
    protected string $token;
    protected string $baseUrl = 'https://api.fonnte.com/send';

    public function __construct()
    {
        $this->token = config('services.fonnte.token', '');
    }

    public function sendMessage(string $target, string $message): bool
    {
        if (empty($this->token)) {
            Log::error('Fonnte token is not configured.');
            return false;
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => $this->token,
            ])
            ->timeout(10) // Set 10 seconds timeout
            ->post($this->baseUrl, [
                'target' => $target,
                'message' => $message,
                'countryCode' => '62', // Default to Indonesia
            ]);

            if ($response->successful()) {
                return true;
            }

            Log::error('Fonnte API Error: ' . $response->body());
            return false;
        } catch (\Exception $e) {
            Log::error('Fonnte Service Exception: ' . $e->getMessage());
            return false;
        }
    }
}
