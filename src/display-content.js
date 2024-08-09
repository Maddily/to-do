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

  return {};
})();

export default displayContent;
