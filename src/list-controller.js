import ToDoList from "./to-do-list";
import controlProjects from "./project-controller";
import reAttachEventListeners from "./reattach-event-listeners";

const listController = (function () {
  // Display new list title input field when a project is hovered over
  function displayNewListInput() {
    const projectContainer = document.querySelectorAll(".project-container");

    projectContainer.forEach((projectContainer) => {
      const newListTitleInput =
        projectContainer.querySelector(".new-list-title");

      projectContainer.addEventListener("mouseover", () => {
        newListTitleInput.style.display = "block";
      });
      projectContainer.addEventListener("mouseout", () => {
        if (!newListTitleInput.value) {
          newListTitleInput.style.display = "none";
          newListTitleInput.nextElementSibling.style.display = "none";
          newListTitleInput.nextElementSibling.nextElementSibling.style.display =
            "none";
        }
      });
    });
  }

  // Display new list description input field upon receiving new list title input
  function displayNewListDescriptionInput() {
    const newListInputFields = document.querySelectorAll(".new-list-title");

    newListInputFields.forEach((newListInputField) => {
      newListInputField.addEventListener("input", () => {
        newListInputField.nextElementSibling.style.display = "block";
      });
    });
  }

  // Display add list button after receiving list title and description input
  function displayAddNewListButton() {
    const newListDescriptionFields = document.querySelectorAll(
      ".new-list-description"
    );

    newListDescriptionFields.forEach((newListDescriptionField) => {
      newListDescriptionField.addEventListener("input", () => {
        newListDescriptionField.nextElementSibling.style.display = "block";
      });
    });
  }

  // Listen for new list input and call createList()
  function initializeListCreation() {
    const addNewListButtons = document.querySelectorAll(".add-list");

    // Enable adding lists by pressing Enter
    const newListInputFields = document.querySelectorAll(".new-list-title");
    newListInputFields.forEach((newListInputField) => {
      newListInputField.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          createList(newListInputField.nextElementSibling.nextElementSibling);
        }
      });
    });

    const newListDescriptionFields = document.querySelectorAll(
      ".new-list-description"
    );
    newListDescriptionFields.forEach((newListDescriptionField) => {
      newListDescriptionField.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          createList(newListDescriptionField.nextElementSibling);
        }
      });
    });

    addNewListButtons.forEach((button) => {
      button.addEventListener("click", () => createList(button));
    });
  }

  function createList(button) {
    const listTitle =
      button.previousElementSibling.previousElementSibling.value.trim();
    const listDescription = button.previousElementSibling.value.trim();
    const projectId = button.parentElement.dataset.id;

    /**
     * Make sure both title and description are present,
     * then find the project to which a list is to be added.
     */
    if (listTitle && listDescription) {
      const thisProject = controlProjects.projects.find((project) => {
        return project.id === projectId;
      });

      // No duplicate list names
      const lists = thisProject.toDoLists;
      const listExists = lists.find((list) => {
        return list.title === listTitle;
      });

      if (listExists) return;

      // Create the list
      const toDoList = new ToDoList(
        listTitle,
        listDescription,
        undefined,
        projectId
      );

      thisProject.addToDoList(toDoList);
      controlProjects.displayProjects();

      // Re-attach event listeners after creating a list
      reAttachEventListeners();
    }
  }

  // When a list is hovered over, display a button that enables deleting the list
  function displayDeleteListButton() {
    const lists = document.querySelectorAll(".list");

    lists.forEach((list) => {
      list.addEventListener("mouseover", () => {
        list.querySelector(".delete-list").style.display = "block";
      });
      list.addEventListener("mouseout", () => {
        list.querySelector(".delete-list").style.display = "none";
      });
    });
  }

  function deleteList(projectId, listId) {
    const project = controlProjects.projects.find(
      (project) => project.id === projectId
    );
    const list = project.toDoLists.find((toDoList) => toDoList.id === listId);

    project.removeToDoList(list);

    // Re-display the projects after deleting a list
    controlProjects.displayProjects();

    reAttachEventListeners();
  }

  return {
    displayNewListInput,
    displayNewListDescriptionInput,
    displayAddNewListButton,
    initializeListCreation,
    displayDeleteListButton,
    deleteList
  };
})();

export default listController;
