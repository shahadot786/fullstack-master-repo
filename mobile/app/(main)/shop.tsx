import React from 'react';
import { YStack, Text } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { ScreenLayout } from '@/components/common/ScreenLayout';

export default function ShopScreen() {
    return (
        <ScreenLayout>

            <YStack flex={1} alignItems="center" justifyContent="center" paddingTop={64} gap="$3">
                <YStack
                    width={80}
                    height={80}
                    borderRadius={40}
                    backgroundColor="#10b981"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Ionicons name="storefront" size={40} color="white" />
                </YStack>
                <Text color="$color" fontSize="$6" fontWeight="600" marginTop="$2">
                    Shop
                </Text>
                <Text color="$color" opacity={0.5} textAlign="center" paddingHorizontal="$6">
                    E-commerce features coming soon
                </Text>
            </YStack>
        </ScreenLayout>
    );
}
