import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { YStack, Text, Select } from 'tamagui';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { createTodoSchema, CreateTodoFormData } from '@/utils/validation';
import { useCreateTodo } from '@/hooks/useTodos';

export default function CreateTodoScreen() {
    const router = useRouter();
    const createMutation = useCreateTodo();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateTodoFormData>({
        resolver: zodResolver(createTodoSchema),
        defaultValues: {
            title: '',
            description: '',
            priority: 'medium',
            dueDate: undefined,
        },
    });

    const onSubmit = async (data: CreateTodoFormData) => {
        try {
            await createMutation.mutateAsync(data);
            Alert.alert('Success', 'Todo created successfully');
            router.back();
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to create todo');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                <YStack padding="$6" gap="$5" backgroundColor="$background">
                    <Controller
                        control={control}
                        name="title"
                        render={({ field: { onChange, value } }) => (
                            <Input
                                label="Title"
                                placeholder="Enter todo title"
                                value={value}
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
                        title="Create Todo"
                        onPress={handleSubmit(onSubmit)}
                        loading={createMutation.isPending}
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
