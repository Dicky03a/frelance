<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CalculatorConfig;
use Inertia\Inertia;
use Inertia\Response;

class CalculatorConfigController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/calculator-configs/index', [
            'calculatorConfigs' => CalculatorConfig::all(),
        ]);
    }
}
