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
  //  PROJECT BLOG OVERLAY
  // ═══════════════════════════════════════════════════════

  // ── Project blog content data ──
  // Edit the HTML inside each entry to change your blog content.
  const projectBlogData = {
    "autonomous-drone": {
      icon: "🛸",
      tag: "FEATURED MISSION",
      date: "2025 — Ongoing",
      title: "Autonomous Campus Logistics Drone",
      subtitle:
        "A fully autonomous multirotor drone system designed for real-world campus delivery and logistics. This project represents the culmination of my work in flight systems, embedded programming, and autonomous navigation.",
      sections: [
        {
          title: "Project Overview",
          content: `
            <p class="blog-text">This project aims to build a fully functional autonomous drone platform capable of performing delivery missions across a campus environment. The system integrates mission planning, obstacle avoidance, FPV telemetry, and custom ground station control into a cohesive flight platform.</p>
            <div class="blog-highlight-box">
              <p>The drone is built on the Pixhawk 2.4.8 flight controller running ArduPilot firmware, paired with a Raspberry Pi companion computer that handles high-level mission logic and sensor processing.</p>
            </div>
          `,
        },
        {
          title: "Key Features",
          content: `
            <ul class="blog-list">
              <li>Fully autonomous GPS-waypoint missions triggered via Python scripts over MAVProxy</li>
              <li>Custom NRF24L01+ wireless ground station for manual override and telemetry feedback</li>
              <li>TF-Luna LiDAR sensor integration for real-time obstacle detection and terrain following</li>
              <li>Live 5.8GHz FPV video feed via HGLRC Zeus VTX for real-time pilot view</li>
              <li>Dual GPS setup for enhanced position accuracy and redundancy</li>
              <li>Raspberry Pi companion computer for onboard computation and sensor fusion</li>
            </ul>
          `,
        },
        {
          title: "Technical Architecture",
          content: `
            <p class="blog-text">The system architecture is split into three main layers: the flight controller layer (Pixhawk + ArduPilot), the companion computer layer (Raspberry Pi running Python scripts), and the ground station layer (NRF24-based remote + laptop running Mission Planner).</p>
            <p class="blog-text">Communication between the Raspberry Pi and Pixhawk happens over MAVLink protocol via serial connection. The Pi sends high-level commands (arm, takeoff, goto waypoint) while the Pixhawk handles low-level stabilization and motor control.</p>
          `,
        },
        {
          title: "Challenges & Learnings",
          content: `
            <p class="blog-text">One of the biggest challenges was achieving reliable GPS lock in urban campus environments with tall buildings causing multipath interference. The dual GPS setup significantly improved position accuracy.</p>
            <p class="blog-text">Tuning PID parameters for stable flight in varying wind conditions required extensive testing. I developed a systematic tuning methodology that reduced oscillations by 80% compared to default parameters.</p>
          `,
        },
      ],
      techStack: [
        "Pixhawk 2.4.8",
        "Raspberry Pi",
        "ArduPilot",
        "MAVProxy",
        "Python",
        "NRF24L01+",
        "TF-Luna LiDAR",
        "HGLRC Zeus VTX",
        "Dual GPS",
        "5.8GHz FPV",
        "MAVLink",
      ],
    },

    "nrf24-ground-station": {
      icon: "⚡",
      tag: "HARDWARE",
      date: "2024",
      title: "NRF24 RC Ground Station",
      subtitle:
        "Custom-built remote control system using NRF24L01+ modules with Arduino, designed for reliable telemetry feedback and manual override capabilities for drone systems.",
      sections: [
        {
          title: "Project Overview",
          content: `
            <p class="blog-text">This project involved designing and building a custom RC ground station from scratch using NRF24L01+ RF modules paired with Arduino microcontrollers. The goal was to create a reliable, low-latency wireless control system that could serve as both a primary controller and a manual override for autonomous drone operations.</p>
          `,
        },
        {
          title: "System Design",
          content: `
            <ul class="blog-list">
              <li>Dual NRF24L01+ modules for simultaneous transmit and receive operations</li>
              <li>Arduino Nano as the main controller with joystick inputs and switches</li>
              <li>Real-time telemetry display showing battery voltage, signal strength, and flight mode</li>
              <li>Failsafe mechanisms that trigger return-to-home on signal loss</li>
              <li>Custom PCB designed in KiCad for a compact, reliable form factor</li>
            </ul>
          `,
        },
        {
          title: "Communication Protocol",
          content: `
            <p class="blog-text">I designed a custom communication protocol on top of the NRF24 library that includes channel hopping for interference resistance, CRC error checking, and automatic retransmission of lost packets. The system achieves a reliable range of approximately 1km in open environments.</p>
          `,
        },
      ],
      techStack: [
        "Arduino",
        "NRF24L01+",
        "RF Communication",
        "KiCad",
        "C++",
        "Custom Protocol",
        "SPI",
      ],
    },

    "embedded-navigation": {
      icon: "🤖",
      tag: "AUTONOMOUS SYSTEMS",
      date: "2024 — 2025",
      title: "Embedded Navigation System",
      subtitle:
        "Raspberry Pi-based navigation computer with sensor fusion from GPS and IMU for real-time position estimation and autonomous waypoint navigation.",
      sections: [
        {
          title: "Project Overview",
          content: `
            <p class="blog-text">This navigation system serves as the brain of autonomous robotic platforms. Built around a Raspberry Pi, it fuses data from multiple sensors — GPS, IMU (accelerometer + gyroscope), and magnetometer — to produce accurate real-time position and heading estimates even in challenging environments.</p>
          `,
        },
        {
          title: "Sensor Fusion Algorithm",
          content: `
            <p class="blog-text">The core of the system is an Extended Kalman Filter (EKF) that combines GPS position data with IMU inertial measurements. This allows the system to maintain accurate position estimates even during brief GPS dropouts, which are common in urban environments.</p>
            <div class="blog-highlight-box">
              <p>The EKF runs at 100Hz using IMU data for prediction steps and 10Hz GPS fixes for correction, achieving position accuracy within 1.5 meters in typical conditions.</p>
            </div>
          `,
        },
        {
          title: "Waypoint Navigation",
          content: `
            <ul class="blog-list">
              <li>Pure pursuit path-following algorithm for smooth trajectory tracking</li>
              <li>Dynamic waypoint insertion and modification via wireless commands</li>
              <li>Speed profiling for safe deceleration on approach to waypoints</li>
              <li>Geofencing with configurable boundary limits and return behavior</li>
            </ul>
          `,
        },
      ],
      techStack: [
        "Raspberry Pi",
        "Python",
        "GPS Module",
        "MPU9250 IMU",
        "Kalman Filter",
        "NumPy",
        "Serial Communication",
      ],
    },

    "lidar-mapping": {
      icon: "🔭",
      tag: "PERCEPTION",
      date: "2025",
      title: "LiDAR Mapping Module",
      subtitle:
        "Point-cloud based environment mapping using TF-Luna LiDAR for obstacle detection, integrated with ArduPilot's terrain-following and avoidance APIs.",
      sections: [
        {
          title: "Project Overview",
          content: `
            <p class="blog-text">This module adds spatial awareness to autonomous drones by using a TF-Luna LiDAR sensor to build a real-time map of the environment. The system detects obstacles in the flight path and provides avoidance commands to the flight controller, enabling safe autonomous flight in cluttered environments.</p>
          `,
        },
        {
          title: "LiDAR Integration",
          content: `
            <p class="blog-text">The TF-Luna LiDAR is mounted on a servo-driven pan mechanism that sweeps ±60° horizontally. Distance measurements are collected at each angle step to build a 2D slice of the environment. Multiple sweeps at different altitudes are combined to create a 3D obstacle map.</p>
            <ul class="blog-list">
              <li>TF-Luna provides measurements up to 8 meters at 250Hz sample rate</li>
              <li>Servo sweep covers 120° field of view with 2° angular resolution</li>
              <li>Point cloud data is processed on the Raspberry Pi companion computer</li>
              <li>Obstacle positions are transformed from sensor frame to world frame using IMU data</li>
            </ul>
          `,
        },
        {
          title: "ArduPilot Integration",
          content: `
            <p class="blog-text">The obstacle map is fed to ArduPilot's avoidance library via MAVLink OBSTACLE_DISTANCE messages. This enables the flight controller to autonomously adjust its path to avoid detected obstacles while still progressing toward mission waypoints.</p>
            <div class="blog-highlight-box">
              <p>The system has been tested successfully in indoor environments with static obstacles, achieving 100% avoidance rate at speeds up to 2 m/s.</p>
            </div>
          `,
        },
      ],
      techStack: [
        "TF-Luna LiDAR",
        "ArduPilot",
        "MAVLink",
        "Python",
        "Raspberry Pi",
        "Servo Control",
        "Point Cloud Processing",
      ],
    },
  };

  function initBlogOverlay() {
    const overlay = document.getElementById("blog-overlay");
    const blogContent = document.getElementById("blog-content");
    const backBtn = document.getElementById("blog-back-btn");
    if (!overlay || !blogContent || !backBtn) return;

    // Click handler for all project cards
    document.querySelectorAll("[data-project]").forEach((card) => {
      card.addEventListener("click", (e) => {
        const slug = card.getAttribute("data-project");
        const data = projectBlogData[slug];
        if (!data) return;
        openBlog(data);
      });

      // Keyboard support
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          card.click();
        }
      });
    });

    // Back button
    backBtn.addEventListener("click", closeBlog);

    // Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && overlay.classList.contains("active")) {
        closeBlog();
      }
    });

    function openBlog(data) {
      // Build blog HTML
      let sectionsHTML = data.sections
        .map(
          (s) => `
        <div class="blog-section">
          <h3 class="blog-section-title">${s.title}</h3>
          ${s.content}
        </div>
      `,
        )
        .join("");

      let techHTML = data.techStack
        .map((t) => `<span class="blog-tech-chip">${t}</span>`)
        .join("");

      blogContent.innerHTML = `
        <div class="blog-hero-banner">
          <canvas id="blog-3d-canvas"></canvas>
          <div class="banner-icon">${data.icon}</div>
        </div>

        <div class="blog-meta">
          <span class="blog-meta-tag">${data.tag}</span>
          <span class="blog-meta-date">${data.date}</span>
        </div>

        <h1 class="blog-title">${data.title}</h1>
        <p class="blog-subtitle">${data.subtitle}</p>

        ${sectionsHTML}

        <div class="blog-section">
          <h3 class="blog-section-title">Tech Stack</h3>
          <div class="blog-tech-stack">${techHTML}</div>
        </div>

        <div class="blog-footer-cta">
          <p>Interested in this project? Let's talk about it.</p>
          <a href="#contact" class="btn btn-primary blog-contact-btn" id="blog-contact-link">Get In Touch</a>
        </div>
      `;

      // Show overlay
      overlay.scrollTop = 0;
      document.body.classList.add("blog-open");
      overlay.classList.add("active");
      overlay.setAttribute("aria-hidden", "false");

      // GSAP entrance animations
      if (window.gsap) {
        const tl = gsap.timeline();
        tl.fromTo(
          ".blog-hero-banner",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        )
          .fromTo(
            ".blog-meta",
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
            "-=0.3",
          )
          .fromTo(
            ".blog-title",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
            "-=0.2",
          )
          .fromTo(
            ".blog-subtitle",
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
            "-=0.2",
          )
          .fromTo(
            ".blog-section",
            { opacity: 0, y: 25 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "power2.out",
              stagger: 0.1,
            },
            "-=0.2",
          )
          .fromTo(
            ".blog-footer-cta",
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
            "-=0.1",
          );
      }

      // Handle contact link inside blog
      const contactLink = document.getElementById("blog-contact-link");
      if (contactLink) {
        contactLink.addEventListener("click", (e) => {
          e.preventDefault();
          closeBlog();
          setTimeout(() => {
            const contactSection = document.querySelector("#contact");
            if (contactSection) {
              const top =
                contactSection.getBoundingClientRect().top +
                window.scrollY -
                80;
              window.scrollTo({ top, behavior: "smooth" });
            }
          }, 450);
        });
      }
    }

    function closeBlog() {
      if (window.gsap) {
        gsap.to(".blog-overlay-inner", {
          opacity: 0,
          y: 30,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            overlay.classList.remove("active");
            overlay.setAttribute("aria-hidden", "true");
            document.body.classList.remove("blog-open");
            // Reset for next open
            gsap.set(".blog-overlay-inner", { opacity: 1, y: 0 });
          },
        });
      } else {
        overlay.classList.remove("active");
        overlay.setAttribute("aria-hidden", "true");
        document.body.classList.remove("blog-open");
      }
    }
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
    initBlogOverlay();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
