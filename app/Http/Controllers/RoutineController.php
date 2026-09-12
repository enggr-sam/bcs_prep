<?php

namespace App\Http\Controllers;

use App\Models\RoutineItem;
use Inertia\Inertia;
use Inertia\Response;

class RoutineController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('routine/index', [
            'items' => RoutineItem::query()
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
                ]),
            'today' => now()->toDateString(),
        ]);
    }
}
