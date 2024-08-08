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

  return {
    setProject,
    updateProject
  };
})();

export default controlStorage;
