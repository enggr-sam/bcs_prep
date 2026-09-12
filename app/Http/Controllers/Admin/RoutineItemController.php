<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\RoutineItem;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RoutineItemController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/routine', [
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

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);

        RoutineItem::create([
            ...$data,
            'weekday' => Carbon::parse($data['date'])->format('D'),
            'position' => (int) RoutineItem::query()->max('position') + 1,
        ]);

        return back();
    }

    public function update(Request $request, RoutineItem $routineItem): RedirectResponse
    {
        $data = $this->validated($request);

        $routineItem->update([
            ...$data,
            'weekday' => Carbon::parse($data['date'])->format('D'),
        ]);

        return back();
    }

    public function destroy(RoutineItem $routineItem): RedirectResponse
    {
        $routineItem->delete();

        return back();
    }

    /**
     * @return array{date: string, subject: string, task: string}
     */
    private function validated(Request $request): array
    {
        return $request->validate([
            'date' => ['required', 'date'],
            'subject' => ['required', 'string', 'max:255'],
            'task' => ['required', 'string', 'max:500'],
        ]);
    }
}
