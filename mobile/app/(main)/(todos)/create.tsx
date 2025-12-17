import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { ScrollView, KeyboardAvoidingView, Platform, Alert, Pressable } from 'react-native';
import { YStack, Text, XStack, TextArea } from 'tamagui';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { createTodoSchema, CreateTodoFormData } from '@/utils/validation';
import { useCreateTodo } from '@/hooks/useTodos';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function CreateTodoScreen() {
    const router = useRouter();
    const createMutation = useCreateTodo();
    const { isDark } = useTheme();
    const [showDatePicker, setShowDatePicker] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<CreateTodoFormData>({
        resolver: zodResolver(createTodoSchema),
        defaultValues: {
            title: '',
            description: '',
            priority: 'medium',
            dueDate: undefined,
        },
    });

    const selectedPriority = watch('priority');
    const selectedDate = watch('dueDate');

    const onSubmit = async (data: CreateTodoFormData) => {
        try {
            // Create payload with only defined values
            const payload: any = {
                title: data.title,
                priority: data.priority,
            };
            
            // Only add optional fields if they have values
            if (data.description && data.description.trim()) {
                payload.description = data.description.trim();
            }
            
            if (data.dueDate) {
                payload.dueDate = data.dueDate;
            }

            await createMutation.mutateAsync(payload);
            Alert.alert('Success', 'Todo created successfully!', [
                {
                    text: 'OK',
                    onPress: () => router.back(),
                },
            ]);
        } catch (error: any) {
            console.error('Create error:', error);
            Alert.alert('Error', error.response?.data?.message || error.message || 'Failed to create todo');
        }
    };

    const priorityOptions = [
        { value: 'low', label: 'Low', color: '#10b981', icon: 'arrow-down-circle' },
        { value: 'medium', label: 'Medium', color: '#f59e0b', icon: 'remove-circle' },
        { value: 'high', label: 'High', color: '#ef4444', icon: 'arrow-up-circle' },
    ];

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
                                Create New Todo
                            </Text>
                        </XStack>
                        <Text fontSize="$4" color="$color" opacity={0.6}>
                            Add a new task to your list
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
                                        Due Date (Optional)
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
                                            <Pressable onPress={() => onChange(undefined)}>
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
                            title={createMutation.isPending ? 'Creating...' : 'Create Todo'}
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
                </YStack>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
