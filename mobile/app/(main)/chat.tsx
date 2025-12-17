import React from 'react';
import { Pressable } from 'react-native';
import { YStack, Text } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';

export default function ChatScreen() {
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

            <YStack flex={1} alignItems="center" justifyContent="center" paddingTop={64}>
                <Ionicons name="chatbubbles-outline" size={64} color="#3b82f6" />
                <Text color="$color" fontSize="$6" fontWeight="600" marginTop="$4">
                    Chat
                </Text>
                <Text color="$color" opacity={0.5} marginTop="$2" textAlign="center" paddingHorizontal="$6">
                    Chat feature coming soon
                </Text>
            </YStack>
        </YStack>
    );
}
