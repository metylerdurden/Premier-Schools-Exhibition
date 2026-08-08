document.addEventListener("DOMContentLoaded", () => {
  const col1Images = [
    "assets/images/child-hero-1.jpg",
    "assets/images/child-hero-2.jpg",
    "assets/images/child-hero-3.jpg",
    "assets/images/child-hero-4.jpg"
  ];
  const col2Images = [
    "assets/images/child-hero-5.jpg",
    "assets/images/child-hero-6.jpg",
    "assets/images/child-hero-7.jpg",
    "assets/images/child-hero-8.jpg"
  ];
  const col3Images = [
    "assets/images/child-hero-9.jpg",
    "assets/images/child-hero-10.jpg",
    "assets/images/child-hero-11.jpg",
    "assets/images/child-hero-12.jpg"
  ];

  // All three columns move at the same speed; only the middle one pauses periodically.
  const columns = [
    { id: "heroTrack1", images: col1Images },
    { id: "heroTrack2", images: col2Images },
    { id: "heroTrack3", images: col3Images }
  ];

  const gallery = document.querySelector(".hero__gallery");
  if (!gallery) return;

  const TOTAL = col1Images.length;
  const COPIES = 3;
  const NUDGE_TRANSITION_MS = 550;

  // Middle lane stops for MIDDLE_PAUSE_DURATION_MS every MIDDLE_PAUSE_INTERVAL_MS while the
  // side lanes keep moving. Speed is set so each pause costs it exactly one row of lag
  // (step px per pause); after TOTAL pauses that's a full loop (TOTAL rows), so on the
  // pause after that the middle lane lands back in visual sync with the side lanes.
  const MIDDLE_INDEX = 1;
  const MIDDLE_PAUSE_INTERVAL_MS = 10000;
  const MIDDLE_PAUSE_DURATION_MS = 2000;

  // Constant phase bias for the middle column so its card boundaries always sit lower than
  // the side columns' (the "V" shape), without ever leaving an unfilled gap: all columns move
  // at the same speed, so this relative offset stays fixed for the life of the animation.
  const V_SHAPE_OFFSET_PX = 40;

  const axis = gallery.dataset.axis === "horizontal" ? "X" : "Y";
  const statusEl = document.getElementById("heroSliderStatus");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const tracks = columns.map((col) => {
    const track = document.getElementById(col.id);
    const tripled = [...col.images, ...col.images, ...col.images];
    tripled.forEach((src) => {
      const card = document.createElement("div");
      card.className = "card";
      const img = document.createElement("img");
      img.src = src;
      img.alt = "School student";
      card.appendChild(img);
      track.appendChild(card);
    });
    return { el: track, step: 0, offset: 0, speed: 0, paused: false };
  });

  function measureSteps() {
    tracks.forEach((t, i) => {
      const firstCard = t.el.querySelector(".card");
      if (!firstCard) return;
      const gap = parseFloat(getComputedStyle(t.el).rowGap) || 0;
      t.step = firstCard.getBoundingClientRect().height + gap;
      if (!t.offset) {
        t.offset = t.step * TOTAL; // start in the middle copy
        if (i === MIDDLE_INDEX) t.offset += V_SHAPE_OFFSET_PX;
      }
    });
    const uniformSpeed = tracks[MIDDLE_INDEX].step / (MIDDLE_PAUSE_DURATION_MS / 1000);
    tracks.forEach((t) => {
      t.speed = uniformSpeed;
    });
  }

  measureSteps();

  function applyTransform(t, withTransition) {
    t.el.style.transition = withTransition ? `transform ${NUDGE_TRANSITION_MS}ms cubic-bezier(0.65, 0, 0.35, 1)` : "none";
    t.el.style.transform = `translate${axis}(${-t.offset}px)`;
  }

  tracks.forEach((t) => applyTransform(t, false));

  let playing = true;
  let lastTime = null;
  let rafId = null;

  function tick(time) {
    if (lastTime === null) lastTime = time;
    const dt = (time - lastTime) / 1000;
    lastTime = time;

    if (playing && !prefersReducedMotion) {
      tracks.forEach((t) => {
        if (t.paused) return;
        t.offset += t.speed * dt;
        const maxOffset = t.step * TOTAL * (COPIES - 1);
        if (t.offset >= maxOffset) t.offset -= t.step * TOTAL;
        applyTransform(t, false);
      });
      if (statusEl) statusEl.textContent = "Photos scrolling";
    }

    rafId = window.requestAnimationFrame(tick);
  }

  rafId = window.requestAnimationFrame(tick);

  let middlePauseInterval = null;
  let middleResumeTimeout = null;

  if (!prefersReducedMotion) {
    middlePauseInterval = window.setInterval(() => {
      tracks[MIDDLE_INDEX].paused = true;
      middleResumeTimeout = window.setTimeout(() => {
        tracks[MIDDLE_INDEX].paused = false;
      }, MIDDLE_PAUSE_DURATION_MS);
    }, MIDDLE_PAUSE_INTERVAL_MS);
  }

  function pause() {
    playing = false;
  }

  function resume() {
    if (prefersReducedMotion) return;
    playing = true;
    lastTime = null;
  }

  function nudge(direction) {
    pause();
    tracks.forEach((t) => {
      t.offset += direction * t.step;
      applyTransform(t, true);
    });
    if (statusEl) {
      statusEl.textContent = direction > 0 ? "Showing next photos" : "Showing previous photos";
    }
    window.setTimeout(() => {
      tracks.forEach((t) => {
        const maxOffset = t.step * TOTAL * (COPIES - 1);
        if (t.offset >= maxOffset || t.offset < t.step * TOTAL) {
          t.offset = t.step * TOTAL + (t.offset % (t.step * TOTAL) + t.step * TOTAL) % (t.step * TOTAL);
          applyTransform(t, false);
        }
      });
      resume();
    }, NUDGE_TRANSITION_MS);
  }

  gallery.addEventListener("mouseenter", pause);
  gallery.addEventListener("mouseleave", resume);
  gallery.addEventListener("focusin", pause);
  gallery.addEventListener("focusout", resume);

  gallery.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      nudge(-1);
    } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      nudge(1);
    }
  });

  let resizeTimeout = null;
  window.addEventListener("resize", () => {
    if (resizeTimeout) window.clearTimeout(resizeTimeout);
    resizeTimeout = window.setTimeout(() => {
      measureSteps();
      tracks.forEach((t) => applyTransform(t, false));
    }, 150);
  });

  let touchStartX = 0;
  let touchStartY = 0;

  gallery.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    },
    { passive: true }
  );

  gallery.addEventListener(
    "touchend",
    (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);
      const SWIPE_THRESHOLD = 30;

      if (Math.max(absX, absY) < SWIPE_THRESHOLD) return;

      if (absX > absY) {
        nudge(dx < 0 ? 1 : -1); // swipe left = next, swipe right = prev
      } else {
        nudge(dy < 0 ? 1 : -1); // swipe up = next, swipe down = prev
      }
    },
    { passive: true }
  );

  window.addEventListener("beforeunload", () => {
    if (rafId) window.cancelAnimationFrame(rafId);
    if (middlePauseInterval) window.clearInterval(middlePauseInterval);
    if (middleResumeTimeout) window.clearTimeout(middleResumeTimeout);
  });
});
