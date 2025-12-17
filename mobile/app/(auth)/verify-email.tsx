import React, { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams, Href } from 'expo-router';
import { ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { YStack, Text, H1 } from 'tamagui';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { verifyEmailSchema, VerifyEmailFormData } from '@/utils/validation';
import { authApi } from '@/api/auth.api';
import { APP_CONFIG } from '@/config/constants';

export default function VerifyEmailScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ email?: string }>();
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<VerifyEmailFormData>({
        resolver: zodResolver(verifyEmailSchema),
        defaultValues: {
            email: params.email || '',
            otp: '',
        },
    });

    useEffect(() => {
        if (params.email) {
            setValue('email', params.email);
        }
    }, [params.email]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const onSubmit = async (data: VerifyEmailFormData) => {
        setLoading(true);
        try {
            await authApi.verifyEmail(data);
            Alert.alert(
                'Email Verified',
                'Your email has been verified successfully. Please login.',
                [
                    {
                        text: 'OK',
                        onPress: () => router.replace('/(auth)/login' as Href),
                    },
                ]
            );
        } catch (error: any) {
            Alert.alert('Verification Failed', error.message || 'Invalid or expired OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async (email: string) => {
        if (countdown > 0) return;

        setResendLoading(true);
        try {
            await authApi.resendOTP({ email });
            setCountdown(APP_CONFIG.OTP_RESEND_COOLDOWN);
            Alert.alert('OTP Sent', 'A new verification code has been sent to your email.');
        } catch (error: any) {
            Alert.alert('Resend Failed', error.message || 'Failed to resend OTP');
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                <YStack
                    flex={1}
                    padding="$6"
                    justifyContent="center"
                    gap="$4"
                    backgroundColor="$background"
                >
                    <H1 color="$color" marginBottom="$4">
                        Verify Email
                    </H1>
                    <Text color="$color" opacity={0.7} marginBottom="$6">
                        Enter the 6-digit code sent to your email
                    </Text>

                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { onChange, value } }) => (
                            <Input
                                label="Email"
                                placeholder="Enter your email"
                                value={value}
                                onChangeText={onChange}
                                error={errors.email?.message}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="otp"
                        render={({ field: { onChange, value } }) => (
                            <Input
                                label="Verification Code"
                                placeholder="Enter 6-digit code"
                                value={value}
                                onChangeText={onChange}
                                error={errors.otp?.message}
                                keyboardType="numeric"
                            />
                        )}
                    />

                    <Button
                        title="Verify Email"
                        onPress={handleSubmit(onSubmit)}
                        loading={loading}
                        fullWidth
                    />

                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { value } }) => (
                            <Button
                                title={countdown > 0 ? `Resend OTP (${countdown}s)` : 'Resend OTP'}
                                onPress={() => handleResendOTP(value)}
                                loading={resendLoading}
                                disabled={countdown > 0}
                                variant="outline"
                                fullWidth
                            />
                        )}
                    />
                </YStack>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
