import React from 'react';
import { YStack, Text } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { HeaderIcons } from '@/components/common/HeaderIcons';

export default function ChatScreen() {
    return (
        <YStack flex={1} backgroundColor="$background">
            <HeaderIcons />

            <YStack flex={1} alignItems="center" justifyContent="center" paddingTop={64} gap="$3">
                <YStack
                    width={80}
                    height={80}
                    borderRadius={40}
                    backgroundColor="#ec4899"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Ionicons name="chatbubbles" size={40} color="white" />
                </YStack>
                <Text color="$color" fontSize="$6" fontWeight="600" marginTop="$2">
                    Chat
                </Text>
                <Text color="$color" opacity={0.5} textAlign="center" paddingHorizontal="$6">
                    Chat features coming soon
                </Text>
            </YStack>
        </YStack>
    );
}
