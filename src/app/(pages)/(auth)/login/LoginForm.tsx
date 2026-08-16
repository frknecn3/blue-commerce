'use client'
import Input from '@/components/Common/Input'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import React, { ChangeEvent, useState } from 'react'
import { toast } from 'sonner'
import { FiLogIn } from 'react-icons/fi'

type Props = {}

const LoginForm = (props: Props): React.ReactElement => {
    const router = useRouter();
    const [data, setData] = useState<{ email: string, password: string }>({ email: "", password: "" })
    const [loading, setLoading] = useState<boolean>(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const clearFieldError = (field: string) => {
        if (fieldErrors[field]) {
            setFieldErrors(prev => {
                const next = { ...prev };
                delete next[field];
                return next;
            });
        }
    };

    // form submit event
    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();

        const errors: Record<string, string> = {};

        if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            errors.email = "Please enter a valid email address.";
        }
        if (!data.password) {
            errors.password = "Password is required.";
        }

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            toast.error(Object.values(errors)[0]);
            return;
        }

        setLoading(true);
        setFieldErrors({});

        // login func from nauth
        const callback = await signIn('credentials', {
            ...data,
            redirect: false
        });

        setLoading(false);

        if (callback?.ok) {
            toast.success('Login successful! Redirecting...');
            router.replace('/');
        }

        if (callback?.error) {
            const errorMsg = 'Invalid email or password.';
            setFieldErrors({
                email: errorMsg,
                password: errorMsg
            });
            toast.error(errorMsg);
        }
    }

    return (
        <div className="w-full flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md bg-white border border-sky-200 shadow-md rounded-xl p-8 flex flex-col items-center">
                {/* Header */}
                <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center text-blue-600 mb-3">
                        <FiLogIn className="text-xl" />
                    </div>
                    <h1 className="text-xl font-bold text-slate-900">Welcome Back</h1>
                    <p className="text-xs text-slate-500 mt-1">Sign in to your BluE-Commerce account</p>
                </div>

                {/* Single Form */}
                <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
                    <Input
                        id="email"
                        label="E-mail"
                        placeholder="example@info.com"
                        type="email"
                        defaultValue={data.email}
                        error={fieldErrors.email}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setData(prev => ({ ...prev, email: e.target.value }));
                            clearFieldError('email');
                        }}
                    />

                    <Input
                        id="password"
                        label="Password"
                        placeholder="Enter password"
                        type="password"
                        defaultValue={data.password}
                        error={fieldErrors.password}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setData(prev => ({ ...prev, password: e.target.value }));
                            clearFieldError('password');
                        }}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs py-3 px-4 rounded-md shadow-xs transition-colors mt-2 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                {/* Footer link */}
                <div className="mt-6 pt-4 border-t border-slate-100 w-full text-center">
                    <p className="text-xs text-slate-500">
                        Don't have an account?{' '}
                        <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                            Register now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LoginForm