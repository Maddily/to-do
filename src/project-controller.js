import Project from "./project";
import reAttachEventListeners from "./reattach-event-listeners";
import ToDoList from "./to-do-list";
import ToDo from "./to-do";
import displayContent from "./display-content";
import controlStorage from "./storage";

const controlProjects = (function () {
  let projects = [];

  function createProject(projectName) {
    // Prevent duplicate project names
    const projectExists = controlProjects.projects.some((project) => {
      return project.name === projectName;
    });

    if (projectExists) {
      console.log("already exists");
      return;
    }

    const project = new Project(projectName);
    controlProjects.projects.push(project);

    // Re-display the projects after adding a new project
    displayProjects();

    reAttachEventListeners();

    return project;
  }

  function removeProject(projectId) {
    const project = controlProjects.projects.find(
      (project) => project.id === projectId
    );
    controlProjects.projects = controlProjects.projects.filter(
      (item) => item !== project
    );
    if (project) {
      controlStorage.removeToDosOfLists(project.toDoLists);
      controlStorage.removeListsOfProject(project.toDoLists);
      controlStorage.removeProject(projectId);
    }

    // Re-display the projects after deleting a project
    displayProjects();

    reAttachEventListeners();
  }

  // Listen for new project input and handle project creation
  function initializeProjectCreation() {
    const addButton = document.querySelector(".add-new-project");
    const input = document.querySelector(".new-project-input");

    addButton.addEventListener("click", handleProjectCreation);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        handleProjectCreation();
      }
    });
  }

  // Get new project input and create a project
  function handleProjectCreation() {
    const input = document.querySelector(".new-project-input");
    const newProjectName = input.value.trim();

    if (!newProjectName) {
      return;
    }

    createProject(newProjectName);
    input.value = "";

    reAttachEventListeners();
  }

  // Listen for clicks on delete project buttons and handle deletion
  function initializeProjectDeletion() {
    const deleteProjectButtons = document.querySelectorAll(".delete-project");

    deleteProjectButtons.forEach((button) => {
      button.addEventListener("click", () => {
        removeProject(button.dataset.id);

        reAttachEventListeners();
        clearNonExistingListFromDisplay();
      });
    });
  }

  /**
   * Delete a displayed list if the project to which
   * it belongs no longer exists.
   */
  function clearNonExistingListFromDisplay() {
    const listContainer = document.querySelector(".list-container");
    if (listContainer) {
      const project = controlProjects.projects.find(
        (project) => project.id === listContainer.dataset.project
      );
      if (!project) {
        displayContent.clearListDisplay();
      }
    }
  }

  function displayDeleteProjectButton() {
    const projectHeadings = document.querySelectorAll(".project-heading");

    projectHeadings.forEach((projectHeading) => {
      projectHeading.addEventListener("mouseover", () => {
        projectHeading.querySelector(".delete-project").style.display = "block";
      });
      projectHeading.addEventListener("mouseout", () => {
        projectHeading.querySelector(".delete-project").style.display = "none";
      });
    });
  }

  return {
    createProject,
    removeProject,
    initializeProjectCreation,
    initializeProjectDeletion,
    displayDeleteProjectButton
  };
})();

export default controlProjects;
