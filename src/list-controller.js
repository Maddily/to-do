import ToDoList from "./to-do-list";
import controlProjects from "./project-controller";
import reAttachEventListeners from "./reattach-event-listeners";

const listController = (function () {
  // Display new list title input field when a project is hovered over
  function displayNewListInput() {
    const projectContainer = document.querySelectorAll(".project-container");

    projectContainer.forEach((projectContainer) => {
      const newListTitleInput =
        projectContainer.querySelector(".new-list-title");

      projectContainer.addEventListener("mouseover", () => {
        newListTitleInput.style.display = "block";
      });
      projectContainer.addEventListener("mouseout", () => {
        if (!newListTitleInput.value) {
          newListTitleInput.style.display = "none";
          newListTitleInput.nextElementSibling.style.display = "none";
          newListTitleInput.nextElementSibling.nextElementSibling.style.display =
            "none";
        }
      });
    });
  }

  return {
    displayNewListInput
  };
})();

export default listController;
