import React from 'react';
import { Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { XStack, YStack, Text } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/common/Card';
import { Todo } from '@/types';
import { useToggleTodo, useDeleteTodo } from '@/hooks/useTodos';

interface TodoCardProps {
    todo: Todo;
}

const priorityColors = {
    low: '#22c55e',
    medium: '#f59e0b',
    high: '#ef4444',
};

export const TodoCard: React.FC<TodoCardProps> = ({ todo }) => {
    console.log(JSON.stringify(todo,null,4),"todo");
    const router = useRouter();
    const toggleMutation = useToggleTodo();
    const deleteMutation = useDeleteTodo();

    const handleToggle = () => {
        toggleMutation.mutate({ id: todo._id, completed: !todo.completed });
    };

    const handleEdit = () => {
        router.push(`/(main)/(todos)/edit/${todo._id}` as any);
    };

    const handleDelete = () => {
        Alert.alert(
            'Delete Todo',
            'Are you sure you want to delete this todo?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => deleteMutation.mutate(todo._id),
                },
            ]
        );
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    return (
        <Card marginBottom="$3">
            <YStack gap="$2">
                <XStack justifyContent="space-between" alignItems="flex-start">
                    <XStack flex={1} gap="$3" alignItems="flex-start">
                        <Pressable 
                            onPress={handleToggle}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            style={{
                                width: 20,
                                height: 20,
                                borderRadius: 6,
                                borderWidth: 2,
                                borderColor: todo.completed ? '#3b82f6' : '#d1d5db',
                                backgroundColor: todo.completed ? '#3b82f6' : 'transparent',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: 4,
                            }}
                        >
                            {todo.completed && (
                                <Ionicons name="checkmark" size={16} color="white" />
                            )}
                        </Pressable>
                        <YStack flex={1}>
                            <Pressable onPress={handleEdit}>
                                <YStack gap="$1">
                                    <Text
                                        fontSize="$5"
                                        fontWeight="600"
                                        color="$color"
                                        textDecorationLine={todo.completed ? 'line-through' : 'none'}
                                        opacity={todo.completed ? 0.6 : 1}
                                    >
                                        {todo.title}
                                    </Text>
                                    {todo.description && (
                                        <Text
                                            fontSize="$3"
                                            color="$color"
                                            opacity={0.7}
                                            numberOfLines={2}
                                        >
                                            {todo.description}
                                        </Text>
                                    )}
                                </YStack>
                            </Pressable>
                        </YStack>
                    </XStack>
                    <Pressable onPress={handleDelete}>
                        <Ionicons name="trash-outline" size={20} color="#ef4444" />
                    </Pressable>
                </XStack>

                <XStack gap="$2" alignItems="center">
                    <XStack
                        backgroundColor={priorityColors[todo.priority]}
                        paddingHorizontal="$2"
                        paddingVertical="$1"
                        borderRadius="$2"
                    >
                        <Text fontSize="$2" color="white" fontWeight="600">
                            {todo.priority.toUpperCase()}
                        </Text>
                    </XStack>
                    {todo.dueDate && (
                        <XStack gap="$1" alignItems="center">
                            <Ionicons name="calendar-outline" size={14} color="#666" />
                            <Text fontSize="$2" color="$color" opacity={0.6}>
                                {formatDate(todo.dueDate)}
                            </Text>
                        </XStack>
                    )}
                </XStack>
            </YStack>
        </Card>
    );
};
