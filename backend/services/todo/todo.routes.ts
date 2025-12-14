import { Router } from "express";
import * as controller from "./todo.controller";

const router = Router();

router.post("/", controller.createTodo);
router.get("/", controller.getTodos);
router.put("/:id", controller.updateTodo);
router.delete("/:id", controller.deleteTodo);
//bulk delete
router.delete("/", controller.deleteAllTodos);

export default router;
