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

  function setList(list) {
    const parsedLists = parseStoredLists();

    const listExists = parsedLists.some(
      (parsedList) => parsedList._id === list.id
    );
    if (listExists) {
      return;
    }

    const plainList = {
      _title: list.title,
      _description: list.description,
      _id: list.id,
      _projectId: list.projectId,
      _toDos: list.toDos,
    };

    parsedLists.push(plainList);
    localStorage.setItem("lists", JSON.stringify(parsedLists));
  }

  function updateList(list) {
    const parsedLists = parseStoredLists();

    const updatedLists = parsedLists.map((parsedList) => {
      if (parsedList._id === list.id) {
        const updatedList = {
          _title: list.title,
          _description: list.description,
          _id: list.id,
          _projectId: list.projectId,
          _toDos: list.toDos,
        };
        return updatedList;
      }
      return parsedList;
    });

    localStorage.setItem("lists", JSON.stringify(updatedLists));
  }

  function removeList(list) {
    const parsedLists = parseStoredLists();

    const filteredLists = parsedLists.filter((item) => item._id !== list.id);
    localStorage.setItem("lists", JSON.stringify(filteredLists));
  }

  function removeListsOfProject(toDoLists) {
    if (!toDoLists) {
      return;
    }

    const parsedLists = parseStoredLists();

    const filteredLists = parsedLists.filter((item) => {
      return !toDoLists.some((toDoList) => toDoList.id === item._id);
    });
    localStorage.setItem("lists", JSON.stringify(filteredLists));
  }

  function recreateList(plainList) {
    const list = new ToDoList(
      plainList._title,
      plainList._description,
      plainList._id
    );

    Object.assign(list, plainList);

    return list;
  }

  function getLists(toDos) {
    const parsedLists = parseStoredLists();

    const lists = parsedLists.map((parsedList) => {
      const list = recreateList(parsedList);

      list.toDos = toDos.filter((todo) => {
        return todo.listId === list.id;
      });

      return list;
    });

    return lists;
  }

  function parseStoredLists() {
    const storedLists = localStorage.getItem("lists");
    let parsedLists = [];

    if (storedLists) {
      try {
        parsedLists = JSON.parse(storedLists);
      } catch (error) {
        console.error("Failed to parse stored projects:", error);
      }
    }

    return parsedLists;
  }

  return {
    setProject,
    updateProject,
    removeProject,
    setList,
    updateList,
    removeList,
    removeListsOfProject
  };
})();

export default controlStorage;
