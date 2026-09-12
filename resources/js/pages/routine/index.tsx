import { Head } from '@inertiajs/react';
import ShellLayout from '@/layouts/shell-layout';
import { type RoutineItem } from '@/types';

function formatDate(value: string): string {
    const [, month, day] = value.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${Number(day)} ${months[Number(month) - 1]}`;
}

export default function RoutineIndex({ items, today }: { items: RoutineItem[]; today: string }) {
    return (
        <ShellLayout title="Study routine">
            <Head title="Routine" />
            <h1 className="mb-2 text-2xl font-semibold">Routine</h1>
            <p className="mb-6 text-sm text-neutral-500">12 September 2026 → 18 October 2026</p>
            <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
                <table className="w-full min-w-[640px] text-left text-sm">
                    <thead className="bg-neutral-100 text-neutral-600">
                        <tr>
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
                                <tr key={item.id} className={isToday ? 'bg-amber-50 font-medium' : 'border-t border-neutral-100'}>
                                    <td className="px-3 py-2 whitespace-nowrap">
                                        {formatDate(item.date)}
                                        {isToday ? <span className="ml-2 text-xs text-amber-800">Today</span> : null}
                                    </td>
                                    <td className="px-3 py-2">{item.weekday}</td>
                                    <td className="px-3 py-2">{item.subject}</td>
                                    <td className="px-3 py-2">{item.task}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </ShellLayout>
    );
}
