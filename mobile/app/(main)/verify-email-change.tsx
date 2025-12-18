import React, { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { YStack, Text, XStack } from 'tamagui';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/api/auth.api';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';

const verifyEmailSchema = z.object({
    otp: z.string().length(6, 'OTP must be 6 digits'),
});

type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>;

export default function VerifyEmailChangeScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const newEmail = params.newEmail as string;
    const updateUserAndTokens = useAuthStore((state) => state.updateUserAndTokens);
    const { isDark } = useTheme();
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<VerifyEmailFormData>({
        resolver: zodResolver(verifyEmailSchema),
        defaultValues: {
            otp: '',
        },
    });

    const otp = watch('otp');

    const onSubmit = async (data: VerifyEmailFormData) => {
        try {
            setIsLoading(true);
            const response = await authApi.verifyEmailChange({
                newEmail,
                otp: data.otp,
            });

            // Update user and tokens in store
            updateUserAndTokens(
                response.user,
                response.tokens.accessToken,
                response.tokens.refreshToken
            );

            Alert.alert(
                'Success',
                'Your email has been changed successfully!',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            // Navigate back to settings or profile
                            router.replace('/(main)/settings' as any);
                        },
                    },
                ]
            );
        } catch (error: any) {
            Alert.alert('Error', error?.message || 'Invalid or expired verification code');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        try {
            setIsResending(true);
            await authApi.requestEmailChange({ newEmail });
            Alert.alert('Success', 'Verification code resent to your new email');
        } catch (error: any) {
            Alert.alert('Error', error?.message || 'Failed to resend code');
        } finally {
            setIsResending(false);
        }
    };

    const textColor = isDark ? '#fafafa' : '#171717';
    const secondaryTextColor = isDark ? '#a3a3a3' : '#737373';
    const cardBg = isDark ? '#1a1a1a' : '#ffffff';
    const borderColor = isDark ? '#262626' : '#e5e7eb';

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#0a0a0a' : '#f9fafb' }} edges={['top']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    style={{ flex: 1, backgroundColor: isDark ? '#0a0a0a' : '#f9fafb' }}
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <YStack
                        flex={1}
                        backgroundColor="$background"
                        paddingHorizontal="$5"
                        paddingTop="$6"
                        paddingBottom="$4"
                        gap="$6"
                    >
                        {/* Header Section */}
                        <YStack gap="$2" alignItems="center">
                            <YStack
                                width={80}
                                height={80}
                                borderRadius={40}
                                backgroundColor="#dbeafe"
                                alignItems="center"
                                justifyContent="center"
                                marginBottom="$2"
                            >
                                <Ionicons
                                    name="mail-outline"
                                    size={40}
                                    color="#3b82f6"
                                />
                            </YStack>
                            <Text fontSize="$8" fontWeight="700" color="$color" textAlign="center">
                                Verify Email
                            </Text>
                            <Text fontSize="$4" color="$color" opacity={0.6} textAlign="center">
                                Enter the 6-digit code sent to
                            </Text>
                            <Text fontSize="$4" fontWeight="600" color="#3b82f6" textAlign="center">
                                {newEmail}
                            </Text>
                        </YStack>

                        {/* OTP Input */}
                        <YStack gap="$4">
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
                                        maxLength={6}
                                    />
                                )}
                            />
                        </YStack>

                        {/* Resend Code */}
                        <YStack alignItems="center">
                            <Text fontSize="$3" color={secondaryTextColor} marginBottom="$2">
                                Didn't receive the code?
                            </Text>
                            <Button
                                title={isResending ? 'Resending...' : 'Resend Code'}
                                onPress={handleResendCode}
                                variant="outline"
                                loading={isResending}
                                disabled={isResending}
                            />
                        </YStack>

                        {/* Info Card */}
                        <YStack
                            backgroundColor={cardBg}
                            padding="$4"
                            borderRadius="$4"
                            borderWidth={1}
                            borderColor={borderColor}
                        >
                            <XStack gap="$3">
                                <Ionicons name="time-outline" size={20} color="#f59e0b" />
                                <YStack flex={1}>
                                    <Text fontSize="$3" color={textColor} lineHeight={18}>
                                        The verification code expires in 10 minutes.
                                    </Text>
                                </YStack>
                            </XStack>
                        </YStack>

                        {/* Spacer */}
                        <YStack flex={1} />

                        {/* Action Buttons */}
                        <YStack gap="$3" paddingBottom="$4">
                            <Button
                                title={isLoading ? 'Verifying...' : 'Verify Email'}
                                onPress={handleSubmit(onSubmit)}
                                loading={isLoading}
                                disabled={otp.length !== 6}
                                fullWidth
                            />
                            <Button
                                title="Cancel"
                                onPress={() => router.back()}
                                variant="outline"
                                fullWidth
                            />
                        </YStack>
                    </YStack>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
