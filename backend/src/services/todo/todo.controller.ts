import { Response } from "express";
import * as todoService from "./todo.service";
import { asyncHandler } from "@common/utils/async-handler.util";
import { sendSuccess, sendPaginated } from "@common/utils/response.util";
import { AuthRequest } from "@middleware/auth.middleware";
import { HTTP_STATUS } from "@fullstack-master/shared";

export const createTodo = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const todo = await todoService.createTodo(userId, req.body);

  sendSuccess(res, todo, "Todo created successfully", HTTP_STATUS.CREATED);
});

export const getTodos = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { todos, total } = await todoService.getTodos(userId, req.query as any);

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  sendPaginated(res, todos, page, limit, total);
});

export const getTodoById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const todo = await todoService.getTodoById(userId, req.params.id);

  sendSuccess(res, todo);
});

export const updateTodo = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const todo = await todoService.updateTodo(userId, req.params.id, req.body);

  sendSuccess(res, todo, "Todo updated successfully");
});

export const deleteTodo = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  await todoService.deleteTodo(userId, req.params.id);

  sendSuccess(res, null, "Todo deleted successfully", HTTP_STATUS.NO_CONTENT);
});

export const deleteAllTodos = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const result = await todoService.deleteAllTodos(userId);

  sendSuccess(res, { deletedCount: result.deletedCount }, "All todos deleted successfully");
});

export const exportTodos = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const csvData = await todoService.exportTodosToCSV(userId, req.query as any);

  // Generate filename with current date
  const date = new Date().toISOString().split('T')[0];
  const filename = `todos-${date}.csv`;

  // Set headers for CSV download
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  
  res.send(csvData);
});


















