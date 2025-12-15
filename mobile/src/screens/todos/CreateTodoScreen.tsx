import React from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, HelperText, SegmentedButtons } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTodoStore } from '../../store/todoStore';

const createTodoSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
    description: z.string().max(500, 'Description too long').optional(),
    priority: z.enum(['low', 'medium', 'high']),
    dueDate: z.string().optional(),
});

type CreateTodoForm = z.infer<typeof createTodoSchema>;

export default function CreateTodoScreen() {
    const navigation = useNavigation();
    const { createTodo, isLoading } = useTodoStore();

    const { control, handleSubmit, formState: { errors } } = useForm<CreateTodoForm>({
        resolver: zodResolver(createTodoSchema),
        defaultValues: {
            title: '',
            description: '',
            priority: 'medium',
            dueDate: '',
        },
    });

    const onSubmit = async (data: CreateTodoForm) => {
        try {
            await createTodo(data);
            navigation.goBack();
        } catch (error) {
            console.error('Failed to create todo:', error);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.content}>
                    <Controller
                        control={control}
                        name="title"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                label="Title *"
                                mode="outlined"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                error={!!errors.title}
                                style={styles.input}
                            />
                        )}
                    />
                    <HelperText type="error" visible={!!errors.title}>
                        {errors.title?.message}
                    </HelperText>

                    <Controller
                        control={control}
                        name="description"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                label="Description"
                                mode="outlined"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                multiline
                                numberOfLines={4}
                                error={!!errors.description}
                                style={styles.input}
                            />
                        )}
                    />
                    <HelperText type="error" visible={!!errors.description}>
                        {errors.description?.message}
                    </HelperText>

                    <Controller
                        control={control}
                        name="priority"
                        render={({ field: { onChange, value } }) => (
                            <View style={styles.priorityContainer}>
                                <HelperText type="info">Priority</HelperText>
                                <SegmentedButtons
                                    value={value}
                                    onValueChange={onChange}
                                    buttons={[
                                        { value: 'low', label: 'Low' },
                                        { value: 'medium', label: 'Medium' },
                                        { value: 'high', label: 'High' },
                                    ]}
                                />
                            </View>
                        )}
                    />

                    <Button
                        mode="contained"
                        onPress={handleSubmit(onSubmit)}
                        loading={isLoading}
                        disabled={isLoading}
                        style={styles.button}
                    >
                        Create TODO
                    </Button>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        padding: 20,
    },
    input: {
        marginBottom: 4,
    },
    priorityContainer: {
        marginTop: 16,
        marginBottom: 24,
    },
    button: {
        paddingVertical: 6,
    },
});
