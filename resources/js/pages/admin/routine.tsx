import { Head, router, useForm, usePage } from '@inertiajs/react';
import { FormEvent, useMemo, useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ShellLayout from '@/layouts/shell-layout';
import { type AdminDay, type AdminStudent, type SharedData } from '@/types';

function formatDate(value: string): string {
    const [year, month, day] = value.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return `${Number(day)} ${months[Number(month) - 1]} ${year}`;
}

function weekdayFor(value: string): string {
    if (!value) {
        return '';
    }

    const parsed = new Date(`${value}T00:00:00`);

    if (Number.isNaN(parsed.getTime())) {
        return '';
    }

    return parsed.toLocaleDateString('en-GB', { weekday: 'short' });
}

export default function AdminRoutine({
    items,
    students,
    today,
}: {
    items: AdminDay[];
    students: AdminStudent[];
    today: string;
}) {
    const { status } = usePage<SharedData>().props;
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

    const createWeekday = useMemo(() => weekdayFor(createForm.data.date), [createForm.data.date]);

    const submitCreate = (e: FormEvent) => {
        e.preventDefault();
        createForm.post(route('admin.routine.store'), {
            preserveScroll: true,
            onSuccess: () => createForm.reset('subject', 'task'),
        });
    };

    const startEdit = (item: AdminDay) => {
        setEditingId(item.id);
        editForm.clearErrors();
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

    const removeDay = (item: AdminDay) => {
        if (!window.confirm(`Remove ${formatDate(item.date)} and every student tick for that day?`)) {
            return;
        }

        router.delete(route('admin.routine.destroy', item.id), { preserveScroll: true });
    };

    const removeStudent = (student: AdminStudent) => {
        if (!window.confirm(`Remove ${student.name} and all of their ticks?`)) {
            return;
        }

        router.delete(route('admin.students.destroy', student.id), { preserveScroll: true });
    };

    return (
        <ShellLayout title="Admin">
            <Head title="Admin" />

            <h1 className="text-2xl font-semibold">Admin</h1>
            <p className="mt-1 text-sm text-neutral-600">Add or remove days, and remove a student with all of their records.</p>

            {status ? <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{status}</p> : null}

            <section className="mt-6 rounded-2xl border border-neutral-200 bg-white p-4 md:p-5">
                <h2 className="text-lg font-semibold">Students</h2>
                <p className="mt-1 text-sm text-neutral-500">
                    {students.length === 0 ? 'No students yet. They register with name and mobile.' : `${students.length} registered`}
                </p>

                <div className="mt-4 space-y-3">
                    {students.map((student) => (
                        <div key={student.id} className="flex flex-col gap-3 rounded-xl border border-neutral-200 p-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0">
                                <p className="text-base font-medium">{student.name}</p>
                                <p className="text-sm text-neutral-500">{student.mobile}</p>
                                <p className="mt-1 text-sm text-neutral-600">
                                    {student.done} / {student.total} days done
                                </p>
                            </div>
                            <Button type="button" variant="destructive" onClick={() => removeStudent(student)}>
                                Remove student
                            </Button>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mt-6 rounded-2xl border border-neutral-200 bg-white p-4 md:p-5">
                <h2 className="text-lg font-semibold">Add a day</h2>
                <p className="mt-1 text-sm text-neutral-500">Pick the date, then write the subject and what to do.</p>

                <form onSubmit={submitCreate} className="mt-4 grid gap-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-1.5">
                            <Label htmlFor="date">Date</Label>
                            <Input id="date" type="date" value={createForm.data.date} onChange={(e) => createForm.setData('date', e.target.value)} required />
                            <p className="text-sm text-neutral-500">{createWeekday || 'Choose a date'}</p>
                            <InputError message={createForm.errors.date} />
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="subject">Subject</Label>
                            <Input
                                id="subject"
                                value={createForm.data.subject}
                                onChange={(e) => createForm.setData('subject', e.target.value)}
                                placeholder="Bangladesh Affairs"
                                required
                            />
                            <InputError message={createForm.errors.subject} />
                        </div>
                    </div>
                    <div className="grid gap-1.5">
                        <Label htmlFor="task">What to do</Label>
                        <textarea
                            id="task"
                            required
                            rows={3}
                            value={createForm.data.task}
                            onChange={(e) => createForm.setData('task', e.target.value)}
                            placeholder="Chapter 1 — read and note the full chapter"
                            className="border-input placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs focus-visible:ring-1 focus-visible:outline-hidden md:text-sm"
                        />
                        <InputError message={createForm.errors.task} />
                    </div>
                    <div>
                        <Button type="submit" disabled={createForm.processing}>
                            {createForm.processing ? 'Saving…' : 'Add day'}
                        </Button>
                    </div>
                </form>
            </section>

            <section className="mt-6 rounded-2xl border border-neutral-200 bg-white p-4 md:p-5">
                <h2 className="text-lg font-semibold">Routine days</h2>
                <p className="mt-1 text-sm text-neutral-500">
                    {items.length === 0 ? 'No days yet. Add one above.' : `${items.length} days in the routine`}
                </p>

                <div className="mt-4 space-y-3">
                    {items.map((item) => (
                        <article
                            key={item.id}
                            className={`rounded-xl border p-4 ${item.date === today ? 'border-amber-300 bg-amber-50' : 'border-neutral-200'}`}
                        >
                            {editingId === item.id ? (
                                <form onSubmit={submitEdit} className="grid gap-3">
                                    <div className="grid gap-3 md:grid-cols-2">
                                        <div className="grid gap-1.5">
                                            <Label>Date</Label>
                                            <Input type="date" value={editForm.data.date} onChange={(e) => editForm.setData('date', e.target.value)} required />
                                            <InputError message={editForm.errors.date} />
                                        </div>
                                        <div className="grid gap-1.5">
                                            <Label>Subject</Label>
                                            <Input value={editForm.data.subject} onChange={(e) => editForm.setData('subject', e.target.value)} required />
                                            <InputError message={editForm.errors.subject} />
                                        </div>
                                    </div>
                                    <div className="grid gap-1.5">
                                        <Label>What to do</Label>
                                        <textarea
                                            required
                                            rows={3}
                                            value={editForm.data.task}
                                            onChange={(e) => editForm.setData('task', e.target.value)}
                                            className="border-input focus-visible:ring-ring flex w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs focus-visible:ring-1 focus-visible:outline-hidden md:text-sm"
                                        />
                                        <InputError message={editForm.errors.task} />
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <Button type="submit" disabled={editForm.processing}>
                                            Save changes
                                        </Button>
                                        <Button type="button" variant="outline" onClick={() => setEditingId(null)}>
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-600">
                                        <span className="text-base font-semibold text-neutral-900">
                                            {item.weekday}, {formatDate(item.date)}
                                        </span>
                                        {item.date === today ? (
                                            <span className="rounded-full bg-amber-200 px-2 py-0.5 text-xs font-medium text-amber-900">Today</span>
                                        ) : null}
                                        <span className="text-xs text-neutral-500">{item.ticks} ticks</span>
                                    </div>
                                    <p className="mt-2 text-base font-medium">{item.subject}</p>
                                    <p className="mt-1 text-sm leading-6 text-neutral-700">{item.task}</p>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <Button type="button" variant="outline" onClick={() => startEdit(item)}>
                                            Edit
                                        </Button>
                                        <Button type="button" variant="destructive" onClick={() => removeDay(item)}>
                                            Remove day
                                        </Button>
                                    </div>
                                </>
                            )}
                        </article>
                    ))}
                </div>
            </section>
        </ShellLayout>
    );
}
