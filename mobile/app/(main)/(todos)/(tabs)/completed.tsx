import React from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { YStack, Text } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { TodoCard } from '@/components/TodoCard';
import { useTodos } from '@/hooks/useTodos';

export default function CompletedTodosScreen() {
    const { data, isLoading, refetch } = useTodos({ completed: true });

    return (
        <YStack flex={1} backgroundColor="$background">
            <FlatList
                data={data?.todos || []}
                renderItem={({ item }) => <TodoCard todo={item} />}
                keyExtractor={(item) => item._id}
                contentContainerStyle={{ padding: 16 }}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={refetch} />
                }
                ListEmptyComponent={
                    <YStack alignItems="center" justifyContent="center" paddingVertical="$10">
                        <Ionicons name="checkmark-circle-outline" size={64} color="#ccc" />
                        <Text color="$color" opacity={0.5} marginTop="$4">
                            No completed todos
                        </Text>
                    </YStack>
                }
            />
        </YStack>
    );
}
