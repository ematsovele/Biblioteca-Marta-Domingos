const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

// Menu de navegação para dispositivos móveis
if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));

    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Fechar menu" : "Abrir menu"
    );
  });
}

// Actualizar automaticamente o ano do rodapé
document.querySelectorAll(".current-year").forEach(element => {
  element.textContent = new Date().getFullYear();
});