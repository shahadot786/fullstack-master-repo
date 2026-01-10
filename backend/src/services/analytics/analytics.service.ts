import Todo from "./../todo/todo.model";
import User from "@services/auth/auth.model";
import Url from "./../url/url.model";
import Expense from "./../expense/expense.model";
import { ShoutboxMessage } from "./../shoutbox/shoutbox.model";
import { Message } from "./../chat/chat.model";

/**
 * Analytics service
 *
 * Provide unified analytics for all service and users.
 * This is the global analytics of the application
 */

type service = {
  name: string;
  total: number;
  completed?: number;
  pending?: number;
  clicks?: number;
  amount?: number;
};

type user = {
  id: string;
  name: string;
  imageUrl: string;
  createdAt: Date;
  services: service[];
};

type services = {
  name: string;
  total: number;
  completed?: number;
  pending?: number;
  clicks?: number;
  amount?: number;
};

export interface AnalyticsStats {
  users: user[];
  services: services[];
}

export const getAnalyticsStats = async (
  page: number = 1,
  limit: number = 6
): Promise<AnalyticsStats & { pagination: { page: number; limit: number; total: number; totalPages: number } }> => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    
    // Fetch all global data
    const [todos, urls, expenses, shoutboxMessages, chatMessages] = await Promise.all([
      Todo.find().sort({ createdAt: -1 }),
      Url.find(),
      Expense.find(),
      ShoutboxMessage.find(),
      Message.find()
    ]);

    // Calculate global service statistics
    const globalServices: services[] = [
      {
        name: "Todo",
        total: todos.length,
        completed: todos.filter((todo) => todo.completed).length,
        pending: todos.filter((todo) => !todo.completed).length,
      },
      {
        name: "URL Shortener",
        total: urls.length,
        clicks: urls.reduce((sum, url) => sum + (url.clicks || 0), 0),
      },
      {
        name: "Expense",
        total: expenses.length,
        amount: expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0),
      },
      {
        name: "Chat",
        total: chatMessages.length,
      },
      {
        name: "Shoutbox",
        total: shoutboxMessages.length,
      }
    ];

    // Map users with their service activities
    const usersWithActivities = users.map((user) => {
      const userIdStr = user._id.toString();
      
      const userTodos = todos.filter((todo) => todo.userId.toString() === userIdStr);
      const userUrls = urls.filter((url) => url.userId.toString() === userIdStr);
      const userExpenses = expenses.filter((exp) => exp.userId.toString() === userIdStr);
      const userChatMessages = chatMessages.filter((msg) => msg.senderId.toString() === userIdStr);
      const userShoutboxMessages = shoutboxMessages.filter((msg) => msg.senderId.toString() === userIdStr);

      return {
        id: userIdStr,
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
          {
            name: "URL Shortener",
            total: userUrls.length,
            clicks: userUrls.reduce((sum, url) => sum + (url.clicks || 0), 0),
          },
          {
            name: "Expense",
            total: userExpenses.length,
            amount: userExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0),
          },
          {
            name: "Chat",
            total: userChatMessages.length,
          },
          {
            name: "Shoutbox",
            total: userShoutboxMessages.length,
          }
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
      services: globalServices,
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

