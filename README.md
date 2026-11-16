# Swayam Khantwal | Portfolio

My personal portfolio website, an animated, space-themed single-page site with 3D drone visuals that presents my work in embedded systems, IoT and autonomous drones.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=flat&logo=threedotjs&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=flat&logo=greensock&logoColor=black)
![Formspree](https://img.shields.io/badge/Formspree-E5122E?style=flat)

## Overview

This repository holds the source code of my personal website. It is a static, single-page portfolio with an About section, featured projects, skills, achievements, blog posts and a contact form. It uses Three.js for a 3D star field and drone models, and GSAP ScrollTrigger for scroll animations. There is no build step: it is plain HTML, CSS and JavaScript, with the libraries loaded from a CDN.

## Features

- **3D visuals (Three.js)** (`js/three-scene.js`)
  - Full-page star field and nebula particle background that drifts as you scroll
  - Animated 3D drone model (body, arms, spinning rotors, LiDAR sensor) in the hero section
  - "Hologram" drone in the featured project card
- **Animations (GSAP + ScrollTrigger)** (`js/main.js`)
  - Hero entrance timeline and mouse parallax
  - Fade, slide and staggered reveal animations on scroll
  - Hover glow on cards and a soft cursor glow trail
- **Navigation**: navbar that changes style on scroll, highlights the active section and scrolls smoothly, plus an animated hamburger menu on mobile
- **Sections**: Hero, About (photo and short bio), Projects (featured project and three project cards), Skills & Tech, Achievements, Blog and Contact
- **Project detail overlay**: clicking a project card (or pressing Enter/Space on it) opens a full-screen write-up generated from data in `main.js`. Pressing Esc closes it.
- **Blog**: three standalone article pages in `blog/`
  - My Experience at CII WorkSkill Competition
  - Building My First Autonomous Drone Project
  - Sensor Fusion with Extended Kalman Filter
- **Contact form**: validates input on the client and submits to [Formspree](https://formspree.io/) with `fetch`, then shows success or error feedback on the button
- **Responsive design**: media-query breakpoints for tablet and mobile

## Tech Stack

| Area | Technology |
| ---- | ---------- |
| Markup | HTML5 |
| Styling | CSS3 (custom properties, animations, media queries) |
| Scripting | Vanilla JavaScript |
| 3D graphics | Three.js r128 (CDN) |
| Animation | GSAP 3.12 + ScrollTrigger (CDN) |
| Fonts | Google Fonts: Orbitron, Exo 2, Inter |
| Contact form | Formspree |

## Getting Started

### Prerequisites

- A modern web browser with WebGL support
- An internet connection (Three.js, GSAP and the fonts load from CDNs)

### Run locally

```bash
git clone https://github.com/Swayam7024/swayamkhantwal.git
cd swayamkhantwal
```

Open `index.html` in a browser, or serve the folder with a local server:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

### Configure the contact form

The form in `index.html` posts to a Formspree endpoint set in its `action` attribute. To receive messages yourself, create a form at [formspree.io](https://formspree.io/) and replace the endpoint URL.

## Project Structure

```
swayamkhantwal/
├── index.html                      # Single-page portfolio
├── css/
│   └── style.css                   # All site and blog styles
├── js/
│   ├── three-scene.js              # Three.js star field, hero drone, hologram drone
│   └── main.js                     # GSAP animations, nav, form, project overlay data
├── blog/
│   ├── cii-workskill-experience.html
│   ├── first-drone-project.html
│   └── sensor-fusion-ekf.html
└── assets/                         # Profile photos
```

## Future Improvements

- Add SEO and social sharing metadata (canonical URL, Open Graph and Twitter cards) and a favicon
- Respect `prefers-reduced-motion` and add a lighter fallback for devices without WebGL
- Upgrade Three.js from r128 to a current release and self-host the libraries
- Generate the blog list and project data from a single source (e.g. JSON or Markdown) so new posts are easier to add

## Author

**Swayam Khantwal**: [github.com/Swayam7024](https://github.com/Swayam7024)

## License

© 2026 Swayam Khantwal. All rights reserved.

The code, written content and personal photos in this repository may not be reused without permission.
