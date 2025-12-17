import React, { useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { YStack, Text, Select } from 'tamagui';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { updateTodoSchema, UpdateTodoFormData } from '@/utils/validation';
import { useTodo, useUpdateTodo, useDeleteTodo } from '@/hooks/useTodos';

export default function EditTodoScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { data: todo, isLoading } = useTodo(id);
    const updateMutation = useUpdateTodo();
    const deleteMutation = useDeleteTodo();

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<UpdateTodoFormData>({
        resolver: zodResolver(updateTodoSchema),
        defaultValues: {
            title: '',
            description: '',
            priority: 'medium',
        },
    });

    useEffect(() => {
        if (todo) {
            setValue('title', todo.title);
            setValue('description', todo.description || '');
            setValue('priority', todo.priority);
        }
    }, [todo]);

    const onSubmit = async (data: UpdateTodoFormData) => {
        try {
            // Create payload with only the fields that have values
            const payload: any = {};
            
            if (data.title) payload.title = data.title;
            if (data.description !== undefined) payload.description = data.description;
            if (data.priority) payload.priority = data.priority;

            await updateMutation.mutateAsync({ id, data: payload });
            Alert.alert('Success', 'Todo updated successfully');
            router.back();
        } catch (error: any) {
            console.error('Update error:', error);
            Alert.alert('Error', error.response?.data?.message || error.message || 'Failed to update todo');
        }
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
                    onPress: async () => {
                        try {
                            await deleteMutation.mutateAsync(id);
                            router.back();
                        } catch (error: any) {
                            Alert.alert('Error', error.message || 'Failed to delete todo');
                        }
                    },
                },
            ]
        );
    };

    if (isLoading) {
        return (
            <YStack flex={1} justifyContent="center" alignItems="center">
                <ActivityIndicator size="large" />
            </YStack>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                <YStack padding="$4" gap="$4" backgroundColor="$background">
                    <Controller
                        control={control}
                        name="title"
                        render={({ field: { onChange, value } }) => (
                            <Input
                                label="Title"
                                placeholder="Enter todo title"
                                value={value || ''}
                                onChangeText={onChange}
                                error={errors.title?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="description"
                        render={({ field: { onChange, value } }) => (
                            <Input
                                label="Description (Optional)"
                                placeholder="Enter description"
                                value={value || ''}
                                onChangeText={onChange}
                                error={errors.description?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="priority"
                        render={({ field: { onChange, value } }) => (
                            <YStack gap="$2">
                                <Text fontSize="$4" fontWeight="500" color="$color">
                                    Priority
                                </Text>
                                <Select value={value} onValueChange={onChange}>
                                    <Select.Trigger>
                                        <Select.Value placeholder="Select priority" />
                                    </Select.Trigger>
                                    <Select.Content>
                                        <Select.Item index={0} value="low">
                                            <Select.ItemText>Low</Select.ItemText>
                                        </Select.Item>
                                        <Select.Item index={1} value="medium">
                                            <Select.ItemText>Medium</Select.ItemText>
                                        </Select.Item>
                                        <Select.Item index={2} value="high">
                                            <Select.ItemText>High</Select.ItemText>
                                        </Select.Item>
                                    </Select.Content>
                                </Select>
                            </YStack>
                        )}
                    />

                    <Button
                        title="Update Todo"
                        onPress={handleSubmit(onSubmit)}
                        loading={updateMutation.isPending}
                        fullWidth
                    />

                    <Button
                        title="Delete Todo"
                        onPress={handleDelete}
                        variant="outline"
                        fullWidth
                    />

                    <Button
                        title="Cancel"
                        onPress={() => router.back()}
                        variant="outline"
                        fullWidth
                    />
                </YStack>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
