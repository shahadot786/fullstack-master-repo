import React from 'react';
import { useRouter, Href } from 'expo-router';
import { ScrollView, Alert, Pressable } from 'react-native';
import { YStack, XStack, Text, H2, Switch, Separator } from 'tamagui';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { authApi } from '@/api/auth.api';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
    const router = useRouter();
    const { user, logout } = useAuth();
    const { theme, toggleTheme, isDark } = useTheme();

    const handleLogout = async () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await authApi.logout();
                        } catch (error) {
                            console.error('Logout error:', error);
                        } finally {
                            logout();
                            router.replace('/(auth)/login' as Href);
                        }
                    },
                },
            ]
        );
    };

    return (
        <ScrollView style={{ flex: 1, backgroundColor: isDark ? '#0a0a0a' : '#ffffff' }} contentContainerStyle={{ paddingBottom: 32 }}>
            <YStack backgroundColor="$background" gap="$5">
                {/* Header */}
                <YStack padding="$5" paddingBottom="$3">
                    <H2 color="$color" fontSize="$9" fontWeight="700">Settings</H2>
                    <Text color="$color" opacity={0.6} fontSize="$4" marginTop="$1">
                        Manage your account and preferences
                    </Text>
                </YStack>

                {/* Profile Section */}
                <YStack paddingHorizontal="$5" gap="$3">
                    <Text fontSize="$3" fontWeight="600" color="$color" opacity={0.5} textTransform="uppercase" letterSpacing={0.5}>
                        Profile
                    </Text>
                    <YStack
                        backgroundColor={isDark ? '#1a1a1a' : '#f9fafb'}
                        borderRadius="$4"
                        borderWidth={1}
                        borderColor={isDark ? '#262626' : '#e5e7eb'}
                        padding="$4"
                        gap="$4"
                    >
                        {/* Avatar and Name */}
                        <XStack alignItems="center" gap="$4">
                            <YStack
                                width={64}
                                height={64}
                                borderRadius={32}
                                backgroundColor="#3b82f6"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Text fontSize="$8" fontWeight="700" color="white">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </Text>
                            </YStack>
                            <YStack flex={1} gap="$1">
                                <Text fontSize="$6" fontWeight="700" color="$color">
                                    {user?.name}
                                </Text>
                                <Text fontSize="$4" color="$color" opacity={0.6}>
                                    {user?.email}
                                </Text>
                            </YStack>
                        </XStack>

                        <Separator borderColor={isDark ? '#262626' : '#e5e7eb'} />

                        {/* Email Verification Status */}
                        <XStack alignItems="center" justifyContent="space-between">
                            <XStack alignItems="center" gap="$3">
                                <Ionicons
                                    name={user?.isEmailVerified ? "checkmark-circle" : "alert-circle"}
                                    size={24}
                                    color={user?.isEmailVerified ? '#10b981' : '#f59e0b'}
                                />
                                <YStack>
                                    <Text fontSize="$4" fontWeight="500" color="$color">
                                        Email Verification
                                    </Text>
                                    <Text fontSize="$3" color="$color" opacity={0.6}>
                                        {user?.isEmailVerified ? 'Verified' : 'Not verified'}
                                    </Text>
                                </YStack>
                            </XStack>
                            {user?.isEmailVerified && (
                                <Ionicons name="shield-checkmark" size={20} color="#10b981" />
                            )}
                        </XStack>
                    </YStack>
                </YStack>

                {/* Appearance Section */}
                <YStack paddingHorizontal="$5" gap="$3">
                    <Text fontSize="$3" fontWeight="600" color="$color" opacity={0.5} textTransform="uppercase" letterSpacing={0.5}>
                        Appearance
                    </Text>
                    <YStack
                        backgroundColor={isDark ? '#1a1a1a' : '#f9fafb'}
                        borderRadius="$4"
                        borderWidth={1}
                        borderColor={isDark ? '#262626' : '#e5e7eb'}
                        padding="$4"
                    >
                        <Pressable>
                            <XStack alignItems="center" justifyContent="space-between">
                                <XStack alignItems="center" gap="$3" flex={1}>
                                    <YStack
                                        width={40}
                                        height={40}
                                        borderRadius={20}
                                        backgroundColor={isDark ? '#262626' : '#e5e7eb'}
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        <Ionicons
                                            name={theme === 'dark' ? 'moon' : 'sunny'}
                                            size={20}
                                            color={theme === 'dark' ? '#fbbf24' : '#f59e0b'}
                                        />
                                    </YStack>
                                    <YStack flex={1}>
                                        <Text fontSize="$4" fontWeight="500" color="$color">
                                            Dark Mode
                                        </Text>
                                        <Text fontSize="$3" color="$color" opacity={0.6}>
                                            {theme === 'dark' ? 'Enabled' : 'Disabled'}
                                        </Text>
                                    </YStack>
                                </XStack>
                                <Switch
                                    checked={theme === 'dark'}
                                    onCheckedChange={toggleTheme}
                                    backgroundColor={theme === 'dark' ? '#3b82f6' : '$borderColor'}
                                />
                            </XStack>
                        </Pressable>
                    </YStack>
                </YStack>

                {/* About Section */}
                <YStack paddingHorizontal="$5" gap="$3">
                    <Text fontSize="$3" fontWeight="600" color="$color" opacity={0.5} textTransform="uppercase" letterSpacing={0.5}>
                        About
                    </Text>
                    <YStack
                        backgroundColor={isDark ? '#1a1a1a' : '#f9fafb'}
                        borderRadius="$4"
                        borderWidth={1}
                        borderColor={isDark ? '#262626' : '#e5e7eb'}
                        padding="$4"
                    >
                        <XStack alignItems="center" gap="$3">
                            <YStack
                                width={40}
                                height={40}
                                borderRadius={20}
                                backgroundColor={isDark ? '#262626' : '#e5e7eb'}
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Ionicons name="information-circle" size={20} color="#3b82f6" />
                            </YStack>
                            <YStack flex={1}>
                                <Text fontSize="$4" fontWeight="500" color="$color">
                                    App Version
                                </Text>
                                <Text fontSize="$3" color="$color" opacity={0.6}>
                                    1.0.0
                                </Text>
                            </YStack>
                        </XStack>
                    </YStack>
                </YStack>

                {/* Logout Button */}
                <YStack paddingHorizontal="$5" paddingTop="$2">
                    <Button
                        title="Logout"
                        onPress={handleLogout}
                        variant="outline"
                        fullWidth
                    />
                </YStack>
            </YStack>
        </ScrollView>
    );
}
