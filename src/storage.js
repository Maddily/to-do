import Project from "./project";
import ToDoList from "./to-do-list";
import ToDo from "./to-do";

const controlStorage = (function () {
  function setProject(project) {
    const parsedProjects = parseStoredProjects();

    const projectExists = parsedProjects.some(
      (parsedProject) => parsedProject._id === project.id
    );
    if (projectExists) {
      return;
    }

    const plainProject = {
      _name: project.name,
      _id: project.id,
      _toDoLists: project.toDoLists,
    };

    parsedProjects.push(plainProject);
    localStorage.setItem("projects", JSON.stringify(parsedProjects));
  }

  function updateProject(project) {
    const parsedProjects = parseStoredProjects();

    const updatedProjects = parsedProjects.map((parsedProject) => {
      if (parsedProject._id === project.id) {
        const updatedProject = {
          _name: project.name,
          _id: project.id,
          _toDoLists: project.toDoLists,
        };
        return updatedProject;
      }
      return parsedProject;
    });

    localStorage.setItem("projects", JSON.stringify(updatedProjects));
  }

  function removeProject(projectId) {
    const parsedProjects = parseStoredProjects();

    const filteredProjects = parsedProjects.filter(
      (item) => item._id !== projectId
    );
    localStorage.setItem("projects", JSON.stringify(filteredProjects));
  }

  function recreateProject(plainProject) {
    const project = new Project(plainProject._name, plainProject._id);

    Object.assign(project, plainProject);

    return project;
  }

  function getProjects(lists) {
    const parsedProjects = parseStoredProjects();

    const projects = parsedProjects.map((parsedProject) => {
      const project = recreateProject(parsedProject);

      project.toDoLists = lists.filter((list) => {
        return list.projectId === project.id;
      });

      return project;
    });

    return projects;
  }

  function parseStoredProjects() {
    const storedProjects = localStorage.getItem("projects");
    let parsedProjects = [];

    if (storedProjects) {
      try {
        parsedProjects = JSON.parse(storedProjects);
      } catch (error) {
        console.error("Failed to parse stored projects:", error);
      }
    }

    return parsedProjects;
  }

  return {
    setProject,
    updateProject,
    removeProject
  };
})();

export default controlStorage;
