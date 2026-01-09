import { Router } from "express";
import { expenseCategoryController } from "./category.controller";
import { authenticate } from "@middleware/auth.middleware";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     ExpenseCategory:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         userId:
 *           type: string
 *           nullable: true
 *         icon:
 *           type: string
 *         emoji:
 *           type: string
 *         color:
 *           type: string
 *         isDefault:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/expense/categories:
 *   get:
 *     summary: Get all expense categories for user
 *     tags: [Expense Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of categories (defaults + user's custom)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ExpenseCategory'
 */
router.get("/", authenticate, expenseCategoryController.getCategories as any);

/**
 * @swagger
 * /api/expense/categories/defaults:
 *   get:
 *     summary: Get only default categories
 *     tags: [Expense Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of default categories
 */
router.get("/defaults", authenticate, expenseCategoryController.getDefaultCategories as any);

/**
 * @swagger
 * /api/expense/categories:
 *   post:
 *     summary: Create a custom category
 *     tags: [Expense Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               emoji:
 *                 type: string
 *               color:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created
 *       409:
 *         description: Category already exists
 */
router.post("/", authenticate, expenseCategoryController.createCategory as any);

/**
 * @swagger
 * /api/expense/categories/{id}:
 *   put:
 *     summary: Update a custom category
 *     tags: [Expense Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               emoji:
 *                 type: string
 *               color:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated
 *       404:
 *         description: Category not found
 */
router.put("/:id", authenticate, expenseCategoryController.updateCategory as any);

/**
 * @swagger
 * /api/expense/categories/{id}:
 *   delete:
 *     summary: Delete a custom category
 *     tags: [Expense Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted
 *       404:
 *         description: Category not found
 */
router.delete("/:id", authenticate, expenseCategoryController.deleteCategory as any);

export default router;
