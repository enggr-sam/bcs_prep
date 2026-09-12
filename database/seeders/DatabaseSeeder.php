<?php

namespace Database\Seeders;

use App\Models\RoutineItem;
use App\Models\User;
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
                'password' => 'password',
            ],
        );

        User::query()->updateOrCreate(
            ['mobile' => '01800000000'],
            [
                'name' => 'Student',
                'email' => 'student@bcs.test',
                'role' => 'student',
                'password' => 'password',
            ],
        );

        if (RoutineItem::query()->exists()) {
            return;
        }

        foreach ($this->routine() as $index => $row) {
            RoutineItem::query()->create([
                ...$row,
                'position' => $index + 1,
            ]);
        }
    }

    /**
     * @return list<array{date: string, weekday: string, subject: string, task: string}>
     */
    private function routine(): array
    {
        return [
            ['date' => '2026-09-12', 'weekday' => 'Sat', 'subject' => 'International Affairs', 'task' => 'Chapter 1 — read and note the full chapter'],
            ['date' => '2026-09-13', 'weekday' => 'Sun', 'subject' => 'International Affairs', 'task' => 'Chapter 5 (day 1 of 2)'],
            ['date' => '2026-09-14', 'weekday' => 'Mon', 'subject' => 'International Affairs', 'task' => 'Chapter 5 — finish'],
            ['date' => '2026-09-15', 'weekday' => 'Tue', 'subject' => 'International Affairs', 'task' => 'Current affairs + IA notes / MCQ (buffer)'],
            ['date' => '2026-09-16', 'weekday' => 'Wed', 'subject' => 'International Affairs', 'task' => 'Chapter 4 (day 1 of 2)'],
            ['date' => '2026-09-17', 'weekday' => 'Thu', 'subject' => 'International Affairs', 'task' => 'Chapter 4 — finish'],
            ['date' => '2026-09-18', 'weekday' => 'Fri', 'subject' => 'International Affairs', 'task' => 'Chapter 2 (day 1 of 2)'],
            ['date' => '2026-09-19', 'weekday' => 'Sat', 'subject' => 'IA + Bangladesh Affairs', 'task' => 'Finish IA Chapter 2 · BA Chapter 1 (1905 → end)'],
            ['date' => '2026-09-20', 'weekday' => 'Sun', 'subject' => 'Bangladesh Affairs', 'task' => 'Chapter 6 — Constitution (day 1 of 2)'],
            ['date' => '2026-09-21', 'weekday' => 'Mon', 'subject' => 'Bangladesh Affairs', 'task' => 'Chapter 6 — Constitution — finish'],
            ['date' => '2026-09-22', 'weekday' => 'Tue', 'subject' => 'Bangladesh Affairs', 'task' => 'Chapters 7 and 8 (day 1 of 2)'],
            ['date' => '2026-09-23', 'weekday' => 'Wed', 'subject' => 'Bangladesh Affairs', 'task' => 'Chapters 7 and 8 — finish'],
            ['date' => '2026-09-24', 'weekday' => 'Thu', 'subject' => 'Bangladesh Affairs', 'task' => 'Full BA revision'],
            ['date' => '2026-09-25', 'weekday' => 'Fri', 'subject' => 'Rest', 'task' => 'Newspaper only'],
            ['date' => '2026-09-26', 'weekday' => 'Sat', 'subject' => 'Bangladesh Affairs', 'task' => 'Leftover + weak-topic drill'],
            ['date' => '2026-09-27', 'weekday' => 'Sun', 'subject' => 'Bangla Grammar', 'task' => 'Word class, demonstratives, case and inflection'],
            ['date' => '2026-09-28', 'weekday' => 'Mon', 'subject' => 'Bangla Grammar', 'task' => 'Compounds, non-finite verbs, and derivational suffixes'],
            ['date' => '2026-09-29', 'weekday' => 'Tue', 'subject' => 'Bangla Grammar', 'task' => 'Sandhi'],
            ['date' => '2026-09-30', 'weekday' => 'Wed', 'subject' => 'Bangla Grammar', 'task' => 'Word origin and class'],
            ['date' => '2026-10-01', 'weekday' => 'Thu', 'subject' => 'Bangla Grammar', 'task' => 'Sentence, voice, and condensation'],
            ['date' => '2026-10-02', 'weekday' => 'Fri', 'subject' => 'Bangla Grammar', 'task' => 'Sound, letters, sound change, and spelling'],
            ['date' => '2026-10-03', 'weekday' => 'Sat', 'subject' => 'Bangla Grammar', 'task' => 'Root, suffix, and origin'],
            ['date' => '2026-10-04', 'weekday' => 'Sun', 'subject' => 'Bangla Grammar', 'task' => 'Idioms and miscellaneous topics (morning and evening)'],
            ['date' => '2026-10-05', 'weekday' => 'Mon', 'subject' => 'Bangla Literature', 'task' => 'Ancient and medieval literature'],
            ['date' => '2026-10-06', 'weekday' => 'Tue', 'subject' => 'Bangla Literature', 'task' => 'Modern poetry'],
            ['date' => '2026-10-07', 'weekday' => 'Wed', 'subject' => 'Bangla Literature', 'task' => 'Novel and short story'],
            ['date' => '2026-10-08', 'weekday' => 'Thu', 'subject' => 'Bangla Literature', 'task' => 'Drama'],
            ['date' => '2026-10-09', 'weekday' => 'Fri', 'subject' => 'Bangla Literature', 'task' => 'Essays, criticism, and literary terms'],
            ['date' => '2026-10-10', 'weekday' => 'Sat', 'subject' => 'Bangla Literature', 'task' => 'Authors, works, and revision'],
            ['date' => '2026-10-11', 'weekday' => 'Sun', 'subject' => 'English', 'task' => 'Day 1 of 4'],
            ['date' => '2026-10-12', 'weekday' => 'Mon', 'subject' => 'English', 'task' => 'Day 2 of 4'],
            ['date' => '2026-10-13', 'weekday' => 'Tue', 'subject' => 'English', 'task' => 'Day 3 of 4'],
            ['date' => '2026-10-14', 'weekday' => 'Wed', 'subject' => 'English', 'task' => 'Day 4 of 4'],
            ['date' => '2026-10-15', 'weekday' => 'Thu', 'subject' => 'Banking & Finance', 'task' => 'Day 1 of 4'],
            ['date' => '2026-10-16', 'weekday' => 'Fri', 'subject' => 'Banking & Finance', 'task' => 'Day 2 of 4'],
            ['date' => '2026-10-17', 'weekday' => 'Sat', 'subject' => 'Banking & Finance', 'task' => 'Day 3 of 4'],
            ['date' => '2026-10-18', 'weekday' => 'Sun', 'subject' => 'Banking & Finance', 'task' => 'Day 4 of 4 — mock viva'],
        ];
    }
}
