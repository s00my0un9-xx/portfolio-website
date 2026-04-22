$(function () {
  const $window = $(window);
  const $header = $('.site-header');
  let lastScrollTop = 0;
  const delta = 5;

  $window.on('scroll', function () {
    const nowScrollTop = $(this).scrollTop();

    if ($('.hamburger').hasClass('is-open')) return;

    if (Math.abs(lastScrollTop - nowScrollTop) <= delta) return;

    if (nowScrollTop > lastScrollTop && nowScrollTop > 100) {
      // 내릴 때: 헤더 숨김
      $header.addClass('hide');
    } else {
      // 올릴 때: 헤더 나타남
      $header.removeClass('hide');
    }

    lastScrollTop = nowScrollTop;
  });
});

// header page scroll
const tl = gsap.timeline({
  onComplete: function () {
    document.documentElement.style.overflow = "auto";
  }
});

tl.fromTo(".hero-cutout",
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

  // about section
  function initAbout() {
    const about = document.getElementById("about");
    if (!about) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const INVIEW_RATIO = 2 / 3;

    // rotate image, FLOW highlight
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


// project card
$(".project-card").each(function () {
  const $card = $(this);

  gsap.set(this, {
    rotation: $card.data("rotate"),
    x: $card.data("x"),
    y: $card.data("y")
  });
});


// PC project slide
if (window.innerWidth > 990) {
  $(".project-card").hover(
    function () {
      gsap.to(this, {
        rotation: 0,
        x: 0,
        y: 0,
        scale: 1.05,
        zIndex: 10,
        duration: 0.3,
        ease: "power2.out"
      });
    },
    function () {
      const $card = $(this);

      gsap.to(this, {
        rotation: $card.data("rotate"),
        x: $card.data("x"),
        y: $card.data("y"),
        scale: 1,
        zIndex: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  );
}


// mobile project slide
if (window.innerWidth <= 990) {
  const $scroll = $(".project-scroll");
  const $cards = $(".project-card");

  // 초기 위치 세팅 (기울어진 상태 유지)
  $cards.each(function () {
    const r = $(this).data("rotate");
    const x = $(this).data("x");
    const y = $(this).data("y");

    gsap.set(this, {
      rotation: r,
      x: x,
      y: y
    });
  });

  function updateCards() {
    let center = $scroll.scrollLeft() + $scroll.outerWidth() / 2;

    let closestCard = null;
    let closestDistance = Infinity;

    $cards.each(function () {
      const $card = $(this);

      const cardCenter =
        $card.position().left + $card.outerWidth() / 2;

      const distance = Math.abs(center - cardCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestCard = this;
      }
    });

    $cards.each(function () {
      const $card = $(this);

      if (this === closestCard) {
        $card.addClass("is-active");

        gsap.to(this, {
          scale: 1.05,
          rotation: 0,
          x: 0,
          y: 0,
          zIndex: 10,
          duration: 0.3
        });

      } else {
        $card.removeClass("is-active");

        const r = $card.data("rotate");
        const x = $card.data("x");
        const y = $card.data("y");

        gsap.to(this, {
          scale: 1,
          rotation: r,
          x: x,
          y: y,
          zIndex: 1,
          duration: 0.3
        });
      }
    });
  }

  $scroll.on("scroll", updateCards);
  updateCards();
}

$(window).on("load", function () {
  const $scroll = $(".project-scroll");
  const $first = $(".project-card").first();

  $scroll.scrollLeft($first.position().left);
  updateCards()
});