<?php

namespace App\Http\Requests\Auth;

use App\Models\User;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'mobile' => ['required', 'string', 'regex:/^[0-9]{10,15}$/'],
            'password' => ['required', 'string'],
        ];
    }

    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        $mobile = (string) $this->string('mobile');
        $password = (string) $this->string('password');
        $studentPassword = (string) config('auth.student_password');

        $user = User::query()->where('mobile', $mobile)->first();

        if ($user?->isAdmin()) {
            if (! Auth::attempt(['mobile' => $mobile, 'password' => $password], $this->boolean('remember'))) {
                $this->failLogin();
            }

            RateLimiter::clear($this->throttleKey());

            return;
        }

        if ($password !== $studentPassword) {
            $this->failLogin();
        }

        if (! $user) {
            $user = User::query()->create([
                'name' => 'Student',
                'mobile' => $mobile,
                'role' => 'student',
                'password' => $studentPassword,
            ]);
        }

        Auth::login($user, $this->boolean('remember'));
        RateLimiter::clear($this->throttleKey());
    }

    private function failLogin(): never
    {
        RateLimiter::hit($this->throttleKey());

        throw ValidationException::withMessages([
            'mobile' => __('auth.failed'),
        ]);
    }

    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'mobile' => __('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->string('mobile')).'|'.$this->ip());
    }
}
