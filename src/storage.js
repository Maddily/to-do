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

  function setToDo(toDo) {
    const parsedToDos = parseStoredToDos();

    const toDoExists = parsedToDos.some(
      (parsedToDo) => parsedToDo._id === toDo.id
    );
    if (toDoExists) {
      return;
    }

    const plainToDo = {
      _name: toDo.name,
      _id: toDo.id,
      _listId: toDo.listId,
      _notes: toDo.notes,
      _checklist: toDo.checklist,
      _dueDate: toDo.dueDate,
    };

    parsedToDos.push(plainToDo);
    localStorage.setItem("toDos", JSON.stringify(parsedToDos));
  }

  function updateToDo(toDo) {
    const parsedToDos = parseStoredToDos();

    const updatedToDos = parsedToDos.map((parsedToDo) => {
      if (parsedToDo._id === toDo.id) {
        const updatedToDo = {
          _name: toDo.name,
          _id: toDo.id,
          _listId: toDo.listId,
          _notes: toDo.notes,
          _checklist: toDo.checklist,
          _dueDate: toDo.dueDate,
        };
        return updatedToDo;
      }
      return parsedToDo;
    });

    localStorage.setItem("toDos", JSON.stringify(updatedToDos));
  }

  function removeToDo(toDo) {
    const parsedToDos = parseStoredToDos();

    const filteredToDos = parsedToDos.filter((item) => item._id !== toDo.id);
    localStorage.setItem("toDos", JSON.stringify(filteredToDos));
  }

  function removeToDosOfList(toDos) {
    if (!toDos) {
      return;
    }

    const parsedToDos = parseStoredToDos();

    const filteredToDos = parsedToDos.filter((item) => {
      return !toDos.some((toDo) => toDo.id === item._id);
    });
    localStorage.setItem("toDos", JSON.stringify(filteredToDos));
  }

  function removeToDosOfLists(toDoLists) {
    for (const toDoList of toDoLists) {
      removeToDosOfList(toDoList.toDos);
    }
  }

  function parseStoredToDos() {
    const storedToDos = localStorage.getItem("toDos");
    let parsedToDos = [];

    if (storedToDos) {
      try {
        parsedToDos = JSON.parse(storedToDos);
      } catch (error) {
        console.error("Failed to parse stored projects:", error);
      }
    }

    return parsedToDos;
  }

  function recreateToDo(plainToDo) {
    const toDo = new ToDo(plainToDo._name, plainToDo._id, plainToDo._listId);

    Object.assign(toDo, plainToDo);

    return toDo;
  }

  function getToDos() {
    const parsedToDos = parseStoredToDos();

    const toDos = parsedToDos.map((parsedToDo) => {
      const toDo = recreateToDo(parsedToDo);

      return toDo;
    });

    return toDos;
  }

  function getData() {
    const toDos = getToDos();
    const lists = getLists(toDos);
    const projects = getProjects(lists);

    return projects;
  }

  return {
    setProject,
    updateProject,
    removeProject,
    setList,
    updateList,
    removeList,
    removeListsOfProject,
    setToDo,
    updateToDo,
    removeToDo,
    removeToDosOfList,
    removeToDosOfLists,
    getData
  };
})();

export default controlStorage;
