import { Head, router } from '@inertiajs/react';
import ShellLayout from '@/layouts/shell-layout';
import { type RoutineItem, type Standing, type StudentMark } from '@/types';

function formatDate(value: string): string {
    const [, month, day] = value.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${Number(day)} ${months[Number(month) - 1]}`;
}

function ModernCheck({
    checked,
    disabled,
    label,
    mine,
    onToggle,
}: {
    checked: boolean;
    disabled: boolean;
    label: string;
    mine: boolean;
    onToggle?: () => void;
}) {
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onToggle}
            title={mine ? `You · ${label}` : label}
            className={`inline-flex max-w-[9.5rem] items-center gap-1.5 rounded-full border px-2 py-1 text-left transition ${
                checked
                    ? mine
                        ? 'border-emerald-700 bg-emerald-100 text-emerald-950'
                        : 'border-emerald-400 bg-emerald-50 text-emerald-900'
                    : mine
                      ? 'border-neutral-400 bg-white text-neutral-900'
                      : 'border-neutral-200 bg-white text-neutral-800'
            } ${disabled ? 'cursor-default' : 'cursor-pointer hover:scale-[1.02]'}`}
            aria-label={mine ? `Mark day done, ${label}` : `${label} ${checked ? 'done' : 'not done'}`}
        >
            <span
                className={`inline-flex size-4 shrink-0 items-center justify-center rounded-full border ${
                    checked ? 'border-emerald-700 bg-white text-emerald-800' : mine ? 'border-neutral-400' : 'border-neutral-300'
                }`}
            >
                {checked ? (
                    <svg viewBox="0 0 20 20" className="size-3 fill-none stroke-current stroke-[2.5]">
                        <path d="M5 10.5 8.2 14 15 6" />
                    </svg>
                ) : null}
            </span>
            <span className="truncate text-xs font-semibold leading-none">{label}</span>
        </button>
    );
}

function MarkRow({
    marks,
    currentUserId,
    canCheck,
    onToggleMine,
}: {
    marks: StudentMark[];
    currentUserId: number | null;
    canCheck: boolean;
    onToggleMine: () => void;
}) {
    const mine = marks.find((mark) => mark.id === currentUserId);
    const others = marks.filter((mark) => mark.id !== currentUserId);
    const mineEnabled = canCheck;

    return (
        <div className="flex flex-wrap items-center gap-1.5">
            {mine ? (
                <ModernCheck
                    checked={mine.done}
                    disabled={!mineEnabled}
                    label={mine.label}
                    mine
                    onToggle={mineEnabled ? onToggleMine : undefined}
                />
            ) : null}
            {others.map((mark) => (
                <ModernCheck key={mark.id} checked={mark.done} disabled label={mark.label} mine={false} />
            ))}
        </div>
    );
}

export default function RoutineIndex({
    items,
    standings,
    today,
    currentUserId,
    canCheck,
}: {
    items: RoutineItem[];
    standings: Standing[];
    today: string;
    currentUserId: number | null;
    canCheck: boolean;
}) {
    const toggle = (item: RoutineItem) => {
        if (!canCheck || !item.canToggle) {
            return;
        }

        router.post(route('routine.toggle', item.id), {}, { preserveScroll: true });
    };

    return (
        <ShellLayout title="Study routine">
            <Head title="Routine" />
            <h1 className="mb-1 text-2xl font-semibold">Routine</h1>
            <p className="mb-5 text-sm text-neutral-500">
                13 September 2026 → 19 October 2026. You can tick only today and yesterday.
            </p>

            <div className="space-y-3 md:space-y-0 md:overflow-x-auto md:rounded-lg md:border md:border-neutral-200 md:bg-white">
                <div className="hidden md:block">
                    <table className="w-full min-w-[800px] text-left text-sm">
                        <thead className="bg-neutral-100 text-neutral-600">
                            <tr>
                                <th className="px-3 py-2 font-medium">Students</th>
                                <th className="px-3 py-2 font-medium">Date</th>
                                <th className="px-3 py-2 font-medium">Day</th>
                                <th className="px-3 py-2 font-medium">Subject</th>
                                <th className="px-3 py-2 font-medium">Do</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => {
                                const isToday = item.date === today;
                                const youDone = item.marks.some((mark) => mark.id === currentUserId && mark.done);
                                return (
                                    <tr
                                        key={item.id}
                                        className={
                                            isToday
                                                ? 'bg-amber-50 font-medium'
                                                : youDone
                                                  ? 'border-t border-neutral-100 bg-emerald-50/40'
                                                  : 'border-t border-neutral-100'
                                        }
                                    >
                                        <td className="px-3 py-2">
                                            <MarkRow
                                                marks={item.marks}
                                                currentUserId={currentUserId}
                                                canCheck={canCheck && item.canToggle}
                                                onToggleMine={() => toggle(item)}
                                            />
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            {formatDate(item.date)}
                                            {isToday ? <span className="ml-2 text-xs text-amber-800">Today</span> : null}
                                        </td>
                                        <td className="px-3 py-2">{item.weekday}</td>
                                        <td className="px-3 py-2">{item.subject}</td>
                                        <td className={`px-3 py-2 ${youDone ? 'text-neutral-500 line-through' : ''}`}>{item.task}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="space-y-3 md:hidden">
                    {items.map((item) => {
                        const isToday = item.date === today;
                        const youDone = item.marks.some((mark) => mark.id === currentUserId && mark.done);
                        return (
                            <article
                                key={item.id}
                                className={`rounded-xl border bg-white p-4 ${
                                    isToday ? 'border-amber-300 bg-amber-50' : youDone ? 'border-emerald-200 bg-emerald-50/40' : 'border-neutral-200'
                                }`}
                            >
                                <MarkRow
                                    marks={item.marks}
                                    currentUserId={currentUserId}
                                    canCheck={canCheck && item.canToggle}
                                    onToggleMine={() => toggle(item)}
                                />
                                <div className="mt-3">
                                    <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                                        <span className="font-medium text-neutral-800">
                                            {item.weekday}, {formatDate(item.date)}
                                        </span>
                                        {isToday ? (
                                            <span className="rounded-full bg-amber-200 px-2 py-0.5 font-medium text-amber-900">Today</span>
                                        ) : null}
                                    </div>
                                    <p className="mt-1 font-medium">{item.subject}</p>
                                    <p className={`mt-1 text-sm text-neutral-600 ${youDone ? 'line-through' : ''}`}>{item.task}</p>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>

            <section className="mt-6 rounded-xl border border-neutral-200 bg-white p-4">
                <h2 className="text-base font-semibold">Class progress</h2>
                <p className="mb-4 text-xs text-neutral-500">Who is ahead this week</p>
                <div className="space-y-3">
                    {standings.map((row) => (
                        <div
                            key={row.id}
                            className={`rounded-lg border p-3 ${row.isYou ? 'border-emerald-300 bg-emerald-50' : 'border-neutral-100'}`}
                        >
                            <div className="mb-1 flex items-center justify-between gap-3">
                                <p className="text-sm font-medium">
                                    #{row.rank} · {row.label}
                                    {row.isYou ? <span className="ml-2 text-xs font-normal text-emerald-700">you</span> : null}
                                </p>
                                <p className="text-sm font-semibold text-emerald-700">{row.percent}%</p>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-neutral-200">
                                <div className="h-full rounded-full bg-emerald-600" style={{ width: `${row.percent}%` }} />
                            </div>
                            <p className="mt-1 text-xs text-neutral-500">
                                {row.done} / {row.total} days
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </ShellLayout>
    );
}
