"use client";

import { Todo, TodoPriority, TodoType } from "@/types";
import { useUpdateTodo, useDeleteTodo } from "@/hooks/use-todos";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface TodoCardProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
}

const priorityColors = {
  low: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  high: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
};

const typeColors: Record<TodoType, string> = {
  "DSA": "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
  "System Design & Architecture": "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  "Projects": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400",
  "Learn": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400",
  "Blogging": "bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400",
  "Frontend": "bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-400",
  "Backend": "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
  "AI/ML": "bg-violet-100 text-violet-800 dark:bg-violet-900/20 dark:text-violet-400",
  "DevOps": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400",
  "Database": "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400",
  "Testing": "bg-rose-100 text-rose-800 dark:bg-rose-900/20 dark:text-rose-400",
};

export function TodoCard({ todo, onEdit }: TodoCardProps) {
  const updateTodo = useUpdateTodo();
  const deleteTodo = useDeleteTodo();

  const handleToggleComplete = () => {
    updateTodo.mutate({
      id: todo._id,
      data: { completed: !todo.completed },
    });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this todo?")) {
      deleteTodo.mutate(todo._id);
    }
  };

  return (
    <Card className={cn(
      "transition-all hover:shadow-lg h-full flex flex-col",
      todo.completed && "opacity-60"
    )}>
      <CardContent className="p-4 flex flex-col h-full">
        {/* Header with checkbox and actions */}
        <div className="flex items-start justify-between mb-3">
          <Checkbox
            checked={todo.completed}
            onCheckedChange={handleToggleComplete}
            className="mt-0.5"
          />
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit(todo)}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={handleDelete}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Title */}
        <h3
          className={cn(
            "font-semibold text-base text-gray-900 dark:text-white mb-2 line-clamp-2",
            todo.completed && "line-through text-gray-500"
          )}
        >
          {todo.title}
        </h3>

        {/* Description */}
        {todo.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3 flex-1">
            {todo.description}
          </p>
        )}

        {/* Footer with priority, type, and due date */}
        <div className="flex flex-col gap-2 mt-auto">
          <div className="flex flex-wrap gap-2">
            <span
              className={cn(
                "text-xs px-2 py-1 rounded-full font-medium w-fit",
                priorityColors[todo.priority]
              )}
            >
              {todo.priority}
            </span>
            <span
              className={cn(
                "text-xs px-2 py-1 rounded-full font-medium w-fit",
                typeColors[todo.type]
              )}
            >
              {todo.type}
            </span>
          </div>
          {todo.dueDate && (
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Calendar className="w-3 h-3 mr-1" />
              {format(new Date(todo.dueDate), "MMM dd, yyyy")}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
