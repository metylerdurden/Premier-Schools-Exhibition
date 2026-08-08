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

  [trackTop, trackBottom].forEach((track) => {
    schools.forEach(({ src, alt }) => {
      const tile = document.createElement("div");
      tile.className = "schools__logo";

      const img = document.createElement("img");
      img.src = src;
      img.alt = alt;

      tile.appendChild(img);
      track.appendChild(tile);
    });
  });

  // Click-and-drag scrolling for mouse users (touch/trackpad already scroll natively).
  // Each row is its own scroll container, so drag state is tracked per marquee.
  document.querySelectorAll(".schools__marquee").forEach((marquee) => {
    let isDown = false;
    let startX = 0;
    let startScrollLeft = 0;
    let dragged = false;

    marquee.addEventListener("mousedown", (e) => {
      isDown = true;
      dragged = false;
      marquee.classList.add("schools__marquee--dragging");
      startX = e.pageX;
      startScrollLeft = marquee.scrollLeft;
    });

    window.addEventListener("mouseup", () => {
      isDown = false;
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
  });
});
