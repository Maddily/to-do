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

  return {};
})();

export default displayContent;
