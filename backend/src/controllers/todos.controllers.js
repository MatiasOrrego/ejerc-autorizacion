import { database } from "../db/database.js";

export const getAllTodosCtrl = (req, res) => {

  const userId = req.user.id;


  const todos = database.todos.filter((todo) => todo.owner === userId);

  res.json({ todos });
};

export const createTodoCtrl = (req, res) => {
  const { title, completed } = req.body;

  if (!title) {
    return res.status(400).json({ message: "El título es requerido" });
  } else if ( title === "") {
    return res.status(400).json({ message: "El título no puede ser vacío" });
  } else if (typeof title !== "string") {
    return res.status(400).json({ message: "El título debe ser un texto" });
  }
  
  if (completed === undefined) {
    return res.status(400).json({ message: "El estado de la tarea es requerido" });
  } else if (typeof completed !== "boolean") {
    return res.status(400).json({ message: "El estado de la tarea debe ser un booleano" });
  }

  const newTodo = {
    id: database.todos.length + 1,
    title,
    completed,
    owner: req.user.id,
  };

  database.todos.push(newTodo);

  res.json({ message: "Tarea creada exitosamente" });
}

export const updateTodoCtrl = (req, res) => {
  const id = req.params.id;
  const { title, completed } = req.body;

  if (!title && completed === undefined) {
    return res.status(400).json({ message: "Se requiere al menos un campo a actualizar" });
  } else if (title && title === "") {
    return res.status(400).json({ message: "El título no puede ser vacío" });
  } else if (title && typeof title !== "string") {
    return res.status(400).json({ message: "El título debe ser un texto" });
  } else if (completed !== undefined && typeof completed !== "boolean") {
    return res.status(400).json({ message: "El estado de la tarea debe ser un booleano" });
  }

  const todo = database.todos.find((todo) => todo.id === id);

  if (!todo) {
    return res.status(404).json({ message: "Tarea no encontrada" });
  }

  todo.title = title;
  todo.completed = completed;

  res.json({ message: "Tarea actualizada exitosamente" });
}

export const deleteTodoCtrl = (req, res) => {
  const id = req.params.id;

  const index = database.todos.findIndex((todo) => todo.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Tarea no encontrada" });
  }

  database.todos.splice(index, 1);

  res.json({ message: "Tarea eliminada exitosamente" });
}