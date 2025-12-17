import React, { useState } from 'react';
import { useRouter, Link, Href } from 'expo-router';
import { ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { YStack, Text, H1 } from 'tamagui';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { registerSchema, RegisterFormData } from '@/utils/validation';
import { authApi } from '@/api/auth.api';

export default function RegisterScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: RegisterFormData) => {
        setLoading(true);
        try {
            await authApi.register(data);
            Alert.alert(
                'Registration Successful',
                'Please check your email for verification code.',
                [
                    {
                        text: 'OK',
                        onPress: () => router.push(`/(auth)/verify-email?email=${encodeURIComponent(data.email)}` as Href),
                    },
                ]
            );
        } catch (error: any) {
            Alert.alert('Registration Failed', error.message || 'An error occurred');
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
                        Create Account
                    </H1>
                    <Text color="$color" opacity={0.7} marginBottom="$6">
                        Sign up to get started
                    </Text>

                    <Controller
                        control={control}
                        name="name"
                        render={({ field: { onChange, value } }) => (
                            <Input
                                label="Name"
                                placeholder="Enter your name"
                                value={value}
                                onChangeText={onChange}
                                error={errors.name?.message}
                            />
                        )}
                    />

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
                        name="password"
                        render={({ field: { onChange, value } }) => (
                            <Input
                                label="Password"
                                placeholder="Enter your password"
                                value={value}
                                onChangeText={onChange}
                                error={errors.password?.message}
                                secureTextEntry
                            />
                        )}
                    />

                    <Button
                        title="Register"
                        onPress={handleSubmit(onSubmit)}
                        loading={loading}
                        fullWidth
                    />

                    <YStack alignItems="center" marginTop="$4">
                        <Text color="$color">
                            Already have an account?{' '}
                            <Link href="/(auth)/login">
                                <Text color="$primary" fontWeight="600">
                                    Login
                                </Text>
                            </Link>
                        </Text>
                    </YStack>
                </YStack>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
