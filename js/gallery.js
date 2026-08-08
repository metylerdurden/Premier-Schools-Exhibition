document.addEventListener("DOMContentLoaded", () => {
  const strip = document.getElementById("galleryStrip");
  if (!strip) return;

  let isDown = false;
  let startX = 0;
  let startScrollLeft = 0;

  strip.addEventListener("pointerdown", (e) => {
    isDown = true;
    startX = e.clientX;
    startScrollLeft = strip.scrollLeft;
    strip.classList.add("gallery__strip--grabbing");
    strip.setPointerCapture(e.pointerId);
  });

  strip.addEventListener("pointermove", (e) => {
    if (!isDown) return;
    strip.scrollLeft = startScrollLeft - (e.clientX - startX);
  });

  function endDrag() {
    isDown = false;
    strip.classList.remove("gallery__strip--grabbing");
  }

  strip.addEventListener("pointerup", endDrag);
  strip.addEventListener("pointercancel", endDrag);
  strip.addEventListener("pointerleave", endDrag);

  strip.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      strip.scrollBy({ left: 300, behavior: "smooth" });
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      strip.scrollBy({ left: -300, behavior: "smooth" });
    }
  });
});
