import Expense, { IExpense } from "./expense.model";
import { NotFoundError } from "@common/errors";
import mongoose from "mongoose";

/**
 * Create a new expense
 */
export const createExpense = async (
    userId: string,
    data: {
        amount: number;
        category: string;
        description?: string;
        date?: Date;
        paymentMethod?: string;
    }
): Promise<IExpense> => {
    const expense = await Expense.create({
        userId: new mongoose.Types.ObjectId(userId),
        amount: data.amount,
        category: data.category,
        description: data.description,
        date: data.date || new Date(),
        paymentMethod: data.paymentMethod || "Cash",
    });
    return expense;
};

/**
 * Get all expenses for a user with filtering and pagination
 */
export const getExpenses = async (
    userId: string,
    options: {
        page?: number;
        limit?: number;
        category?: string;
        startDate?: string;
        endDate?: string;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
    }
): Promise<{ expenses: IExpense[]; total: number }> => {
    const { page = 1, limit = 20, category, startDate, endDate, sortBy = "date", sortOrder = "desc" } = options;
    const skip = (page - 1) * limit;

    const query: any = { userId: new mongoose.Types.ObjectId(userId) };

    if (category) {
        query.category = category;
    }

    if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate);
        if (endDate) query.date.$lte = new Date(endDate);
    }

    const sort: any = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

    const [expenses, total] = await Promise.all([
        Expense.find(query).sort(sort).skip(skip).limit(limit),
        Expense.countDocuments(query),
    ]);

    return { expenses, total };
};

/**
 * Update an expense
 */
export const updateExpense = async (
    userId: string,
    expenseId: string,
    data: Partial<{
        amount: number;
        category: string;
        description: string;
        date: Date;
        paymentMethod: string;
    }>
): Promise<IExpense> => {
    const expense = await Expense.findOneAndUpdate(
        {
            _id: new mongoose.Types.ObjectId(expenseId),
            userId: new mongoose.Types.ObjectId(userId),
        },
        { $set: data },
        { new: true }
    );

    if (!expense) {
        throw new NotFoundError("Expense not found");
    }

    return expense;
};

/**
 * Delete an expense
 */
export const deleteExpense = async (userId: string, expenseId: string): Promise<void> => {
    const result = await Expense.findOneAndDelete({
        _id: new mongoose.Types.ObjectId(expenseId),
        userId: new mongoose.Types.ObjectId(userId),
    });

    if (!result) {
        throw new NotFoundError("Expense not found");
    }
};

/**
 * Get monthly statistics for a user
 */
export const getMonthlyStats = async (
    userId: string,
    year: number,
    month: number
): Promise<{
    total: number;
    count: number;
    byCategory: { category: string; total: number; count: number }[];
    byPaymentMethod: { method: string; total: number; count: number }[];
}> => {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const [categoryStats, paymentStats, totalStats] = await Promise.all([
        Expense.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    date: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $group: {
                    _id: "$category",
                    total: { $sum: "$amount" },
                    count: { $sum: 1 },
                },
            },
            { $sort: { total: -1 } },
        ]),
        Expense.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    date: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $group: {
                    _id: "$paymentMethod",
                    total: { $sum: "$amount" },
                    count: { $sum: 1 },
                },
            },
        ]),
        Expense.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    date: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" },
                    count: { $sum: 1 },
                },
            },
        ]),
    ]);

    return {
        total: totalStats[0]?.total || 0,
        count: totalStats[0]?.count || 0,
        byCategory: categoryStats.map((s) => ({ category: s._id, total: s.total, count: s.count })),
        byPaymentMethod: paymentStats.map((s) => ({ method: s._id, total: s.total, count: s.count })),
    };
};
