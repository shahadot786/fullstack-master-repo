import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { FlatList, Pressable, RefreshControl, ActivityIndicator } from 'react-native';
import { YStack, Text } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { TodoCard } from '@/components/TodoCard';
import { useInfiniteTodos } from '@/hooks/useTodos';
import { ScreenLayout } from '@/components/common/ScreenLayout';

export default function AllTodosScreen() {
    const router = useRouter();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        refetch,
    } = useInfiniteTodos();

    // Flatten all pages into a single array
    const todos = data?.pages.flatMap(page => page.data) ?? [];

    const handleCreate = () => {
        router.push('/(main)/(todos)/create' as any);
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await refetch();
        setIsRefreshing(false);
    };

    const handleLoadMore = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };

    const renderFooter = () => {
        if (!isFetchingNextPage) return null;
        return (
            <YStack paddingVertical="$4" alignItems="center">
                <ActivityIndicator size="small" color="#3b82f6" />
            </YStack>
        );
    };

    return (
        <ScreenLayout>
            <FlatList
                data={todos}
                renderItem={({ item }) => <TodoCard todo={item} />}
                keyExtractor={(item) => item._id}
                contentContainerStyle={{ padding: 16 }}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                        tintColor="#3b82f6"
                    />
                }
                ListFooterComponent={renderFooter}
                ListEmptyComponent={
                    isLoading ? (
                        <YStack alignItems="center" justifyContent="center" paddingVertical="$10">
                            <ActivityIndicator size="large" color="#3b82f6" />
                        </YStack>
                    ) : (
                        <YStack alignItems="center" justifyContent="center" paddingVertical="$10">
                            <Ionicons name="checkmark-circle-outline" size={64} color="#ccc" />
                            <Text color="$color" opacity={0.5} marginTop="$4">
                                No todos yet
                            </Text>
                            <Text color="$color" opacity={0.5}>
                                Tap + to create one
                            </Text>
                        </YStack>
                    )
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
        </ScreenLayout>
    );
}
