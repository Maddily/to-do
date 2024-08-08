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

  return {
    createProject,
    removeProject
  };
})();

export default controlProjects;
