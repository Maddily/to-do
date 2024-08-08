import Logo from "./assets/images/logo.png";

export default function displayLogo() {
  const side = document.querySelector("aside");
  const logo = new Image();

  logo.src = Logo;
  logo.classList.add("logo");

  side.prepend(logo);
}
