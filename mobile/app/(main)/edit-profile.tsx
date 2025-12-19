import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { ScrollView, KeyboardAvoidingView, Platform, Alert, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { YStack, Text, XStack } from 'tamagui';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as ImagePicker from 'expo-image-picker';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/api/auth.api';
import { uploadApi } from '@/api/upload.api';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';

const editProfileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name cannot exceed 50 characters'),
});

type EditProfileFormData = z.infer<typeof editProfileSchema>;

export default function EditProfileScreen() {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const updateUserAndTokens = useAuthStore((state) => state.updateUserAndTokens);
    const { isDark } = useTheme();
    const [isLoading, setIsLoading] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors, isDirty },
    } = useForm<EditProfileFormData>({
        resolver: zodResolver(editProfileSchema),
        defaultValues: {
            name: user?.name || '',
        },
    });

    const onSubmit = async (data: EditProfileFormData) => {
        if (!isDirty) {
            Alert.alert('No Changes', 'Please make changes before saving.');
            return;
        }

        try {
            setIsLoading(true);
            const response = await authApi.updateProfile(data);
            
            // Update user and tokens in store
            updateUserAndTokens(
                response.user,
                response.tokens.accessToken,
                response.tokens.refreshToken
            );

            Alert.alert('Success', 'Profile updated successfully!', [
                {
                    text: 'OK',
                    onPress: () => router.back(),
                },
            ]);
        } catch (error: any) {
            Alert.alert('Error', error?.message || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handleImagePicker = async () => {
        Alert.alert(
            'Profile Picture',
            'Choose an option',
            [
                {
                    text: 'Take Photo',
                    onPress: () => pickImage('camera'),
                },
                {
                    text: 'Choose from Library',
                    onPress: () => pickImage('library'),
                },
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
            ]
        );
    };

    const pickImage = async (source: 'camera' | 'library') => {
        try {
            let result;

            if (source === 'camera') {
                const permission = await ImagePicker.requestCameraPermissionsAsync();
                if (!permission.granted) {
                    Alert.alert('Permission Required', 'Camera permission is required to take photos.');
                    return;
                }
                result = await ImagePicker.launchCameraAsync({
                    mediaTypes: ['images'],
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 0.8,
                });
            } else {
                const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (!permission.granted) {
                    Alert.alert('Permission Required', 'Gallery permission is required to select photos.');
                    return;
                }
                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ['images'],
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 0.8,
                });
            }

            if (!result.canceled && result.assets[0]) {
                await uploadProfileImage(result.assets[0].uri);
            }
        } catch (error: any) {
            Alert.alert('Error', error?.message || 'Failed to pick image');
        }
    };

    const uploadProfileImage = async (imageUri: string) => {
        try {
            setIsUploadingImage(true);

            // Upload image to Cloudinary
            const uploadResult = await uploadApi.uploadFile(imageUri, 'profile-images');

            // Update profile with new image URL using the correct endpoint
            const response = await authApi.updateProfileImage(uploadResult.url);

            // Update user and tokens in store
            updateUserAndTokens(
                response.user,
                response.tokens.accessToken,
                response.tokens.refreshToken
            );

            Alert.alert('Success', 'Profile image updated successfully!');
        } catch (error: any) {
            Alert.alert('Error', error?.message || 'Failed to upload profile image');
        } finally {
            setIsUploadingImage(false);
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
                        <TouchableOpacity onPress={handleImagePicker} disabled={isUploadingImage}>
                            <YStack position="relative">
                                {user?.profileImage ? (
                                    <Image
                                        source={{ uri: user.profileImage }}
                                        style={{
                                            width: 100,
                                            height: 100,
                                            borderRadius: 50,
                                        }}
                                    />
                                ) : (
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
                                )}
                                <YStack
                                    position="absolute"
                                    bottom={0}
                                    right={0}
                                    width={32}
                                    height={32}
                                    borderRadius={16}
                                    backgroundColor="#3b82f6"
                                    alignItems="center"
                                    justifyContent="center"
                                    borderWidth={2}
                                    borderColor={isDark ? '#0a0a0a' : '#f9fafb'}
                                >
                                    {isUploadingImage ? (
                                        <ActivityIndicator size="small" color="white" />
                                    ) : (
                                        <Ionicons name="camera" size={16} color="white" />
                                    )}
                                </YStack>
                            </YStack>
                        </TouchableOpacity>
                        <Text fontSize="$3" color="$color" opacity={0.5}>
                            {user?.email}
                        </Text>
                    </YStack>

                    {/* Name Form */}
                    <YStack gap="$4">
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
                    </YStack>

                    {/* Quick Actions */}
                    <YStack gap="$3">
                        <Text fontSize="$5" fontWeight="600" color={textColor}>
                            Account Settings
                        </Text>

                        {/* Change Email */}
                        <TouchableOpacity onPress={() => router.push('/(main)/change-email' as any)}>
                            <YStack
                                backgroundColor={cardBg}
                                padding="$4"
                                borderRadius="$4"
                                borderWidth={1}
                                borderColor={borderColor}
                            >
                                <XStack alignItems="center" justifyContent="space-between">
                                    <XStack alignItems="center" gap="$3">
                                        <Ionicons name="mail-outline" size={24} color="#3b82f6" />
                                        <YStack>
                                            <Text fontSize="$4" fontWeight="600" color={textColor}>
                                                Change Email
                                            </Text>
                                            <Text fontSize="$3" color={secondaryTextColor}>
                                                Requires verification
                                            </Text>
                                        </YStack>
                                    </XStack>
                                    <Ionicons name="chevron-forward" size={20} color={secondaryTextColor} />
                                </XStack>
                            </YStack>
                        </TouchableOpacity>

                        {/* Change Password */}
                        <TouchableOpacity onPress={() => router.push('/(main)/change-password' as any)}>
                            <YStack
                                backgroundColor={cardBg}
                                padding="$4"
                                borderRadius="$4"
                                borderWidth={1}
                                borderColor={borderColor}
                            >
                                <XStack alignItems="center" justifyContent="space-between">
                                    <XStack alignItems="center" gap="$3">
                                        <Ionicons name="key-outline" size={24} color="#10b981" />
                                        <YStack>
                                            <Text fontSize="$4" fontWeight="600" color={textColor}>
                                                Change Password
                                            </Text>
                                            <Text fontSize="$3" color={secondaryTextColor}>
                                                Keep your account secure
                                            </Text>
                                        </YStack>
                                    </XStack>
                                    <Ionicons name="chevron-forward" size={20} color={secondaryTextColor} />
                                </XStack>
                            </YStack>
                        </TouchableOpacity>
                    </YStack>

                    {/* Spacer */}
                    <YStack flex={1} />

                    {/* Action Buttons */}
                    <YStack gap="$3" paddingBottom="$4">
                        <Button
                            title={isLoading ? 'Updating...' : 'Save Changes'}
                            onPress={handleSubmit(onSubmit)}
                            loading={isLoading}
                            disabled={!isDirty}
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
