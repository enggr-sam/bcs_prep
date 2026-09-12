import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { type SharedData } from '@/types';

export default function ShellLayout({ children, title }: PropsWithChildren<{ title: string }>) {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    return (
        <div className="min-h-svh bg-neutral-50 text-neutral-900">
            <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white">
                <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4">
                    <div className="min-w-0">
                        <p className="text-sm font-semibold">BCS Prep</p>
                        <p className="truncate text-xs text-neutral-500">{title}</p>
                    </div>
                    {user ? (
                        <div className="flex shrink-0 items-center gap-3 text-sm">
                            <span className="hidden text-neutral-500 sm:inline">
                                {user.mobile}
                                {user.role === 'admin' ? ' · admin' : ''}
                            </span>
                            {user.role === 'admin' ? (
                                <Link href={route('admin.routine.index')} className="hover:underline">
                                    Edit
                                </Link>
                            ) : null}
                            <Link href={route('logout')} method="post" as="button" className="hover:underline">
                                Log out
                            </Link>
                        </div>
                    ) : null}
                </div>
            </header>
            <main className="mx-auto max-w-5xl px-4 py-5 md:py-8">{children}</main>
        </div>
    );
}
