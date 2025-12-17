import React, { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { YStack, Text, H1 } from 'tamagui';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { resetPasswordSchema, ResetPasswordFormData } from '@/utils/validation';
import { authApi } from '@/api/auth.api';

export default function ResetPasswordScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ email?: string }>();
    const [loading, setLoading] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            email: params.email || '',
            otp: '',
            newPassword: '',
        },
    });

    useEffect(() => {
        if (params.email) {
            setValue('email', params.email);
        }
    }, [params.email]);

    const onSubmit = async (data: ResetPasswordFormData) => {
        setLoading(true);
        try {
            await authApi.resetPassword(data);
            Alert.alert(
                'Password Reset Successful',
                'Your password has been reset. Please login with your new password.',
                [
                    {
                        text: 'OK',
                        onPress: () => router.replace('/(auth)/login' as Href),
                    },
                ]
            );
        } catch (error: any) {
            Alert.alert('Reset Failed', error.message || 'Invalid or expired OTP');
        } finally {
            setLoading(false);
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
                        Reset Password
                    </H1>
                    <Text color="$color" opacity={0.7} marginBottom="$6">
                        Enter the code from your email and your new password
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
                                label="Reset Code"
                                placeholder="Enter 6-digit code"
                                value={value}
                                onChangeText={onChange}
                                error={errors.otp?.message}
                                keyboardType="numeric"
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="newPassword"
                        render={({ field: { onChange, value } }) => (
                            <Input
                                label="New Password"
                                placeholder="Enter new password"
                                value={value}
                                onChangeText={onChange}
                                error={errors.newPassword?.message}
                                secureTextEntry
                            />
                        )}
                    />

                    <Button
                        title="Reset Password"
                        onPress={handleSubmit(onSubmit)}
                        loading={loading}
                        fullWidth
                    />

                    <Button
                        title="Back to Login"
                        onPress={() => router.replace('/(auth)/login' as Href)}
                        variant="outline"
                        fullWidth
                    />
                </YStack>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
