import React from 'react';
import { ScrollView } from 'react-native';
import { YStack, Text, H2 } from 'tamagui';
import { Card } from '@/components/common/Card';

export default function NotesScreen() {
    return (
        <ScrollView style={{ flex: 1 }}>
            <YStack padding="$4" gap="$4" backgroundColor="$background">
                <H2 color="$color">Notes</H2>

                <Card>
                    <YStack gap="$3" alignItems="center" paddingVertical="$6">
                        <Text fontSize="$6" color="$color" opacity={0.5}>
                            📝
                        </Text>
                        <Text color="$color" opacity={0.7} textAlign="center">
                            Notes feature coming soon!
                        </Text>
                        <Text color="$color" opacity={0.5} textAlign="center" fontSize="$3">
                            This is a placeholder for the notes functionality.
                        </Text>
                    </YStack>
                </Card>
            </YStack>
        </ScrollView>
    );
}
