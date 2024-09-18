import { database } from "../db/database.js";

export const getAllTodosCtrl = (req, res) => {

  const userId = req.user.id;


  const todos = database.todos.filter((todo) => todo.owner === userId);

  res.json({ todos });
};

export const createTodoCtrl = (req, res) => {
  console.log("Inicio de createTodoCtrl");

  const id = new Date().getTime()
  console.log("id:", id);

  const userId = req.user.id;
  console.log("userId:", userId);

  const { title, completed } = req.body;
  console.log("Datos recibidos - title:", title, ", completed:", completed);

  if (!title) {
    console.log("Error: El título es requerido");
    return res.status(400).json({ message: "El título es requerido" });
  } else if (typeof title !== "string") {
    console.log("Error: El título debe ser un string");
    return res.status(400).json({ message: "El título debe ser un string" });
  } else if (title.length < 3) {
    console.log("Error: El título debe tener al menos 3 caracteres");
    return res
      .status(400)
      .json({ message: "El título debe tener al menos 3 caracteres" });
  }

  if (completed === undefined) {
    console.log("Error: El estado de la tarea es requerido");
    return res
      .status(400)
      .json({ message: "El estado de la tarea es requerido" });
  } else if (typeof completed !== "boolean") {
    console.log("Error: El estado de la tarea debe ser un booleano");
    return res
      .status(400)
      .json({ message: "El estado de la tarea debe ser un booleano" });
  }

  const newTodo = {
    id: id,
    title,
    completed,
    owner: userId,
  };

  console.log("Nueva tarea creada:", newTodo);

  database.todos.push(newTodo);

  console.log("Tarea agregada a la base de datos. Estado actual de la base de datos:", database.todos);

  res.json({ message: "Tarea creada exitosamente" });

  console.log("Fin de createTodoCtrl");
};

export const updateTodoCtrl = (req, res) => {
  console.log("Inicio de updateTodoCtrl");

  const userId = req.user.id;
  console.log("userId:", userId);

  const { id } = req.params;
  console.log("ID de la tarea a actualizar:", id);

  const { title, completed } = req.body;
  console.log("Datos recibidos - title:", title, ", completed:", completed);

  if (!title) {
    console.log("Error: El título es requerido");
    return res.status(400).json({ message: "El título es requerido" });
  } else if (typeof title !== "string") {
    console.log("Error: El título debe ser un string");
    return res.status(400).json({ message: "El título debe ser un string" });
  } else if (title.length < 3) {
    console.log("Error: El título debe tener al menos 3 caracteres");
    return res
      .status(400)
      .json({ message: "El título debe tener al menos 3 caracteres" });
  }

  if (completed === undefined) {
    console.log("Error: El estado de la tarea es requerido");
    return res
      .status(400)
      .json({ message: "El estado de la tarea es requerido" });
  } else if (typeof completed !== "boolean") {
    console.log("Error: El estado de la tarea debe ser un booleano");
    return res
      .status(400)
      .json({ message: "El estado de la tarea debe ser un booleano" });
  }

  const todoIndex = database.todos.findIndex((todo) => todo.id === Number(id));
  console.log("Índice de la tarea en la base de datos:", todoIndex);

  if (todoIndex === -1) {
    console.log("Error: Tarea no encontrada");
    return res.status(404).json({ message: "Tarea no encontrada" });
  }

  if (database.todos[todoIndex].owner !== userId) {
    console.log("Error: No tienes permisos para modificar esta tarea");
    return res
      .status(403)
      .json({ message: "No tienes permisos para modificar esta tarea" });
  }

  database.todos[todoIndex] = {
    ...database.todos[todoIndex],
    title,
    completed,
  };

  console.log("Tarea actualizada:", database.todos[todoIndex]);

  res.json({ message: "Tarea actualizada exitosamente" });

  console.log("Estado actual de la base de datos:", database.todos);
  console.log("Fin de updateTodoCtrl");
};

export const deleteTodoCtrl = (req, res) => {
  console.log("Inicio de deleteTodoCtrl");

  const userId = req.user.id;
  console.log("userId:", userId);

  const { id } = req.params;
  console.log("ID de la tarea a eliminar:", id);

  const todoIndex = database.todos.findIndex((todo) => todo.id === Number(id));
  console.log("Índice de la tarea en la base de datos:", todoIndex);

  if (todoIndex === -1) {
    console.log("Error: Tarea no encontrada");
    return res.status(404).json({ message: "Tarea no encontrada" });
  }

  if (database.todos[todoIndex].owner !== userId) {
    console.log("Error: No tienes permisos para eliminar esta tarea");
    return res
      .status(403)
      .json({ message: "No tienes permisos para eliminar esta tarea" });
  }

  console.log("Eliminando tarea:", database.todos[todoIndex]);
  database.todos.splice(todoIndex, 1);

  console.log("Tarea eliminada. Estado actual de la base de datos:", database.todos);
  res.json({ message: "Tarea eliminada exitosamente" });

  console.log("Fin de deleteTodoCtrl");
};