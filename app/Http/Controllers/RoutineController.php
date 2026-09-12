<?php

namespace App\Http\Controllers;

use App\Models\RoutineItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RoutineController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $doneIds = $user?->isAdmin()
            ? collect()
            : $user?->completedRoutineItems()->pluck('routine_items.id') ?? collect();

        $items = RoutineItem::query()
            ->orderBy('date')
            ->orderBy('position')
            ->get()
            ->map(fn (RoutineItem $item) => [
                'id' => $item->id,
                'date' => $item->date->toDateString(),
                'weekday' => $item->weekday,
                'subject' => $item->subject,
                'task' => $item->task,
                'position' => $item->position,
                'done' => $doneIds->contains($item->id),
            ]);

        return Inertia::render('routine/index', [
            'items' => $items,
            'today' => now()->toDateString(),
            'doneCount' => $items->where('done', true)->count(),
            'totalCount' => $items->count(),
            'canCheck' => (bool) $user && ! $user->isAdmin(),
        ]);
    }

    public function toggle(Request $request, RoutineItem $routineItem): RedirectResponse
    {
        $user = $request->user();

        abort_unless($user && ! $user->isAdmin(), 403);

        $user->completedRoutineItems()->toggle([$routineItem->id]);

        return back();
    }
}
