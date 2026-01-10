import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { FlatList, Pressable, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { YStack, XStack, Text } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { TodoCard } from '@/components/TodoCard';
import { TodoFilters } from '@/components/TodoFilters';
import { useInfiniteTodos } from '@/hooks/useTodos';
import { ScreenLayout } from '@/components/common/ScreenLayout';
import { TodoType, TodoPriority } from '@/types';
import { todosApi } from '@/api/todos.api';

export default function AllTodosScreen() {
    const router = useRouter();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<{
        completed?: boolean;
        priority?: TodoPriority;
        type?: TodoType;
        dueDateFrom?: string;
        dueDateTo?: string;
    }>({});

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        refetch,
    } = useInfiniteTodos(filters);

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

    const handleApplyFilters = (newFilters: typeof filters) => {
        setFilters(newFilters);
    };

    const handleExport = async () => {
        if (todos.length === 0) {
            Alert.alert('No Todos', 'There are no todos to export.');
            return;
        }

        try {
            setIsExporting(true);

            // Get CSV data from API
            const csvData = await todosApi.exportTodos(filters);

            // Generate filename with current date
            const date = new Date().toISOString().split('T')[0];
            const filename = `todos-${date}.csv`;

            // Create file using new API
            const file = new File(Paths.document, filename);
            file.write(csvData);

            // Share the file
            const canShare = await Sharing.isAvailableAsync();
            if (canShare) {
                await Sharing.shareAsync(file.uri, {
                    mimeType: 'text/csv',
                    dialogTitle: 'Export Todos',
                });
            } else {
                Alert.alert('Success', `Todos exported to ${filename}`);
            }
        } catch (error) {
            console.error('Export error:', error);
            Alert.alert('Export Failed', 'Could not export todos. Please try again.');
        } finally {
            setIsExporting(false);
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

    // Count active filters
    const activeFilterCount = Object.values(filters).filter(v => v !== undefined).length;

    return (
        <ScreenLayout>
            {/* Filter Button */}
            <XStack
                justifyContent="space-between"
                alignItems="center"
                paddingHorizontal="$4"
                paddingVertical="$3"
                borderBottomWidth={1}
                borderBottomColor="$borderColor"
            >
                <Text fontSize="$6" fontWeight="700" color="$color">
                    All Todos
                </Text>
                <XStack gap="$2">
                    <Pressable
                        onPress={handleExport}
                        disabled={isExporting || todos.length === 0}
                        style={{
                            padding: 8,
                            borderRadius: 8,
                            backgroundColor: isExporting ? '#3b82f615' : 'transparent',
                            opacity: isExporting || todos.length === 0 ? 0.5 : 1,
                        }}
                    >
                        <Ionicons
                            name={isExporting ? "hourglass-outline" : "download-outline"}
                            size={24}
                            color="#3b82f6"
                        />
                    </Pressable>
                    <Pressable
                        onPress={() => setShowFilters(true)}
                        style={{
                            padding: 8,
                            borderRadius: 8,
                            backgroundColor: activeFilterCount > 0 ? '#3b82f615' : 'transparent',
                            position: 'relative',
                        }}
                    >
                        <Ionicons name="filter" size={24} color={activeFilterCount > 0 ? '#3b82f6' : '#6b7280'} />
                        {activeFilterCount > 0 && (
                            <YStack
                                position="absolute"
                                top={4}
                                right={4}
                                backgroundColor="#3b82f6"
                                borderRadius={10}
                                width={20}
                                height={20}
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Text fontSize={10} color="white" fontWeight="700">
                                    {activeFilterCount}
                                </Text>
                            </YStack>
                        )}
                    </Pressable>
                </XStack>
            </XStack>

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
                                No todos found
                            </Text>
                            <Text color="$color" opacity={0.5}>
                                {activeFilterCount > 0 ? 'Try adjusting filters' : 'Tap + to create one'}
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

            {/* Filters Modal */}
            <TodoFilters
                visible={showFilters}
                onClose={() => setShowFilters(false)}
                filters={filters}
                onApplyFilters={handleApplyFilters}
            />
        </ScreenLayout>
    );
}
