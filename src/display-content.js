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

  return {};
})();

export default displayContent;
