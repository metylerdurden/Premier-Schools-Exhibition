document.addEventListener("DOMContentLoaded", () => {
  initVisitCarousel();
  initCategoriesSlider();
});

function initVisitCarousel() {
  const track = document.getElementById("visitTrack");
  const prevBtn = document.getElementById("visitPrev");
  const nextBtn = document.getElementById("visitNext");
  const statusEl = document.getElementById("visitStatus");
  if (!track || !prevBtn || !nextBtn) return;

  const cards = Array.from(track.children);
  const scrollAmount = 240;
  const AUTOPLAY_MS = 4000;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let autoplayId = null;

  function announceCurrentCard() {
    if (!statusEl) return;
    const trackCenter = track.scrollLeft + track.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Infinity;
    cards.forEach((card, i) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(cardCenter - trackCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i;
      }
    });
    statusEl.textContent = cards[closestIndex].getAttribute("aria-label") || "";
  }

  function scrollNext() {
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    if (atEnd) {
      track.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      track.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
    window.setTimeout(announceCurrentCard, 350);
  }

  function scrollPrev() {
    track.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    window.setTimeout(announceCurrentCard, 350);
  }

  function startAutoplay() {
    if (prefersReducedMotion) return;
    stopAutoplay();
    autoplayId = window.setInterval(scrollNext, AUTOPLAY_MS);
  }

  function stopAutoplay() {
    if (autoplayId) {
      window.clearInterval(autoplayId);
      autoplayId = null;
    }
  }

  prevBtn.addEventListener("click", () => {
    scrollPrev();
    startAutoplay();
  });

  nextBtn.addEventListener("click", () => {
    scrollNext();
    startAutoplay();
  });

  track.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollPrev();
      startAutoplay();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollNext();
      startAutoplay();
    }
  });

  track.addEventListener("mouseenter", stopAutoplay);
  track.addEventListener("mouseleave", startAutoplay);
  track.addEventListener("focusin", stopAutoplay);
  track.addEventListener("focusout", startAutoplay);

  startAutoplay();
}

function initCategoriesSlider() {
  const grid = document.querySelector(".categories__grid");
  const dots = Array.from(document.querySelectorAll(".categories__dot"));
  if (!grid || dots.length === 0) return;

  const cards = Array.from(grid.children);

  function setActiveDot(index) {
    dots.forEach((dot, i) => {
      dot.setAttribute("aria-current", i === index ? "true" : "false");
    });
  }

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      cards[index].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      setActiveDot(index);
    });
  });

  let scrollTimeout = null;
  grid.addEventListener("scroll", () => {
    if (scrollTimeout) window.clearTimeout(scrollTimeout);
    scrollTimeout = window.setTimeout(() => {
      const gridCenter = grid.scrollLeft + grid.clientWidth / 2;
      let closestIndex = 0;
      let closestDistance = Infinity;
      cards.forEach((card, i) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(cardCenter - gridCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
      });
      setActiveDot(closestIndex);
    }, 100);
  });
}
