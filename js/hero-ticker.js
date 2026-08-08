document.addEventListener("DOMContentLoaded", () => {
  const card = document.getElementById("heroEventCard");
  const track = document.getElementById("heroEventTrack");
  if (!card || !track) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  const SPEED_PX_PER_SEC = 18;
  let repeatHeight = 0;
  let offset = 0;
  let paused = false;
  let lastTime = null;

  function measure() {
    // All rows are identical, so the vertical gap between the first two
    // is exactly one loop period — wrapping by that amount is seamless.
    const rows = track.querySelectorAll(".hero__event-row");
    repeatHeight = rows.length >= 2 ? rows[1].offsetTop - rows[0].offsetTop : 0;
  }

  measure();
  window.addEventListener("resize", measure);

  card.addEventListener("mouseenter", () => { paused = true; });
  card.addEventListener("mouseleave", () => { paused = false; });
  card.addEventListener("focusin", () => { paused = true; });
  card.addEventListener("focusout", () => { paused = false; });

  function tick(now) {
    if (lastTime === null) lastTime = now;
    const dt = (now - lastTime) / 1000;
    lastTime = now;

    if (!paused && !document.hidden && repeatHeight > 0) {
      offset += SPEED_PX_PER_SEC * dt;
      if (offset >= repeatHeight) offset -= repeatHeight;
      track.style.transform = `translateY(${-offset}px)`;
    }

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
});
