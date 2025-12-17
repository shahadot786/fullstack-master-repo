import React from 'react';
import { Pressable } from 'react-native';
import { XStack } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * HeaderIcons Component
 * 
 * Displays menu and settings icons in the header
 * Used across all main screens for consistent navigation
 */

export const HeaderIcons: React.FC = () => {
    const navigation = useNavigation();
    const router = useRouter();
    const { isDark } = useTheme();
    const insets = useSafeAreaInsets();

    const handleOpenDrawer = () => {
        navigation.dispatch(DrawerActions.openDrawer());
    };

    const handleOpenSettings = () => {
        router.push('/(main)/settings' as any);
    };

    return (
        <XStack
            position="absolute"
            top={insets.top + 8}
            left={0}
            right={0}
            paddingHorizontal="$4"
            justifyContent="space-between"
            alignItems="center"
            zIndex={10}
        >
            <Pressable
                onPress={handleOpenDrawer}
                style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Ionicons name="menu" size={24} color={isDark ? '#fafafa' : '#171717'} />
            </Pressable>

            <Pressable
                onPress={handleOpenSettings}
                style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Ionicons name="settings-outline" size={22} color={isDark ? '#fafafa' : '#171717'} />
            </Pressable>
        </XStack>
    );
};
