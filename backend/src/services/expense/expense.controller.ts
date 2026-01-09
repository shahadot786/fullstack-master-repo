import { Response, NextFunction } from "express";
import { AuthRequest } from "@middleware/auth.middleware";
import * as expenseService from "./expense.service";

/**
 * Create a new expense
 */
export const createExpense = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        const { amount, category, description, date, paymentMethod } = req.body;

        const expense = await expenseService.createExpense(userId!, {
            amount,
            category,
            description,
            date,
            paymentMethod,
        });

        res.status(201).json({
            success: true,
            message: "Expense created successfully",
            data: expense,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get all expenses for the authenticated user
 */
export const getExpenses = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        const { page, limit, category, startDate, endDate, sortBy, sortOrder } = req.query;

        const { expenses, total } = await expenseService.getExpenses(userId!, {
            page: page ? parseInt(page as string) : undefined,
            limit: limit ? parseInt(limit as string) : undefined,
            category: category as string,
            startDate: startDate as string,
            endDate: endDate as string,
            sortBy: sortBy as string,
            sortOrder: sortOrder as "asc" | "desc",
        });

        res.json({
            success: true,
            data: expenses,
            pagination: {
                page: page ? parseInt(page as string) : 1,
                limit: limit ? parseInt(limit as string) : 20,
                total,
                totalPages: Math.ceil(total / (limit ? parseInt(limit as string) : 20)),
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get monthly stats
 */
export const getMonthlyStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        const { year, month } = req.query;

        const currentDate = new Date();
        const statsYear = year ? parseInt(year as string) : currentDate.getFullYear();
        const statsMonth = month ? parseInt(month as string) : currentDate.getMonth() + 1;

        const stats = await expenseService.getMonthlyStats(userId!, statsYear, statsMonth);

        res.json({
            success: true,
            data: stats,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update an expense
 */
export const updateExpense = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        const { amount, category, description, date, paymentMethod } = req.body;

        const expense = await expenseService.updateExpense(userId!, id, {
            amount,
            category,
            description,
            date,
            paymentMethod,
        });

        res.json({
            success: true,
            message: "Expense updated successfully",
            data: expense,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete an expense
 */
export const deleteExpense = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;

        await expenseService.deleteExpense(userId!, id);

        res.json({
            success: true,
            message: "Expense deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};
