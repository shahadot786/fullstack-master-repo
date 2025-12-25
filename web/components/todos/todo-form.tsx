"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Todo, TodoType } from "@/types";
import { useCreateTodo, useUpdateTodo } from "@/hooks/use-todos";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";

const todoSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  description: z.string().max(500, "Description too long").optional(),
  priority: z.enum(["low", "medium", "high"]),
  type: z.enum([
    "DSA",
    "System Design & Architecture",
    "Projects",
    "Learn",
    "Blogging",
    "Frontend",
    "Backend",
    "AI/ML",
    "DevOps",
    "Database",
    "Testing",
  ]),
  dueDate: z.string().min(1, "Due date is required"),
});

type TodoFormValues = z.infer<typeof todoSchema>;

interface TodoFormProps {
  open: boolean;
  onClose: () => void;
  todo?: Todo | null;
}

export function TodoForm({ open, onClose, todo }: TodoFormProps) {
  const createTodo = useCreateTodo();
  const updateTodo = useUpdateTodo();
  const isEditing = !!todo;

  const form = useForm<TodoFormValues>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      type: "Learn",
      dueDate: "",
    },
  });

  useEffect(() => {
    if (todo) {
      form.reset({
        title: todo.title,
        description: todo.description || "",
        priority: todo.priority,
        type: todo.type,
        dueDate: todo.dueDate
          ? new Date(todo.dueDate).toISOString().split("T")[0]
          : "",
      });
    } else {
      form.reset({
        title: "",
        description: "",
        priority: "medium",
        type: "Learn",
        dueDate: "",
      });
    }
  }, [todo, form]);

  const onSubmit = async (data: TodoFormValues) => {
    try {
      const payload = {
        ...data,
        dueDate: data.dueDate, // Now required
      };

      if (isEditing) {
        await updateTodo.mutateAsync({
          id: todo._id,
          data: payload,
        });
      } else {
        await createTodo.mutateAsync(payload);
      }

      form.reset();
      onClose();
    } catch (error) {
      const errorMessage =
        (error instanceof Error &&
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message) ||
        "Title already exists";
      form.setError("title", {
        type: "server",
        message: errorMessage,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Todo" : "Create New Todo"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update your todo details below"
              : "Add a new task to your list"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter todo title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter todo description"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="DSA">DSA</SelectItem>
                      <SelectItem value="System Design & Architecture">System Design & Architecture</SelectItem>
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date (Optional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createTodo.isPending || updateTodo.isPending}
              >
                {createTodo.isPending || updateTodo.isPending
                  ? "Saving..."
                  : isEditing
                  ? "Update"
                  : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
