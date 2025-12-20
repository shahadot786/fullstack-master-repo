import Todo from "./../todo/todo.model";
import User from "@services/auth/auth.model";

/**
 * Analytics service
 *
 * Provide unified analytics for all service and users.
 * This is the global analytics of the application
 */

type service = {
  name: string;
  total: number;
  completed: number;
  pending: number;
};

type user = {
  id: string;
  name: string;
  imageUrl: string;
  createdAt: Date;
  services: service[];
};

type services = {
  name:string;
  total:number;
  completed:number;
  pending:number;
}

export interface AnalyticsStats {
  users: user[];
  services:services[]
}

export const getAnalyticsStats = async (
  page: number = 1,
  limit: number = 6
): Promise<AnalyticsStats & { pagination: { page: number; limit: number; total: number; totalPages: number } }> => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    const todos = await Todo.find().sort({ createdAt: -1 });

    // Calculate global service statistics
    const globalTodoStats = {
      name: "Todo",
      total: todos.length,
      completed: todos.filter((todo) => todo.completed).length,
      pending: todos.filter((todo) => !todo.completed).length,
    };

    // Map users with their service activities
    const usersWithActivities = users.map((user) => {
      // Filter todos for this specific user
      const userTodos = todos.filter(
        (todo) => todo.userId.toString() === user._id.toString()
      );

      return {
        id: user._id.toString(),
        name: user.name,
        imageUrl: user.profileImage || "",
        createdAt: user.createdAt,
        services: [
          {
            name: "Todo",
            total: userTodos.length,
            completed: userTodos.filter((todo) => todo.completed).length,
            pending: userTodos.filter((todo) => !todo.completed).length,
          },
        ],
      };
    });

    // Apply pagination to users
    const totalUsers = usersWithActivities.length;
    const totalPages = Math.ceil(totalUsers / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = usersWithActivities.slice(startIndex, endIndex);

    return {
      users: paginatedUsers,
      services: [globalTodoStats],
      pagination: {
        page,
        limit,
        total: totalUsers,
        totalPages,
      },
    };
  } catch (error: any) {
    throw new Error(`Analytics error: ${error.message}`);
  }
};

