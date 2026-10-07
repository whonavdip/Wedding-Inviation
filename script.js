const revealTargets = document.querySelectorAll(
  ".welcome .eyebrow, .welcome h2, .welcome__copy, .welcome__signature, " +
    ".story__image, .story__stamp, .details > .eyebrow, .details > h2, " +
    ".details__intro, .event-info__item, .dress-note, " +
    ".closing__content, .closing__date"
);

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
  );

  revealTargets.forEach((element) => {
    element.classList.add("scroll-reveal");
    revealObserver.observe(element);
  });
}

const calendarScene = document.querySelector(".calendar-scene");
const scrollEffects = document.querySelectorAll(".story__image img, .hero__date");
let scrollFrame = 0;

function updateScrollEffects() {
  if (calendarScene) {
    const bounds = calendarScene.getBoundingClientRect();
    const scrollableDistance = Math.max(1, bounds.height - window.innerHeight);
    const progress = Math.max(0, Math.min(1, -bounds.top / scrollableDistance));
    const calendarScale =
      progress < 0.4
        ? 0.82 + (progress / 0.4) * 0.46
        : 1.28 - ((progress - 0.4) / 0.6) * 0.56;
    const sparkleScale =
      progress < 0.4
        ? 0.72 + (progress / 0.4) * 0.88
        : 1.6 - ((progress - 0.4) / 0.6) * 0.88;
    const fadeToNext = Math.max(0, Math.min(1, (progress - 0.62) / 0.28));
    const sparkleGlow = Math.max(0, 1 - Math.abs(progress - 0.4) / 0.4) * (1 - fadeToNext);

    calendarScene.style.setProperty("--calendar-scale", calendarScale.toFixed(3));
    calendarScene.style.setProperty("--sparkle-scale", sparkleScale.toFixed(3));
    calendarScene.style.setProperty("--sparkle-glow", sparkleGlow.toFixed(3));
    calendarScene.style.setProperty("--sparkle-opacity", (1 - fadeToNext).toFixed(3));
    calendarScene.style.setProperty("--calendar-opacity", (1 - fadeToNext).toFixed(3));
    calendarScene.style.setProperty("--next-opacity", fadeToNext.toFixed(3));
    calendarScene.style.setProperty("--next-scale", (0.94 + fadeToNext * 0.06).toFixed(3));
    calendarScene.style.setProperty("--next-image-scale", (1.08 - fadeToNext * 0.08).toFixed(3));
    const infoProgress = Math.max(0, Math.min(1, (progress - 0.55) / 0.3));
    calendarScene.style.setProperty("--info-opacity", infoProgress.toFixed(3));
    calendarScene.style.setProperty("--info-shift", `${((1 - infoProgress) * 24).toFixed(2)}px`);
  }

  scrollEffects.forEach((element) => {
    const bounds = element.getBoundingClientRect();
    const progress = Math.max(
      0,
      Math.min(1, (window.innerHeight - bounds.top) / (window.innerHeight + bounds.height))
    );

    if (element.classList.contains("hero__date")) {
      element.style.setProperty("--scroll-scale", (1 + progress * 0.12).toFixed(3));
    } else {
      element.style.setProperty("--scroll-scale", (1.2 - progress * 0.2).toFixed(3));
      element.style.setProperty("--scroll-shift", `${(0.5 - progress) * 24}px`);
    }
  });

  scrollFrame = 0;
}

function requestScrollEffects() {
  if (!scrollFrame) {
    scrollFrame = window.requestAnimationFrame(updateScrollEffects);
  }
}

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  window.addEventListener("scroll", requestScrollEffects, { passive: true });
  window.addEventListener("resize", requestScrollEffects);
  updateScrollEffects();
}
