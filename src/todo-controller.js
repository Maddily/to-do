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

  /**
   * Create a ToDo
   *
   * @param {Element} button - A button to add a new ToDo
   */
  function createTodo(button) {
    const todoName = button.previousElementSibling.value.trim();
    const listId = button.parentElement.dataset.id;
    const projectId = button.parentElement.parentElement.dataset.project;

    /**
     * Make sure todo name is present,
     * then find the list to which a todo is to be added.
     */
    if (todoName) {
      const project = controlProjects.projects.find((project) => {
        return project.id === projectId;
      });
      const list = project.toDoLists.find((todoList) => {
        return todoList.id == listId;
      });

      // No duplicate todo names
      if (isTodoPresent(list, todoName)) return;

      // Create the todo
      const todo = new ToDo(todoName, undefined, listId);

      list.addToDo(todo);

      // Clear the todo input field
      button.previousElementSibling.value = "";

      // Redisplay the ToDos after creating a new one
      displayTodos(list._toDos, projectId, listId);
      reAttachEventListeners();
    }
  }

  // Create a checkbox for completing a ToDo
  function createTodoCheckbox(todoId, projectId, listId) {
    const checkTodo = document.createElement("input");

    checkTodo.type = "checkbox";
    checkTodo.classList.add("check-todo");
    checkTodo.setAttribute("data-id", todoId);
    checkTodo.setAttribute("data-project", projectId);
    checkTodo.setAttribute("data-list", listId);

    return checkTodo;
  }

  // Create a container for a todo's name, description, checklist and due date
  function createTodoContainer(todoId, projectId, listId) {
    const todoContainer = document.createElement("div");

    todoContainer.classList.add("todo-container");
    todoContainer.setAttribute("data-id", todoId);
    todoContainer.setAttribute("data-project", projectId);
    todoContainer.setAttribute("data-list", listId);

    return todoContainer;
  }

  // Create a ToDo name input field to display and edit a ToDo's name
  function createTodoName(todo) {
    const todoName = document.createElement("input");

    todoName.classList.add("todo-name");
    todoName.type = "text";
    todoName.value = todo.name;

    return todoName;
  }

  // Create a chevron button that toggles showing/hiding a todo's details
  function createChevronButton() {
    const expandIcon = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    expandIcon.setAttribute("viewBox", "0 0 24 24");
    expandIcon.classList.add("chevron", "expand");

    const expandTitle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "title"
    );
    expandTitle.textContent = "Expand Details";

    const expandPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    expandPath.setAttribute(
      "d",
      "M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z"
    );
    expandPath.setAttribute("fill", "#717ed4");

    expandIcon.append(expandTitle, expandPath);

    return expandIcon;
  }

  // Create a container for a ToDo's name/input field
  function createTodoNameContainer(todo) {
    const todoNameContainer = document.createElement("div");
    todoNameContainer.classList.add("todo-name-container");

    // A ToDo name input field to display and edit a ToDo's name
    const todoName = createTodoName(todo);

    todoNameContainer.appendChild(todoName);

    return todoNameContainer;
  }

  /**
   * Create and configure a todo item, its checkbox,
   * container and expand/hide button.
   */
  function createTodoItem(todo, projectId, listId) {
    // The container for a whole todo
    const todoItem = document.createElement("div");
    todoItem.classList.add("todo-item");

    // The checkbox for completing a todo
    const checkTodo = createTodoCheckbox(todo.id, projectId, listId);

    // The container for a todo's name, description, checklist and due date
    const todoContainer = createTodoContainer(todo.id, projectId, listId);

    // The container for a todo's name
    const todoNameContainer = createTodoNameContainer(todo);

    todoContainer.appendChild(todoNameContainer);

    // A chevron button that toggles showing/hiding a todo's details
    const expandIcon = createChevronButton();

    todoItem.append(checkTodo, todoContainer, expandIcon);

    return todoItem;
  }

  // Create an input field for adding a new ToDo
  function createNewTodoInput() {
    const newTodoInput = document.createElement("input");
    newTodoInput.classList.add("new-todo-name");
    newTodoInput.type = "text";
    newTodoInput.placeholder = "New ToDo";

    return newTodoInput;
  }

  // Create a button to add a new ToDo
  function createAddTodoButton() {
    const addTodoButton = document.createElement("button");
    addTodoButton.classList.add("add-todo");
    addTodoButton.textContent = "Add ToDo";

    return addTodoButton;
  }

  return {};
})();

export default todoController;
