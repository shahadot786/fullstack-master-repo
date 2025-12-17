import { create } from 'zustand';
import { Todo } from '@/types';

/**
 * Todo Store
 * 
 * Zustand store for todo state management.
 * Manages todos list, filter, and loading/error states.
 */

type TodoFilter = 'all' | 'active' | 'completed';

interface TodoState {
    todos: Todo[];
    filter: TodoFilter;
    isLoading: boolean;
    error: string | null;
}

interface TodoActions {
    setTodos: (todos: Todo[]) => void;
    addTodo: (todo: Todo) => void;
    updateTodo: (id: string, updates: Partial<Todo>) => void;
    deleteTodo: (id: string) => void;
    setFilter: (filter: TodoFilter) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;
    getFilteredTodos: () => Todo[];
}

type TodoStore = TodoState & TodoActions;

export const useTodoStore = create<TodoStore>((set, get) => ({
    // Initial state
    todos: [],
    filter: 'all',
    isLoading: false,
    error: null,

    // Actions
    setTodos: (todos) => set({ todos, error: null }),

    addTodo: (todo) =>
        set((state) => ({
            todos: [todo, ...state.todos],
            error: null,
        })),

    updateTodo: (id, updates) =>
        set((state) => ({
            todos: state.todos.map((todo) =>
                todo._id === id ? { ...todo, ...updates } : todo
            ),
            error: null,
        })),

    deleteTodo: (id) =>
        set((state) => ({
            todos: state.todos.filter((todo) => todo._id !== id),
            error: null,
        })),

    setFilter: (filter) => set({ filter }),

    setLoading: (loading) => set({ isLoading: loading }),

    setError: (error) => set({ error }),

    clearError: () => set({ error: null }),

    getFilteredTodos: () => {
        const { todos, filter } = get();

        switch (filter) {
            case 'active':
                return todos.filter((todo) => !todo.completed);
            case 'completed':
                return todos.filter((todo) => todo.completed);
            default:
                return todos;
        }
    },
}));
