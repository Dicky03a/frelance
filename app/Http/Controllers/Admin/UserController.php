<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

use App\Http\Resources\UserResource;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $query = User::query();

        if ($request->filled('search')) {
            $query->where('name', 'like', "%{$request->search}%")
                ->orWhere('email', 'like', "%{$request->search}%");
        }

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        $users = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('admin/users/index', [
            'users' => UserResource::collection($users),
            'filters' => $request->only(['search', 'role']),
            'roles' => UserRole::cases(),
        ]);
    }

    public function show(User $user): Response
    {
        return Inertia::render('admin/users/show', [
            'user' => $user->load(['orders', 'forumThreads', 'forumReplies']),
        ]);
    }

    public function ban(User $user): RedirectResponse
    {
        if ($user->isAdmin()) {
            return redirect()->back()->with('error', 'Admin tidak dapat diblokir.');
        }

        $user->update(['is_banned' => ! $user->is_banned]);
        $status = $user->is_banned ? 'diblokir' : 'diaktifkan kembali';

        return redirect()->back()->with('success', "User berhasil {$status}.");
    }

    public function destroy(User $user): RedirectResponse
    {
        if ($user->isAdmin()) {
            return redirect()->back()->with('error', 'Admin tidak dapat dihapus.');
        }

        $user->delete();
        return redirect()->route('admin.users.index')->with('success', 'User berhasil dihapus.');
    }
}
