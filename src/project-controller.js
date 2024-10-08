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

  /**
   * Create the elements necessary for updating the name
   * of a project
   *
   * @returns A container for the input field used to rename
   * a project, and a button to submit changes
   */
  function createRenameProjectElements() {
    const renameProjectContainer = document.createElement("div");
    renameProjectContainer.classList.add("rename-project");

    const renameProjectInput = document.createElement("input");
    renameProjectInput.classList.add("rename-project-input");
    renameProjectInput.setAttribute("type", "text");
    renameProjectInput.setAttribute("name", "project");
    renameProjectInput.setAttribute("placeholder", "New Project Name");

    const renameProjectButton = document.createElement("svg");
    renameProjectButton.classList.add("rename-project-button");
    renameProjectButton.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    renameProjectButton.setAttribute("viewBox", "0 0 24 24");
    renameProjectButton.setAttribute("fill", "#717ed4");
    renameProjectButton.innerHTML = `
      <title>Rename Project</title>
      <path d="M18.9,8.1L9,18L4.05,13.05L4.76,12.34L9,16.59L18.19,7.39L18.9,8.1Z" />
    `;

    renameProjectContainer.append(renameProjectInput, renameProjectButton);

    return renameProjectContainer;
  }

  /**
   * Display the heading of a project consisting of a project icon,
   * the name of the project and an icon/button used to delete the project
   *
   * @param {Number} i - The index of a project in the projects array
   * @param {Element} projectContainer - The container of a specific project
   */
  function displayProjectHeading(i, projectContainer) {
    const projectHeading = document.createElement("div");
    projectHeading.classList.add("project-heading");

    const projectIcon = createProjectIcon();
    const projectName = createProjectName(i);
    const deleteProjectIcon = createDeleteProjectIcon(i);

    projectHeading.append(projectIcon, projectName, deleteProjectIcon);

    const renameProjectContainer = createRenameProjectElements();

    projectContainer.appendChild(projectHeading);
    projectContainer.appendChild(renameProjectContainer);
  }

  /**
   * In case the project contains no todo lists, the input
   * fields to add a new list are visible right after the
   * project's heading
   */
  function displayListInputAfterProjectHeading(projectContainer) {
    projectContainer.innerHTML += `
      <input class='new-list-title' type='text' placeholder='New List'>
      <input class='new-list-description' placeholder='New List Description'>
      <button class='add-list'>Add New List</button>
    `;
  }

  // Display input fields for adding a new list below existing lists
  function displayListInput(projectContainer) {
    projectContainer.innerHTML += `
      <input class='new-list-title' type='text' placeholder='New List'>
      <input class='new-list-description' placeholder='New List Description'>
      <button class='add-list'>Add New List</button>
    `;
  }

  function createListIcon() {
    const listIcon = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    listIcon.setAttribute("viewBox", "0 0 24 24");
    listIcon.setAttribute("fill", "#717ed4");

    const listIconTitle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "title"
    );
    listIconTitle.textContent = "List";

    const listIconPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    listIconPath.setAttribute(
      "d",
      "M20,18V19H7V18H20M20,12V13H7V12H20M20,6V7H7V6H20M2,5H5V8H2V5M3,6V7H4V6H3M2,11H5V14H2V11M3,12V13H4V12H3M2,17H5V20H2V17M3,18V19H4V18H3Z"
    );

    listIcon.append(listIconTitle, listIconPath);

    return listIcon;
  }

  /**
   * Create an icon used to delete a list
   *
   * @param {Number} i - The index of a project in the projects array
   * @param {Number} j - The index of a todo in the toDoLists array
   * @returns The icon used to delete a list
   */
  function createDeleteListIcon(i, j) {
    const deleteListIcon = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    deleteListIcon.classList.add("delete-list");
    deleteListIcon.setAttribute(
      "data-id",
      controlProjects.projects[i].toDoLists[j].id
    );
    deleteListIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    deleteListIcon.setAttribute("viewBox", "0 0 24 24");
    deleteListIcon.setAttribute("fill", "#717ed4");

    const deleteListIconTitle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "title"
    );
    deleteListIconTitle.textContent = "Delete List";

    const deleteListIconPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    deleteListIconPath.setAttribute("d", "M5,13V12H18V13H5Z");

    deleteListIcon.append(deleteListIconTitle, deleteListIconPath);

    return deleteListIcon;
  }

  /**
   * Display the todo lists of a project below the project's heading
   *
   * @param {Element} projectContainer - The container of a specific project
   * @param {Number} i - The index of a project in the projects array
   * @param {Number} j - The index of a list in the toDoLists array
   */
  function displayProjectLists(projectContainer, i, j) {
    const listContainer = document.createElement("div");
    listContainer.classList.add("list");
    listContainer.setAttribute(
      "data-id",
      controlProjects.projects[i].toDoLists[j].id
    );

    const listIcon = createListIcon();

    const listTitle = document.createElement("span");
    listTitle.textContent = controlProjects.projects[i].toDoLists[j].title;

    const deleteListIcon = createDeleteListIcon(i, j);

    listContainer.append(listIcon, listTitle, deleteListIcon);

    projectContainer.appendChild(listContainer);
  }

  // Display current projects and their ToDo lists.
  function displayProjects() {
    const projectsContainer = document.querySelector(".projects-container");

    projectsContainer.innerHTML = "";

    for (let i = 0; i < controlProjects.projects.length; i++) {
      const projectContainer = document.createElement("div");

      projectContainer.classList.add("project-container");
      projectContainer.setAttribute("data-id", controlProjects.projects[i].id);

      // Display the project heading.
      displayProjectHeading(i, projectContainer);

      /**
       * For projects with no lists in them,
       * put the input fields right after the project heading.
       */
      if (controlProjects.projects[i].toDoLists.length === 0) {
        displayListInputAfterProjectHeading(projectContainer);
      }

      // Display ToDo lists of a project.
      for (let j = 0; j < controlProjects.projects[i].toDoLists.length; j++) {
        displayProjectLists(projectContainer, i, j);

        // Add new list input fields below the last ToDo list.
        if (j === controlProjects.projects[i].toDoLists.length - 1) {
          displayListInput(projectContainer);
        }
      }

      projectsContainer.appendChild(projectContainer);
    }
  }

  // Create a default project as the starting point. It can be deleted by the user.
  function createDefaultProject() {
    const defaultProject = createProject("My Project");
    const defaultList = new ToDoList(
      "My List",
      "This is my first list.",
      undefined,
      defaultProject.id
    );

    defaultProject.addToDoList(defaultList);
  }

  /**
   * When a project heading/name is clicked, the heading
   * is replaced with an input field for a new name.
   */
  function displayrRenameProjectField() {
    const projectHeadings = document.querySelectorAll(".project-heading");

    projectHeadings.forEach((projectHeading) => {
      projectHeading.addEventListener("click", () => {
        const currentProjectName =
          projectHeading.querySelector(".project-name").textContent;
        const renameProjectInput =
          projectHeading.nextElementSibling.querySelector(
            ".rename-project-input"
          );

        renameProjectInput.value = currentProjectName;
        projectHeading.style.display = "none";
        renameProjectInput.style.display = "block";
        renameProjectInput.nextElementSibling.style.display = "block";
      });
    });
  }

  /**
   * Enable renaming a project when rename project button is clicked
   * or when Enter key is pressed.
   */
  function renameProject() {
    const renameProjectButtons = document.querySelectorAll(
      ".rename-project-button"
    );
    renameProjectButtons.forEach((renameProjectButton) => {
      renameProjectButton.addEventListener("click", () => {
        renameProjectHelper(renameProjectButton);
      });
    });

    const renameProjectInputFields = document.querySelectorAll(
      ".rename-project-input"
    );
    renameProjectInputFields.forEach((renameProjectInputField) => {
      renameProjectInputField.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          renameProjectHelper(renameProjectInputField.nextElementSibling);
        }
      });
    });
  }

  // Renames a project, safely
  function renameProjectHelper(renameProjectButton) {
    const newProjectName =
      renameProjectButton.previousElementSibling.value.trim();
    const projectHeading =
      renameProjectButton.parentElement.previousElementSibling;
    const projectId = projectHeading.parentElement.dataset.id;

    // No duplicate project names
    const projectExists = controlProjects.projects.some((project) => {
      return project.name === newProjectName;
    });

    const currentProjectName = controlProjects.projects.find(
      (project) => project.id === projectId
    ).name;
    if (!projectExists || currentProjectName === newProjectName) {
      projectHeading.querySelector(".project-name").textContent =
        newProjectName;

      // Hide the input field and button and redisplay the project heading
      projectHeading.style.display = "flex";
      renameProjectButton.previousElementSibling.style.display = "none";
      renameProjectButton.style.display = "none";

      // Update the name of the project in projects array
      controlProjects.projects.find(
        (project) => project.id === projectId
      ).name = newProjectName;
    }
  }

  return {
    projects,
    createProject,
    removeProject,
    initializeProjectCreation,
    initializeProjectDeletion,
    displayDeleteProjectButton,
    displayProjects,
    createDefaultProject,
    displayrRenameProjectField,
    renameProject
  };
})();

export default controlProjects;
