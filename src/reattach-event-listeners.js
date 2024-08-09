import controlProjects from "./project-controller";
import listController from "./list-controller";
import todoController from "./todo-controller";
import displayContent from "./display-content";

export default function reAttachEventListeners() {
  controlProjects.displayDeleteProjectButton();
  controlProjects.initializeProjectCreation();
  controlProjects.initializeProjectDeletion();
  controlProjects.displayrRenameProjectField();
  controlProjects.renameProject();
  listController.displayNewListInput();
  listController.displayNewListDescriptionInput();
  listController.displayAddNewListButton();
  listController.initializeListCreation();
  listController.displayDeleteListButton();
  listController.initializeListDeletion();
  todoController.displayNewTodoInput();
  todoController.displayAddNewTodoButton();
  todoController.initializeTodoCreation();
  todoController.completeTodo();
  displayContent.initializeListDisplay();
}
