/* global AOS, gsap */

function splitToChars(el) {
  const raw = (el.textContent || "").replace(/\s+/g, " ").trim();
  el.textContent = "";

  // Keep spaces as non-breaking so layout doesn't collapse
  const frag = document.createDocumentFragment();
  for (const ch of raw) {
    const wrap = document.createElement("span");
    wrap.className = "char-wrap";

    const span = document.createElement("span");
    span.className = "char";
    span.textContent = ch === " " ? "\u00A0" : ch;

    wrap.appendChild(span);
    frag.appendChild(wrap);
  }

  el.appendChild(frag);
  return el.querySelectorAll(".char");
}

function initHeroTextMotion() {
  const splitEls = document.querySelectorAll("[data-split]");
  const allChars = [];

  splitEls.forEach((el) => {
    const chars = splitToChars(el);
    allChars.push(...chars);
  });

  gsap.set(allChars, { yPercent: 130, opacity: 0 });
  gsap.to(allChars, {
    yPercent: 0,
    opacity: 1,
    duration: 0.9,
    ease: "power4.out",
    stagger: 0.035,
    delay: 0.15,
  });
}

function initAOS() {
  if (typeof AOS === "undefined") return;
  AOS.init({
    once: true,
    offset: 120,
    duration: 700,
    easing: "ease-out-quart",
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initAOS();

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (typeof gsap === "undefined") return;

  initHeroTextMotion();
});

