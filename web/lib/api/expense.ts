import api from "@/lib/api/client";
import { 
    Expense, 
    CreateExpenseDto, 
    UpdateExpenseDto, 
    ExpenseQueryParams,
    ExpenseStats,
    ExpensesResponse,
    ExpenseCategory
} from "@/types";

export const expenseApi = {
    getExpenses: async (params?: ExpenseQueryParams): Promise<ExpensesResponse> => {
        const response = await api.get("/expense", { params });
        return response.data;
    },

    getExpenseStats: async (year?: number, month?: number): Promise<{ success: boolean; data: ExpenseStats }> => {
        const response = await api.get("/expense/stats", { 
            params: { year, month } 
        });
        return response.data;
    },

    createExpense: async (data: CreateExpenseDto): Promise<{ success: boolean; data: Expense }> => {
        const response = await api.post("/expense", data);
        return response.data;
    },

    updateExpense: async (id: string, data: UpdateExpenseDto): Promise<{ success: boolean; data: Expense }> => {
        const response = await api.put(`/expense/${id}`, data);
        return response.data;
    },

    deleteExpense: async (id: string): Promise<{ success: boolean; message: string }> => {
        const response = await api.delete(`/expense/${id}`);
        return response.data;
    },

    // Category API
    getCategories: async (): Promise<{ success: boolean; data: ExpenseCategory[] }> => {
        const response = await api.get("/expense/categories");
        return response.data;
    },

    createCategory: async (data: { name: string; icon?: string; emoji?: string; color?: string }): Promise<{ success: boolean; data: ExpenseCategory }> => {
        const response = await api.post("/expense/categories", data);
        return response.data;
    },

    deleteCategory: async (id: string): Promise<{ success: boolean; message: string }> => {
        const response = await api.delete(`/expense/categories/${id}`);
        return response.data;
    },
};
