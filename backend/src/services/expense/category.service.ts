import ExpenseCategory, { DEFAULT_CATEGORIES, IExpenseCategory } from "./category.model";
import mongoose from "mongoose";

class ExpenseCategoryService {
    /**
     * Ensure default categories exist (called on app startup or first request)
     */
    async ensureDefaultCategories(): Promise<void> {
        const existingDefaults = await ExpenseCategory.countDocuments({ isDefault: true });
        
        if (existingDefaults === 0) {
            await ExpenseCategory.insertMany(
                DEFAULT_CATEGORIES.map(cat => ({
                    ...cat,
                    userId: null,
                }))
            );
        }
    }

    /**
     * Get all categories for a user (defaults + user's custom ones)
     */
    async getCategories(userId: string): Promise<IExpenseCategory[]> {
        await this.ensureDefaultCategories();
        
        return ExpenseCategory.find({
            $or: [
                { isDefault: true },
                { userId: new mongoose.Types.ObjectId(userId) }
            ]
        }).sort({ isDefault: -1, name: 1 });
    }

    /**
     * Get only default categories
     */
    async getDefaultCategories(): Promise<IExpenseCategory[]> {
        await this.ensureDefaultCategories();
        return ExpenseCategory.find({ isDefault: true }).sort({ name: 1 });
    }

    /**
     * Get user's custom categories only
     */
    async getUserCategories(userId: string): Promise<IExpenseCategory[]> {
        return ExpenseCategory.find({ 
            userId: new mongoose.Types.ObjectId(userId),
            isDefault: false 
        }).sort({ name: 1 });
    }

    /**
     * Create a new custom category for a user
     */
    async createCategory(
        userId: string,
        data: { name: string; emoji?: string; color?: string }
    ): Promise<IExpenseCategory> {
        // Check for duplicate (case-insensitive)
        const normalizedName = data.name.trim();
        
        // Check if it's a default category name
        const existingDefault = await ExpenseCategory.findOne({
            name: { $regex: new RegExp(`^${normalizedName}$`, 'i') },
            isDefault: true
        });
        
        if (existingDefault) {
            throw new Error(`Category "${normalizedName}" already exists as a default category`);
        }

        // Check if user already has this category
        const existingUserCat = await ExpenseCategory.findOne({
            name: { $regex: new RegExp(`^${normalizedName}$`, 'i') },
            userId: new mongoose.Types.ObjectId(userId)
        });
        
        if (existingUserCat) {
            throw new Error(`You already have a category named "${normalizedName}"`);
        }

        const category = new ExpenseCategory({
            name: normalizedName,
            userId: new mongoose.Types.ObjectId(userId),
            emoji: data.emoji,
            color: data.color,
            isDefault: false,
        });

        return category.save();
    }

    /**
     * Update a user's custom category
     */
    async updateCategory(
        userId: string,
        categoryId: string,
        data: { name?: string; emoji?: string; color?: string }
    ): Promise<IExpenseCategory | null> {
        const category = await ExpenseCategory.findOne({
            _id: categoryId,
            userId: new mongoose.Types.ObjectId(userId),
            isDefault: false
        });

        if (!category) {
            throw new Error("Category not found or cannot be modified");
        }

        if (data.name) {
            const normalizedName = data.name.trim();
            
            // Check for duplicate name
            const duplicate = await ExpenseCategory.findOne({
                _id: { $ne: categoryId },
                name: { $regex: new RegExp(`^${normalizedName}$`, 'i') },
                $or: [
                    { isDefault: true },
                    { userId: new mongoose.Types.ObjectId(userId) }
                ]
            });
            
            if (duplicate) {
                throw new Error(`Category "${normalizedName}" already exists`);
            }
            
            category.name = normalizedName;
        }

        if (data.emoji !== undefined) category.emoji = data.emoji;
        if (data.color !== undefined) category.color = data.color;

        return category.save();
    }

    /**
     * Delete a user's custom category
     */
    async deleteCategory(userId: string, categoryId: string): Promise<boolean> {
        const result = await ExpenseCategory.deleteOne({
            _id: categoryId,
            userId: new mongoose.Types.ObjectId(userId),
            isDefault: false
        });

        return result.deletedCount > 0;
    }

    /**
     * Get or create a category by name for expense creation
     */
    async getOrCreateCategory(
        userId: string,
        categoryName: string
    ): Promise<IExpenseCategory> {
        await this.ensureDefaultCategories();
        const normalizedName = categoryName.trim();

        // Check for existing default category
        const defaultCat = await ExpenseCategory.findOne({
            name: { $regex: new RegExp(`^${normalizedName}$`, 'i') },
            isDefault: true
        });

        if (defaultCat) return defaultCat;

        // Check for existing user category
        const userCat = await ExpenseCategory.findOne({
            name: { $regex: new RegExp(`^${normalizedName}$`, 'i') },
            userId: new mongoose.Types.ObjectId(userId)
        });

        if (userCat) return userCat;

        // Create new user category
        const newCategory = new ExpenseCategory({
            name: normalizedName,
            userId: new mongoose.Types.ObjectId(userId),
            isDefault: false,
        });

        return newCategory.save();
    }
}

export const expenseCategoryService = new ExpenseCategoryService();
