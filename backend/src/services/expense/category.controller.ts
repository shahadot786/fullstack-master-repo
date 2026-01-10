import { Response } from "express";
import { AuthRequest } from "@middleware/auth.middleware";
import { expenseCategoryService } from "./category.service";

class ExpenseCategoryController {
    /**
     * Get all categories (defaults + user's custom)
     */
    async getCategories(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ success: false, message: "Unauthorized" });
                return;
            }

            const categories = await expenseCategoryService.getCategories(userId);
            res.json({ success: true, data: categories });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    /**
     * Get only default categories
     */
    async getDefaultCategories(_req: AuthRequest, res: Response): Promise<void> {
        try {
            const categories = await expenseCategoryService.getDefaultCategories();
            res.json({ success: true, data: categories });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    /**
     * Create a new custom category
     */
    async createCategory(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ success: false, message: "Unauthorized" });
                return;
            }

            const { name, emoji, color } = req.body;
            
            if (!name || !name.trim()) {
                res.status(400).json({ success: false, message: "Category name is required" });
                return;
            }

            const category = await expenseCategoryService.createCategory(userId, {
                name,
                emoji,
                color,
            });

            res.status(201).json({ success: true, data: category });
        } catch (error: any) {
            if (error.message.includes("already exists")) {
                res.status(409).json({ success: false, message: error.message });
            } else {
                res.status(500).json({ success: false, message: error.message });
            }
        }
    }

    /**
     * Update a custom category
     */
    async updateCategory(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ success: false, message: "Unauthorized" });
                return;
            }

            const { id } = req.params;
            const { name, emoji, color } = req.body;

            const category = await expenseCategoryService.updateCategory(userId, id, {
                name,
                emoji,
                color,
            });

            if (!category) {
                res.status(404).json({ success: false, message: "Category not found" });
                return;
            }

            res.json({ success: true, data: category });
        } catch (error: any) {
            if (error.message.includes("already exists") || error.message.includes("cannot be modified")) {
                res.status(400).json({ success: false, message: error.message });
            } else {
                res.status(500).json({ success: false, message: error.message });
            }
        }
    }

    /**
     * Delete a custom category
     */
    async deleteCategory(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ success: false, message: "Unauthorized" });
                return;
            }

            const { id } = req.params;
            const deleted = await expenseCategoryService.deleteCategory(userId, id);

            if (!deleted) {
                res.status(404).json({ success: false, message: "Category not found or cannot be deleted" });
                return;
            }

            res.json({ success: true, message: "Category deleted successfully" });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

export const expenseCategoryController = new ExpenseCategoryController();
