import controlProjects from "./project-controller";
import todoController from "./todo-controller";
import listController from "./list-controller";

const displayContent = (function () {
  // Display the details of a list when a list is selected
  function initializeListDisplay() {
    const lists = document.querySelectorAll(".list");

    lists.forEach((list) =>
      list.addEventListener("click", () => {
        const listId = list.dataset.id;
        const projectId = list.parentElement.dataset.id;
        const project = controlProjects.projects.find((project) => {
          return project.id === projectId;
        });

        const thisList = project._toDoLists.find((list) => {
          return list.id === listId;
        });

        if (thisList) {
          createListContent(
            thisList.title,
            thisList.description,
            thisList._toDos,
            listId,
            projectId
          );
        }
      })
    );
  }

  function createListContainer(contentContainer, projectId) {
    const listContainer = document.createElement("div");

    clearListDisplay();
    listContainer.innerHTML = "";
    listContainer.classList.add("list-container");
    listContainer.setAttribute("data-project", projectId);
    contentContainer.appendChild(listContainer);

    return listContainer;
  }

  function createListTitleContainer(title, listId) {
    const listTitleContainer = document.createElement("div");
    listTitleContainer.classList.add("list-title-container");

    const listTitle = document.createElement("input");
    listTitle.classList.add("list-title");
    listTitle.setAttribute("data-id", listId);
    listTitle.value = title;

    listTitleContainer.appendChild(listTitle);

    return listTitleContainer;
  }

  function createListDescriptionContainer(description, listId) {
    const listDescriptionContainer = document.createElement("div");
    listDescriptionContainer.classList.add("list-description-container");

    const listDescription = document.createElement("textarea");
    listDescription.classList.add("list-description");
    listDescription.setAttribute("data-id", listId);
    listDescription.value = description;

    listDescriptionContainer.appendChild(listDescription);

    return listDescriptionContainer;
  }

  function createToDosContainer(listId) {
    const toDosContainer = document.createElement("div");
    toDosContainer.classList.add("todos-container");
    toDosContainer.setAttribute("data-id", listId);

    return toDosContainer;
  }

  function createToDoCheckbox(todo, projectId, listId) {
    const todoCheckbox = document.createElement("input");

    todoCheckbox.type = "checkbox";
    todoCheckbox.classList.add("check-todo");
    todoCheckbox.setAttribute("data-id", todo.id);
    todoCheckbox.setAttribute("data-project", projectId);
    todoCheckbox.setAttribute("data-list", listId);

    return todoCheckbox;
  }

  function createToDoContainer(todo, projectId, listId) {
    const todoContainer = document.createElement("div");

    todoContainer.classList.add("todo-container");
    todoContainer.setAttribute("data-id", todo.id);
    todoContainer.setAttribute("data-project", projectId);
    todoContainer.setAttribute("data-list", listId);

    return todoContainer;
  }

  function createToDoNameContainer(todo) {
    const todoNameContainer = document.createElement("div");
    todoNameContainer.classList.add("todo-name-container");

    const todoName = document.createElement("input");
    todoName.classList.add("todo-name");
    todoName.type = "text";
    todoName.value = todo.name;
    todoNameContainer.appendChild(todoName);

    return todoNameContainer;
  }

  function createExpandIcon() {
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

  function createNewToDoInput() {
    const newTodoNameInput = document.createElement("input");

    newTodoNameInput.classList.add("new-todo-name");
    newTodoNameInput.type = "text";
    newTodoNameInput.placeholder = "New ToDo";

    return newTodoNameInput;
  }

  function createAddToDoButton() {
    const addTodoButton = document.createElement("button");

    addTodoButton.classList.add("add-todo");
    addTodoButton.textContent = "Add ToDo";

    return addTodoButton;
  }

  function replaceDisplayedList(contentContainer, listContainer) {
    if (contentContainer.children.length > 0) {
      const existingListContainer = document.querySelector(".list-container");
      contentContainer.replaceChild(listContainer, existingListContainer);
    } else {
      contentContainer.appendChild(listContainer);
    }
  }

  function attachEventListeners() {
    // Enable displaying new todo input
    todoController.displayNewTodoInput();
    // Enable displaying new todo button
    todoController.displayAddNewTodoButton();
    // Enable creating new todos
    todoController.initializeTodoCreation();
    // Enable completing todos
    todoController.completeTodo();
    // Enable displaying todo details
    todoController.initializeDisplayingTodoDetails();
    // Enable renaming a list
    listController.updateListTitle();
    // Enable updating a list's description
    listController.updateListDescription();
    // Enable updating a todo's name
    todoController.initializeUpdatingName();
  }

  function createListContent(title, description, todos, listId, projectId) {
    const contentContainer = document.querySelector(".content");
    const listContainer = createListContainer(contentContainer, projectId);

    const listTitleContainer = createListTitleContainer(title, listId);

    const listDescriptionContainer = createListDescriptionContainer(
      description,
      listId
    );

    const toDosContainer = createToDosContainer(listId);

    listContainer.append(
      listTitleContainer,
      listDescriptionContainer,
      toDosContainer
    );

    for (const todo of todos) {
      const todoItem = document.createElement("div");
      todoItem.classList.add("todo-item");

      const todoCheckbox = createToDoCheckbox(todo, projectId, listId);

      const todoContainer = createToDoContainer(todo, projectId, listId);

      const todoNameContainer = createToDoNameContainer(todo);

      todoContainer.appendChild(todoNameContainer);

      const expandIcon = createExpandIcon();

      todoItem.append(todoCheckbox, todoContainer, expandIcon);

      toDosContainer.appendChild(todoItem);
    }

    const newTodoNameInput = createNewToDoInput();

    const addTodoButton = createAddToDoButton();

    toDosContainer.append(newTodoNameInput, addTodoButton);

    /**
     * If a list is already being displayed, replace it
     * with the list requested.
     */
    replaceDisplayedList(contentContainer, listContainer);

    attachEventListeners();
  }

  function enableSelectingAProject() {
    const selectAProject = document.querySelector(".select-project-button");
    selectAProject.addEventListener("click", () => {
      const menuButton = document.querySelector(".menu");
      const aside = document.querySelector("aside");

      aside.classList.toggle("display-menu");
      menuButton.classList.toggle("menu-button-to-right");
    });
  }

  return {};
})();

export default displayContent;
