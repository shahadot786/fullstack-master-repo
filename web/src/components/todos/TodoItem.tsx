'use client';

import { useTodoStore } from '@/lib/store/todos';
import type { Todo } from '@/types';
import { Trash2, Edit } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface TodoItemProps {
    todo: Todo;
}

export default function TodoItem({ todo }: TodoItemProps) {
    const { updateTodo, deleteTodo } = useTodoStore();

    const handleToggle = async () => {
        try {
            await updateTodo(todo._id, { completed: !todo.completed });
            toast.success(todo.completed ? 'Marked as incomplete' : 'Marked as complete');
        } catch (error) {
            toast.error('Failed to update todo');
        }
    };

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this todo?')) {
            try {
                await deleteTodo(todo._id);
                toast.success('TODO deleted');
            } catch (error) {
                toast.error('Failed to delete todo');
            }
        }
    };

    const handleEdit = () => {
        // TODO: Implement edit functionality, e.g., open a modal or navigate
        console.log('Edit todo:', todo._id);
        toast('Edit functionality not yet implemented', { icon: 'ℹ️' });
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'bg-red-100 text-red-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'low':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <li className="px-4 py-4 sm:px-6 hover:bg-gray-50">
            <div className="flex items-center justify-between">
                <div className="flex items-center flex-1 min-w-0">
                    <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={handleToggle}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                    />
                    <div className="ml-4 flex-1">
                        <div className="flex items-center">
                            <p
                                className={`text-sm font-medium text-gray-900 ${todo.completed ? 'line-through text-gray-500' : ''
                                    }`}
                            >
                                {todo.title}
                            </p>
                            <span
                                className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                                    todo.priority
                                )}`}
                            >
                                {todo.priority}
                            </span>
                        </div>
                        {todo.description && (
                            <p className="mt-1 text-sm text-gray-500">{todo.description}</p>
                        )}
                        <div className="mt-2 flex items-center text-xs text-gray-500">
                            <span>Created {format(new Date(todo.createdAt), 'MMM d, yyyy')}</span>
                            {todo.dueDate && (
                                <>
                                    <span className="mx-2">•</span>
                                    <span>Due {format(new Date(todo.dueDate), 'MMM d, yyyy')}</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="ml-4 flex items-center space-x-2">
                    <button
                        onClick={handleEdit}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                        <Edit className="h-5 w-5" />
                    </button>
                    <button
                        onClick={handleDelete}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                        <Trash2 className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </li>
    );
}
