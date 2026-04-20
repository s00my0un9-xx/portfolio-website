/* global $, AOS */
(function () {
  const $win = $(window);
  const $doc = $(document);

  function setMobileMenu(open) {
    const btn = document.querySelector(".hamburger");
    const panel = document.getElementById("mobileMenu");
    if (!btn || !panel) return;

    btn.classList.toggle("is-open", open);
    btn.setAttribute("aria-expanded", String(open));
    if (open) {
      panel.hidden = false;
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      panel.hidden = true;
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
  }

  function bindHeader() {
    const btn = document.querySelector(".hamburger");
    const panel = document.getElementById("mobileMenu");
    if (!btn || !panel) return;

    btn.addEventListener("click", () => {
      const isOpen = btn.getAttribute("aria-expanded") === "true";
      setMobileMenu(!isOpen);
    });

    panel.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      if (target.matches("a")) setMobileMenu(false);
    });

    $win.on("resize", () => {
      if (window.matchMedia("(min-width: 821px)").matches) setMobileMenu(false);
    });
  }

  function initAOS() {
    if (!window.AOS) return;
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true,
      offset: 80,
    });
  }

  $doc.ready(async function () {
    bindHeader();
    initAOS();
  });
})();

