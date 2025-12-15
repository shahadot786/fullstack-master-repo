'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store/auth';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function VerifyEmailPage() {
    const [otp, setOtp] = useState('');
    const [countdown, setCountdown] = useState(0);
    const { user, verifyEmail, resendVerificationOTP, isLoading } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }

        if (user.isEmailVerified) {
            router.push('/dashboard');
        }
    }, [user, router]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleVerify = async () => {
        if (otp.length !== 6) {
            toast.error('Please enter a 6-digit code');
            return;
        }

        try {
            await verifyEmail({ email: user!.email, otp });
            toast.success('Email verified successfully!');
            router.push('/dashboard');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Verification failed');
        }
    };

    const handleResend = async () => {
        try {
            await resendVerificationOTP(user!.email);
            toast.success('Verification code sent!');
            setCountdown(60);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to resend code');
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Verify Your Email
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        We sent a 6-digit code to
                        <br />
                        <span className="font-medium text-gray-900">{user.email}</span>
                    </p>
                </div>

                <div className="mt-8 space-y-6">
                    <div>
                        <label htmlFor="otp" className="block text-sm font-medium text-gray-700 text-center mb-2">
                            Enter verification code
                        </label>
                        <input
                            id="otp"
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            maxLength={6}
                            className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-center text-2xl tracking-widest font-mono"
                            placeholder="000000"
                        />
                    </div>

                    <div>
                        <button
                            onClick={handleVerify}
                            disabled={isLoading || otp.length !== 6}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Verifying...' : 'Verify Email'}
                        </button>
                    </div>

                    <div className="text-center">
                        <button
                            onClick={handleResend}
                            disabled={isLoading || countdown > 0}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {countdown > 0
                                ? `Resend code in ${countdown}s`
                                : 'Resend verification code'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
