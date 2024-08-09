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

  // Display a list's ToDo items
  function displayTodos(todos, projectId, listId) {
    const todosContainer = document.querySelector(".todos-container");
    // Clear the current todos before redisplaying the list's todos
    todosContainer.textContent = "";

    for (const todo of todos) {
      const todoItem = createTodoItem(todo, projectId, listId);
      todosContainer.appendChild(todoItem);
    }

    // An input field for adding a new todo
    const newTodoInput = createNewTodoInput();

    // A button that displays only if there's input in the new todo input field
    const addTodoButton = createAddTodoButton();

    // The new todo input field and button are on the same level as each todo
    todosContainer.append(newTodoInput, addTodoButton);

    // After displaying the todos, enable updating their names
    initializeUpdatingName();
  }

  // When a todo's checkbox is selected, delete todo
  function completeTodo() {
    // The checkboxes (one next to each todo) to complete todos
    const todoChecks = document.querySelectorAll(".check-todo");

    todoChecks.forEach((todoCheck) => {
      todoCheck.addEventListener("click", () => {
        const todoId = todoCheck.dataset.id;
        const listId = todoCheck.dataset.list;
        const projectId = todoCheck.dataset.project;

        const project = controlProjects.projects.find(
          (project) => project.id === projectId
        );
        const list = project.toDoLists.find((list) => list.id == listId);
        const todo = list._toDos.find((todo) => todo.id == todoId);

        // A method on the ToDoList class
        list.removeToDo(todo);

        // Redisplay the todos after completing a todo
        displayTodos(list._toDos, projectId, listId);
        reAttachEventListeners();
      });
    });
  }

  // Listen for clicks on a todo's expand/hide button to expand/hide details
  function initializeDisplayingTodoDetails() {
    const todosContainer = document.querySelector(".todos-container");

    if (todosContainer) {
      todosContainer.addEventListener("click", (event) => {
        if (event.target.classList.contains("chevron")) {
          const chevron = event.target;
          // A displayed todo's name
          const todoHeading = chevron.previousElementSibling
            .querySelector(".todo-name-container")
            .querySelector(".todo-name");

          // If the details are already displayed, hide them
          if (chevron.classList.contains("hide")) {
            hideTodoDetails(todoHeading.parentElement);
          } else {
            // Pass the todo element, the todo id, the list id and the project id
            displayTodoDetails(
              todoHeading.parentElement.parentElement,
              todoHeading.parentElement.parentElement.dataset.id,
              todoHeading.parentElement.parentElement.dataset.list,
              todoHeading.parentElement.parentElement.dataset.project
            );
          }
          // Toggle the chevron icon to indicate the next action on subsequent click
          switchChevron(chevron.parentElement, chevron);
        }
      });
    }
  }

  // Toggle the chevron icon to indicate the next action on subsequent click
  function switchChevron(todoItem, chevron) {
    let className;
    // `className` is a flag that will determine toggling the icon
    if (chevron.classList.contains("expand")) {
      className = "hide";
    } else {
      className = "expand";
    }

    // Replace the current chevron icon with an expand/hide one
    todoItem.removeChild(chevron);
    const svgNamespace = "http://www.w3.org/2000/svg";

    const expandSvg = document.createElementNS(svgNamespace, "svg");
    expandSvg.setAttribute("xmlns", svgNamespace);
    expandSvg.setAttribute("viewBox", "0 0 24 24");
    expandSvg.classList.add("chevron", className);

    const expandTitle = document.createElementNS(svgNamespace, "title");
    expandTitle.textContent =
      className === "expand" ? "Expand Details" : "Hide Details";

    const expandPath = document.createElementNS(svgNamespace, "path");
    expandPath.setAttribute(
      "d",
      className === "expand"
        ? "M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z"
        : "M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"
    );
    expandPath.setAttribute("fill", "#717ed4");

    expandSvg.append(expandTitle, expandPath);

    // The chevron icon is added next to a todo's name
    todoItem.appendChild(expandSvg);
  }

  /**
   * Hides the details of a todo item, assuming that
   * the todo item details are currently visible.
   *
   * @param {Element} todoHeading - Todo name container
   */
  function hideTodoDetails(todoHeading) {
    // Delete all sibling elements of todoHeading, which are a todo's details.
    while (todoHeading.nextElementSibling) {
      todoHeading.parentElement.removeChild(todoHeading.nextElementSibling);
    }
  }

  // Create notes element
  function createNotes(todo) {
    const notes = document.createElement("textarea");
    notes.classList.add("notes");
    notes.setAttribute("placeholder", "Notes");
    notes.value = todo.notes ? todo.notes : "";

    return notes;
  }

  // Create a button that will be used to delete an item in a checklist
  function createDeleteItemButton() {
    const deleteItem = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    deleteItem.setAttribute("viewBox", "0 0 24 24");
    deleteItem.classList.add("delete-item");

    const deleteItemTitle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "title"
    );
    deleteItemTitle.textContent = "Delete Item";

    const deleteItemPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    deleteItemPath.setAttribute("d", "M19,13H5V11H19V13Z");
    deleteItemPath.setAttribute("fill", "#717ed4");

    deleteItem.append(deleteItemTitle, deleteItemPath);

    return deleteItem;
  }

  // Create a checklist in the DOM
  function createChecklist(todo, projectId, listId) {
    const checklist = document.createElement("ul");
    checklist.classList.add("checklist");

    let i = 0;
    for (const item in todo.checklist) {
      const checkItemContainer = document.createElement("li");
      checkItemContainer.classList.add("check-item-container");

      const checkItemLabel = document.createElement("label");
      checkItemLabel.setAttribute("for", `check-item${i}-${todo.id}`);
      checkItemLabel.textContent = item;

      const checkItem = document.createElement("input");
      checkItem.type = "checkbox";
      checkItem.setAttribute("id", `check-item${i}-${todo.id}`);
      checkItem.classList.add("check-item");
      checkItem.setAttribute("data-id", todo.id);
      checkItem.setAttribute("data-project", projectId);
      checkItem.setAttribute("data-list", listId);

      if (todo.checklist[item]) {
        checkItem.checked = true;
      }

      const deleteItem = createDeleteItemButton();

      checkItemContainer.append(checkItem, checkItemLabel, deleteItem);
      checklist.appendChild(checkItemContainer);

      i++;
    }

    return checklist;
  }

  // Display the details of a todo
  function displayTodoDetails(todoContainer, todoId, listId, projectId) {
    const project = controlProjects.projects.find(
      (project) => project.id === projectId
    );
    const list = project.toDoLists.find((list) => list.id == listId);
    const todo = list._toDos.find((todo) => todo.id == todoId);

    todoContainer.innerHTML = "";

    const todoName = createTodoName(todo);
    const todoNameContainer = createTodoNameContainer(todo);
    const notes = createNotes(todo);
    const checklist = createChecklist(todo, projectId, listId);
    const dueDateContainer = createDueDateButton();

    todoContainer.append(todoNameContainer, notes, checklist, dueDateContainer);

    createNewCheckItemInput(checklist);
    displayCheckItemInput(checklist);
    displayAddNewItemButton(checklist);
    initializeItemCreation(checklist, todoId, listId, projectId);
    displayDeleteItemButton(checklist);
    initializeDeletingItem(checklist);
    initializeChecklistSelection(todoContainer);
    initializeUpdatingNameInDetails(todoName, todoId, listId, projectId);
    initializeUpdatingNotes(notes, todoId, listId, projectId);
    setDueDate(todoContainer, todoId, listId, projectId);
    displayDueDate(todoContainer, todoId, listId, projectId);
  }

  // Create a button to add new items to a checklist
  function createAddItemButton() {
    const addItemButton = document.createElement("button");
    addItemButton.classList.add("add-item");
    addItemButton.textContent = "Add Item";

    const addItemButtonContainer = document.createElement("li");
    addItemButtonContainer.classList.add("add-item-button-container");
    addItemButtonContainer.appendChild(addItemButton);

    return addItemButtonContainer;
  }

  // Create an input field for adding new items to a checklist
  function createNewCheckItemInput(checklist) {
    const newCheckItemInput = document.createElement("input");
    newCheckItemInput.classList.add("new-check-item");
    newCheckItemInput.type = "text";
    if (checklist.hasChildNodes()) {
      newCheckItemInput.placeholder = "New Item";
    } else {
      newCheckItemInput.placeholder = "Add item to checklist";
    }

    const newCheckItemInputContainer = document.createElement("li");
    newCheckItemInputContainer.classList.add("new-check-item-input-container");
    newCheckItemInputContainer.appendChild(newCheckItemInput);

    const addItemButtonContainer = createAddItemButton();

    checklist.append(newCheckItemInputContainer, addItemButtonContainer);
  }

  // Display an input field when a checklist is hovered over
  function displayCheckItemInput(checklist) {
    const newCheckItemInputContainer = checklist.querySelector(
      ".new-check-item-input-container"
    );
    const newCheckItemInput = checklist.querySelector(".new-check-item");

    checklist.addEventListener("mouseover", () => {
      newCheckItemInputContainer.style.display = "block";
      newCheckItemInput.style.display = "block";
    });
    checklist.addEventListener("mouseout", () => {
      if (!newCheckItemInput.value) {
        newCheckItemInputContainer.style.display = "none";
        newCheckItemInput.style.display = "none";
        if (newCheckItemInputContainer.nextElementSibling) {
          newCheckItemInputContainer.nextElementSibling.style.display = "none";
        }
      }
    });
  }

  // Display a button to add a new item to a checklist
  function displayAddNewItemButton(checklist) {
    const newItemField = checklist.querySelector(".new-check-item");

    newItemField.addEventListener("input", () => {
      newItemField.parentElement.nextElementSibling.style.display = "block";
      newItemField.parentElement.nextElementSibling.querySelector(
        ".add-item"
      ).style.display = "block";
    });
  }

  /**
   * Add event listeners for Enter key press on input field
   * and for mouse click on the button to add an item to a checklist
   */
  function initializeItemCreation(checklist, todoId, listId, projectId) {
    const addNewTodoButton = checklist.querySelector(".add-item");
    const newItemField = checklist.querySelector(".new-check-item");

    newItemField.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        createItem(newItemField, newItemField.value, todoId, listId, projectId);
      }
    });

    addNewTodoButton.addEventListener("click", () => {
      createItem(newItemField, newItemField.value, todoId, listId, projectId);
    });
  }

  // Add an item to a checklist
  function createItem(newItemField, value, todoId, listId, projectId) {
    const project = controlProjects.projects.find((project) => {
      return project.id === projectId;
    });
    const list = project.toDoLists.find((todoList) => {
      return todoList.id == listId;
    });
    const todo = list.toDos.find((todo) => todo.id == todoId);

    // No duplicate item names
    const itemExists = value in todo.checklist;

    if (itemExists) return;

    // Add the item to the checklist
    todo.addToChecklist(value);

    // Clear the todo input field
    newItemField.value = "";

    // Re-display the checklist
    displayTodoDetails(
      newItemField.parentElement.parentElement.parentElement,
      todoId,
      listId,
      projectId
    );
  }

  // Enable updating the name of a ToDo when its details are expanded
  function initializeUpdatingNameInDetails(
    todoName,
    todoId,
    listId,
    projectId
  ) {
    todoName.addEventListener("input", () => {
      updateName(todoName.value, todoId, listId, projectId);
    });
  }

  // Enable updating the name of a ToDo when its details are hidden
  function initializeUpdatingName() {
    const todoNames = document.querySelectorAll(".todo-name");
    todoNames.forEach((todoName) => {
      todoName.addEventListener("input", () => {
        const todoId = todoName.parentElement.parentElement.dataset.id;
        const listId = todoName.parentElement.parentElement.dataset.list;
        const projectId = todoName.parentElement.parentElement.dataset.project;

        updateName(todoName.value, todoId, listId, projectId);
      });
    });
  }

  // Update a ToDo's name
  function updateName(value, todoId, listId, projectId) {
    const project = controlProjects.projects.find(
      (project) => project.id === projectId
    );
    const list = project.toDoLists.find((list) => list.id == listId);
    const todo = list._toDos.find((todo) => todo.id == todoId);

    todo.name = value;
  }

  // Enable updating a ToDo's notes
  function initializeUpdatingNotes(notes, todoId, listId, projectId) {
    notes.addEventListener("input", () => {
      updateNotes(notes.value, projectId, listId, todoId);
    });
  }

  // Update a ToDo's notes
  function updateNotes(value, projectId, listId, todoId) {
    const project = controlProjects.projects.find(
      (project) => project.id === projectId
    );
    const list = project.toDoLists.find((list) => list.id == listId);
    const todo = list._toDos.find((todo) => todo.id == todoId);

    todo.notes = value;
  }

  // Enable selecting items from a checklist
  function initializeChecklistSelection(todoContainer) {
    todoContainer.addEventListener("click", (event) => {
      if (event.target.classList.contains("check-item")) {
        const checkItem = event.target;
        // Toggle current checked status
        toggleCheckedStatus(checkItem);
      }
    });
  }

  // Toggle a checklist item's checked status
  function toggleCheckedStatus(checkItem) {
    const project = controlProjects.projects.find(
      (project) => project.id === checkItem.dataset.project
    );
    const list = project.toDoLists.find(
      (list) => list.id == checkItem.dataset.list
    );
    const todo = list._toDos.find((todo) => todo.id == checkItem.dataset.id);

    const item =
      checkItem.nodeName.toLowerCase() === "input"
        ? checkItem.nextElementSibling.textContent
        : checkItem.textContent;

    todo.toggleCheckedStatus(item);
  }

  // Display a button to delete an item in a checklist
  function displayDeleteItemButton(checklist) {
    const checkItemContainers = checklist.querySelectorAll(
      ".check-item-container"
    );

    checkItemContainers.forEach((checkItemContainer) => {
      checkItemContainer.addEventListener("mouseover", () => {
        checkItemContainer.querySelector(".delete-item").style.display =
          "block";
      });
      checkItemContainer.addEventListener("mouseout", () => {
        checkItemContainer.querySelector(".delete-item").style.display = "none";
      });
    });
  }

  // Enable deleting an item in a checklist
  function initializeDeletingItem(checklist) {
    const deleteItemButtons = checklist.querySelectorAll(".delete-item");

    deleteItemButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const item = button.previousElementSibling.textContent;
        deleteItem(button, item);
      });
    });
  }

  return {};
})();

export default todoController;
