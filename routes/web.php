<?php

use App\Http\Controllers\Admin\RoutineItemController;
use App\Http\Controllers\RoutineController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route(auth()->user()->homeRoute());
    }

    return redirect()->route('login');
})->name('home');

Route::middleware('auth')->group(function () {
    Route::get('routine', [RoutineController::class, 'index'])->name('routine.index');
    Route::post('routine/{routineItem}/toggle', [RoutineController::class, 'toggle'])->name('routine.toggle');
    Route::get('dashboard', fn () => redirect()->route(auth()->user()->homeRoute()))->name('dashboard');
});

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('routine', [RoutineItemController::class, 'index'])->name('routine.index');
    Route::post('routine', [RoutineItemController::class, 'store'])->name('routine.store');
    Route::put('routine/{routineItem}', [RoutineItemController::class, 'update'])->name('routine.update');
    Route::delete('routine/{routineItem}', [RoutineItemController::class, 'destroy'])->name('routine.destroy');
});

require __DIR__.'/auth.php';
