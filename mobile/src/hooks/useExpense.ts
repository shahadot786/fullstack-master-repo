import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { expenseApi } from '@/api/expense.api';
import { CreateExpenseDto, UpdateExpenseDto, ExpenseQueryParams } from '@/types';

export function useExpenses(params?: ExpenseQueryParams) {
    return useQuery({
        queryKey: ['expenses', params],
        queryFn: () => expenseApi.getExpenses(params),
    });
}

export function useExpenseStats(year?: number, month?: number) {
    return useQuery({
        queryKey: ['expense-stats', year, month],
        queryFn: () => expenseApi.getExpenseStats(year, month),
    });
}

export function useCategories() {
    return useQuery({
        queryKey: ['expense-categories'],
        queryFn: () => expenseApi.getCategories(),
    });
}

export function useCreateCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { name: string; icon?: string; emoji?: string; color?: string }) =>
            expenseApi.createCategory(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expense-categories'] });
        },
    });
}

export function useCreateExpense() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateExpenseDto) => expenseApi.createExpense(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses'] });
            queryClient.invalidateQueries({ queryKey: ['expense-stats'] });
            queryClient.invalidateQueries({ queryKey: ['expense-categories'] });
        },
    });
}

export function useUpdateExpense() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateExpenseDto }) =>
            expenseApi.updateExpense(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses'] });
            queryClient.invalidateQueries({ queryKey: ['expense-stats'] });
        },
    });
}

export function useDeleteExpense() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => expenseApi.deleteExpense(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses'] });
            queryClient.invalidateQueries({ queryKey: ['expense-stats'] });
        },
    });
}

export function useDeleteCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => expenseApi.deleteCategory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expense-categories'] });
        },
    });
}
