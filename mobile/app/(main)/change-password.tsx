import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { YStack, Text, XStack } from 'tamagui';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { authApi } from '@/api/auth.api';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';

const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordScreen() {
    const router = useRouter();
    const { isDark } = useTheme();
    const [isLoading, setIsLoading] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ChangePasswordFormData>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (data: ChangePasswordFormData) => {
        try {
            setIsLoading(true);
            await authApi.changePassword({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            });
            Alert.alert('Success', 'Password changed successfully!', [
                {
                    text: 'OK',
                    onPress: () => {
                        reset();
                        router.back();
                    },
                },
            ]);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to change password');
        } finally {
            setIsLoading(false);
        }
    };

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
                    <YStack gap="$2">
                        <XStack alignItems="center" gap="$3">
                            <Ionicons
                                name="key-outline"
                                size={28}
                                color="#3b82f6"
                            />
                            <Text fontSize="$8" fontWeight="700" color="$color">
                                Change Password
                            </Text>
                        </XStack>
                        <Text fontSize="$4" color="$color" opacity={0.6}>
                            Update your account password
                        </Text>
                    </YStack>

                    {/* Security Info */}
                    <YStack
                        backgroundColor={isDark ? '#1a1a1a' : '#eff6ff'}
                        borderRadius="$3"
                        padding="$4"
                        borderWidth={1}
                        borderColor={isDark ? '#262626' : '#bfdbfe'}
                    >
                        <XStack gap="$3">
                            <Ionicons name="information-circle" size={20} color="#3b82f6" />
                            <Text fontSize="$3" color="$color" opacity={0.8} flex={1}>
                                Your password must be at least 8 characters long
                            </Text>
                        </XStack>
                    </YStack>

                    {/* Form Section */}
                    <YStack gap="$4" flex={1}>
                        <Controller
                            control={control}
                            name="currentPassword"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    label="Current Password"
                                    placeholder="Enter current password"
                                    value={value}
                                    onChangeText={onChange}
                                    error={errors.currentPassword?.message}
                                    secureTextEntry
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

                        <Controller
                            control={control}
                            name="confirmPassword"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    label="Confirm New Password"
                                    placeholder="Confirm new password"
                                    value={value}
                                    onChangeText={onChange}
                                    error={errors.confirmPassword?.message}
                                    secureTextEntry
                                />
                            )}
                        />
                    </YStack>

                    {/* Action Buttons */}
                    <YStack gap="$3" paddingBottom="$4">
                        <Button
                            title={isLoading ? 'Changing...' : 'Change Password'}
                            onPress={handleSubmit(onSubmit)}
                            loading={isLoading}
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
