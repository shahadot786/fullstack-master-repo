import React, { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, Pressable } from 'react-native';
import { YStack, Text, XStack, TextArea } from 'tamagui';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { updateTodoSchema, UpdateTodoFormData } from '@/utils/validation';
import { useTodo, useUpdateTodo, useDeleteTodo } from '@/hooks/useTodos';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function EditTodoScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { data: todo, isLoading } = useTodo(id);
    const updateMutation = useUpdateTodo();
    const deleteMutation = useDeleteTodo();
    const { isDark } = useTheme();
    const [showDatePicker, setShowDatePicker] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<UpdateTodoFormData>({
        resolver: zodResolver(updateTodoSchema),
        defaultValues: {
            title: '',
            description: '',
            priority: 'medium',
            dueDate: undefined,
        },
    });

    const selectedPriority = watch('priority');
    const selectedDate = watch('dueDate');

    useEffect(() => {
        if (todo) {
            setValue('title', todo.title);
            setValue('description', todo.description || '');
            setValue('priority', todo.priority);
            setValue('dueDate', todo.dueDate);
        }
    }, [todo]);

    const onSubmit = async (data: UpdateTodoFormData) => {
        try {
            // Create payload with only the fields that have values
            const payload: any = {};
            
            if (data.title) payload.title = data.title;
            if (data.description !== undefined) payload.description = data.description;
            if (data.priority) payload.priority = data.priority;
            if (data.dueDate !== undefined) payload.dueDate = data.dueDate;

            await updateMutation.mutateAsync({ id, data: payload });
            Alert.alert('Success', 'Todo updated successfully!', [
                {
                    text: 'OK',
                    onPress: () => router.back(),
                },
            ]);
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to update todo');
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
                            Alert.alert('Success', 'Todo deleted successfully!', [
                                {
                                    text: 'OK',
                                    onPress: () => router.back(),
                                },
                            ]);
                        } catch (error: any) {
                            Alert.alert('Error', error.message || 'Failed to delete todo');
                        }
                    },
                },
            ]
        );
    };

    const priorityOptions = [
        { value: 'low', label: 'Low', color: '#10b981', icon: 'arrow-down-circle' },
        { value: 'medium', label: 'Medium', color: '#f59e0b', icon: 'remove-circle' },
        { value: 'high', label: 'High', color: '#ef4444', icon: 'arrow-up-circle' },
    ];

    if (isLoading) {
        return (
            <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$background">
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text color="$color" marginTop="$4">Loading todo...</Text>
            </YStack>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                <YStack
                    flex={1}
                    backgroundColor="$background"
                    paddingHorizontal="$5"
                    paddingTop="$6"
                    paddingBottom="$4"
                    gap="$5"
                >
                    {/* Header Section */}
                    <YStack gap="$2">
                        <XStack alignItems="center" gap="$3">
                            <Ionicons
                                name="create-outline"
                                size={28}
                                color="#3b82f6"
                            />
                            <Text fontSize="$8" fontWeight="700" color="$color">
                                Edit Todo
                            </Text>
                        </XStack>
                        <Text fontSize="$4" color="$color" opacity={0.6}>
                            Update your task details
                        </Text>
                    </YStack>

                    {/* Form Section */}
                    <YStack gap="$4" flex={1}>
                        <Controller
                            control={control}
                            name="title"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    label="Title"
                                    placeholder="e.g., Buy groceries, Finish project..."
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
                                <YStack gap="$2" width="100%">
                                    <Text fontSize="$4" fontWeight="500" color="$color">
                                        Description (Optional)
                                    </Text>
                                    <TextArea
                                        placeholder="Add more details about your task..."
                                        value={value || ''}
                                        onChangeText={onChange}
                                        backgroundColor="$background"
                                        borderWidth={1.5}
                                        borderColor={errors.description ? '$error' : '$borderColor'}
                                        borderRadius="$4"
                                        padding="$4"
                                        minHeight={100}
                                        fontSize="$4"
                                        color="$color"
                                    />
                                    {errors.description && (
                                        <Text fontSize="$3" color="$error">
                                            {errors.description.message}
                                        </Text>
                                    )}
                                </YStack>
                            )}
                        />

                        {/* Priority Selection */}
                        <Controller
                            control={control}
                            name="priority"
                            render={({ field: { onChange, value } }) => (
                                <YStack gap="$2">
                                    <Text fontSize="$4" fontWeight="500" color="$color">
                                        Priority
                                    </Text>
                                    <XStack gap="$2">
                                        {priorityOptions.map((option) => (
                                            <Pressable
                                                key={option.value}
                                                onPress={() => onChange(option.value)}
                                                style={{
                                                    flex: 1,
                                                    padding: 12,
                                                    borderRadius: 8,
                                                    borderWidth: 2,
                                                    borderColor: value === option.value ? option.color : (isDark ? '#262626' : '#e5e5e5'),
                                                    backgroundColor: value === option.value ? `${option.color}15` : 'transparent',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <Ionicons
                                                    name={option.icon as any}
                                                    size={20}
                                                    color={value === option.value ? option.color : (isDark ? '#6b7280' : '#737373')}
                                                />
                                                <Text
                                                    fontSize="$3"
                                                    fontWeight={value === option.value ? '600' : '400'}
                                                    color={value === option.value ? option.color : '$color'}
                                                    marginTop="$1"
                                                >
                                                    {option.label}
                                                </Text>
                                            </Pressable>
                                        ))}
                                    </XStack>
                                </YStack>
                            )}
                        />

                        {/* Due Date */}
                        <Controller
                            control={control}
                            name="dueDate"
                            render={({ field: { onChange, value } }) => (
                                <YStack gap="$2">
                                    <Text fontSize="$4" fontWeight="500" color="$color">
                                        Due Date
                                    </Text>
                                    <Pressable
                                        onPress={() => setShowDatePicker(true)}
                                        style={{
                                            padding: 14,
                                            borderRadius: 8,
                                            borderWidth: 1.5,
                                            borderColor: isDark ? '#262626' : '#e5e5e5',
                                            backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <XStack alignItems="center" gap="$2">
                                            <Ionicons name="calendar-outline" size={20} color={isDark ? '#fafafa' : '#171717'} />
                                            <Text color="$color">
                                                {value ? new Date(value).toLocaleDateString() : 'Select due date'}
                                            </Text>
                                        </XStack>
                                        {value && (
                                            <Pressable onPress={(e) => {
                                                e.stopPropagation();
                                                onChange(undefined);
                                            }}>
                                                <Ionicons name="close-circle" size={20} color="#6b7280" />
                                            </Pressable>
                                        )}
                                    </Pressable>
                                    {showDatePicker && (
                                        <DateTimePicker
                                            value={value ? new Date(value) : new Date()}
                                            mode="date"
                                            display="default"
                                            onChange={(event, selectedDate) => {
                                                setShowDatePicker(false);
                                                if (selectedDate) {
                                                    onChange(selectedDate.toISOString());
                                                }
                                            }}
                                        />
                                    )}
                                </YStack>
                            )}
                        />
                    </YStack>

                    {/* Action Buttons */}
                    <YStack gap="$3" paddingBottom="$4" marginBottom="$10">
                        <Button
                            title={updateMutation.isPending ? 'Updating...' : 'Update Todo'}
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
                </YStack>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
