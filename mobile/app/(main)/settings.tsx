import React from 'react';
import { useRouter, Href } from 'expo-router';
import { ScrollView, Alert } from 'react-native';
import { YStack, XStack, Text, H2, Switch } from 'tamagui';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { authApi } from '@/api/auth.api';

export default function SettingsScreen() {
    const router = useRouter();
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

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
        <ScrollView style={{ flex: 1 }}>
            <YStack padding="$4" gap="$4" backgroundColor="$background">
                <H2 color="$color">Settings</H2>

                {/* User Profile */}
                <Card>
                    <YStack gap="$3">
                        <Text fontSize="$6" fontWeight="600" color="$color">
                            Profile
                        </Text>
                        <YStack gap="$2">
                            <Text color="$color" opacity={0.7}>
                                Name
                            </Text>
                            <Text color="$color" fontSize="$5">
                                {user?.name}
                            </Text>
                        </YStack>
                        <YStack gap="$2">
                            <Text color="$color" opacity={0.7}>
                                Email
                            </Text>
                            <Text color="$color" fontSize="$5">
                                {user?.email}
                            </Text>
                        </YStack>
                        <YStack gap="$2">
                            <Text color="$color" opacity={0.7}>
                                Email Verified
                            </Text>
                            <Text color={user?.isEmailVerified ? '$success' : '$error'} fontSize="$5">
                                {user?.isEmailVerified ? 'Yes' : 'No'}
                            </Text>
                        </YStack>
                    </YStack>
                </Card>

                {/* Appearance */}
                <Card>
                    <YStack gap="$3">
                        <Text fontSize="$6" fontWeight="600" color="$color">
                            Appearance
                        </Text>
                        <XStack justifyContent="space-between" alignItems="center">
                            <Text color="$color">Dark Mode</Text>
                            <Switch
                                checked={theme === 'dark'}
                                onCheckedChange={toggleTheme}
                            />
                        </XStack>
                    </YStack>
                </Card>

                {/* App Info */}
                <Card>
                    <YStack gap="$3">
                        <Text fontSize="$6" fontWeight="600" color="$color">
                            About
                        </Text>
                        <YStack gap="$2">
                            <Text color="$color" opacity={0.7}>
                                Version
                            </Text>
                            <Text color="$color" fontSize="$5">
                                1.0.0
                            </Text>
                        </YStack>
                    </YStack>
                </Card>

                {/* Logout */}
                <Button
                    title="Logout"
                    onPress={handleLogout}
                    variant="outline"
                    fullWidth
                />
            </YStack>
        </ScrollView>
    );
}
