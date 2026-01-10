import React, { useEffect, useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator,
    Pressable,
} from "react-native";
import { YStack, Text, XStack } from "tamagui";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { updateTodoSchema, UpdateTodoFormData } from "@/utils/validation";
import { useTodo, useUpdateTodo, useDeleteTodo } from "@/hooks/useTodos";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";
import DateTimePicker from "@react-native-community/datetimepicker";

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
            title: "",
            description: "",
            priority: "medium",
            type: "Learn",
            dueDate: undefined,
        },
    });

    const selectedDate = watch("dueDate");

    useEffect(() => {
        if (todo) {
            setValue("title", todo.title);
            setValue("description", todo.description || "");
            setValue("priority", todo.priority);
            setValue("type", todo.type);
            setValue("dueDate", todo.dueDate);
        }
    }, [todo, setValue]);

    const onSubmit = async (data: UpdateTodoFormData) => {
        try {
            const payload: Partial<UpdateTodoFormData> = {};
            if (data.title) payload.title = data.title;
            if (data.description !== undefined)
                payload.description = data.description;
            if (data.priority) payload.priority = data.priority;
            if (data.type) payload.type = data.type;
            if (data.dueDate !== undefined) payload.dueDate = data.dueDate;

            await updateMutation.mutateAsync({ id, data: payload });
            Alert.alert("Success", "Todo updated successfully!", [
                { text: "OK", onPress: () => router.back() },
            ]);
        } catch (error: any) {
            Alert.alert(
                "Error",
                error.response?.data?.message || "Failed to update todo"
            );
        }
    };

    const handleDelete = () => {
        Alert.alert("Delete Todo", "Are you sure you want to delete this todo?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    try {
                        await deleteMutation.mutateAsync(id);
                        Alert.alert("Success", "Todo deleted successfully!", [
                            { text: "OK", onPress: () => router.back() },
                        ]);
                    } catch (error: any) {
                        Alert.alert("Error", error.message || "Failed to delete todo");
                    }
                },
            },
        ]);
    };

    const priorityOptions = [
        {
            value: "low" as const,
            label: "Low",
            color: "#10b981",
            icon: "arrow-down-circle" as const,
        },
        {
            value: "medium" as const,
            label: "Medium",
            color: "#f59e0b",
            icon: "remove-circle" as const,
        },
        {
            value: "high" as const,
            label: "High",
            color: "#ef4444",
            icon: "arrow-up-circle" as const,
        },
    ];

    const typeOptions = [
        { value: "DSA" as const, label: "DSA", color: "#a855f7" },
        {
            value: "System Design & Architecture" as const,
            label: "System Design",
            color: "#3b82f6",
        },
        { value: "Projects" as const, label: "Projects", color: "#6366f1" },
        { value: "Learn" as const, label: "Learn", color: "#06b6d4" },
        { value: "Blogging" as const, label: "Blogging", color: "#ec4899" },
        { value: "Frontend" as const, label: "Frontend", color: "#14b8a6" },
        { value: "Backend" as const, label: "Backend", color: "#f97316" },
        { value: "AI/ML" as const, label: "AI/ML", color: "#8b5cf6" },
        { value: "DevOps" as const, label: "DevOps", color: "#10b981" },
        { value: "Database" as const, label: "Database", color: "#f59e0b" },
        { value: "Testing" as const, label: "Testing", color: "#f43f5e" },
    ];

    if (isLoading) {
        return (
            <YStack
                flex={1}
                justifyContent="center"
                alignItems="center"
                backgroundColor={isDark ? "#000" : "#fff"}
            >
                <ActivityIndicator size="large" color={isDark ? "#fff" : "#000"} />
                <Text marginTop="$4" color={isDark ? "#fff" : "#000"}>
                    Loading todo...
                </Text>
            </YStack>
        );
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
            <ScrollView
                style={{ flex: 1, backgroundColor: isDark ? "#000" : "#fff" }}
                contentContainerStyle={{ padding: 20 }}
                keyboardShouldPersistTaps="handled"
            >
                <YStack space="$4">
                    {/* Header Section */}
                    <YStack space="$2" marginBottom="$4">
                        <Text
                            fontSize={32}
                            fontWeight="bold"
                            color={isDark ? "#fff" : "#000"}
                        >
                            Edit Todo
                        </Text>
                        <Text fontSize={16} color={isDark ? "#9ca3af" : "#6b7280"}>
                            Update your task details
                        </Text>
                    </YStack>

                    {/* Form Section */}
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
                            <YStack space="$2">
                                <Text
                                    fontSize={14}
                                    fontWeight="600"
                                    color={isDark ? "#fff" : "#000"}
                                >
                                    Description (Optional)
                                </Text>
                                <Pressable
                                    style={{
                                        padding: 14,
                                        borderRadius: 8,
                                        borderWidth: 1.5,
                                        borderColor: isDark ? "#262626" : "#e5e5e5",
                                        backgroundColor: isDark ? "#1a1a1a" : "#f5f5f5",
                                        minHeight: 100,
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: value
                                                ? isDark
                                                    ? "#fff"
                                                    : "#000"
                                                : isDark
                                                    ? "#6b7280"
                                                    : "#9ca3af",
                                            fontSize: 16,
                                        }}
                                        onPress={() => { }}
                                    >
                                        {value || "Enter description (optional)"}
                                    </Text>
                                </Pressable>
                                {errors.description && (
                                    <Text fontSize={12} color="#ef4444">
                                        {errors.description.message}
                                    </Text>
                                )}
                            </YStack>
                        )}
                    />

                    {/* Type Selection */}
                    <Controller
                        control={control}
                        name="type"
                        render={({ field: { onChange, value } }) => (
                            <YStack space="$2">
                                <Text
                                    fontSize={14}
                                    fontWeight="600"
                                    color={isDark ? "#fff" : "#000"}
                                >
                                    Type
                                </Text>
                                <XStack flexWrap="wrap" gap="$2">
                                    {typeOptions.map((option) => (
                                        <Pressable
                                            key={option.value}
                                            onPress={() => onChange(option.value)}
                                            style={{
                                                paddingHorizontal: 16,
                                                paddingVertical: 10,
                                                borderRadius: 8,
                                                borderWidth: 2,
                                                borderColor:
                                                    value === option.value
                                                        ? option.color
                                                        : isDark
                                                            ? "#262626"
                                                            : "#e5e5e5",
                                                backgroundColor:
                                                    value === option.value
                                                        ? `${option.color}15`
                                                        : "transparent",
                                            }}
                                        >
                                            <Text
                                                fontSize={14}
                                                fontWeight="600"
                                                color={
                                                    value === option.value
                                                        ? option.color
                                                        : isDark
                                                            ? "#9ca3af"
                                                            : "#6b7280"
                                                }
                                            >
                                                {option.label}
                                            </Text>
                                        </Pressable>
                                    ))}
                                </XStack>
                            </YStack>
                        )}
                    />

                    {/* Priority Selection */}
                    <Controller
                        control={control}
                        name="priority"
                        render={({ field: { onChange, value } }) => (
                            <YStack space="$2">
                                <Text
                                    fontSize={14}
                                    fontWeight="600"
                                    color={isDark ? "#fff" : "#000"}
                                >
                                    Priority
                                </Text>
                                <XStack space="$2">
                                    {priorityOptions.map((option) => (
                                        <Pressable
                                            key={option.value}
                                            onPress={() => onChange(option.value)}
                                            style={{
                                                flex: 1,
                                                padding: 12,
                                                borderRadius: 8,
                                                borderWidth: 2,
                                                borderColor:
                                                    value === option.value
                                                        ? option.color
                                                        : isDark
                                                            ? "#262626"
                                                            : "#e5e5e5",
                                                backgroundColor:
                                                    value === option.value
                                                        ? `${option.color}15`
                                                        : "transparent",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <Ionicons
                                                name={option.icon}
                                                size={20}
                                                color={
                                                    value === option.value
                                                        ? option.color
                                                        : isDark
                                                            ? "#6b7280"
                                                            : "#9ca3af"
                                                }
                                            />
                                            <Text
                                                fontSize={12}
                                                fontWeight="600"
                                                marginTop="$1"
                                                color={
                                                    value === option.value
                                                        ? option.color
                                                        : isDark
                                                            ? "#9ca3af"
                                                            : "#6b7280"
                                                }
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
                            <YStack space="$2">
                                <Text
                                    fontSize={14}
                                    fontWeight="600"
                                    color={isDark ? "#fff" : "#000"}
                                >
                                    Due Date
                                </Text>
                                <Pressable
                                    onPress={() => setShowDatePicker(true)}
                                    style={{
                                        padding: 14,
                                        borderRadius: 8,
                                        borderWidth: 1.5,
                                        borderColor: isDark ? "#262626" : "#e5e5e5",
                                        backgroundColor: isDark ? "#1a1a1a" : "#f5f5f5",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <XStack alignItems="center" space="$2">
                                        <Ionicons
                                            name="calendar-outline"
                                            size={20}
                                            color={isDark ? "#9ca3af" : "#6b7280"}
                                        />
                                        <Text
                                            color={
                                                value
                                                    ? isDark
                                                        ? "#fff"
                                                        : "#000"
                                                    : isDark
                                                        ? "#6b7280"
                                                        : "#9ca3af"
                                            }
                                        >
                                            {value
                                                ? new Date(value).toLocaleDateString()
                                                : "Select due date"}
                                        </Text>
                                    </XStack>
                                    {value && (
                                        <Pressable
                                            onPress={(e) => {
                                                e.stopPropagation();
                                                onChange(undefined);
                                            }}
                                        >
                                            <Ionicons name="close-circle" size={20} color="#ef4444" />
                                        </Pressable>
                                    )}
                                </Pressable>
                                {showDatePicker && (
                                    <DateTimePicker
                                        value={selectedDate ? new Date(selectedDate) : new Date()}
                                        mode="date"
                                        display={Platform.OS === "ios" ? "spinner" : "default"}
                                        onChange={(event, date) => {
                                            setShowDatePicker(false);
                                            if (date) {
                                                onChange(date.toISOString());
                                            }
                                        }}
                                    />
                                )}
                            </YStack>
                        )}
                    />

                    {/* Action Buttons */}
                    <YStack space="$3" marginTop="$4">
                        <Button
                            title="Update Todo"
                            onPress={handleSubmit(onSubmit)}
                            loading={updateMutation.isPending}
                            fullWidth
                        />
                        <Button
                            title="Cancel"
                            onPress={() => router.back()}
                            variant="outline"
                            fullWidth
                        />
                        <Button
                            title="Delete Todo"
                            onPress={handleDelete}
                            variant="outline"
                            fullWidth
                        />
                    </YStack>
                </YStack>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
