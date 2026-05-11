(() => {
  const root = document.documentElement;
  const body = document.body;
  const nav = document.querySelector("nav");
  const navLinks = document.querySelector(".nav-links");

  if (!body) return;

  function setViewportVars() {
    root.style.setProperty("--vh", `${window.innerHeight * 0.01}px`);
    root.style.setProperty("--vw", `${window.innerWidth * 0.01}px`);
  }

  function markDeviceSize() {
    const width = window.innerWidth;
    body.classList.toggle("is-phone", width <= 600);
    body.classList.toggle("is-tablet", width > 600 && width <= 900);
  }

  function preventHorizontalOverflow() {
    const viewportWidth = root.clientWidth || window.innerWidth;
    if (!viewportWidth) return;

    document.querySelectorAll("body *").forEach((element) => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      const isFixed = style.position === "fixed" || style.position === "sticky";

      if (!isFixed && rect.width > viewportWidth) {
        element.style.maxWidth = "100%";
        element.style.overflowWrap = "anywhere";
      }
    });
  }

  function makeNavCompactWhenNeeded() {
    if (!nav || !navLinks) return;

    const linksOverflow = navLinks.scrollWidth > navLinks.clientWidth + 2;
    nav.classList.toggle("nav-compact", linksOverflow);
  }

  function tuneLayout() {
    setViewportVars();
    markDeviceSize();
    makeNavCompactWhenNeeded();
    preventHorizontalOverflow();
  }

  window.addEventListener("resize", tuneLayout, { passive: true });
  window.addEventListener("orientationchange", () => setTimeout(tuneLayout, 200), {
    passive: true,
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", tuneLayout);
  } else {
    tuneLayout();
  }

  window.addEventListener("load", tuneLayout, { once: true });
})();
