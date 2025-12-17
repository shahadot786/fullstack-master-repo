import React from 'react';
import { YStack, Text } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { HeaderIcons } from '@/components/common/HeaderIcons';

export default function ExpenseScreen() {
    return (
        <YStack flex={1} backgroundColor="$background">
            <HeaderIcons />

            <YStack flex={1} alignItems="center" justifyContent="center" paddingTop={64} gap="$3">
                <YStack
                    width={80}
                    height={80}
                    borderRadius={40}
                    backgroundColor="#ef4444"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Ionicons name="wallet" size={40} color="white" />
                </YStack>
                <Text color="$color" fontSize="$6" fontWeight="600" marginTop="$2">
                    Expense Tracker
                </Text>
                <Text color="$color" opacity={0.5} textAlign="center" paddingHorizontal="$6">
                    Expense tracking features coming soon
                </Text>
            </YStack>
        </YStack>
    );
}
