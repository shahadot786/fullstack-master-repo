import React from 'react';
import { Pressable } from 'react-native';
import { XStack } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';

/**
 * Header Icons Component
 * 
 * Displays drawer menu icon on the left and settings icon on the right.
 * Automatically handles safe area insets for proper positioning on iOS devices.
 */
export const HeaderIcons = () => {
    const router = useRouter();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const { isDark } = useTheme();

    const handleOpenDrawer = () => {
        navigation.dispatch(DrawerActions.openDrawer());
    };

    const handleOpenSettings = () => {
        router.push('/(main)/settings' as any);
    };

    const iconButtonStyle = {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5',
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
    };

    return (
        <XStack
            position="absolute"
            top={insets.top + 16}
            left={16}
            right={16}
            zIndex={10}
            justifyContent="space-between"
        >
            {/* Menu Icon */}
            <Pressable onPress={handleOpenDrawer} style={iconButtonStyle}>
                <Ionicons name="menu" size={24} color={isDark ? '#fafafa' : '#171717'} />
            </Pressable>

            {/* Settings Icon */}
            <Pressable onPress={handleOpenSettings} style={iconButtonStyle}>
                <Ionicons name="settings-outline" size={24} color={isDark ? '#fafafa' : '#171717'} />
            </Pressable>
        </XStack>
    );
};
