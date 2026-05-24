<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $locale = $request->query('lang') 
            ?? $request->session()->get('locale') 
            ?? ($request->user()?->locale) 
            ?? config('app.locale', 'id');

        if (! in_array($locale, ['id', 'en'])) {
            $locale = 'id';
        }

        App::setLocale($locale);
        $request->session()->put('locale', $locale);

        if ($request->user() && $request->user()->locale !== $locale) {
            $request->user()->update(['locale' => $locale]);
        }

        return $next($request);
    }
}
