import Todo, { ITodo } from "./todo.model";
import { TodoQueryInput } from "@fullstack-master/shared";
import { NotFoundError, ConflictError } from "@common/errors";
import { emitToUser } from "@common/services/websocket.service";

export const createTodo = async (
  userId: string,
  data: Partial<ITodo>
): Promise<ITodo> => {
  // Check for duplicate title (case-insensitive via collation)
  if (data.title) {
    const existingTodo = await Todo.findOne({ userId, title: data.title })
      .collation({ locale: 'en', strength: 2 });
    if (existingTodo) {
      throw new ConflictError("A todo with this title already exists");
    }
  }

  try {
    const todo = await Todo.create({ ...data, userId });
    
    // Emit WebSocket event for real-time update
    console.log(`📤 [BACKEND] Emitting todo:created event to user ${userId}`);
    emitToUser(userId, "todo:created", { todo });
    
    return todo;
  } catch (error: any) {
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      throw new ConflictError("A todo with this title already exists");
    }
    throw error;
  }
};

export const getTodos = async (
  userId: string,
  query: TodoQueryInput
): Promise<{ todos: ITodo[]; total: number }> => {
  const { page = 1, limit = 10, completed, priority, sortBy = "createdAt", sortOrder = "desc" } = query;

  // Build filter
  const filter: any = { userId };
  if (completed !== undefined) {
    filter.completed = completed;
  }
  if (priority) {
    filter.priority = priority;
  }

  // Build sort
  const sort: any = {};
  sort[sortBy] = sortOrder === "asc" ? 1 : -1;

  // Execute query with pagination
  const skip = (page - 1) * limit;
  const [todos, total] = await Promise.all([
    Todo.find(filter).sort(sort).skip(skip).limit(limit),
    Todo.countDocuments(filter),
  ]);

  return { todos, total };
};

export const getTodoById = async (
  userId: string,
  todoId: string
): Promise<ITodo> => {
  const todo = await Todo.findOne({ _id: todoId, userId });
  if (!todo) {
    throw new NotFoundError("Todo not found");
  }
  return todo;
};

export const updateTodo = async (
  userId: string,
  todoId: string,
  data: Partial<ITodo>
): Promise<ITodo> => {
  // Check for duplicate title if title is being updated (case-insensitive via collation)
  if (data.title) {
    const existingTodo = await Todo.findOne({ userId, title: data.title })
      .collation({ locale: 'en', strength: 2 });
    // Allow update if the existing todo is the same one being updated
    if (existingTodo && existingTodo._id.toString() !== todoId) {
      throw new ConflictError("A todo with this title already exists");
    }
  }

  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: todoId, userId },
      data,
      { new: true, runValidators: true }
    );

    if (!todo) {
      throw new NotFoundError("Todo not found");
    }

    // Emit WebSocket event for real-time update
    console.log(`📤 [BACKEND] Emitting todo:updated event to user ${userId}`);
    emitToUser(userId, "todo:updated", { todo });

    return todo;
  } catch (error: any) {
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      throw new ConflictError("A todo with this title already exists");
    }
    throw error;
  }
};

export const deleteTodo = async (
  userId: string,
  todoId: string
): Promise<void> => {
  const todo = await Todo.findOneAndDelete({ _id: todoId, userId });
  if (!todo) {
    throw new NotFoundError("Todo not found");
  }
  
  // Emit WebSocket event for real-time update
  console.log(`📤 [BACKEND] Emitting todo:deleted event to user ${userId}`);
  emitToUser(userId, "todo:deleted", { todoId });
};

export const deleteAllTodos = async (userId: string) => {
  const result = await Todo.deleteMany({ userId });
  
  // Emit WebSocket event for real-time update
  console.log(`📤 [BACKEND] Emitting todos:deleted_all event to user ${userId}`);
  emitToUser(userId, "todos:deleted_all", { deletedCount: result.deletedCount });
  
  return result;
};
