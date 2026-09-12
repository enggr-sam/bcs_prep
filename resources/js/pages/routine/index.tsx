import { Head, router } from '@inertiajs/react';
import ShellLayout from '@/layouts/shell-layout';
import { type RoutineItem } from '@/types';

function formatDate(value: string): string {
    const [, month, day] = value.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${Number(day)} ${months[Number(month) - 1]}`;
}

export default function RoutineIndex({
    items,
    today,
    doneCount,
    totalCount,
    canCheck,
}: {
    items: RoutineItem[];
    today: string;
    doneCount: number;
    totalCount: number;
    canCheck: boolean;
}) {
    const percent = totalCount === 0 ? 0 : Math.round((doneCount / totalCount) * 100);

    const toggle = (item: RoutineItem) => {
        if (!canCheck) {
            return;
        }

        router.post(route('routine.toggle', item.id), {}, { preserveScroll: true });
    };

    return (
        <ShellLayout title="Study routine">
            <Head title="Routine" />
            <h1 className="mb-1 text-2xl font-semibold">Routine</h1>
            <p className="mb-5 text-sm text-neutral-500">13 September 2026 → 19 October 2026</p>

            <div className="space-y-3 pb-28 md:space-y-0 md:overflow-x-auto md:rounded-lg md:border md:border-neutral-200 md:bg-white md:pb-0">
                <div className="hidden md:block">
                    <table className="w-full min-w-[720px] text-left text-sm">
                        <thead className="bg-neutral-100 text-neutral-600">
                            <tr>
                                {canCheck ? <th className="w-14 px-3 py-2 font-medium">Done</th> : null}
                                <th className="px-3 py-2 font-medium">Date</th>
                                <th className="px-3 py-2 font-medium">Day</th>
                                <th className="px-3 py-2 font-medium">Subject</th>
                                <th className="px-3 py-2 font-medium">Do</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => {
                                const isToday = item.date === today;
                                return (
                                    <tr
                                        key={item.id}
                                        className={
                                            isToday
                                                ? 'bg-amber-50 font-medium'
                                                : item.done
                                                  ? 'border-t border-neutral-100 bg-emerald-50/50 text-neutral-500'
                                                  : 'border-t border-neutral-100'
                                        }
                                    >
                                        {canCheck ? (
                                            <td className="px-3 py-2">
                                                <input
                                                    type="checkbox"
                                                    className="size-5 accent-emerald-600"
                                                    checked={Boolean(item.done)}
                                                    onChange={() => toggle(item)}
                                                    aria-label={`Mark ${item.subject} done`}
                                                />
                                            </td>
                                        ) : null}
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            {formatDate(item.date)}
                                            {isToday ? <span className="ml-2 text-xs text-amber-800">Today</span> : null}
                                        </td>
                                        <td className="px-3 py-2">{item.weekday}</td>
                                        <td className="px-3 py-2">{item.subject}</td>
                                        <td className={`px-3 py-2 ${item.done ? 'line-through' : ''}`}>{item.task}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="md:hidden">
                    {items.map((item) => {
                        const isToday = item.date === today;
                        return (
                            <article
                                key={item.id}
                                className={`rounded-xl border bg-white p-4 ${
                                    isToday ? 'border-amber-300 bg-amber-50' : item.done ? 'border-emerald-200 bg-emerald-50/40' : 'border-neutral-200'
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    {canCheck ? (
                                        <input
                                            type="checkbox"
                                            className="mt-1 size-6 shrink-0 accent-emerald-600"
                                            checked={Boolean(item.done)}
                                            onChange={() => toggle(item)}
                                            aria-label={`Mark ${item.subject} done`}
                                        />
                                    ) : null}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                                            <span className="font-medium text-neutral-800">
                                                {item.weekday}, {formatDate(item.date)}
                                            </span>
                                            {isToday ? (
                                                <span className="rounded-full bg-amber-200 px-2 py-0.5 font-medium text-amber-900">Today</span>
                                            ) : null}
                                        </div>
                                        <p className="mt-1 font-medium">{item.subject}</p>
                                        <p className={`mt-1 text-sm text-neutral-600 ${item.done ? 'line-through' : ''}`}>{item.task}</p>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>

            {canCheck ? (
                <div className="fixed inset-x-0 bottom-0 z-10 border-t border-neutral-200 bg-white/95 p-4 backdrop-blur md:static md:mt-6 md:rounded-xl md:border md:bg-white">
                    <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
                        <div>
                            <p className="text-sm font-semibold">Your progress</p>
                            <p className="text-xs text-neutral-500">
                                {doneCount} of {totalCount} days finished
                            </p>
                        </div>
                        <p className="text-lg font-semibold text-emerald-700">{percent}%</p>
                    </div>
                    <div className="mx-auto mt-2 h-2 max-w-5xl overflow-hidden rounded-full bg-neutral-200">
                        <div className="h-full rounded-full bg-emerald-600 transition-all" style={{ width: `${percent}%` }} />
                    </div>
                </div>
            ) : (
                <p className="mt-6 text-sm text-neutral-500">{totalCount} days in this routine.</p>
            )}
        </ShellLayout>
    );
}
