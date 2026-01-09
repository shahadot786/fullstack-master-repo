import { Router } from "express";
import * as expenseController from "./expense.controller";
import { authenticate } from "@middleware/auth.middleware";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Expense:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         userId:
 *           type: string
 *         amount:
 *           type: number
 *         category:
 *           type: string
 *           enum: [Food, Transport, Shopping, Bills, Entertainment, Health, Education, Other]
 *         description:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *         paymentMethod:
 *           type: string
 *           enum: [Cash, Card, UPI, Bank Transfer]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/expense:
 *   post:
 *     summary: Create a new expense
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - category
 *             properties:
 *               amount:
 *                 type: number
 *               category:
 *                 type: string
 *                 enum: [Food, Transport, Shopping, Bills, Entertainment, Health, Education, Other]
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               paymentMethod:
 *                 type: string
 *                 enum: [Cash, Card, UPI, Bank Transfer]
 *     responses:
 *       201:
 *         description: Expense created successfully
 */
router.post("/", authenticate, expenseController.createExpense as any);

/**
 * @swagger
 * /api/expense:
 *   get:
 *     summary: Get all expenses for the authenticated user
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of expenses
 */
router.get("/", authenticate, expenseController.getExpenses as any);

/**
 * @swagger
 * /api/expense/stats:
 *   get:
 *     summary: Get monthly expense statistics
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Monthly statistics
 */
router.get("/stats", authenticate, expenseController.getMonthlyStats as any);

/**
 * @swagger
 * /api/expense/{id}:
 *   put:
 *     summary: Update an expense
 *     tags: [Expenses]
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
 *               amount:
 *                 type: number
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               paymentMethod:
 *                 type: string
 *     responses:
 *       200:
 *         description: Expense updated successfully
 */
router.put("/:id", authenticate, expenseController.updateExpense as any);

/**
 * @swagger
 * /api/expense/{id}:
 *   delete:
 *     summary: Delete an expense
 *     tags: [Expenses]
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
 *         description: Expense deleted successfully
 */
router.delete("/:id", authenticate, expenseController.deleteExpense as any);

export default router;
