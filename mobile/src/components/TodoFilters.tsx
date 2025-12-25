import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, Platform } from 'react-native';
import { YStack, XStack, Text } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { TodoType, TodoPriority } from '@/types';
import DateTimePicker from '@react-native-community/datetimepicker';

interface TodoFiltersProps {
    visible: boolean;
    onClose: () => void;
    filters: {
        completed?: boolean;
        priority?: TodoPriority;
        type?: TodoType;
        dueDateFrom?: string;
        dueDateTo?: string;
    };
    onApplyFilters: (filters: {
        completed?: boolean;
        priority?: TodoPriority;
        type?: TodoType;
        dueDateFrom?: string;
        dueDateTo?: string;
    }) => void;
}

export const TodoFilters: React.FC<TodoFiltersProps> = ({
    visible,
    onClose,
    filters: initialFilters,
    onApplyFilters,
}) => {
    const { isDark } = useTheme();
    const [filters, setFilters] = useState(initialFilters);
    const [showFromDatePicker, setShowFromDatePicker] = useState(false);
    const [showToDatePicker, setShowToDatePicker] = useState(false);

    const priorityOptions: { value: TodoPriority; label: string; color: string }[] = [
        { value: 'low', label: 'Low', color: '#22c55e' },
        { value: 'medium', label: 'Medium', color: '#f59e0b' },
        { value: 'high', label: 'High', color: '#ef4444' },
    ];

    const typeOptions: { value: TodoType; label: string; color: string }[] = [
        { value: 'DSA', label: 'DSA', color: '#a855f7' },
        { value: 'System Design & Architecture', label: 'System Design', color: '#3b82f6' },
        { value: 'Projects', label: 'Projects', color: '#6366f1' },
        { value: 'Learn', label: 'Learn', color: '#06b6d4' },
        { value: 'Blogging', label: 'Blogging', color: '#ec4899' },
        { value: 'Frontend', label: 'Frontend', color: '#14b8a6' },
        { value: 'Backend', label: 'Backend', color: '#f97316' },
        { value: 'AI/ML', label: 'AI/ML', color: '#8b5cf6' },
        { value: 'DevOps', label: 'DevOps', color: '#10b981' },
        { value: 'Database', label: 'Database', color: '#f59e0b' },
        { value: 'Testing', label: 'Testing', color: '#f43f5e' },
    ];

    const handleApply = () => {
        onApplyFilters(filters);
        onClose();
    };

    const handleClear = () => {
        const clearedFilters = {
            completed: undefined,
            priority: undefined,
            type: undefined,
            dueDateFrom: undefined,
            dueDateTo: undefined,
        };
        setFilters(clearedFilters);
        onApplyFilters(clearedFilters);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <YStack
                flex={1}
                backgroundColor="rgba(0,0,0,0.5)"
                justifyContent="flex-end"
            >
                <YStack
                    backgroundColor={isDark ? '#1a1a1a' : '#ffffff'}
                    borderTopLeftRadius={20}
                    borderTopRightRadius={20}
                    paddingBottom={Platform.OS === 'ios' ? 40 : 20}
                    maxHeight="80%"
                >
                    {/* Header */}
                    <XStack
                        justifyContent="space-between"
                        alignItems="center"
                        padding="$4"
                        borderBottomWidth={1}
                        borderBottomColor={isDark ? '#262626' : '#e5e5e5'}
                    >
                        <Text fontSize="$6" fontWeight="700" color="$color">
                            Filters
                        </Text>
                        <Pressable onPress={onClose}>
                            <Ionicons name="close" size={24} color={isDark ? '#fafafa' : '#171717'} />
                        </Pressable>
                    </XStack>

                    <ScrollView>
                        <YStack padding="$4" gap="$5">
                            {/* Status Filter */}
                            <YStack gap="$2">
                                <Text fontSize="$4" fontWeight="600" color="$color">
                                    Status
                                </Text>
                                <XStack gap="$2">
                                    <Pressable
                                        onPress={() => setFilters({ ...filters, completed: undefined })}
                                        style={{
                                            flex: 1,
                                            padding: 12,
                                            borderRadius: 8,
                                            borderWidth: 2,
                                            borderColor: filters.completed === undefined ? '#3b82f6' : (isDark ? '#262626' : '#e5e5e5'),
                                            backgroundColor: filters.completed === undefined ? '#3b82f615' : 'transparent',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Text
                                            fontSize="$3"
                                            fontWeight={filters.completed === undefined ? '600' : '400'}
                                            color={filters.completed === undefined ? '#3b82f6' : '$color'}
                                        >
                                            All
                                        </Text>
                                    </Pressable>
                                    <Pressable
                                        onPress={() => setFilters({ ...filters, completed: false })}
                                        style={{
                                            flex: 1,
                                            padding: 12,
                                            borderRadius: 8,
                                            borderWidth: 2,
                                            borderColor: filters.completed === false ? '#f59e0b' : (isDark ? '#262626' : '#e5e5e5'),
                                            backgroundColor: filters.completed === false ? '#f59e0b15' : 'transparent',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Text
                                            fontSize="$3"
                                            fontWeight={filters.completed === false ? '600' : '400'}
                                            color={filters.completed === false ? '#f59e0b' : '$color'}
                                        >
                                            Active
                                        </Text>
                                    </Pressable>
                                    <Pressable
                                        onPress={() => setFilters({ ...filters, completed: true })}
                                        style={{
                                            flex: 1,
                                            padding: 12,
                                            borderRadius: 8,
                                            borderWidth: 2,
                                            borderColor: filters.completed === true ? '#22c55e' : (isDark ? '#262626' : '#e5e5e5'),
                                            backgroundColor: filters.completed === true ? '#22c55e15' : 'transparent',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Text
                                            fontSize="$3"
                                            fontWeight={filters.completed === true ? '600' : '400'}
                                            color={filters.completed === true ? '#22c55e' : '$color'}
                                        >
                                            Completed
                                        </Text>
                                    </Pressable>
                                </XStack>
                            </YStack>

                            {/* Priority Filter */}
                            <YStack gap="$2">
                                <Text fontSize="$4" fontWeight="600" color="$color">
                                    Priority
                                </Text>
                                <XStack gap="$2" flexWrap="wrap">
                                    <Pressable
                                        onPress={() => setFilters({ ...filters, priority: undefined })}
                                        style={{
                                            paddingHorizontal: 16,
                                            paddingVertical: 10,
                                            borderRadius: 8,
                                            borderWidth: 2,
                                            borderColor: !filters.priority ? '#3b82f6' : (isDark ? '#262626' : '#e5e5e5'),
                                            backgroundColor: !filters.priority ? '#3b82f615' : 'transparent',
                                            marginBottom: 8,
                                        }}
                                    >
                                        <Text
                                            fontSize="$3"
                                            fontWeight={!filters.priority ? '600' : '400'}
                                            color={!filters.priority ? '#3b82f6' : '$color'}
                                        >
                                            All
                                        </Text>
                                    </Pressable>
                                    {priorityOptions.map((option) => (
                                        <Pressable
                                            key={option.value}
                                            onPress={() => setFilters({ ...filters, priority: option.value })}
                                            style={{
                                                paddingHorizontal: 16,
                                                paddingVertical: 10,
                                                borderRadius: 8,
                                                borderWidth: 2,
                                                borderColor: filters.priority === option.value ? option.color : (isDark ? '#262626' : '#e5e5e5'),
                                                backgroundColor: filters.priority === option.value ? `${option.color}15` : 'transparent',
                                                marginBottom: 8,
                                            }}
                                        >
                                            <Text
                                                fontSize="$3"
                                                fontWeight={filters.priority === option.value ? '600' : '400'}
                                                color={filters.priority === option.value ? option.color : '$color'}
                                            >
                                                {option.label}
                                            </Text>
                                        </Pressable>
                                    ))}
                                </XStack>
                            </YStack>

                            {/* Type Filter */}
                            <YStack gap="$2">
                                <Text fontSize="$4" fontWeight="600" color="$color">
                                    Type
                                </Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    <XStack gap="$2">
                                        <Pressable
                                            onPress={() => setFilters({ ...filters, type: undefined })}
                                            style={{
                                                paddingHorizontal: 16,
                                                paddingVertical: 10,
                                                borderRadius: 8,
                                                borderWidth: 2,
                                                borderColor: !filters.type ? '#3b82f6' : (isDark ? '#262626' : '#e5e5e5'),
                                                backgroundColor: !filters.type ? '#3b82f615' : 'transparent',
                                            }}
                                        >
                                            <Text
                                                fontSize="$3"
                                                fontWeight={!filters.type ? '600' : '400'}
                                                color={!filters.type ? '#3b82f6' : '$color'}
                                            >
                                                All Types
                                            </Text>
                                        </Pressable>
                                        {typeOptions.map((option) => (
                                            <Pressable
                                                key={option.value}
                                                onPress={() => setFilters({ ...filters, type: option.value })}
                                                style={{
                                                    paddingHorizontal: 16,
                                                    paddingVertical: 10,
                                                    borderRadius: 8,
                                                    borderWidth: 2,
                                                    borderColor: filters.type === option.value ? option.color : (isDark ? '#262626' : '#e5e5e5'),
                                                    backgroundColor: filters.type === option.value ? `${option.color}15` : 'transparent',
                                                }}
                                            >
                                                <Text
                                                    fontSize="$3"
                                                    fontWeight={filters.type === option.value ? '600' : '400'}
                                                    color={filters.type === option.value ? option.color : '$color'}
                                                >
                                                    {option.label}
                                                </Text>
                                            </Pressable>
                                        ))}
                                    </XStack>
                                </ScrollView>
                            </YStack>

                            {/* Date Range Filter */}
                            <YStack gap="$2">
                                <Text fontSize="$4" fontWeight="600" color="$color">
                                    Due Date Range
                                </Text>
                                <YStack gap="$3">
                                    <Pressable
                                        onPress={() => setShowFromDatePicker(true)}
                                        style={{
                                            padding: 14,
                                            borderRadius: 8,
                                            borderWidth: 1.5,
                                            borderColor: isDark ? '#262626' : '#e5e5e5',
                                            backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5',
                                        }}
                                    >
                                        <XStack alignItems="center" justifyContent="space-between">
                                            <XStack alignItems="center" gap="$2">
                                                <Ionicons name="calendar-outline" size={20} color={isDark ? '#fafafa' : '#171717'} />
                                                <Text color="$color">
                                                    {filters.dueDateFrom ? new Date(filters.dueDateFrom).toLocaleDateString() : 'From date'}
                                                </Text>
                                            </XStack>
                                            {filters.dueDateFrom && (
                                                <Pressable onPress={() => setFilters({ ...filters, dueDateFrom: undefined })}>
                                                    <Ionicons name="close-circle" size={20} color="#6b7280" />
                                                </Pressable>
                                            )}
                                        </XStack>
                                    </Pressable>

                                    <Pressable
                                        onPress={() => setShowToDatePicker(true)}
                                        style={{
                                            padding: 14,
                                            borderRadius: 8,
                                            borderWidth: 1.5,
                                            borderColor: isDark ? '#262626' : '#e5e5e5',
                                            backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5',
                                        }}
                                    >
                                        <XStack alignItems="center" justifyContent="space-between">
                                            <XStack alignItems="center" gap="$2">
                                                <Ionicons name="calendar-outline" size={20} color={isDark ? '#fafafa' : '#171717'} />
                                                <Text color="$color">
                                                    {filters.dueDateTo ? new Date(filters.dueDateTo).toLocaleDateString() : 'To date'}
                                                </Text>
                                            </XStack>
                                            {filters.dueDateTo && (
                                                <Pressable onPress={() => setFilters({ ...filters, dueDateTo: undefined })}>
                                                    <Ionicons name="close-circle" size={20} color="#6b7280" />
                                                </Pressable>
                                            )}
                                        </XStack>
                                    </Pressable>

                                    {showFromDatePicker && (
                                        <DateTimePicker
                                            value={filters.dueDateFrom ? new Date(filters.dueDateFrom) : new Date()}
                                            mode="date"
                                            display="default"
                                            onChange={(event, selectedDate) => {
                                                setShowFromDatePicker(false);
                                                if (selectedDate) {
                                                    setFilters({ ...filters, dueDateFrom: selectedDate.toISOString() });
                                                }
                                            }}
                                        />
                                    )}

                                    {showToDatePicker && (
                                        <DateTimePicker
                                            value={filters.dueDateTo ? new Date(filters.dueDateTo) : new Date()}
                                            mode="date"
                                            display="default"
                                            onChange={(event, selectedDate) => {
                                                setShowToDatePicker(false);
                                                if (selectedDate) {
                                                    setFilters({ ...filters, dueDateTo: selectedDate.toISOString() });
                                                }
                                            }}
                                        />
                                    )}
                                </YStack>
                            </YStack>
                        </YStack>
                    </ScrollView>

                    {/* Action Buttons */}
                    <XStack gap="$3" padding="$4" paddingTop="$2">
                        <Pressable
                            onPress={handleClear}
                            style={{
                                flex: 1,
                                padding: 14,
                                borderRadius: 8,
                                borderWidth: 1.5,
                                borderColor: isDark ? '#262626' : '#e5e5e5',
                                alignItems: 'center',
                            }}
                        >
                            <Text fontSize="$4" fontWeight="600" color="$color">
                                Clear
                            </Text>
                        </Pressable>
                        <Pressable
                            onPress={handleApply}
                            style={{
                                flex: 1,
                                padding: 14,
                                borderRadius: 8,
                                backgroundColor: '#3b82f6',
                                alignItems: 'center',
                            }}
                        >
                            <Text fontSize="$4" fontWeight="600" color="white">
                                Apply
                            </Text>
                        </Pressable>
                    </XStack>
                </YStack>
            </YStack>
        </Modal>
    );
};
