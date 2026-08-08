document.addEventListener("DOMContentLoaded", () => {
  const schools = [
    { src: "assets/logos/Harrow.png", alt: "Harrow International School, Bengaluru" },
    { src: "assets/logos/Shrewsbury-school.png", alt: "Shrewsbury International School, Bangkok" },
    { src: "assets/logos/kings-college.png", alt: "King's College India, Rohtak" },
    { src: "assets/logos/woodstock-school-logo.png", alt: "Woodstock School" },
    { src: "assets/logos/Mombasa-Logo-green.png", alt: "The Aga Khan Academy, Mombasa" },
    { src: "assets/logos/TISB.png", alt: "TISB" },
    { src: "assets/logos/gis.png", alt: "Participating school logo" },
    { src: "assets/logos/hopetown.png", alt: "Hopetown School" },
    { src: "assets/logos/school-logo-unidentified.jpg", alt: "Participating school logo" }
  ];

  const trackTop = document.getElementById("schoolsTrackTop");
  const trackBottom = document.getElementById("schoolsTrackBottom");
  if (!trackTop || !trackBottom) return;

  function fillTrack(track) {
    // Duplicated so the track can loop seamlessly: at the halfway scroll point
    // the second copy lines up exactly where the first one started.
    for (let copy = 0; copy < 2; copy++) {
      schools.forEach(({ src, alt }) => {
        const tile = document.createElement("div");
        tile.className = "schools__logo";

        const img = document.createElement("img");
        img.src = src;
        img.alt = copy === 0 ? alt : "";
        if (copy === 1) img.setAttribute("aria-hidden", "true");

        tile.appendChild(img);
        track.appendChild(tile);
      });
    }
  }

  [trackTop, trackBottom].forEach(fillTrack);

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const SPEED_PX_PER_SEC = 32;

  // Click-and-drag scrolling for mouse users (touch/trackpad already scroll natively).
  // Each row is its own scroll container, so drag state is tracked per marquee.
  document.querySelectorAll(".schools__marquee").forEach((marquee, index) => {
    const track = marquee.querySelector(".schools__track");
    const direction = index % 2 === 0 ? 1 : -1; // alternate flow direction row to row
    let halfWidth = track.scrollWidth / 2;
    let isDown = false;
    let dragged = false;
    let startX = 0;
    let startScrollLeft = 0;
    let paused = false;
    let lastTime = null;

    // Start the second row already flowing the opposite way from a natural position.
    if (direction === -1) marquee.scrollLeft = halfWidth;

    marquee.addEventListener("mousedown", (e) => {
      isDown = true;
      dragged = false;
      paused = true;
      marquee.classList.add("schools__marquee--dragging");
      startX = e.pageX;
      startScrollLeft = marquee.scrollLeft;
    });

    window.addEventListener("mouseup", () => {
      if (!isDown) return;
      isDown = false;
      paused = false;
      marquee.classList.remove("schools__marquee--dragging");
    });

    marquee.addEventListener("mouseleave", () => {
      isDown = false;
      marquee.classList.remove("schools__marquee--dragging");
    });

    marquee.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const delta = e.pageX - startX;
      if (Math.abs(delta) > 3) dragged = true;
      marquee.scrollLeft = startScrollLeft - delta;
    });

    // Prevent logo links/clicks from firing after a drag (none currently, but harmless to guard).
    marquee.addEventListener(
      "click",
      (e) => {
        if (dragged) e.preventDefault();
      },
      true
    );

    marquee.addEventListener("mouseenter", () => { paused = true; });
    marquee.addEventListener("mouseleave", () => { if (!isDown) paused = false; });
    marquee.addEventListener("focusin", () => { paused = true; });
    marquee.addEventListener("focusout", () => { paused = false; });
    marquee.addEventListener("touchstart", () => { paused = true; }, { passive: true });
    marquee.addEventListener("touchend", () => { paused = false; }, { passive: true });

    if (prefersReducedMotion) return;

    function tick(now) {
      if (lastTime === null) lastTime = now;
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (!paused && !document.hidden) {
        halfWidth = track.scrollWidth / 2;
        let next = marquee.scrollLeft + direction * SPEED_PX_PER_SEC * dt;
        if (next >= halfWidth) next -= halfWidth;
        if (next < 0) next += halfWidth;
        marquee.scrollLeft = next;
      }

      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  });
});
