import React from 'react';
import { FlatList } from 'react-native';
import { YStack, Text } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { TodoCard } from '@/components/TodoCard';
import { useTodos } from '@/hooks/useTodos';
import { ScreenLayout } from '@/components/common/ScreenLayout';

export default function CompletedTodosScreen() {
    const { data, isLoading } = useTodos({ completed: true });



    return (
        <ScreenLayout>
            <FlatList
                data={data?.data || []}
                renderItem={({ item }) => <TodoCard todo={item} />}
                keyExtractor={(item) => item._id}
                contentContainerStyle={{ padding: 16 }}

                ListEmptyComponent={
                    <YStack alignItems="center" justifyContent="center" paddingVertical="$10">
                        <Ionicons name="checkmark-circle-outline" size={64} color="#ccc" />
                        <Text color="$color" opacity={0.5} marginTop="$4">
                            No completed todos
                        </Text>
                    </YStack>
                }
            />
        </ScreenLayout>
    );
}
