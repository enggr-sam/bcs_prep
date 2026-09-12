<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'mobile' => ['required', 'string', 'regex:/^[0-9]{10,15}$/', 'unique:'.User::class],
            'password' => ['required', 'string', 'min:6'],
        ]);

        $user = User::create([
            'name' => 'Student',
            'mobile' => $request->mobile,
            'role' => 'student',
            'password' => $request->password,
        ]);

        event(new Registered($user));

        Auth::login($user);

        return to_route($user->homeRoute());
    }
}
