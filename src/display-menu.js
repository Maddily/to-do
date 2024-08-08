export default function displayMenu() {
  const menuButton = document.querySelector(".menu");
  const aside = document.querySelector("aside");

  menuButton.addEventListener("click", () => {
    aside.classList.toggle("display-menu");
    menuButton.classList.toggle("menu-button-to-right");
  });
}
