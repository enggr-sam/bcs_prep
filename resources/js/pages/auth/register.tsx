import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        mobile: '',
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <AuthLayout title="Student register" description="Only mobile number and password">
            <Head title="Register" />
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
                        minLength={6}
                        autoComplete="new-password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="At least 6 characters"
                    />
                    <InputError message={errors.password} />
                </div>
                <Button type="submit" className="w-full" disabled={processing}>
                    Create student account
                </Button>
                <p className="text-muted-foreground text-center text-sm">
                    Already registered? <TextLink href={route('login')}>Log in</TextLink>
                </p>
            </form>
        </AuthLayout>
    );
}
