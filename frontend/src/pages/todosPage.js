const fetchTodos = (tbody) => {
  fetch("http://localhost:4000/todos", {
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      tbody.innerHTML = ""; // Limpiar la tabla antes de agregar nuevas filas
      data.todos.forEach((todo) => {
        const tr = document.createElement("tr");

        const td1 = document.createElement("td");
        td1.classList.add("border", "px-4", "py-2");
        td1.textContent = todo.id;

        const td2 = document.createElement("td");
        td2.classList.add("border", "px-4", "py-2");
        td2.textContent = todo.title;

        const td3 = document.createElement("td");
        td3.classList.add("border", "px-4", "py-2");
        td3.textContent = todo.completed ? "Sí" : "No";

        const td4 = document.createElement("td");
        td4.classList.add("border", "px-4", "py-2");
        td4.textContent = todo.owner;

        const td5 = document.createElement("td");
        td5.classList.add("border", "px-4", "py-2");

        const updateBtn = document.createElement("button");
        updateBtn.classList.add("bg-blue-600", "text-white", "px-4", "py-2", "rounded-lg", "hover:bg-blue-700", "mr-2", "transition", "duration-300", "ease-in-out");
        updateBtn.textContent = "Actualizar";
        updateBtn.addEventListener("click", () => {
          showModal(todo, tbody);
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("bg-red-600", "text-white", "px-4", "py-2", "rounded-lg", "hover:bg-red-700", "transition", "duration-300", "ease-in-out");
        deleteBtn.textContent = "Borrar";
        deleteBtn.addEventListener("click", () => {
          fetch(`http://localhost:4000/todos/${todo.id}`, {
            method: "DELETE",
            credentials: "include",
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.json();
            })
            .then((data) => {
              console.log("Tarea eliminada:", data);
              alert("Tarea eliminada exitosamente");
              fetchTodos(tbody); // Volver a obtener la lista de tareas
            })
            .catch((error) => {
              console.error("Error al eliminar tarea:", error);
              alert("Error al eliminar tarea: " + error.message);
            });
        });

        td5.appendChild(updateBtn);
        td5.appendChild(deleteBtn);

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tbody.appendChild(tr);
      });
    })
    .catch((error) => {
      console.error("Error al obtener tareas:", error);
      alert("Error al obtener tareas: " + error.message);
    });
};

const showModal = (todo, tbody) => {
  const modal = document.createElement("div");
  modal.classList.add("fixed", "top-0", "left-0", "w-full", "h-full", "bg-black", "bg-opacity-50", "flex", "justify-center", "items-center");

  const modalContent = document.createElement("div");
  modalContent.classList.add("bg-white", "p-6", "rounded-lg", "shadow-lg");

  const modalTitle = document.createElement("h2");
  modalTitle.classList.add("text-2xl", "font-bold", "mb-4");
  modalTitle.textContent = todo.id ? `Editando Tarea ${todo.id}` : "Agregar Nueva Tarea";
  modalContent.appendChild(modalTitle);

  const inputTitle = document.createElement("input");
  inputTitle.value = todo.title;
  inputTitle.classList.add("border", "p-2", "w-full", "mb-4", "rounded-lg");
  modalContent.appendChild(inputTitle);

  const completedCheckbox = document.createElement("input");
  completedCheckbox.type = "checkbox";
  completedCheckbox.checked = todo.completed;
  modalContent.appendChild(completedCheckbox);
  modalContent.appendChild(document.createTextNode(" Completada"));

  const confirmButton = document.createElement("button");
  confirmButton.textContent = todo.id ? "Actualizar" : "Agregar";
  confirmButton.classList.add("bg-green-600", "text-white", "px-4", "py-2", "rounded-lg", "mr-2", "hover:bg-green-700", "transition", "duration-300", "ease-in-out");
  confirmButton.addEventListener("click", () => {
    if (todo.id) {
      // Actualizar tarea existente
      const updatedTodo = {
        title: inputTitle.value,
        completed: completedCheckbox.checked,
      };

      fetch(`http://localhost:4000/todos/${todo.id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTodo),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Tarea actualizada:", data);
          alert("Tarea actualizada exitosamente");
          modal.remove();
          fetchTodos(tbody); // Volver a obtener la lista de tareas
        })
        .catch((error) => {
          console.error("Error al actualizar tarea:", error);
          alert("Error al actualizar tarea: " + error.message);
        });
    } else {
      const newTodo = {
        title: inputTitle.value,
        completed: completedCheckbox.checked,
      };

      fetch("http://localhost:4000/todos", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodo),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Tarea agregada:", data);
          alert("Tarea creada exitosamente");
          modal.remove();
          fetchTodos(tbody); // Volver a obtener la lista de tareas
        })
        .catch((error) => {
          console.error("Error al agregar tarea:", error);
          alert("Error al agregar tarea: " + error.message);
        });
    }
  });
  modalContent.appendChild(confirmButton);

  const cancelButton = document.createElement("button");
  cancelButton.textContent = "Cancelar";
  cancelButton.classList.add("bg-red-600", "text-white", "px-4", "py-2", "rounded-lg", "hover:bg-red-700", "transition", "duration-300", "ease-in-out");
  cancelButton.addEventListener("click", () => {
    modal.remove();
  });
  modalContent.appendChild(cancelButton);

  modal.appendChild(modalContent);
  document.body.appendChild(modal);
};

export const todosPage = () => {
  const container = document.createElement("div");
  container.classList.add("flex", "flex-col", "items-center", "justify-center", "min-h-screen", "bg-gray-100", "p-4");

  const btnHome = document.createElement("button");
  btnHome.classList.add("bg-blue-600", "text-white", "px-4", "py-2", "rounded-lg", "hover:bg-blue-700", "mb-4", "transition", "duration-300", "ease-in-out");
  btnHome.textContent = "Home";
  btnHome.addEventListener("click", () => {
    window.location.pathname = "/home";
  });

  const title = document.createElement("h1");
  title.classList.add("text-4xl", "font-bold", "mb-4");
  title.textContent = "List of Todos";

  const table = document.createElement("table");
  table.classList.add("w-full", "bg-white", "shadow-lg", "rounded-lg", "overflow-hidden");

  const thead = document.createElement("thead");
  thead.classList.add("bg-gray-200");
  const tr = document.createElement("tr");
  const th1 = document.createElement("th");
  th1.classList.add("border", "px-4", "py-2", "text-left");
  th1.textContent = "ID";

  const th2 = document.createElement("th");
  th2.classList.add("border", "px-4", "py-2", "text-left");
  th2.textContent = "Title";

  const th3 = document.createElement("th");
  th3.classList.add("border", "px-4", "py-2", "text-left");
  th3.textContent = "Completed";

  const th4 = document.createElement("th");
  th4.classList.add("border", "px-4", "py-2", "text-left");
  th4.textContent = "Owner Id";

  const th5 = document.createElement("th");
  th5.classList.add("border", "px-4", "py-2", "text-left");
  th5.textContent = "Acciones";

  tr.appendChild(th1);
  tr.appendChild(th2);
  tr.appendChild(th3);
  tr.appendChild(th4);
  tr.appendChild(th5);
  thead.appendChild(tr);

  const tbody = document.createElement("tbody");
  tbody.classList.add("text-center");
  table.appendChild(thead);
  table.appendChild(tbody);

  container.appendChild(btnHome);

  fetchTodos(tbody);


  const addButton = document.createElement("button");
  addButton.classList.add("bg-green-600", "text-white", "px-4", "py-2", "rounded-lg", "mt-4", "hover:bg-green-700", "transition", "duration-300", "ease-in-out");
  addButton.textContent = "Agregar Tarea";
  addButton.addEventListener("click", () => {
    showModal({ title: "", completed: false }, tbody);
  });
  container.appendChild(addButton);

  container.appendChild(title);
  container.appendChild(table);

  return container;
};