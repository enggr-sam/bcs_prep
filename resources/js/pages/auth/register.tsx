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
        name: '',
        mobile: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <AuthLayout title="Student register" description="Name and mobile only. You will log in with the class password.">
            <Head title="Register" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        type="text"
                        required
                        autoFocus
                        autoComplete="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Your name"
                    />
                    <InputError message={errors.name} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="mobile">Mobile</Label>
                    <Input
                        id="mobile"
                        type="tel"
                        required
                        inputMode="numeric"
                        autoComplete="username"
                        value={data.mobile}
                        onChange={(e) => setData('mobile', e.target.value)}
                        placeholder="01XXXXXXXXX"
                    />
                    <InputError message={errors.mobile} />
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
