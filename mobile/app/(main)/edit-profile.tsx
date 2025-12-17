import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { YStack, Text, XStack } from 'tamagui';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';
import { authApi } from '@/api/auth.api';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';

const editProfileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name cannot exceed 50 characters'),
    email: z.string().email('Please provide a valid email'),
});

type EditProfileFormData = z.infer<typeof editProfileSchema>;

export default function EditProfileScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const { isDark } = useTheme();
    const [isLoading, setIsLoading] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<EditProfileFormData>({
        resolver: zodResolver(editProfileSchema),
        defaultValues: {
            name: user?.name || '',
            email: user?.email || '',
        },
    });

    const onSubmit = async (data: EditProfileFormData) => {
        try {
            setIsLoading(true);
            const response = await authApi.updateProfile(data);
            // Update local user state - will implement updateUser in useAuth hook
            Alert.alert('Success', 'Profile updated successfully!', [
                {
                    text: 'OK',
                    onPress: () => router.back(),
                },
            ]);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    return (
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
                                name="person-circle-outline"
                                size={28}
                                color="#3b82f6"
                            />
                            <Text fontSize="$8" fontWeight="700" color="$color">
                                Edit Profile
                            </Text>
                        </XStack>
                        <Text fontSize="$4" color="$color" opacity={0.6}>
                            Update your personal information
                        </Text>
                    </YStack>

                    {/* Avatar Section */}
                    <YStack alignItems="center" gap="$3">
                        <YStack
                            width={100}
                            height={100}
                            borderRadius={50}
                            backgroundColor="#3b82f6"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Text fontSize="$10" fontWeight="700" color="white">
                                {user?.name?.charAt(0).toUpperCase()}
                            </Text>
                        </YStack>
                        <Text fontSize="$3" color="$color" opacity={0.5}>
                            {user?.email}
                        </Text>
                    </YStack>

                    {/* Form Section */}
                    <YStack gap="$4" flex={1}>
                        <Controller
                            control={control}
                            name="name"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    label="Full Name"
                                    placeholder="Enter your full name"
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
                                    label="Email Address"
                                    placeholder="Enter your email"
                                    value={value}
                                    onChangeText={onChange}
                                    error={errors.email?.message}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            )}
                        />
                    </YStack>

                    {/* Action Buttons */}
                    <YStack gap="$3" paddingBottom="$4">
                        <Button
                            title={isLoading ? 'Updating...' : 'Update Profile'}
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
    );
}
