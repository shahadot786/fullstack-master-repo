import Todo from "../todo/todo.model";

/**
 * Stats Service
 * 
 * Provides unified statistics for all services in the application.
 * Currently returns real data for todos and dummy data for future services.
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
}

/**
 * Get comprehensive stats for all services
 */
export const getStats = async (userId: string): Promise<ServiceStats> => {
    // Get real todo statistics
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(startOfToday);
    endOfToday.setDate(endOfToday.getDate() + 1);

    const [
        totalTodos,
        activeTodos,
        completedTodos,
        highPriorityTodos,
        todayDueTodos,
        overdueTodos,
    ] = await Promise.all([
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
    ]);

    // Return stats with real todo data and dummy data for other services
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
    };
};
