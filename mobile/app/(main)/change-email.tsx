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
import { useAuthStore } from '@/store/authStore';
import { userApi } from '@/api/user.api';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';

const changeEmailSchema = z.object({
    newEmail: z.string().email('Please provide a valid email'),
});

type ChangeEmailFormData = z.infer<typeof changeEmailSchema>;

export default function ChangeEmailScreen() {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const { isDark } = useTheme();
    const [isLoading, setIsLoading] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<ChangeEmailFormData>({
        resolver: zodResolver(changeEmailSchema),
        defaultValues: {
            newEmail: '',
        },
    });

    const newEmail = watch('newEmail');

    const onSubmit = async (data: ChangeEmailFormData) => {
        if (data.newEmail === user?.email) {
            Alert.alert('Error', 'New email cannot be the same as current email');
            return;
        }

        try {
            setIsLoading(true);
            await userApi.requestEmailChange(data.newEmail);
            
            // Navigate to verification screen with email param
            Alert.alert(
                'Verification Code Sent',
                `We've sent a verification code to ${data.newEmail}. Please enter it in the next screen.`,
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            router.push({
                                pathname: '/(main)/verify-email-change' as any,
                                params: { newEmail: data.newEmail },
                            });
                        },
                    },
                ]
            );
        } catch (error: any) {
            Alert.alert('Error', error?.message || 'Failed to send verification code');
        } finally {
            setIsLoading(false);
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
                        <YStack gap="$2">
                            <XStack alignItems="center" gap="$3">
                                <Ionicons
                                    name="mail-outline"
                                    size={28}
                                    color="#3b82f6"
                                />
                                <Text fontSize="$8" fontWeight="700" color="$color">
                                    Change Email
                                </Text>
                            </XStack>
                            <Text fontSize="$4" color="$color" opacity={0.6}>
                                Verify your new email address
                            </Text>
                        </YStack>

                        {/* Current Email Card */}
                        <YStack
                            backgroundColor={cardBg}
                            padding="$4"
                            borderRadius="$4"
                            borderWidth={1}
                            borderColor={borderColor}
                        >
                            <Text fontSize="$3" fontWeight="600" color={secondaryTextColor} marginBottom="$2">
                                Current Email
                            </Text>
                            <Text fontSize="$4" fontWeight="600" color={textColor}>
                                {user?.email}
                            </Text>
                        </YStack>

                        {/* Info Alert */}
                        <YStack
                            backgroundColor="#dbeafe"
                            padding="$4"
                            borderRadius="$4"
                            borderWidth={1}
                            borderColor="#3b82f6"
                        >
                            <XStack gap="$3">
                                <Ionicons name="information-circle" size={20} color="#3b82f6" />
                                <YStack flex={1}>
                                    <Text fontSize="$3" color="#1e40af" fontWeight="600" marginBottom="$1">
                                        Email Verification Required
                                    </Text>
                                    <Text fontSize="$3" color="#1e40af" lineHeight={18}>
                                        You'll receive a verification code at your new email address. 
                                        Your email will be updated after successful verification.
                                    </Text>
                                </YStack>
                            </XStack>
                        </YStack>

                        {/* Form Section */}
                        <YStack gap="$4">
                            <Controller
                                control={control}
                                name="newEmail"
                                render={({ field: { onChange, value } }) => (
                                    <Input
                                        label="New Email Address"
                                        placeholder="Enter your new email"
                                        value={value}
                                        onChangeText={onChange}
                                        error={errors.newEmail?.message}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                )}
                            />
                        </YStack>

                        {/* Spacer */}
                        <YStack flex={1} />

                        {/* Action Buttons */}
                        <YStack gap="$3" paddingBottom="$4">
                            <Button
                                title={isLoading ? 'Sending Code...' : 'Send Verification Code'}
                                onPress={handleSubmit(onSubmit)}
                                loading={isLoading}
                                disabled={!newEmail}
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
