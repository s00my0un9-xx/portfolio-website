/* global $, gsap, AOS */
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

  function playHeroVideos() {
    const videos = [
      document.getElementById("heroVideoFull"),
      document.getElementById("heroVideoMask"),
    ].filter(Boolean);

    const playOne = (video) => {
      try {
        const p = video.play();
        if (p && typeof p.then === "function") return p.catch(() => {});
      } catch (_) {
        // ignore
      }
      return Promise.resolve();
    };

    return Promise.all(videos.map(playOne)).then(() => {});
  }

  function runIntroAnimation() {
    const prefersReduced =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const header = document.querySelector('[data-animate="header"]');
    const title = document.querySelector('[data-animate="heroTitle"]');
    const heroFull = document.querySelector('[data-animate="heroFull"]');
    const heroMint = document.querySelector('[data-animate="heroMint"]');
    const heroMask = document.querySelector('[data-animate="heroMask"]');
    const heroScroll = document.querySelector('[data-animate="heroScroll"]');

    if (!header || !title || !window.gsap) return;

    if (prefersReduced) {
      document.body.classList.remove("is-intro");
      header.style.opacity = "1";
      title.style.opacity = "1";
      if (heroMint) heroMint.style.opacity = "1";
      if (heroMask) heroMask.style.opacity = "1";
      if (heroFull) heroFull.style.opacity = "0";
      if (heroScroll) heroScroll.style.opacity = "1";
      return;
    }

    gsap.set([header, title], { opacity: 0 });
    if (heroMint) gsap.set(heroMint, { opacity: 0 });
    if (heroMask) gsap.set(heroMask, { opacity: 0 });
    if (heroFull) gsap.set(heroFull, { opacity: 1 });
    if (heroScroll) gsap.set(heroScroll, { opacity: 0 });

    const tl = gsap.timeline({ delay: 3 });
    tl.add(() => document.body.classList.remove("is-intro"), 0);
    if (heroMint) tl.to(heroMint, { opacity: 1, duration: 0.9, ease: "power2.out" }, 0);
    if (heroMask) tl.to(heroMask, { opacity: 1, duration: 0.9, ease: "power2.out" }, 0);
    if (heroFull) tl.to(heroFull, { opacity: 0, duration: 0.9, ease: "power2.out" }, 0);
    tl.to(header, { opacity: 1, duration: 0.8, ease: "power2.out" }, 0.15);
    tl.to(title, { opacity: 1, duration: 0.9, ease: "power2.out" }, 0.15);
    if (heroScroll) tl.to(heroScroll, { opacity: 1, duration: 0.6, ease: "power2.out" }, 0.25);
  }

  $doc.ready(async function () {
    bindHeader();
    initAOS();

    await playHeroVideos();
    runIntroAnimation();
  });
})();

