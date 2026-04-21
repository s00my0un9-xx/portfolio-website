/* hamburger menu */
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

  function initAbout() {
    const about = document.getElementById("about");
    if (!about) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const INVIEW_RATIO = 2 / 3;

    // in-view toggle (rotate image, FLOW highlight)
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          about.classList.toggle("is-inview", entry.intersectionRatio >= INVIEW_RATIO);
        }
      },
      { root: null, threshold: [0, INVIEW_RATIO] }
    );
    io.observe(about);
    if (prefersReduced) {
      about.classList.add("is-inview");
    }
  }

  $doc.ready(async function () {
    bindHeader();
    initAOS();
    initAbout();
  });
})();


gsap.timeline()
  .fromTo(".hero-cutout",
    { opacity: 0 },
    { opacity: 1, duration: 5, delay: 1.5, ease: "power2.out" }
  )
  .fromTo(".site-header",
    { y: -80, opacity: 0, background: "transparent" },
    { y: 0, opacity: 1, background: "var(--mint)", duration: .8, ease: "power2.out" },
    "-=0.5"
  )
  .fromTo(".scroll-down",
    { opacity: 0, y: -10 },
    { opacity: 1, y: 0, duration: .6, ease: "power2.out" },
    "-=0.3"
  );

gsap.to(".scroll-down", {
  y: 6,
  repeat: -1,
  yoyo: true,
  duration: .6,
  ease: "power1.inOut"
});
