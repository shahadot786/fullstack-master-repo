import React from 'react';
import { Pressable } from 'react-native';
import { YStack, Text, XStack } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';

export default function AIScreen() {
    const navigation = useNavigation();
    const { isDark } = useTheme();
    const insets = useSafeAreaInsets();

    const handleOpenDrawer = () => {
        navigation.dispatch(DrawerActions.openDrawer());
    };

    return (
        <YStack flex={1} backgroundColor="$background">
            {/* Menu Icon */}
            <Pressable
                onPress={handleOpenDrawer}
                style={{
                    position: 'absolute',
                    top: insets.top + 16,
                    left: 16,
                    zIndex: 10,
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

            <YStack flex={1} alignItems="center" justifyContent="center" paddingTop={64} gap="$3">
                <YStack
                    width={80}
                    height={80}
                    borderRadius={40}
                    backgroundColor="#8b5cf6"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Ionicons name="sparkles" size={40} color="white" />
                </YStack>
                <Text color="$color" fontSize="$6" fontWeight="600" marginTop="$2">
                    AI Assistant
                </Text>
                <Text color="$color" opacity={0.5} textAlign="center" paddingHorizontal="$6">
                    AI-powered features coming soon
                </Text>
            </YStack>
        </YStack>
    );
}
