document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".header");
  if (!header) return;

  const SCROLL_THRESHOLD = 20;

  function updateHeaderState() {
    header.classList.toggle("header--scrolled", window.scrollY > SCROLL_THRESHOLD);
  }

  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });
});
