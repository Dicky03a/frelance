<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Services\FonnteService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('public/contact');
    }

    public function store(Request $request, FonnteService $fonnte): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string',
        ]);

        $target = config('services.fonnte.whatsapp_number');
        $message = "Halo, ada pesan baru dari form kontak:\n\n";
        $message .= "Nama: {$request->name}\n";
        $message .= "Email: {$request->email}\n";
        $message .= "Pesan: {$request->message}";

        $sent = $fonnte->sendMessage($target, $message);

        if ($sent) {
            return back()->with('success', 'Pesan Anda telah terkirim via WhatsApp!');
        }

        return back()->with('error', 'Gagal mengirim pesan. Silakan coba lagi nanti.');
    }
}
