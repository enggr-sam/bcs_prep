<?php

namespace Database\Seeders;

use App\Models\RoutineItem;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['mobile' => '01700000000'],
            [
                'name' => 'Admin',
                'email' => 'admin@bcs.test',
                'role' => 'admin',
                'password' => 'iamadmin',
            ],
        );

        User::query()->updateOrCreate(
            ['mobile' => '01800000000'],
            [
                'name' => 'Student',
                'email' => 'student@bcs.test',
                'role' => 'student',
                'password' => 'iamstudent',
            ],
        );

        $start = Carbon::parse('2026-09-13');
        $keepIds = [];

        foreach ($this->topics() as $index => $topic) {
            $date = $start->copy()->addDays($index);

            $item = RoutineItem::query()->updateOrCreate(
                ['position' => $index + 1],
                [
                    'date' => $date->toDateString(),
                    'weekday' => $date->format('D'),
                    'subject' => $topic[0],
                    'task' => $topic[1],
                ],
            );

            $keepIds[] = $item->id;
        }

        RoutineItem::query()->whereNotIn('id', $keepIds)->delete();
    }

    /**
     * @return list<array{0: string, 1: string}>
     */
    private function topics(): array
    {
        return [
            ['International Affairs', 'Chapter 1 — read and note the full chapter'],
            ['International Affairs', 'Chapter 5 (day 1 of 2)'],
            ['International Affairs', 'Chapter 5 — finish'],
            ['International Affairs', 'Current affairs + IA notes / MCQ (buffer)'],
            ['International Affairs', 'Chapter 4 (day 1 of 2)'],
            ['International Affairs', 'Chapter 4 — finish'],
            ['International Affairs', 'Chapter 2 (day 1 of 2)'],
            ['IA + Bangladesh Affairs', 'Finish IA Chapter 2 · BA Chapter 1 (1905 → end)'],
            ['Bangladesh Affairs', 'Chapter 6 — Constitution (day 1 of 2)'],
            ['Bangladesh Affairs', 'Chapter 6 — Constitution — finish'],
            ['Bangladesh Affairs', 'Chapters 7 and 8 (day 1 of 2)'],
            ['Bangladesh Affairs', 'Chapters 7 and 8 — finish'],
            ['Bangladesh Affairs', 'Full BA revision'],
            ['Rest', 'Newspaper only'],
            ['Bangladesh Affairs', 'Leftover + weak-topic drill'],
            ['Bangla Grammar', 'Word class, demonstratives, case and inflection'],
            ['Bangla Grammar', 'Compounds, non-finite verbs, and derivational suffixes'],
            ['Bangla Grammar', 'Sandhi'],
            ['Bangla Grammar', 'Word origin and class'],
            ['Bangla Grammar', 'Sentence, voice, and condensation'],
            ['Bangla Grammar', 'Sound, letters, sound change, and spelling'],
            ['Bangla Grammar', 'Root, suffix, and origin'],
            ['Bangla Grammar', 'Idioms and miscellaneous topics (morning and evening)'],
            ['Bangla Literature', 'Ancient and medieval literature'],
            ['Bangla Literature', 'Modern poetry'],
            ['Bangla Literature', 'Novel and short story'],
            ['Bangla Literature', 'Drama'],
            ['Bangla Literature', 'Essays, criticism, and literary terms'],
            ['Bangla Literature', 'Authors, works, and revision'],
            ['English', 'Day 1 of 4'],
            ['English', 'Day 2 of 4'],
            ['English', 'Day 3 of 4'],
            ['English', 'Day 4 of 4'],
            ['Banking & Finance', 'Day 1 of 4'],
            ['Banking & Finance', 'Day 2 of 4'],
            ['Banking & Finance', 'Day 3 of 4'],
            ['Banking & Finance', 'Day 4 of 4 — mock viva'],
        ];
    }
}
