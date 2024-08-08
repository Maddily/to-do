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

  function createProjectIcon() {
    const projectIcon = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );

    projectIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    projectIcon.setAttribute("viewBox", "0 0 24 24");
    projectIcon.setAttribute("fill", "#717ed4");
    projectIcon.innerHTML = `
      <title>Project</title>
      <path d="M5,5H9L12,8H18C19.66,8 21,9.34 21,11V17C21,18.66 19.66,20 18,20H5C3.34,20 2,18.66 2,17V8C2,6.34 3.34,5 5,5M5,6C3.9,6 3,6.9 3,8V17C3,18.1 3.9,19 5,19H18C19.1,19 20,18.1 20,17V11C20,9.9 19.1,9 18,9H11.59L8.59,6H5Z" />
    `;

    return projectIcon;
  }

  /**
   * Create the project name element
   *
   * @param {Number} i - The index of a project in the projects array
   * @returns The projectName element
   */
  function createProjectName(i) {
    const projectName = document.createElement("span");
    projectName.classList.add("project-name");
    projectName.textContent = controlProjects.projects[i].name;

    return projectName;
  }

  /**
   * Create an svg icon to delete a project
   *
   * @param {Number} i - The index of a project in the projects array
   * @returns The icon used to delete a project
   */
  function createDeleteProjectIcon(i) {
    const deleteProjectIcon = document.createElement("svg");

    deleteProjectIcon.classList.add("delete-project");
    deleteProjectIcon.setAttribute("data-id", controlProjects.projects[i].id);
    deleteProjectIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    deleteProjectIcon.setAttribute("viewBox", "0 0 24 24");
    deleteProjectIcon.setAttribute("fill", "#717ed4");
    deleteProjectIcon.innerHTML = `
      <title>Delete Project</title>
      <path d="M5,13V12H18V13H5Z" />
    `;

    return deleteProjectIcon;
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
