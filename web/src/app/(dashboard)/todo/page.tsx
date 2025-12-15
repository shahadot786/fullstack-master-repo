'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  deleteAllTodos,
  type Todo,
  type CreateTodoData,
  type UpdateTodoData,
} from '@/lib/api/todos';
import { Plus, Trash2, Edit2, Check, X, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * Todo Page
 * Full CRUD operations for todos with pagination, filtering, and search
 */
export default function TodoPage() {
  // State management
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  
  // Form states
  const [formData, setFormData] = useState<CreateTodoData>({
    title: '',
    description: '',
    priority: 'medium',
  });

  const limit = 10;

  // Fetch todos on mount and when filters change
  useEffect(() => {
    fetchTodos();
  }, [page, filter, priorityFilter]);

  /**
   * Fetch todos from API
   */
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const params: any = { page, limit };
      
      if (filter !== 'all') {
        params.completed = filter === 'completed';
      }
      
      if (priorityFilter !== 'all') {
        params.priority = priorityFilter;
      }

      const response = await getTodos(params);
      setTodos(response.data);
      setTotal(response.pagination.total);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create new todo
   */
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    try {
      await createTodo(formData);
      toast.success('Todo created successfully');
      setIsCreateModalOpen(false);
      setFormData({ title: '', description: '', priority: 'medium' });
      fetchTodos();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create todo');
    }
  };

  /**
   * Update existing todo
   */
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingTodo) return;

    try {
      await updateTodo(editingTodo._id, formData);
      toast.success('Todo updated successfully');
      setIsEditModalOpen(false);
      setEditingTodo(null);
      setFormData({ title: '', description: '', priority: 'medium' });
      fetchTodos();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update todo');
    }
  };

  /**
   * Toggle todo completion status
   */
  const handleToggleComplete = async (todo: Todo) => {
    try {
      await updateTodo(todo._id, { completed: !todo.completed });
      toast.success(todo.completed ? 'Todo marked as pending' : 'Todo completed!');
      fetchTodos();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update todo');
    }
  };

  /**
   * Delete a todo
   */
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this todo?')) return;

    try {
      await deleteTodo(id);
      toast.success('Todo deleted successfully');
      fetchTodos();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete todo');
    }
  };

  /**
   * Delete all todos
   */
  const handleDeleteAll = async () => {
    if (!confirm('Are you sure you want to delete ALL todos? This action cannot be undone.')) return;

    try {
      const response = await deleteAllTodos();
      toast.success(`Deleted ${response.data.deletedCount} todos`);
      fetchTodos();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete todos');
    }
  };

  /**
   * Open edit modal with todo data
   */
  const openEditModal = (todo: Todo) => {
    setEditingTodo(todo);
    setFormData({
      title: todo.title,
      description: todo.description || '',
      priority: todo.priority,
    });
    setIsEditModalOpen(true);
  };

  /**
   * Get priority badge color
   */
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-error/20 text-error';
      case 'medium': return 'bg-warning/20 text-warning';
      case 'low': return 'bg-success/20 text-success';
      default: return 'bg-gray-200 text-gray-700';
    }
  };

  // Filter todos by search query
  const filteredTodos = todos.filter(todo =>
    todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    todo.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Todos</h1>
          <p className="text-text-secondary mt-1">Manage your tasks and stay organized</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus size={18} className="mr-2" />
            New Todo
          </Button>
          {todos.length > 0 && (
            <Button variant="danger" onClick={handleDeleteAll}>
              <Trash2 size={18} className="mr-2" />
              Delete All
            </Button>
          )}
        </div>
      </div>

      {/* Filters and Search */}
      <Card padding="md">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <Input
              placeholder="Search todos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search size={18} />}
            />
          </div>

          {/* Status Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-4 py-2 border border-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className="px-4 py-2 border border-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </Card>

      {/* Todos List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" text="Loading todos..." />
        </div>
      ) : filteredTodos.length === 0 ? (
        <Card padding="lg" className="text-center">
          <div className="py-12">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">No todos found</h3>
            <p className="text-text-secondary mb-6">
              {searchQuery ? 'Try adjusting your search or filters' : 'Create your first todo to get started'}
            </p>
            {!searchQuery && (
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus size={18} className="mr-2" />
                Create Todo
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredTodos.map((todo) => (
            <Card key={todo._id} padding="md" hover className="transition-all">
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <button
                  onClick={() => handleToggleComplete(todo)}
                  className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    todo.completed
                      ? 'bg-success border-success'
                      : 'border-border hover:border-primary'
                  }`}
                >
                  {todo.completed && <Check size={14} className="text-white" />}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3
                    className={`text-lg font-semibold ${
                      todo.completed ? 'line-through text-text-muted' : 'text-text-primary'
                    }`}
                  >
                    {todo.title}
                  </h3>
                  {todo.description && (
                    <p className="text-sm text-text-secondary mt-1">{todo.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(todo.priority)}`}>
                      {todo.priority}
                    </span>
                    <span className="text-xs text-text-muted">
                      {new Date(todo.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(todo)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    aria-label="Edit todo"
                  >
                    <Edit2 size={18} className="text-text-secondary hover:text-primary" />
                  </button>
                  <button
                    onClick={() => handleDelete(todo._id)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    aria-label="Delete todo"
                  >
                    <Trash2 size={18} className="text-text-secondary hover:text-error" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {total > limit && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="px-4 py-2 text-text-primary">
            Page {page} of {Math.ceil(total / limit)}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage(p => p + 1)}
            disabled={page >= Math.ceil(total / limit)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setFormData({ title: '', description: '', priority: 'medium' });
        }}
        title="Create New Todo"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Title"
            placeholder="Enter todo title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Description
            </label>
            <textarea
              placeholder="Enter description (optional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create Todo</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingTodo(null);
          setFormData({ title: '', description: '', priority: 'medium' });
        }}
        title="Edit Todo"
      >
        <form onSubmit={handleUpdate} className="space-y-4">
          <Input
            label="Title"
            placeholder="Enter todo title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Description
            </label>
            <textarea
              placeholder="Enter description (optional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Update Todo</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
