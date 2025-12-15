'use client';

import { useTodoStore } from '@/lib/store/todos';
import TodoItem from './TodoItem';

export default function TodoList({ onEdit }) {
    const { todos, loading, error } = useTodoStore();

    if (loading && todos.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <p className="mt-2 text-sm text-gray-500">Loading todos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-800">{error}</p>
            </div>
        );
    }

    if (todos.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-lg shadow">
                <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No todos</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new todo.</p>
            </div>
        );
    }

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
                {todos.map((todo) => (
                    <TodoItem key={todo._id} todo={todo} />
                ))}
            </ul>
        </div>
    );
}
