import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TodoStackParamList } from '@navigation/types';
import { todoSchema, TodoFormData } from '@utils/validation';
import { useGetTodoById, useUpdateTodo, useDeleteTodo } from '@hooks/useTodos';
import { useTheme } from '@hooks/useTheme';
import Button from '@components/common/Button';
import Input from '@components/common/Input';
import Card from '@components/common/Card';

type EditTodoScreenNavigationProp = NativeStackNavigationProp<TodoStackParamList, 'EditTodo'>;
type EditTodoScreenRouteProp = RouteProp<TodoStackParamList, 'EditTodo'>;

export default function EditTodoScreen() {
  const navigation = useNavigation<EditTodoScreenNavigationProp>();
  const route = useRoute<EditTodoScreenRouteProp>();
  const { isDark } = useTheme();
  const { todoId } = route.params;

  const { data: todo, isLoading } = useGetTodoById(todoId);
  const updateTodo = useUpdateTodo();
  const deleteTodo = useDeleteTodo();
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TodoFormData>({
    resolver: zodResolver(todoSchema),
    values: todo
      ? {
          title: todo.title,
          description: todo.description || '',
          priority: todo.priority,
          dueDate: todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : '',
        }
      : undefined,
  });

  const onSubmit = async (data: TodoFormData) => {
    try {
      setError(null);
      await updateTodo.mutateAsync({ id: todoId, data });
      navigation.goBack();
    } catch (err: any) {
      setError(err.message || 'Failed to update todo');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTodo.mutateAsync(todoId);
      navigation.goBack();
    } catch (err: any) {
      setError(err.message || 'Failed to delete todo');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!todo) {
    return (
      <View style={styles.centerContainer}>
        <Text style={[styles.errorText, isDark && styles.errorText_dark]}>
          Todo not found
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text style={[styles.title, isDark && styles.title_dark]}>
            Edit Todo
          </Text>

          <Card style={styles.card}>
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <Controller
              control={control}
              name="title"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Title *"
                  placeholder="Enter todo title"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.title?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Description"
                  placeholder="Enter description (optional)"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.description?.message}
                  multiline
                  numberOfLines={4}
                  style={{ height: 100, textAlignVertical: 'top' }}
                />
              )}
            />

            <Controller
              control={control}
              name="priority"
              render={({ field: { onChange, value } }) => (
                <View style={styles.priorityContainer}>
                  <Text style={[styles.label, isDark && styles.label_dark]}>
                    Priority
                  </Text>
                  <View style={styles.priorityButtons}>
                    {(['low', 'medium', 'high'] as const).map((priority) => (
                      <Button
                        key={priority}
                        title={priority.charAt(0).toUpperCase() + priority.slice(1)}
                        onPress={() => onChange(priority)}
                        variant={value === priority ? 'primary' : 'outline'}
                        size="small"
                      />
                    ))}
                  </View>
                </View>
              )}
            />

            <Controller
              control={control}
              name="dueDate"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Due Date"
                  placeholder="YYYY-MM-DD (optional)"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.dueDate?.message}
                />
              )}
            />

            <View style={styles.buttonContainer}>
              <Button
                title="Cancel"
                onPress={() => navigation.goBack()}
                variant="outline"
                style={{ flex: 1 }}
              />
              <Button
                title="Update"
                onPress={handleSubmit(onSubmit)}
                loading={updateTodo.isPending}
                variant="primary"
                style={{ flex: 1 }}
              />
            </View>

            <Button
              title="Delete Todo"
              onPress={handleDelete}
              loading={deleteTodo.isPending}
              variant="danger"
              fullWidth
              style={{ marginTop: 16 }}
            />
          </Card>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  content: {
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#262626',
    marginBottom: 24,
    fontFamily: 'JetBrainsMono-Bold',
  },
  title_dark: {
    color: '#f5f5f5',
  },
  card: {
    marginBottom: 24,
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#991b1b',
    fontSize: 14,
    fontFamily: 'JetBrainsMono-Regular',
  },
  errorText_dark: {
    color: '#f87171',
  },
  priorityContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#262626',
    fontFamily: 'JetBrainsMono-Medium',
  },
  label_dark: {
    color: '#f5f5f5',
  },
  priorityButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
});
