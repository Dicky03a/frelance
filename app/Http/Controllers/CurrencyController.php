<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CurrencyController extends Controller
{
    public function set(Request $request, string $currency)
    {
        $currency = in_array(strtoupper($currency), ['IDR', 'USD']) ? strtoupper($currency) : 'IDR';
        
        session(['currency' => $currency]);

        return back();
    }
}
