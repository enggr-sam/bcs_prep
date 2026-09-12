import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function Login({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        mobile: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <AuthLayout title="Log in" description="Use your mobile number and password">
            <Head title="Log in" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-2">
                    <Label htmlFor="mobile">Mobile</Label>
                    <Input
                        id="mobile"
                        type="tel"
                        required
                        autoFocus
                        inputMode="numeric"
                        autoComplete="username"
                        value={data.mobile}
                        onChange={(e) => setData('mobile', e.target.value)}
                        placeholder="01XXXXXXXXX"
                    />
                    <InputError message={errors.mobile} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        required
                        autoComplete="current-password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="Password"
                    />
                    <InputError message={errors.password} />
                </div>
                <Button type="submit" className="w-full" disabled={processing}>
                    Log in
                </Button>
                <p className="text-muted-foreground text-center text-sm">
                    Student?{' '}
                    <TextLink href={route('register')}>Register with mobile</TextLink>
                </p>
            </form>
            {status ? <p className="text-center text-sm text-green-700">{status}</p> : null}
        </AuthLayout>
    );
}
