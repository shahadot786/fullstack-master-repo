import React from 'react';
import { useRouter, Href } from 'expo-router';
import { ScrollView, Alert, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { YStack, XStack, Text, H2, Switch, Separator } from 'tamagui';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { authApi } from '@/api/auth.api';
import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';

export default function SettingsScreen() {
    const router = useRouter();
    const { user, logout } = useAuth();
    const { theme, toggleTheme, isDark } = useTheme();
    const queryClient = useQueryClient();

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
                            // Logout error - silently fail
                        } finally {
                            // Clear React Query cache to remove previous user's data
                            queryClient.clear();
                            logout();
                            router.replace('/(auth)/login' as Href);
                        }
                    },
                },
            ]
        );
    };

    const handleEditProfile = () => {
        router.push('/(main)/edit-profile' as Href);
    };

    const handleChangePassword = () => {
        router.push('/(main)/change-password' as Href);
    };

    const handleNotifications = () => {
        Alert.alert('Notifications', 'Notification settings coming soon');
    };

    const handleLanguage = () => {
        Alert.alert('Language', 'Language selection coming soon');
    };

    const handlePrivacy = () => {
        router.push({
            pathname: '/(main)/webview',
            params: { url: 'https://example.com/privacy', title: 'Privacy Policy' }
        } as any);
    };

    const handleTerms = () => {
        router.push({
            pathname: '/(main)/webview',
            params: { url: 'https://example.com/terms', title: 'Terms of Service' }
        } as any);
    };

    const handleHelp = () => {
        Alert.alert('Help & Support', 'Help center coming soon');
    };

    const handleAbout = () => {
        Alert.alert('About', 'Fullstack Master App\nVersion 1.0.0');
    };

    const SettingsItem = ({
        icon,
        iconColor,
        iconBg,
        label,
        onPress,
        showChevron = true,
        rightElement
    }: any) => (
        <Pressable onPress={onPress}>
            <XStack
                alignItems="center"
                justifyContent="space-between"
                paddingVertical="$3"
                paddingHorizontal="$4"
            >
                <XStack alignItems="center" gap="$3" flex={1}>
                    <YStack
                        width={36}
                        height={36}
                        borderRadius={18}
                        backgroundColor={iconBg}
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Ionicons name={icon} size={20} color={iconColor} />
                    </YStack>
                    <Text fontSize="$4" fontWeight="500" color="$color">
                        {label}
                    </Text>
                </XStack>
                {rightElement || (showChevron && (
                    <Ionicons name="chevron-forward" size={20} color={isDark ? '#6b7280' : '#9ca3af'} />
                ))}
            </XStack>
        </Pressable>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#0a0a0a' : '#f9fafb' }} edges={['top']}>
            <ScrollView
                style={{ flex: 1, backgroundColor: isDark ? '#0a0a0a' : '#f9fafb' }}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
            <YStack backgroundColor="$background">
                {/* Header */}
                <YStack padding="$5" paddingBottom="$4">
                    <H2 color="$color" fontSize="$9" fontWeight="700">Settings</H2>
                </YStack>

                {/* Profile Card - Non-clickable */}
                <YStack paddingHorizontal="$4" paddingBottom="$4">
                    <YStack
                        backgroundColor={isDark ? '#1a1a1a' : '#ffffff'}
                        borderRadius="$4"
                        padding="$4"
                        borderWidth={1}
                        borderColor={isDark ? '#262626' : '#e5e7eb'}
                    >
                        <XStack alignItems="center" gap="$3">
                            {user?.profileImage ? (
                                <YStack
                                    width={50}
                                    height={50}
                                    borderRadius={25}
                                    overflow="hidden"
                                >
                                    <Image
                                        source={{ uri: user.profileImage }}
                                        style={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: 25,
                                        }}
                                    />
                                </YStack>
                            ) : (
                                <YStack
                                    width={50}
                                    height={50}
                                    borderRadius={25}
                                    backgroundColor="#3b82f6"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <Text fontSize="$7" fontWeight="700" color="white">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </Text>
                                </YStack>
                            )}
                            <YStack flex={1}>
                                <Text fontSize="$5" fontWeight="700" color="$color">
                                    {user?.name}
                                </Text>
                                <Text fontSize="$3" color="$color" opacity={0.6}>
                                    {user?.email}
                                </Text>
                            </YStack>
                        </XStack>
                    </YStack>
                </YStack>

                {/* Dark Mode Toggle */}
                <YStack paddingHorizontal="$4" paddingBottom="$3">
                    <YStack
                        backgroundColor={isDark ? '#1a1a1a' : '#ffffff'}
                        borderRadius="$4"
                        borderWidth={1}
                        borderColor={isDark ? '#262626' : '#e5e7eb'}
                    >
                        <SettingsItem
                            icon="moon"
                            iconColor={isDark ? '#fbbf24' : '#f59e0b'}
                            iconBg={isDark ? '#262626' : '#fef3c7'}
                            label="Dark Mode"
                            showChevron={false}
                            rightElement={
                                <Switch
                                    checked={theme === 'dark'}
                                    onCheckedChange={toggleTheme}
                                    size="$3"
                                    backgroundColor={theme === 'dark' ? '#3b82f6' : '#d1d5db'}
                                >
                                    <Switch.Thumb
                                        animation="quick"
                                        backgroundColor="white"
                                    />
                                </Switch>
                            }
                        />
                    </YStack>
                </YStack>

                {/* Profile Section */}
                <YStack paddingHorizontal="$4" paddingTop="$2">
                    <Text fontSize="$2" fontWeight="600" color="$color" opacity={0.5} paddingLeft="$2" paddingBottom="$2">
                        PROFILE
                    </Text>
                    <YStack
                        backgroundColor={isDark ? '#1a1a1a' : '#ffffff'}
                        borderRadius="$4"
                        borderWidth={1}
                        borderColor={isDark ? '#262626' : '#e5e7eb'}
                    >
                        <SettingsItem
                            icon="person"
                            iconColor="#ffffff"
                            iconBg="#f59e0b"
                            label="Edit Profile"
                            onPress={handleEditProfile}
                        />
                        <Separator borderColor={isDark ? '#262626' : '#e5e7eb'} />
                        <SettingsItem
                            icon="key"
                            iconColor="#ffffff"
                            iconBg="#3b82f6"
                            label="Change Password"
                            onPress={handleChangePassword}
                        />
                    </YStack>
                </YStack>

                {/* Notifications Section */}
                <YStack paddingHorizontal="$4" paddingTop="$4">
                    <Text fontSize="$2" fontWeight="600" color="$color" opacity={0.5} paddingLeft="$2" paddingBottom="$2">
                        NOTIFICATIONS
                    </Text>
                    <YStack
                        backgroundColor={isDark ? '#1a1a1a' : '#ffffff'}
                        borderRadius="$4"
                        borderWidth={1}
                        borderColor={isDark ? '#262626' : '#e5e7eb'}
                    >
                        <SettingsItem
                            icon="notifications"
                            iconColor="#ffffff"
                            iconBg="#10b981"
                            label="Notifications"
                            onPress={handleNotifications}
                        />
                    </YStack>
                </YStack>

                {/* Regional Section */}
                <YStack paddingHorizontal="$4" paddingTop="$4">
                    <Text fontSize="$2" fontWeight="600" color="$color" opacity={0.5} paddingLeft="$2" paddingBottom="$2">
                        REGIONAL
                    </Text>
                    <YStack
                        backgroundColor={isDark ? '#1a1a1a' : '#ffffff'}
                        borderRadius="$4"
                        borderWidth={1}
                        borderColor={isDark ? '#262626' : '#e5e7eb'}
                    >
                        <SettingsItem
                            icon="language"
                            iconColor="#ffffff"
                            iconBg="#8b5cf6"
                            label="Language"
                            onPress={handleLanguage}
                        />
                    </YStack>
                </YStack>

                {/* Legal Section */}
                <YStack paddingHorizontal="$4" paddingTop="$4">
                    <Text fontSize="$2" fontWeight="600" color="$color" opacity={0.5} paddingLeft="$2" paddingBottom="$2">
                        LEGAL
                    </Text>
                    <YStack
                        backgroundColor={isDark ? '#1a1a1a' : '#ffffff'}
                        borderRadius="$4"
                        borderWidth={1}
                        borderColor={isDark ? '#262626' : '#e5e7eb'}
                    >
                        <SettingsItem
                            icon="shield-checkmark"
                            iconColor="#ffffff"
                            iconBg="#06b6d4"
                            label="Privacy Policy"
                            onPress={handlePrivacy}
                        />
                        <Separator borderColor={isDark ? '#262626' : '#e5e7eb'} />
                        <SettingsItem
                            icon="document-text"
                            iconColor="#ffffff"
                            iconBg="#6366f1"
                            label="Terms of Service"
                            onPress={handleTerms}
                        />
                    </YStack>
                </YStack>

                {/* Support Section */}
                <YStack paddingHorizontal="$4" paddingTop="$4">
                    <Text fontSize="$2" fontWeight="600" color="$color" opacity={0.5} paddingLeft="$2" paddingBottom="$2">
                        SUPPORT
                    </Text>
                    <YStack
                        backgroundColor={isDark ? '#1a1a1a' : '#ffffff'}
                        borderRadius="$4"
                        borderWidth={1}
                        borderColor={isDark ? '#262626' : '#e5e7eb'}
                    >
                        <SettingsItem
                            icon="help-circle"
                            iconColor="#ffffff"
                            iconBg="#ec4899"
                            label="Help & Support"
                            onPress={handleHelp}
                        />
                        <Separator borderColor={isDark ? '#262626' : '#e5e7eb'} />
                        <SettingsItem
                            icon="information-circle"
                            iconColor="#ffffff"
                            iconBg="#14b8a6"
                            label="About"
                            onPress={handleAbout}
                        />
                    </YStack>
                </YStack>

                {/* Logout Section */}
                <YStack paddingHorizontal="$4" paddingTop="$4">
                    <YStack
                        backgroundColor={isDark ? '#1a1a1a' : '#ffffff'}
                        borderRadius="$4"
                        borderWidth={1}
                        borderColor={isDark ? '#262626' : '#e5e7eb'}
                    >
                        <SettingsItem
                            icon="log-out"
                            iconColor="#ffffff"
                            iconBg="#ef4444"
                            label="Logout"
                            onPress={handleLogout}
                        />
                    </YStack>
                </YStack>

                {/* Footer */}
                <YStack alignItems="center" paddingVertical="$6" gap="$2">
                    <Text fontSize="$3" color="$color" opacity={0.4}>
                        Fullstack Master App
                    </Text>
                    <Text fontSize="$2" color="$color" opacity={0.3}>
                        Version 1.0.0
                    </Text>
                </YStack>
            </YStack>
        </ScrollView>
        </SafeAreaView>
    );
}
