document.addEventListener("DOMContentLoaded", () => {
  const videos = Array.from(document.querySelectorAll("video[autoplay]"));
  if (!videos.length) return;

  function tryPlayAll() {
    videos.forEach((video) => {
      if (video.paused) video.play().catch(() => {});
    });
  }

  // Safari/WebKit doesn't always honor the declarative autoplay attribute, and a
  // rejected play() call is never retried automatically. Try right away, again once
  // each video has actually buffered data, and again on the user's first interaction
  // with the page (a genuine gesture always satisfies autoplay restrictions).
  tryPlayAll();
  videos.forEach((video) => video.addEventListener("loadeddata", tryPlayAll));

  const interactionEvents = ["pointerdown", "touchstart", "keydown", "scroll", "wheel"];
  function onFirstInteraction() {
    tryPlayAll();
    interactionEvents.forEach((evt) => document.removeEventListener(evt, onFirstInteraction));
  }
  interactionEvents.forEach((evt) => document.addEventListener(evt, onFirstInteraction, { passive: true }));
});
