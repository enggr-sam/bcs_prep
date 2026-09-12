import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { type SharedData } from '@/types';

export default function ShellLayout({ children, title }: PropsWithChildren<{ title: string }>) {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    return (
        <div className="min-h-svh bg-neutral-50 text-neutral-900">
            <header className="border-b border-neutral-200 bg-white">
                <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
                    <div>
                        <p className="text-sm font-semibold">BCS Prep</p>
                        <p className="text-xs text-neutral-500">{title}</p>
                    </div>
                    {user ? (
                        <div className="flex items-center gap-4 text-sm">
                            <span className="text-neutral-500">
                                {user.mobile}
                                {user.role === 'admin' ? ' · admin' : ''}
                            </span>
                            {user.role === 'admin' ? (
                                <Link href={route('admin.routine.index')} className="hover:underline">
                                    Edit routine
                                </Link>
                            ) : null}
                            <Link href={route('logout')} method="post" as="button" className="hover:underline">
                                Log out
                            </Link>
                        </div>
                    ) : null}
                </div>
            </header>
            <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        </div>
    );
}
