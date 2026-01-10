"use client";

import { useState, useCallback } from "react";
import { useWebSocket } from "@/hooks/use-websocket";
import { useGetTodos } from "@/hooks/use-todos";
import { Todo, TodoPriority, TodoType } from "@/types";
import { TodoCard } from "@/components/todos/todo-card";
import { TodoForm } from "@/components/todos/todo-form";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { LoaderModal } from "@/components/ui/loader-modal";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Wifi, WifiOff, X, Download } from "lucide-react";
import { todosApi } from "@/lib/api/todos";

export default function TodosPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [completedFilter, setCompletedFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [dueDateFromFilter, setDueDateFromFilter] = useState<string>("");
  const [dueDateToFilter, setDueDateToFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isExporting, setIsExporting] = useState(false);

  const { data, isLoading, error } = useGetTodos({
    page,
    limit: pageSize,
    completed:
      completedFilter === "all" ? undefined : completedFilter === "completed",
    priority:
      priorityFilter === "all" ? undefined : (priorityFilter as TodoPriority),
    type:
      typeFilter === "all" ? undefined : (typeFilter as TodoType),
    dueDateFrom: dueDateFromFilter || undefined,
    dueDateTo: dueDateToFilter || undefined,
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

  const handleTypeFilterChange = useCallback((value: string) => {
    setTypeFilter(value);
    setPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setCompletedFilter("all");
    setPriorityFilter("all");
    setTypeFilter("all");
    setDueDateFromFilter("");
    setDueDateToFilter("");
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

  const handleExport = useCallback(async () => {
    try {
      setIsExporting(true);
      const blob = await todosApi.exportTodos({
        completed: completedFilter === "all" ? undefined : completedFilter === "completed",
        priority: priorityFilter === "all" ? undefined : (priorityFilter as TodoPriority),
        type: typeFilter === "all" ? undefined : (typeFilter as TodoType),
        dueDateFrom: dueDateFromFilter || undefined,
        dueDateTo: dueDateToFilter || undefined,
      });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const date = new Date().toISOString().split('T')[0];
      link.download = `todos-${date}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Export successful - file downloaded
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export todos. Please try again.");
    } finally {
      setIsExporting(false);
    }
  }, [completedFilter, priorityFilter, typeFilter, dueDateFromFilter, dueDateToFilter]);

  if (isLoading) {
    return <LoaderModal text="Loading Todos..." />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-40">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">
            {error instanceof Error
              ? error.message
              : "Failed to load todos. Please try again."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="mb-6 shrink-0">
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
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              onClick={handleExport}
              variant="outline"
              disabled={isExporting || todos.length === 0}
              className="w-full sm:w-auto"
            >
              <Download className="w-4 h-4 mr-2" />
              {isExporting ? "Exporting..." : "Export CSV"}
            </Button>
            <Button onClick={handleCreateNew} className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              New Todo
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3">
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

            <Select
              value={typeFilter}
              onValueChange={handleTypeFilterChange}
            >
              <SelectTrigger className="w-full sm:w-45">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="DSA">DSA</SelectItem>
                <SelectItem value="System Design & Architecture">System Design</SelectItem>
                <SelectItem value="Projects">Projects</SelectItem>
                <SelectItem value="Learn">Learn</SelectItem>
                <SelectItem value="Blogging">Blogging</SelectItem>
                <SelectItem value="Frontend">Frontend</SelectItem>
                <SelectItem value="Backend">Backend</SelectItem>
                <SelectItem value="AI/ML">AI/ML</SelectItem>
                <SelectItem value="DevOps">DevOps</SelectItem>
                <SelectItem value="Database">Database</SelectItem>
                <SelectItem value="Testing">Testing</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="w-full sm:w-auto"
            >
              <X className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>

          {/* Date Range Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="sm:w-48">
              <Input
                type="date"
                placeholder="From date"
                value={dueDateFromFilter}
                onChange={(e) => {
                  setDueDateFromFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full"
              />
            </div>
            <div className="sm:w-48">
              <Input
                type="date"
                placeholder="To date"
                value={dueDateToFilter}
                onChange={(e) => {
                  setDueDateToFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full"
              />
            </div>
          </div>
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
        <div className="mt-6 shrink-0">
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
