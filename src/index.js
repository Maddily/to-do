import "./styles/style.css";
import "./styles/normalize.css";
import displayLogo from "./display-logo";
import listController from "./list-controller";
import controlProjects from "./project-controller";
import displayMenu from "./display-menu";
import displayContent from "./display-content";
import controlStorage from "./storage";

document.addEventListener("DOMContentLoaded", () => {
  // Reload data from storage
  controlProjects.projects = controlStorage.getData();

  // Display logo
  displayLogo();

  // Create a default project, if one hasn't already been created
  const hasDefaultProject = localStorage.getItem("hasDefaultProject");
  if (!hasDefaultProject || hasDefaultProject === false) {
    controlProjects.createDefaultProject();
    localStorage.setItem("hasDefaultProject", true);
  }

  // Display projects
  controlProjects.displayProjects();

  // Display new list input field
  listController.displayNewListInput();

  // Display new list description field
  listController.displayNewListDescriptionInput();

  // Display add new list button
  listController.displayAddNewListButton();

  //Enable Creating a new list
  listController.initializeListCreation();

  // Display delete project button on hover over a project
  controlProjects.displayDeleteProjectButton();

  // Enable creating a new project
  controlProjects.initializeProjectCreation();

  // Enable deleting a project
  controlProjects.initializeProjectDeletion();

  // Enable renaming a project
  controlProjects.displayrRenameProjectField();
  controlProjects.renameProject();

  // Enable list deletion
  listController.displayDeleteListButton();
  listController.initializeListDeletion();

  // Enable displaying the menu (sidebar) on smaller screens
  displayMenu();

  // Enable displaying the menu when 'Select a project' is clicked
  displayContent.enableSelectingAProject();

  // Enable displaying list content
  displayContent.initializeListDisplay();
});
