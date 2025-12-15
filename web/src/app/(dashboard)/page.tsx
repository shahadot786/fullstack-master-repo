'use client';

import { useEffect, useState } from 'react';
import { useTodoStore } from '@/lib/store/todos';
import { Plus } from 'lucide-react';
import TodoList from '@/components/todos/TodoList';
import CreateTodoModal from '@/components/todos/CreateTodoModal';
import EditTodoModal from '@/components/todos/EditTodoModal'; // New import

export default function DashboardPage() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // New state for edit modal
    const [editingTodo, setEditingTodo] = useState(null); // New state for todo being edited
    const [searchTerm, setSearchTerm] = useState(''); // New state for search term
    const [filterStatus, setFilterStatus] = useState('all'); // New state for filter status ('all', 'pending', 'completed')

    const { fetchTodos } = useTodoStore();

    useEffect(() => {
        fetchTodos();
    }, [fetchTodos]);

    const handleEditTodo = (todo) => {
        setEditingTodo(todo);
        setIsEditModalOpen(true);
    };

    return (
        <div>
            <div className="sm:flex sm:items-center sm:justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My TODOs</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage your tasks and stay organized
                    </p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        New TODO
                    </button>
                </div>
            </div>

            {/* Search and Filter Section */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <input
                    type="text"
                    placeholder="Search todos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                </select>
            </div>

            <TodoList
                searchTerm={searchTerm}
                filterStatus={filterStatus}
                onEditTodo={handleEditTodo} // Pass handler to TodoList
            />

            <CreateTodoModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />

            {/* New EditTodoModal */}
            {editingTodo && (
                <EditTodoModal
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setEditingTodo(null); // Clear editing todo on close
                    }}
                    todo={editingTodo}
                />
            )}
        </div>
    );
}
