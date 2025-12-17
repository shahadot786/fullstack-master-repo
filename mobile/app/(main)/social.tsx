import React from 'react';
import { Pressable } from 'react-native';
import { YStack, Text } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';
import { useTheme } from '@/hooks/useTheme';

export default function SocialScreen() {
    const navigation = useNavigation();
    const { isDark } = useTheme();

    const handleOpenDrawer = () => {
        navigation.dispatch(DrawerActions.openDrawer());
    };

    return (
        <YStack flex={1} backgroundColor="$background">
            <Pressable
                onPress={handleOpenDrawer}
                style={{
                    position: 'absolute',
                    top: 16,
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
                    backgroundColor="#ec4899"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Ionicons name="people" size={40} color="white" />
                </YStack>
                <Text color="$color" fontSize="$6" fontWeight="600" marginTop="$2">
                    Social
                </Text>
                <Text color="$color" opacity={0.5} textAlign="center" paddingHorizontal="$6">
                    Social networking features coming soon
                </Text>
            </YStack>
        </YStack>
    );
}
