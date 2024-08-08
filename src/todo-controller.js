import ToDo from "./to-do";
import controlProjects from "./project-controller";
import reAttachEventListeners from "./reattach-event-listeners";
import { parseISO, isToday, isTomorrow } from "date-fns";

const todoController = (function () {
  // Display new todo input field when a list is hovered over
  function displayNewTodoInput() {
    const todosContainers = document.querySelectorAll(".todos-container");

    todosContainers.forEach((todosContainer) => {
      const newTodoInput = todosContainer.querySelector(".new-todo-name");

      // Show new todo input field when mouse is over the list
      todosContainer.addEventListener("mouseover", () => {
        newTodoInput.style.display = "block";
      });

      // Hide new todo input field when mouse is out of the list
      todosContainer.addEventListener("mouseout", () => {
        if (!newTodoInput.value) {
          newTodoInput.style.display = "none";
          if (newTodoInput.nextElementSibling) {
            newTodoInput.nextElementSibling.style.display = "none";
          }
        }
      });
    });
  }

  // Display add todo button after receiving todo name input
  function displayAddNewTodoButton() {
    const newTodoFields = document.querySelectorAll(".new-todo-name");

    newTodoFields.forEach((newTodoField) => {
      newTodoField.addEventListener("input", () => {
        newTodoField.nextElementSibling.style.display = "block";
      });
    });
  }

  // Listen for new todo input and call createTodo()
  function initializeTodoCreation() {
    const addNewTodoButtons = document.querySelectorAll(".add-todo");
    const newTodoInputFields = document.querySelectorAll(".new-todo-name");

    newTodoInputFields.forEach((newTodoInputField) => {
      newTodoInputField.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          createTodo(newTodoInputField.nextElementSibling);
        }
      });
    });

    addNewTodoButtons.forEach((button) => {
      button.addEventListener("click", () => createTodo(button));
    });
  }

  // Checks if a ToDo already exists
  function isTodoPresent(list, todoName) {
    const todos = list.toDos;
    const todoExists = todos.find((todo) => {
      return todo.name === todoName;
    });

    return todoExists;
  }

  return {};
})();

export default todoController;
