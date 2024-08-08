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

  // Display new list description input field upon receiving new list title input
  function displayNewListDescriptionInput() {
    const newListInputFields = document.querySelectorAll(".new-list-title");

    newListInputFields.forEach((newListInputField) => {
      newListInputField.addEventListener("input", () => {
        newListInputField.nextElementSibling.style.display = "block";
      });
    });
  }

  return {
    displayNewListInput,
    displayNewListDescriptionInput
  };
})();

export default listController;
