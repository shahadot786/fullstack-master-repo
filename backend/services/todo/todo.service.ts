import Todo, { ITodo } from "./todo.model";

export const createTodo = (data: Partial<ITodo>) => {
  return Todo.create(data);
};

export const getTodos = () => {
  return Todo.find().sort({ createdAt: -1 });
};

export const updateTodo = (id: string, data: Partial<ITodo>) => {
  return Todo.findByIdAndUpdate(id, data, { new: true });
};

export const deleteTodo = (id: string) => {
  return Todo.findByIdAndDelete(id);
};

export const deleteAllTodos = async ()=>{
  return await Todo.deleteMany({});
}
