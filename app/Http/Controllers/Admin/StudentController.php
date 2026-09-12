<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;

class StudentController extends Controller
{
    public function destroy(User $user): RedirectResponse
    {
        abort_unless($user->role === 'student', 404);

        $name = trim((string) $user->name) !== '' ? trim((string) $user->name) : 'Student';

        DB::transaction(function () use ($user) {
            DB::table('routine_item_completions')->where('user_id', $user->id)->delete();
            DB::table('sessions')->where('user_id', $user->id)->delete();
            $user->delete();
        });

        return back()->with('status', $name.' was removed with all their ticks.');
    }
}
