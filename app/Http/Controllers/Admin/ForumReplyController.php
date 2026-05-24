<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ForumReply;
use Illuminate\Http\RedirectResponse;

class ForumReplyController extends Controller
{
    public function hide(ForumReply $reply): RedirectResponse
    {
        $reply->update(['is_hidden' => ! $reply->is_hidden]);
        $status = $reply->is_hidden ? 'disembunyikan' : 'ditampilkan kembali';

        return redirect()->back()->with('success', "Balasan berhasil {$status}.");
    }
}
