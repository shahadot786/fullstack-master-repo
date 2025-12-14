import { Request, Response, NextFunction } from "express";
import * as todoService from "./todo.service";
import Todo, { ITodo } from "./todo.model";

export const createTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {title} = req.body;

    //check the title is not empty
    if(!title){
      return res.status(409).json({success:false,message:"Title is Required!"})
    }

    //check the todo is already exists
    const isTodoExists = await Todo.findOne({title});

    if(isTodoExists){
      return res.status(409).json({success:false,message:"Todo is already exists!"})
    }

    const todo = await todoService.createTodo(req.body);
    res.status(201).json({success:true,message:"Todo created successfully!",todo});
  } catch (error) {
    next(error);
  }
};

export const getTodos = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const todos = await todoService.getTodos();
    res.json(todos);
  } catch (error) {
    next(error);
  }
};

export const updateTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {title} = req.body;

    //check the title is not empty
    if(!title){
      return res.status(409).json({success:false,message:"Title is Required!"})
    }

    //check the todo is already exists
    const isTodoExists = await Todo.findOne({title});

    if(isTodoExists){
      return res.status(409).json({success:false,message:"Todo is already exists!"})
    }
    const todo = await todoService.updateTodo(req.params.id, req.body);
    res.json(todo);
  } catch (error) {
    next(error);
  }
};

export const deleteTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await todoService.deleteTodo(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const deleteAllTodos = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await todoService.deleteAllTodos();

    return res.status(200).json({
      message: "All todos deleted successfully",
      deletedCount: result.deletedCount
    });
  } catch (error) {
    next(error);
  }
};

















