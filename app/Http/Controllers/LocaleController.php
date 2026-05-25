<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;

class LocaleController extends Controller
{
    public function set(Request $request, string $lang)
    {
        $locale = in_array($lang, ['id', 'en']) ? $lang : 'id';
        
        session(['locale' => $locale]);
        App::setLocale($locale);

        if (auth()->check()) {
            auth()->user()->update(['locale' => $locale]);
        }

        return back();
    }
}
