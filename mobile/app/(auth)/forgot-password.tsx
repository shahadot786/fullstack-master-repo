import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { YStack, Text, H1 } from 'tamagui';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { forgotPasswordSchema, ForgotPasswordFormData } from '@/utils/validation';
import { authApi } from '@/api/auth.api';

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        },
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setLoading(true);
        try {
            await authApi.requestPasswordReset(data);
            Alert.alert(
                'Reset Code Sent',
                'Please check your email for the password reset code.',
                [
                    {
                        text: 'OK',
                        onPress: () => router.push({ pathname: '/(auth)/reset-password' as Href, params: { email: data.email } }),
                    },
                ]
            );
        } catch (error: any) {
            Alert.alert('Request Failed', error.message || 'Failed to send reset code');
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
                        Forgot Password
                    </H1>
                    <Text color="$color" opacity={0.7} marginBottom="$6">
                        Enter your email to receive a password reset code
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

                    <Button
                        title="Send Reset Code"
                        onPress={handleSubmit(onSubmit)}
                        loading={loading}
                        fullWidth
                    />

                    <Button
                        title="Back to Login"
                        onPress={() => router.back()}
                        variant="outline"
                        fullWidth
                    />
                </YStack>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
