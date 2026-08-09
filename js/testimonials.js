document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".testimonial-card");
  if (!cards.length) return;

  const ICON_MUTED =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="22" y1="9" x2="16" y2="15"/><line x1="16" y1="9" x2="22" y2="15"/></svg>';
  const ICON_UNMUTED =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>';

  cards.forEach((card) => {
    const video = card.querySelector(".testimonial-card__media");
    const toggle = card.querySelector(".testimonial-card__mute-toggle");
    if (!video || !toggle) return;

    function syncButton() {
      toggle.setAttribute("aria-pressed", String(video.muted));
      toggle.setAttribute("aria-label", video.muted ? "Unmute video" : "Mute video");
      toggle.querySelector(".testimonial-card__mute-icon").innerHTML = video.muted ? ICON_MUTED : ICON_UNMUTED;
    }

    toggle.addEventListener("click", () => {
      video.muted = !video.muted;
      syncButton();
    });

    syncButton();

    // Safari/WebKit doesn't always honor the declarative autoplay attribute. Calling
    // play() before the video has buffered enough gets rejected and is never retried
    // automatically, so try immediately and again once it's actually ready to play.
    video.play().catch(() => {});
    video.addEventListener("loadeddata", () => video.play().catch(() => {}));
  });
});
