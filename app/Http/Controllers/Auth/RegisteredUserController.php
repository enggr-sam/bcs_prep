<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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
            'name' => ['required', 'string', 'max:80'],
            'mobile' => ['required', 'string', 'regex:/^[0-9]{10,15}$/', 'unique:'.User::class],
        ]);

        $user = User::query()->create([
            'name' => $request->string('name')->trim(),
            'mobile' => $request->mobile,
            'role' => 'student',
            'password' => config('auth.student_password'),
        ]);

        event(new Registered($user));

        return redirect()->route('login')->with('status', 'Account created. Log in with the class password.');
    }
}
