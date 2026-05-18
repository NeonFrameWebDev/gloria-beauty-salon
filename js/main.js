/* Gloria Beauty Salon -- main.js
 * Handles: loader, parallax, scroll reveals, lightbox, hamburger nav
 */
(function () {
  "use strict";

  /* ── Loader ──────────────────────────────────────────────── */
  function initLoader() {
    const loader = document.getElementById("loader");
    if (!loader) return;

    // Animate progress bar
    const fill = loader.querySelector(".loader-bar-fill");
    if (fill) {
      fill.style.transition = "width 1.1s ease-out";
      requestAnimationFrame(() => {
        fill.style.width = "100%";
      });
    }

    // After 1.2s, fade out loader and fade in body
    setTimeout(() => {
      loader.style.transition = "opacity 0.35s ease";
      loader.style.opacity = "0";
      document.body.classList.add("page-ready");
      setTimeout(() => {
        loader.style.display = "none";
      }, 360);
    }, 1200);
  }

  /* ── Hero Parallax ───────────────────────────────────────── */
  function initParallax() {
    const heroImg = document.querySelector(".hero-img-parallax");
    if (!heroImg) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    let ticking = false;
    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          heroImg.style.transform = `translateY(${scrollY * 0.3}px)`;
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  /* ── Scroll Reveals ──────────────────────────────────────── */
  function initReveal() {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const reveals = document.querySelectorAll(".reveal");

    if (prefersReduced) {
      reveals.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    reveals.forEach((el) => observer.observe(el));
  }

  /* ── Nav scroll behavior ─────────────────────────────────── */
  function initNav() {
    const nav = document.querySelector("nav.site-nav");
    if (!nav) return;
    window.addEventListener("scroll", () => {
      if (window.scrollY > 40) {
        nav.classList.add("nav-scrolled");
      } else {
        nav.classList.remove("nav-scrolled");
      }
    });
  }

  /* ── Hamburger ───────────────────────────────────────────── */
  function initHamburger() {
    const btn = document.querySelector(".nav-hamburger");
    const drawer = document.getElementById("nav-drawer");
    if (!btn || !drawer) return;

    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      drawer.classList.toggle("drawer-open", !open);
      btn.classList.toggle("is-open", !open);
    });

    // Close on link click
    drawer.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        btn.setAttribute("aria-expanded", "false");
        drawer.classList.remove("drawer-open");
        btn.classList.remove("is-open");
      });
    });
  }

  /* ── Lightbox ────────────────────────────────────────────── */
  function initLightbox() {
    const tiles = document.querySelectorAll(".gallery-tile");
    const lb = document.getElementById("lightbox");
    if (!lb || !tiles.length) return;

    const lbImg = lb.querySelector(".lb-img");
    const lbCaption = lb.querySelector(".lb-caption");
    const lbClose = lb.querySelector(".lb-close");
    const lbPrev = lb.querySelector(".lb-prev");
    const lbNext = lb.querySelector(".lb-next");

    let currentIndex = 0;
    const images = [];

    tiles.forEach((tile, i) => {
      const img = tile.querySelector("img");
      const caption = tile.dataset.caption || "";
      images.push({ src: img.src, caption });
    });

    function openAt(index) {
      currentIndex = index;
      const item = images[currentIndex];
      lbImg.src = item.src;
      lbImg.alt = item.caption;
      if (lbCaption) lbCaption.textContent = item.caption;
      lb.classList.add("lb-open");
      lb.focus();
    }

    function close() {
      lb.classList.remove("lb-open");
    }

    function prev() {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      openAt(currentIndex);
    }

    function next() {
      currentIndex = (currentIndex + 1) % images.length;
      openAt(currentIndex);
    }

    tiles.forEach((tile, i) => {
      tile.addEventListener("click", () => openAt(i));
      tile.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") openAt(i);
      });
    });

    lbClose.addEventListener("click", close);
    lbPrev.addEventListener("click", prev);
    lbNext.addEventListener("click", next);

    lb.addEventListener("click", (e) => {
      if (e.target === lb) close();
    });

    document.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("lb-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    });
  }

  /* ── Init ────────────────────────────────────────────────── */
  document.addEventListener("DOMContentLoaded", () => {
    initLoader();
    initNav();
    initParallax();
    initReveal();
    initHamburger();
    initLightbox();
  });
})();
