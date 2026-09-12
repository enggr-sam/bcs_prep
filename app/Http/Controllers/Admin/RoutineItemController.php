<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\RoutineItem;
use App\Models\RoutineItemCompletion;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class RoutineItemController extends Controller
{
    public function index(): Response
    {
        $students = User::query()
            ->where('role', 'student')
            ->orderBy('name')
            ->orderBy('id')
            ->get(['id', 'name', 'mobile']);

        $totalDays = RoutineItem::query()->count();
        $doneByUser = RoutineItemCompletion::query()
            ->selectRaw('user_id, count(*) as done_count')
            ->whereIn('user_id', $students->pluck('id'))
            ->groupBy('user_id')
            ->pluck('done_count', 'user_id');

        $ticksByDay = RoutineItemCompletion::query()
            ->selectRaw('routine_item_id, count(*) as tick_count')
            ->groupBy('routine_item_id')
            ->pluck('tick_count', 'routine_item_id');

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
                    'ticks' => (int) ($ticksByDay[$item->id] ?? 0),
                ]),
            'students' => $students->map(fn (User $student) => [
                'id' => $student->id,
                'name' => trim((string) $student->name) !== '' ? trim((string) $student->name) : 'Student',
                'mobile' => $student->mobile,
                'done' => (int) ($doneByUser[$student->id] ?? 0),
                'total' => $totalDays,
            ]),
            'today' => now()->toDateString(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);

        RoutineItem::create([
            ...$data,
            'weekday' => Carbon::parse($data['date'], config('app.timezone'))->format('D'),
            'position' => (int) RoutineItem::query()->max('position') + 1,
        ]);

        return back()->with('status', 'Day added.');
    }

    public function update(Request $request, RoutineItem $routineItem): RedirectResponse
    {
        $data = $this->validated($request);

        $routineItem->update([
            ...$data,
            'weekday' => Carbon::parse($data['date'], config('app.timezone'))->format('D'),
        ]);

        return back()->with('status', 'Day updated.');
    }

    public function destroy(RoutineItem $routineItem): RedirectResponse
    {
        $label = $routineItem->date->toFormattedDateString();

        DB::transaction(function () use ($routineItem) {
            DB::table('routine_item_completions')->where('routine_item_id', $routineItem->id)->delete();
            $routineItem->delete();
        });

        return back()->with('status', $label.' was removed with all ticks for that day.');
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
