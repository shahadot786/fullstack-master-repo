import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { TodoStackParamList } from '@navigation/types';
import { useGetTodos, useToggleTodo, useDeleteTodo } from '@hooks/useTodos';
import { useTheme } from '@hooks/useTheme';
import { Todo } from '@types';
import Card from '@components/common/Card';
import Button from '@components/common/Button';

type TodoListScreenNavigationProp = NativeStackNavigationProp<TodoStackParamList, 'TodoTabs'>;

interface TodoListScreenProps {
  filter?: 'all' | 'active' | 'completed';
}

/**
 * Todo List Screen
 * 
 * Displays a list of todos with filtering options.
 * Uses Tanstack Query for data fetching and caching.
 * Supports pull-to-refresh and optimistic updates.
 */
export default function TodoListScreen({ filter = 'all' }: TodoListScreenProps) {
  const navigation = useNavigation<TodoListScreenNavigationProp>();
  const { isDark } = useTheme();
  
  // Determine query params based on filter
  const queryParams = filter === 'all' 
    ? undefined 
    : { completed: filter === 'completed' };

  // Fetch todos with Tanstack Query
  const { data: todos, isLoading, isError, error, refetch } = useGetTodos(queryParams);
  const toggleTodo = useToggleTodo();
  const deleteTodo = useDeleteTodo();

  const [refreshing, setRefreshing] = useState(false);

  /**
   * Handle pull-to-refresh
   */
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  /**
   * Handle todo toggle (mark complete/incomplete)
   */
  const handleToggle = (todo: Todo) => {
    toggleTodo.mutate({
      id: todo._id,
      completed: !todo.completed,
    });
  };

  /**
   * Handle todo deletion
   */
  const handleDelete = (id: string) => {
    deleteTodo.mutate(id);
  };

  /**
   * Navigate to create todo screen
   */
  const handleCreate = () => {
    navigation.navigate('CreateTodo');
  };

  /**
   * Navigate to edit todo screen
   */
  const handleEdit = (todoId: string) => {
    navigation.navigate('EditTodo', { todoId });
  };

  /**
   * Navigate to todo detail screen
   */
  const handleViewDetail = (todoId: string) => {
    navigation.navigate('TodoDetail', { todoId });
  };

  /**
   * Render a single todo item
   */
  const renderTodoItem = ({ item }: { item: Todo }) => (
    <TouchableOpacity onPress={() => handleViewDetail(item._id)}>
      <Card style={styles.todoCard}>
        <View style={styles.todoContent}>
          {/* Checkbox */}
          <TouchableOpacity
            onPress={() => handleToggle(item)}
            style={styles.checkbox}
          >
            <Ionicons
              name={item.completed ? 'checkmark-circle' : 'ellipse-outline'}
              size={28}
              color={item.completed ? '#22c55e' : isDark ? '#737373' : '#a3a3a3'}
            />
          </TouchableOpacity>

          {/* Todo info */}
          <View style={styles.todoInfo}>
            <Text
              style={[
                styles.todoTitle,
                isDark && styles.todoTitle_dark,
                item.completed && styles.todoTitle_completed,
              ]}
            >
              {item.title}
            </Text>
            {item.description && (
              <Text
                style={[
                  styles.todoDescription,
                  isDark && styles.todoDescription_dark,
                  item.completed && styles.todoDescription_completed,
                ]}
                numberOfLines={2}
              >
                {item.description}
              </Text>
            )}
            <View style={styles.todoMeta}>
              <View style={[styles.priorityBadge, styles[`priority_${item.priority}`]]}>
                <Text style={styles.priorityText}>{item.priority}</Text>
              </View>
              {item.dueDate && (
                <Text style={[styles.dueDate, isDark && styles.dueDate_dark]}>
                  {new Date(item.dueDate).toLocaleDateString()}
                </Text>
              )}
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={() => handleEdit(item._id)}
              style={styles.actionButton}
            >
              <Ionicons name="create-outline" size={20} color="#2563eb" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDelete(item._id)}
              style={styles.actionButton}
            >
              <Ionicons name="trash-outline" size={20} color="#dc2626" />
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  /**
   * Render empty state
   */
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons
        name="checkmark-done-outline"
        size={64}
        color={isDark ? '#525252' : '#d4d4d4'}
      />
      <Text style={[styles.emptyText, isDark && styles.emptyText_dark]}>
        {filter === 'completed'
          ? 'No completed todos yet'
          : filter === 'active'
          ? 'No active todos'
          : 'No todos yet'}
      </Text>
      <Text style={[styles.emptySubtext, isDark && styles.emptySubtext_dark]}>
        Tap the + button to create your first todo
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Text style={[styles.errorText, isDark && styles.errorText_dark]}>
          {error?.message || 'Failed to load todos'}
        </Text>
        <Button title="Retry" onPress={() => refetch()} variant="primary" />
      </View>
    );
  }

  return (
    <View style={[styles.container, isDark && styles.container_dark]}>
      <FlatList
        data={todos}
        renderItem={renderTodoItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={isDark ? '#ffffff' : '#000000'}
          />
        }
      />

      {/* FAB - Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleCreate}>
        <Ionicons name="add" size={28} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container_dark: {
    backgroundColor: '#171717',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80, // Space for FAB
  },
  todoCard: {
    marginBottom: 12,
  },
  todoContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    marginRight: 12,
    paddingTop: 2,
  },
  todoInfo: {
    flex: 1,
  },
  todoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#262626',
    marginBottom: 4,
    fontFamily: 'JetBrainsMono-Medium',
  },
  todoTitle_dark: {
    color: '#f5f5f5',
  },
  todoTitle_completed: {
    textDecorationLine: 'line-through',
    color: '#a3a3a3',
  },
  todoDescription: {
    fontSize: 14,
    color: '#737373',
    marginBottom: 8,
    fontFamily: 'JetBrainsMono-Regular',
  },
  todoDescription_dark: {
    color: '#a3a3a3',
  },
  todoDescription_completed: {
    color: '#a3a3a3',
  },
  todoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  priority_low: {
    backgroundColor: '#dbeafe',
  },
  priority_medium: {
    backgroundColor: '#fef3c7',
  },
  priority_high: {
    backgroundColor: '#fee2e2',
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#262626',
    textTransform: 'uppercase',
    fontFamily: 'JetBrainsMono-Medium',
  },
  dueDate: {
    fontSize: 12,
    color: '#737373',
    fontFamily: 'JetBrainsMono-Regular',
  },
  dueDate_dark: {
    color: '#a3a3a3',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#525252',
    marginTop: 16,
    marginBottom: 8,
    fontFamily: 'JetBrainsMono-Medium',
  },
  emptyText_dark: {
    color: '#a3a3a3',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#737373',
    fontFamily: 'JetBrainsMono-Regular',
  },
  emptySubtext_dark: {
    color: '#737373',
  },
  errorText: {
    fontSize: 16,
    color: '#dc2626',
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: 'JetBrainsMono-Regular',
  },
  errorText_dark: {
    color: '#f87171',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
