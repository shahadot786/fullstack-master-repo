"use client";

import { useState } from "react";
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
import { Plus, Loader2 } from "lucide-react";

export default function TodosPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [completedFilter, setCompletedFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const { data: todos, isLoading, error } = useGetTodos({
    completed: completedFilter === "all" ? undefined : completedFilter === "completed",
    priority: priorityFilter === "all" ? undefined : (priorityFilter as TodoPriority),
  });

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTodo(null);
  };

  const handleCreateNew = () => {
    setEditingTodo(null);
    setIsFormOpen(true);
  };

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
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              My Todos
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {todos?.length || 0} total tasks
            </p>
          </div>
          <Button onClick={handleCreateNew}>
            <Plus className="w-4 h-4 mr-2" />
            New Todo
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <Select value={completedFilter} onValueChange={setCompletedFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[180px]">
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
