document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".header");
  if (!header) return;

  const SCROLL_THRESHOLD = 12;

  function syncHeaderState() {
    header.classList.toggle("header--scrolled", window.scrollY > SCROLL_THRESHOLD);
  }

  window.addEventListener("scroll", syncHeaderState, { passive: true });
  syncHeaderState();
});
