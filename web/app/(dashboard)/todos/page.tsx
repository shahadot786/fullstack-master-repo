"use client";

import { useState, useCallback } from "react";
import { useWebSocket } from "@/hooks/use-websocket";
import { useGetTodos } from "@/hooks/use-todos";
import { Todo, TodoPriority } from "@/types";
import { TodoCard } from "@/components/todos/todo-card";
import { TodoForm } from "@/components/todos/todo-form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2, Wifi, WifiOff } from "lucide-react";

export default function TodosPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [completedFilter, setCompletedFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const { data: todos, isLoading, error } = useGetTodos({
    completed: completedFilter === "all" ? undefined : completedFilter === "completed",
    priority: priorityFilter === "all" ? undefined : (priorityFilter as TodoPriority),
  });

  // Initialize WebSocket for real-time updates
  const { isConnected } = useWebSocket();

  const handleEdit = useCallback((todo: Todo) => {
    setEditingTodo(todo);
    setIsFormOpen(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false);
    setEditingTodo(null);
  }, []);

  const handleCreateNew = useCallback(() => {
    setEditingTodo(null);
    setIsFormOpen(true);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">
            Failed to load todos. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              My Todos
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {todos?.length || 0} total tasks
              </p>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <div className="flex items-center gap-1.5">
                {isConnected ? (
                  <>
                    <Wifi className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                    <span className="text-xs text-green-600 dark:text-green-400">Live</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs text-gray-400">Offline</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <Button onClick={handleCreateNew} className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            New Todo
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={completedFilter} onValueChange={setCompletedFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Todo List */}
      <div className="space-y-3">
        {todos && todos.length > 0 ? (
          todos.map((todo) => (
            <TodoCard key={todo._id} todo={todo} onEdit={handleEdit} />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No todos found. Create your first task!
            </p>
            <Button onClick={handleCreateNew}>
              <Plus className="w-4 h-4 mr-2" />
              Create Todo
            </Button>
          </div>
        )}
      </div>

      {/* Todo Form Dialog */}
      <TodoForm
        open={isFormOpen}
        onClose={handleCloseForm}
        todo={editingTodo}
      />
    </div>
  );
}
