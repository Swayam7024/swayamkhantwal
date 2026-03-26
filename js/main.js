/* ─────────────────────────────────────────────────────────
   MAIN.JS  —  Swayam Khantwal Portfolio
   • GSAP ScrollTrigger scroll animations
   • Navbar scroll behaviour
   • Mobile menu toggle
   • Mouse parallax on hero
   • Form submission handling
   • Scroll-based active nav link
───────────────────────────────────────────────────────── */

(function () {
  "use strict";

  // ═══════════════════════════════════════════════════════
  //  GSAP Registration
  // ═══════════════════════════════════════════════════════
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  // ═══════════════════════════════════════════════════════
  //  NAVBAR — scroll hide/show + active link
  // ═══════════════════════════════════════════════════════
  const navbar = document.getElementById("navbar");
  let lastScroll = 0;

  window.addEventListener(
    "scroll",
    function () {
      const current = window.scrollY;

      // Add glass class when scrolled
      if (current > 60) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }

      lastScroll = current;
    },
    { passive: true },
  );

  // Active nav link on scroll
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => link.classList.remove("active"));
          const activeLink = document.querySelector(
            `.nav-link[href="#${entry.target.id}"]`,
          );
          if (activeLink) activeLink.classList.add("active");
        }
      });
    },
    { threshold: 0.3, rootMargin: "-80px 0px -40% 0px" },
  );

  sections.forEach((section) => sectionObserver.observe(section));

  // ═══════════════════════════════════════════════════════
  //  MOBILE MENU
  // ═══════════════════════════════════════════════════════
  const hamburger = document.getElementById("nav-hamburger");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  function toggleMenu(open) {
    const isOpen =
      open !== undefined ? open : !mobileMenu.classList.contains("open");
    mobileMenu.classList.toggle("open", isOpen);
    hamburger.setAttribute("aria-expanded", isOpen);

    // Animate hamburger icon
    const spans = hamburger.querySelectorAll("span");
    if (isOpen) {
      gsap.to(spans[0], {
        rotation: 45,
        y: 7,
        duration: 0.3,
        ease: "power2.inOut",
      });
      gsap.to(spans[1], { opacity: 0, duration: 0.2 });
      gsap.to(spans[2], {
        rotation: -45,
        y: -7,
        duration: 0.3,
        ease: "power2.inOut",
      });
    } else {
      gsap.to(spans[0], {
        rotation: 0,
        y: 0,
        duration: 0.3,
        ease: "power2.inOut",
      });
      gsap.to(spans[1], { opacity: 1, duration: 0.2 });
      gsap.to(spans[2], {
        rotation: 0,
        y: 0,
        duration: 0.3,
        ease: "power2.inOut",
      });
    }
  }

  if (hamburger) hamburger.addEventListener("click", () => toggleMenu());

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => toggleMenu(false));
  });

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
      toggleMenu(false);
    }
  });

  // ═══════════════════════════════════════════════════════
  //  SMOOTH SCROLL FOR ANCHOR LINKS
  // ═══════════════════════════════════════════════════════
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        const offset = 80; // navbar height
        const top =
          target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  });

  // ═══════════════════════════════════════════════════════
  //  HERO ENTRANCE ANIMATION
  // ═══════════════════════════════════════════════════════
  function initHeroAnimation() {
    if (!window.gsap) return;

    const tl = gsap.timeline({ delay: 0.3 });

    tl.fromTo(
      "#hero-content .hero-badge",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
    )
      .fromTo(
        ".name-line:first-child",
        { opacity: 0, y: 40, skewY: 3 },
        { opacity: 1, y: 0, skewY: 0, duration: 0.9, ease: "power3.out" },
        "-=0.4",
      )
      .fromTo(
        ".name-line.accent-glow",
        { opacity: 0, y: 40, skewY: 3 },
        { opacity: 1, y: 0, skewY: 0, duration: 0.9, ease: "power3.out" },
        "-=0.6",
      )
      .fromTo(
        "#hero-subtitle",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
        "-=0.4",
      )
      .fromTo(
        "#hero-cta-primary",
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.6, ease: "back.out(1.5)" },
        "-=0.3",
      )
      .fromTo(
        "#hero-cta-ghost",
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.6, ease: "back.out(1.5)" },
        "-=0.5",
      )
      .fromTo(
        "#scroll-indicator",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        "-=0.3",
      );
  }

  // ═══════════════════════════════════════════════════════
  //  MOUSE PARALLAX ON HERO
  // ═══════════════════════════════════════════════════════
  function initMouseParallax() {
    const heroParallax = document.getElementById("hero-parallax");
    const heroContent = document.getElementById("hero-content");
    if (!heroParallax || !heroContent) return;

    let targetX = 0,
      targetY = 0;
    let currentX = 0,
      currentY = 0;

    document.addEventListener("mousemove", (e) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 30;
      targetY = (e.clientY / window.innerHeight - 0.5) * 20;
    });

    function updateParallax() {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;

      heroParallax.style.transform = `translate(${currentX * 0.6}px, ${currentY * 0.4}px)`;
      heroContent.style.transform = `translate(${currentX * -0.15}px, ${currentY * -0.1}px)`;

      requestAnimationFrame(updateParallax);
    }
    updateParallax();
  }

  // ═══════════════════════════════════════════════════════
  //  GSAP SCROLL TRIGGER ANIMATIONS
  // ═══════════════════════════════════════════════════════
  function initScrollAnimations() {
    if (!window.gsap || !window.ScrollTrigger) return;

    // ── Fade elements ──
    gsap.utils.toArray(".gsap-fade").forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        },
      );
    });

    // ── Slide from left ──
    gsap.utils.toArray(".gsap-slide-left").forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );
    });

    // ── Slide from right ──
    gsap.utils.toArray(".gsap-slide-right").forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );
    });

    // ── Fade up (staggered for grid items) ──
    gsap.utils.toArray(".gsap-fade-up").forEach((el, i) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: i * 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        },
      );
    });

    // ── Featured project hologram entrance ──
    gsap.fromTo(
      ".featured-project",
      { opacity: 0, scale: 0.95 },
      {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".featured-project",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      },
    );

    // ── Skills chips stagger ──
    const skillChips = document.querySelectorAll(".skill-chip");
    skillChips.forEach((chip, i) => {
      gsap.fromTo(
        chip,
        { opacity: 0, scale: 0.7, y: 10 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.4,
          delay: (i % 6) * 0.06,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: chip,
            start: "top 92%",
            toggleActions: "play none none none",
          },
        },
      );
    });

    // ── Contact links stagger ──
    const contactLinks = document.querySelectorAll(".contact-link");
    contactLinks.forEach((link, i) => {
      gsap.fromTo(
        link,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          delay: i * 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: link,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        },
      );
    });

    // ── Parallax for section backgrounds ──
    gsap.utils.toArray(".section").forEach((section) => {
      gsap.to(section, {
        backgroundPositionY: "30%",
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });
  }

  // ═══════════════════════════════════════════════════════
  //  FORM SUBMISSION
  // ═══════════════════════════════════════════════════════
  function initContactForm() {
    const form = document.getElementById("contact-form");
    const submitBtn = document.getElementById("form-submit");
    if (!form || !submitBtn) return;

    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const name = form.querySelector("#cf-name").value.trim();
      const email = form.querySelector("#cf-email").value.trim();
      const message = form.querySelector("#cf-message").value.trim();

      if (!name || !email || !message) {
        shakeForm(form);
        return;
      }

      const endpoint = form.getAttribute("action");
      if (!endpoint || endpoint.includes("REPLACE_WITH_YOUR_FORM_ID")) {
        console.warn(
          "Formspree endpoint missing. Replace REPLACE_WITH_YOUR_FORM_ID in the form action.",
        );
        shakeForm(form);
        return;
      }

      const originalText = submitBtn.querySelector("span").textContent;
      submitBtn.querySelector("span").textContent = "Transmitting…";
      submitBtn.disabled = true;

      try {
        const formData = new FormData(form);
        const response = await fetch(endpoint, {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          let errorMessage = "Formspree request failed";
          try {
            const errorData = await response.json();
            if (
              errorData &&
              Array.isArray(errorData.errors) &&
              errorData.errors[0]?.message
            ) {
              errorMessage = errorData.errors[0].message;
            }
          } catch (_) {
            // Keep fallback message if response body is not JSON.
          }
          throw new Error(errorMessage);
        }

        submitBtn.querySelector("span").textContent = "Signal Sent ✓";
        submitBtn.style.background =
          "linear-gradient(135deg, #16a34a, #22c55e)";
        form.reset();

        setTimeout(() => {
          submitBtn.querySelector("span").textContent = originalText;
          submitBtn.style.background = "";
          submitBtn.disabled = false;
        }, 3000);
      } catch (error) {
        console.error("Contact form submission failed:", error);
        submitBtn.querySelector("span").textContent = "Transmission Failed";
        submitBtn.style.background =
          "linear-gradient(135deg, #b91c1c, #ef4444)";

        setTimeout(() => {
          submitBtn.querySelector("span").textContent = originalText;
          submitBtn.style.background = "";
          submitBtn.disabled = false;
        }, 3000);
      }
    });
  }

  function shakeForm(form) {
    if (!window.gsap) return;
    gsap.fromTo(
      form,
      { x: -10 },
      { x: 0, duration: 0.5, ease: "elastic.out(1, 0.3)", clearProps: "x" },
    );
  }

  // ═══════════════════════════════════════════════════════
  //  HOVER GLOW EFFECT on project / skill cards
  // ═══════════════════════════════════════════════════════
  function initCardGlow() {
    document
      .querySelectorAll(".project-card, .skill-category, .about-card")
      .forEach((card) => {
        card.addEventListener("mousemove", (e) => {
          const rect = card.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          card.style.setProperty("--gx", `${x}%`);
          card.style.setProperty("--gy", `${y}%`);
          card.style.background = `
          radial-gradient(ellipse 60% 50% at ${x}% ${y}%, rgba(0,119,255,0.09) 0%, transparent 70%),
          var(--bg-card)
        `;
        });
        card.addEventListener("mouseleave", () => {
          card.style.background = "";
        });
      });
  }

  // ═══════════════════════════════════════════════════════
  //  CURSOR GLOW TRAIL
  // ═══════════════════════════════════════════════════════
  function initCursorTrail() {
    const trail = document.createElement("div");
    trail.style.cssText = `
      position: fixed;
      width: 300px; height: 300px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(0,229,255,0.04) 0%, transparent 70%);
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      transition: opacity 0.3s;
      will-change: left, top;
    `;
    document.body.appendChild(trail);

    let tx = 0,
      ty = 0,
      cx = 0,
      cy = 0;
    document.addEventListener("mousemove", (e) => {
      tx = e.clientX;
      ty = e.clientY;
    });

    function moveTrail() {
      cx += (tx - cx) * 0.1;
      cy += (ty - cy) * 0.1;
      trail.style.left = cx + "px";
      trail.style.top = cy + "px";
      requestAnimationFrame(moveTrail);
    }
    moveTrail();
  }

  // ═══════════════════════════════════════════════════════
  //  INIT
  // ═══════════════════════════════════════════════════════
  function init() {
    initHeroAnimation();
    initMouseParallax();
    initScrollAnimations();
    initContactForm();
    initCardGlow();
    initCursorTrail();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
