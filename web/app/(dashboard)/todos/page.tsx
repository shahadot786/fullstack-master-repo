"use client";

import { useState, useCallback } from "react";
import { useWebSocket } from "@/hooks/use-websocket";
import { useGetTodos } from "@/hooks/use-todos";
import { Todo, TodoPriority } from "@/types";
import { TodoCard } from "@/components/todos/todo-card";
import { TodoForm } from "@/components/todos/todo-form";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { LoaderModal } from "@/components/ui/loader-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Wifi, WifiOff } from "lucide-react";

export default function TodosPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [completedFilter, setCompletedFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading, error } = useGetTodos({
    page,
    limit: pageSize,
    completed:
      completedFilter === "all" ? undefined : completedFilter === "completed",
    priority:
      priorityFilter === "all" ? undefined : (priorityFilter as TodoPriority),
  });

  const todos = data?.data || [];
  const pagination = data?.pagination;

  // Initialize WebSocket for real-time updates
  const { isConnected } = useWebSocket();

  // Handlers that reset page when filters change
  const handleCompletedFilterChange = useCallback((value: string) => {
    setCompletedFilter(value);
    setPage(1);
  }, []);

  const handlePriorityFilterChange = useCallback((value: string) => {
    setPriorityFilter(value);
    setPage(1);
  }, []);

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
    return <LoaderModal text="Loading Todos..." />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-40">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">
            Failed to load todos. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="mb-6 flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              My Todos
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {pagination?.total || 0} total tasks
              </p>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <div className="flex items-center gap-1.5">
                {isConnected ? (
                  <>
                    <Wifi className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                    <span className="text-xs text-green-600 dark:text-green-400">
                      Live
                    </span>
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
          <Select
            value={completedFilter}
            onValueChange={handleCompletedFilterChange}
          >
            <SelectTrigger className="w-full sm:w-45">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={priorityFilter}
            onValueChange={handlePriorityFilterChange}
          >
            <SelectTrigger className="w-full sm:w-45">
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

      {/* Todo Grid - Fixed height with scroll */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {todos && todos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-4">
            {todos.map((todo) => (
              <TodoCard key={todo._id} todo={todo} onEdit={handleEdit} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No todos found. Create your first task!
              </p>
              <Button onClick={handleCreateNew}>
                <Plus className="w-4 h-4 mr-2" />
                Create Todo
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.total > 0 && (
        <div className="mt-6 flex-shrink-0">
          <Pagination
            currentPage={page}
            totalPages={pagination.totalPages}
            pageSize={pageSize}
            totalItems={pagination.total}
            onPageChange={setPage}
            onPageSizeChange={(newSize: number) => {
              setPageSize(newSize);
              setPage(1); // Reset to first page when changing page size
            }}
          />
        </div>
      )}

      {/* Todo Form Dialog */}
      <TodoForm
        open={isFormOpen}
        onClose={handleCloseForm}
        todo={editingTodo}
      />
    </div>
  );
}
