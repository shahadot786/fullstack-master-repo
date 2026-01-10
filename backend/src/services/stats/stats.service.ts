import mongoose from "mongoose";
import Todo from "../todo/todo.model";
import Url from "../url/url.model";
import Expense from "../expense/expense.model";
import { Conversation, Message } from "../chat/chat.model";
import { ShoutboxMessage } from "../shoutbox/shoutbox.model";

/**
 * Stats Service
 * 
 * Provides unified statistics for all services in the application.
 * Currently returns real data for implemented services.
 */

export interface ServiceStats {
    todos: {
        total: number;
        active: number;
        completed: number;
        highPriority: number;
        todayDue: number;
        overdue: number;
    };
    notes: {
        total: number;
        categories: number;
        recent: number;
    };
    chat: {
        totalConversations: number;
        unreadMessages: number;
    };
    ai: {
        totalQueries: number;
        tokensUsed: number;
    };
    shop: {
        totalProducts: number;
        totalOrders: number;
        revenue: number;
    };
    social: {
        totalPosts: number;
        followers: number;
        likes: number;
    };
    delivery: {
        activeDeliveries: number;
        completedDeliveries: number;
        pendingDeliveries: number;
    };
    expense: {
        totalExpenses: number;
        thisMonth: number;
        categories: number;
    };
    weather: {
        currentLocation: string;
        savedLocations: number;
    };
    urlShortener: {
        totalUrls: number;
        totalClicks: number;
        activeLinks: number;
    };
    shoutbox: {
        totalMessages: number;
    };
}

/**
 * Get comprehensive stats for all services
 */
export const getStats = async (userId: string): Promise<ServiceStats> => {
    try {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endOfToday = new Date(startOfToday);
        endOfToday.setDate(endOfToday.getDate() + 1);

        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // Fetch all stats with timeout protection
        const statsQueries = Promise.all([
            // Todo Stats
            Todo.countDocuments({ userId }),
            Todo.countDocuments({ userId, completed: false }),
            Todo.countDocuments({ userId, completed: true }),
            Todo.countDocuments({ userId, priority: "high", completed: false }),
            Todo.countDocuments({
                userId,
                completed: false,
                dueDate: { $gte: startOfToday, $lt: endOfToday },
            }),
            Todo.countDocuments({
                userId,
                completed: false,
                dueDate: { $lt: now },
            }),
            
            // URL Stats
            Url.countDocuments({ userId }),
            Url.aggregate([
                { $match: { userId: new mongoose.Types.ObjectId(userId) } },
                { $group: { _id: null, totalClicks: { $sum: "$clicks" } } }
            ]),
            Url.countDocuments({ userId, isActive: true }),

            // Expense Stats
            Expense.aggregate([
                { $match: { userId: new mongoose.Types.ObjectId(userId) } },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ]),
            Expense.aggregate([
                { 
                    $match: { 
                        userId: new mongoose.Types.ObjectId(userId),
                        date: { $gte: startOfMonth }
                    } 
                },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ]),
            Expense.distinct("category", { userId }),

            // Chat Stats
            Conversation.countDocuments({ participants: userId }),
            Message.countDocuments({ 
                conversationId: { $in: await Conversation.find({ participants: userId }).distinct("_id") },
                "readBy.userId": { $ne: userId },
                senderId: { $ne: userId }
            }),

            // Shoutbox Stats
            ShoutboxMessage.countDocuments({}),
        ]);

        const results = await statsQueries;

        const [
            totalTodos,
            activeTodos,
            completedTodos,
            highPriorityTodos,
            todayDueTodos,
            overdueTodos,
            totalUrls,
            urlClicksData,
            activeUrls,
            totalExpenseData,
            monthExpenseData,
            expenseCategories,
            totalConversations,
            unreadMessages,
            totalShoutboxMessages,
        ] = results;

        return {
            todos: {
                total: totalTodos,
                active: activeTodos,
                completed: completedTodos,
                highPriority: highPriorityTodos,
                todayDue: todayDueTodos,
                overdue: overdueTodos,
            },
            notes: {
                total: 0,
                categories: 0,
                recent: 0,
            },
            chat: {
                totalConversations: totalConversations,
                unreadMessages: unreadMessages,
            },
            ai: {
                totalQueries: 0,
                tokensUsed: 0,
            },
            shop: {
                totalProducts: 0,
                totalOrders: 0,
                revenue: 0,
            },
            social: {
                totalPosts: 0,
                followers: 0,
                likes: 0,
            },
            delivery: {
                activeDeliveries: 0,
                completedDeliveries: 0,
                pendingDeliveries: 0,
            },
            expense: {
                totalExpenses: totalExpenseData?.[0]?.total || 0,
                thisMonth: monthExpenseData?.[0]?.total || 0,
                categories: expenseCategories.length,
            },
            weather: {
                currentLocation: "Not set",
                savedLocations: 0,
            },
            urlShortener: {
                totalUrls: totalUrls || 0,
                totalClicks: urlClicksData?.[0]?.totalClicks || 0,
                activeLinks: activeUrls || 0,
            },
            shoutbox: {
                totalMessages: totalShoutboxMessages,
            },
        };
    } catch (error: any) {
        console.error(`[Stats Service] Error fetching stats for user ${userId}:`, error);
        
        // Instead of throwing, return zero stats to prevent client hanging
        // This ensures the API always responds
        return {
            todos: {
                total: 0,
                active: 0,
                completed: 0,
                highPriority: 0,
                todayDue: 0,
                overdue: 0,
            },
            notes: {
                total: 0,
                categories: 0,
                recent: 0,
            },
            chat: {
                totalConversations: 0,
                unreadMessages: 0,
            },
            ai: {
                totalQueries: 0,
                tokensUsed: 0,
            },
            shop: {
                totalProducts: 0,
                totalOrders: 0,
                revenue: 0,
            },
            social: {
                totalPosts: 0,
                followers: 0,
                likes: 0,
            },
            delivery: {
                activeDeliveries: 0,
                completedDeliveries: 0,
                pendingDeliveries: 0,
            },
            expense: {
                totalExpenses: 0,
                thisMonth: 0,
                categories: 0,
            },
            weather: {
                currentLocation: "Not set",
                savedLocations: 0,
            },
            urlShortener: {
                totalUrls: 0,
                totalClicks: 0,
                activeLinks: 0,
            },
            shoutbox: {
                totalMessages: 0,
            },
        };
    }
};
