document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".attractions__tab");
  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => {
        const isActive = t === tab;
        t.classList.toggle("attractions__tab--active", isActive);
        t.setAttribute("aria-selected", String(isActive));
        const panel = document.getElementById(t.getAttribute("aria-controls"));
        if (panel) panel.hidden = !isActive;
      });
    });
  });
});
