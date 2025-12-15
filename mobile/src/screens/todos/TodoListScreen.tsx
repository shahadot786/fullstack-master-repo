import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { Text, FAB, Card, Chip, IconButton, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { format } from 'date-fns';
import { useTodoStore } from '../../store/todoStore';
import type { TodoStackParamList } from '../../navigation/RootNavigator';
import type { Todo } from '../../types';

type TodoListScreenNavigationProp = StackNavigationProp<TodoStackParamList, 'TodoList'>;

export default function TodoListScreen() {
    const navigation = useNavigation<TodoListScreenNavigationProp>();
    const { todos, loading, fetchTodos, updateTodo, deleteTodo } = useTodoStore();

    useEffect(() => {
        fetchTodos();
    }, []);

    const handleToggleComplete = async (todo: Todo) => {
        try {
            await updateTodo(todo._id, { completed: !todo.completed });
        } catch (error) {
            console.error('Failed to update todo:', error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteTodo(id);
        } catch (error) {
            console.error('Failed to delete todo:', error);
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return '#ef4444';
            case 'medium':
                return '#f59e0b';
            case 'low':
                return '#10b981';
            default:
                return '#6b7280';
        }
    };

    const renderTodo = ({ item }: { item: Todo }) => (
        <Card style={styles.card}>
            <Card.Content>
                <View style={styles.cardHeader}>
                    <View style={styles.titleRow}>
                        <IconButton
                            icon={item.completed ? 'checkbox-marked' : 'checkbox-blank-outline'}
                            size={24}
                            onPress={() => handleToggleComplete(item)}
                        />
                        <Text
                            variant="titleMedium"
                            style={[
                                styles.title,
                                item.completed && styles.completedTitle,
                            ]}
                        >
                            {item.title}
                        </Text>
                    </View>
                    <IconButton
                        icon="delete"
                        size={20}
                        onPress={() => handleDelete(item._id)}
                    />
                </View>

                {item.description && (
                    <Text variant="bodyMedium" style={styles.description}>
                        {item.description}
                    </Text>
                )}

                <View style={styles.footer}>
                    <Chip
                        mode="outlined"
                        style={[styles.chip, { borderColor: getPriorityColor(item.priority) }]}
                        textStyle={{ color: getPriorityColor(item.priority) }}
                    >
                        {item.priority}
                    </Chip>
                    <Text variant="bodySmall" style={styles.date}>
                        {format(new Date(item.createdAt), 'MMM d, yyyy')}
                    </Text>
                </View>
            </Card.Content>
        </Card>
    );

    if (loading && todos.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={todos}
                renderItem={renderTodo}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={fetchTodos} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text variant="titleLarge" style={styles.emptyText}>
                            No TODOs yet
                        </Text>
                        <Text variant="bodyMedium" style={styles.emptySubtext}>
                            Tap the + button to create one
                        </Text>
                    </View>
                }
            />
            <FAB
                icon="plus"
                style={styles.fab}
                onPress={() => navigation.navigate('CreateTodo')}
            />
        </View>
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
    listContent: {
        padding: 16,
        paddingBottom: 80,
    },
    card: {
        marginBottom: 12,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    title: {
        flex: 1,
        marginLeft: 8,
    },
    completedTitle: {
        textDecorationLine: 'line-through',
        color: '#9ca3af',
    },
    description: {
        marginTop: 8,
        marginLeft: 48,
        color: '#6b7280',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
        marginLeft: 48,
    },
    chip: {
        height: 28,
    },
    date: {
        color: '#9ca3af',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: '#6366f1',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        marginBottom: 8,
        color: '#6b7280',
    },
    emptySubtext: {
        color: '#9ca3af',
    },
});
