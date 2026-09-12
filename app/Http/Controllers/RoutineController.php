<?php

namespace App\Http\Controllers;

use App\Models\RoutineItem;
use App\Models\RoutineItemCompletion;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RoutineController extends Controller
{
    public function index(Request $request): Response
    {
        $current = $request->user();
        $students = User::query()
            ->where('role', 'student')
            ->orderBy('name')
            ->orderBy('id')
            ->get(['id', 'name', 'mobile']);

        $total = RoutineItem::query()->count();
        $doneByUser = RoutineItemCompletion::query()
            ->selectRaw('user_id, count(*) as done_count')
            ->whereIn('user_id', $students->pluck('id'))
            ->groupBy('user_id')
            ->pluck('done_count', 'user_id');

        $donePairs = RoutineItemCompletion::query()
            ->whereIn('user_id', $students->pluck('id'))
            ->get(['user_id', 'routine_item_id'])
            ->groupBy('routine_item_id');

        $items = RoutineItem::query()
            ->orderBy('date')
            ->orderBy('position')
            ->get()
            ->map(function (RoutineItem $item) use ($students, $donePairs) {
                $doneIds = $donePairs->get($item->id, collect())->pluck('user_id');

                return [
                    'id' => $item->id,
                    'date' => $item->date->toDateString(),
                    'weekday' => $item->weekday,
                    'subject' => $item->subject,
                    'task' => $item->task,
                    'position' => $item->position,
                    'canToggle' => $this->isCheckableDate($item),
                    'marks' => $students->map(fn (User $student) => [
                        'id' => $student->id,
                        'label' => $this->studentName($student),
                        'done' => $doneIds->contains($student->id),
                    ])->values(),
                ];
            });

        $standings = $students
            ->map(function (User $student) use ($doneByUser, $total, $current) {
                $done = (int) ($doneByUser[$student->id] ?? 0);
                $percent = $total === 0 ? 0 : (int) round(($done / $total) * 100);

                return [
                    'id' => $student->id,
                    'label' => $this->studentName($student),
                    'done' => $done,
                    'total' => $total,
                    'percent' => $percent,
                    'isYou' => $current?->id === $student->id,
                ];
            })
            ->sortBy([
                ['percent', 'desc'],
                ['done', 'desc'],
                ['id', 'asc'],
            ])
            ->values()
            ->map(function (array $row, int $index) {
                $row['rank'] = $index + 1;

                return $row;
            });

        return Inertia::render('routine/index', [
            'items' => $items,
            'standings' => $standings,
            'today' => now()->toDateString(),
            'currentUserId' => $current?->id,
            'canCheck' => (bool) $current && ! $current->isAdmin(),
        ]);
    }

    public function toggle(Request $request, RoutineItem $routineItem): RedirectResponse
    {
        $user = $request->user();

        abort_unless($user && ! $user->isAdmin(), 403);
        abort_unless($this->isCheckableDate($routineItem), 403);

        $user->completedRoutineItems()->toggle([$routineItem->id]);

        return back();
    }

    private function isCheckableDate(RoutineItem $item): bool
    {
        $date = $item->date->startOfDay();

        return $date->equalTo(now()->startOfDay())
            || $date->equalTo(now()->subDay()->startOfDay());
    }

    private function studentName(User $student): string
    {
        $name = trim((string) $student->name);

        return $name !== '' ? $name : 'Student';
    }
}
