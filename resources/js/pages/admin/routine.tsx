import { Head, useForm, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ShellLayout from '@/layouts/shell-layout';
import { type RoutineItem } from '@/types';

function formatDate(value: string): string {
    const [, month, day] = value.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${Number(day)} ${months[Number(month) - 1]}`;
}

export default function AdminRoutine({ items, today }: { items: RoutineItem[]; today: string }) {
    const [editingId, setEditingId] = useState<number | null>(null);

    const createForm = useForm({
        date: today,
        subject: '',
        task: '',
    });

    const editForm = useForm({
        date: '',
        subject: '',
        task: '',
    });

    const submitCreate = (e: FormEvent) => {
        e.preventDefault();
        createForm.post(route('admin.routine.store'), {
            preserveScroll: true,
            onSuccess: () => createForm.reset('subject', 'task'),
        });
    };

    const startEdit = (item: RoutineItem) => {
        setEditingId(item.id);
        editForm.setData({
            date: item.date,
            subject: item.subject,
            task: item.task,
        });
    };

    const submitEdit = (e: FormEvent) => {
        e.preventDefault();
        if (editingId === null) {
            return;
        }
        editForm.put(route('admin.routine.update', editingId), {
            preserveScroll: true,
            onSuccess: () => setEditingId(null),
        });
    };

    const remove = (item: RoutineItem) => {
        if (!window.confirm(`Delete ${formatDate(item.date)}?`)) {
            return;
        }
        router.delete(route('admin.routine.destroy', item.id), { preserveScroll: true });
    };

    return (
        <ShellLayout title="Manage routine">
            <Head title="Manage routine" />
            <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold">Manage routine</h1>
                    <p className="text-sm text-neutral-500">Students see this table after they log in.</p>
                </div>
                <a href={route('routine.index')} className="text-sm underline">
                    Student view
                </a>
            </div>

            <form onSubmit={submitCreate} className="mb-8 grid gap-3 rounded-lg border border-neutral-200 bg-white p-4 md:grid-cols-4">
                <div className="grid gap-1">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" type="date" value={createForm.data.date} onChange={(e) => createForm.setData('date', e.target.value)} required />
                    <InputError message={createForm.errors.date} />
                </div>
                <div className="grid gap-1">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" value={createForm.data.subject} onChange={(e) => createForm.setData('subject', e.target.value)} required />
                    <InputError message={createForm.errors.subject} />
                </div>
                <div className="grid gap-1 md:col-span-2">
                    <Label htmlFor="task">Do</Label>
                    <Input id="task" value={createForm.data.task} onChange={(e) => createForm.setData('task', e.target.value)} required />
                    <InputError message={createForm.errors.task} />
                </div>
                <div className="md:col-span-4">
                    <Button type="submit" disabled={createForm.processing}>
                        Add day
                    </Button>
                </div>
            </form>

            <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
                <table className="w-full min-w-[720px] text-left text-sm">
                    <thead className="bg-neutral-100 text-neutral-600">
                        <tr>
                            <th className="px-3 py-2 font-medium">Date</th>
                            <th className="px-3 py-2 font-medium">Day</th>
                            <th className="px-3 py-2 font-medium">Subject</th>
                            <th className="px-3 py-2 font-medium">Do</th>
                            <th className="px-3 py-2 font-medium"> </th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr key={item.id} className={item.date === today ? 'bg-amber-50' : 'border-t border-neutral-100'}>
                                {editingId === item.id ? (
                                    <td colSpan={5} className="px-3 py-3">
                                        <form onSubmit={submitEdit} className="grid gap-2 md:grid-cols-4">
                                            <Input type="date" value={editForm.data.date} onChange={(e) => editForm.setData('date', e.target.value)} required />
                                            <Input value={editForm.data.subject} onChange={(e) => editForm.setData('subject', e.target.value)} required />
                                            <Input className="md:col-span-2" value={editForm.data.task} onChange={(e) => editForm.setData('task', e.target.value)} required />
                                            <div className="flex gap-2 md:col-span-4">
                                                <Button type="submit" size="sm" disabled={editForm.processing}>
                                                    Save
                                                </Button>
                                                <Button type="button" size="sm" variant="outline" onClick={() => setEditingId(null)}>
                                                    Cancel
                                                </Button>
                                            </div>
                                        </form>
                                    </td>
                                ) : (
                                    <>
                                        <td className="px-3 py-2 whitespace-nowrap">{formatDate(item.date)}</td>
                                        <td className="px-3 py-2">{item.weekday}</td>
                                        <td className="px-3 py-2">{item.subject}</td>
                                        <td className="px-3 py-2">{item.task}</td>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            <button type="button" className="mr-3 underline" onClick={() => startEdit(item)}>
                                                Edit
                                            </button>
                                            <button type="button" className="underline" onClick={() => remove(item)}>
                                                Delete
                                            </button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </ShellLayout>
    );
}
