import React from 'react';
import { useRouter } from 'expo-router';
import { FlatList, RefreshControl, Pressable } from 'react-native';
import { YStack, Text } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { TodoCard } from '@/components/TodoCard';
import { useTodos } from '@/hooks/useTodos';
import { HeaderIcons } from '@/components/common/HeaderIcons';

export default function AllTodosScreen() {
    const router = useRouter();
    const { data, isLoading, refetch } = useTodos();

    const handleCreate = () => {
        router.push('/(main)/(todos)/create' as any);
    };

    return (
        <YStack flex={1} backgroundColor="$background">
            <HeaderIcons />

            <FlatList
                data={data?.todos || []}
                renderItem={({ item }) => <TodoCard todo={item} />}
                keyExtractor={(item) => item._id}
                contentContainerStyle={{ padding: 16, paddingTop: 64 }}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={refetch} />
                }
                ListEmptyComponent={
                    <YStack alignItems="center" justifyContent="center" paddingVertical="$10">
                        <Ionicons name="checkmark-circle-outline" size={64} color="#ccc" />
                        <Text color="$color" opacity={0.5} marginTop="$4">
                            No todos yet
                        </Text>
                        <Text color="$color" opacity={0.5}>
                            Tap + to create one
                        </Text>
                    </YStack>
                }
            />

            {/* Floating Action Button */}
            <Pressable
                onPress={handleCreate}
                style={{
                    position: 'absolute',
                    right: 20,
                    bottom: 20,
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    backgroundColor: '#3b82f6',
                    justifyContent: 'center',
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 5,
                }}
            >
                <Ionicons name="add" size={32} color="white" />
            </Pressable>
        </YStack>
    );
}
