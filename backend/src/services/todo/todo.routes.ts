import { Router } from "express";
import * as controller from "./todo.controller";
import { authenticate } from "@middleware/auth.middleware";
import { validate } from "@middleware/validation.middleware";
import {
    createTodoValidation,
    updateTodoValidation,
    getTodoValidation,
    queryTodosValidation,
} from "./todo.validation";

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/todos:
 *   post:
 *     summary: Create a new todo
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Todo created successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/", validate(createTodoValidation), controller.createTodo);

/**
 * @swagger
 * /api/todos/export:
 *   get:
 *     summary: Export todos as CSV
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: completed
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: CSV file downloaded successfully
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 */
router.get("/export", validate(queryTodosValidation), controller.exportTodos);

/**
 * @swagger
 * /api/todos:
 *   get:
 *     summary: Get all todos for authenticated user
 *     tags: [Todos]
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
 *         name: completed
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *     responses:
 *       200:
 *         description: Todos retrieved successfully
 */
router.get("/", validate(queryTodosValidation), controller.getTodos);

/**
 * @swagger
 * /api/todos/{id}:
 *   get:
 *     summary: Get a todo by ID
 *     tags: [Todos]
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
 *         description: Todo retrieved successfully
 *       404:
 *         description: Todo not found
 */
router.get("/:id", validate(getTodoValidation), controller.getTodoById);

/**
 * @swagger
 * /api/todos/{id}:
 *   put:
 *     summary: Update a todo
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               completed:
 *                 type: boolean
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Todo updated successfully
 *       404:
 *         description: Todo not found
 */
router.put("/:id", validate(updateTodoValidation), controller.updateTodo);

/**
 * @swagger
 * /api/todos/{id}:
 *   delete:
 *     summary: Delete a todo
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Todo deleted successfully
 *       404:
 *         description: Todo not found
 */
router.delete("/:id", validate(getTodoValidation), controller.deleteTodo);

/**
 * @swagger
 * /api/todos:
 *   delete:
 *     summary: Delete all todos for authenticated user
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All todos deleted successfully
 */
router.delete("/", controller.deleteAllTodos);

export default router;
