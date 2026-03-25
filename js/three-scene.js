/* ─────────────────────────────────────────────────────────
   THREE-SCENE.JS  —  Swayam Khantwal Portfolio
   • Animated star field reacting to scroll
   • 3D drone geometry (hero canvas)
   • Holographic drone (projects canvas)
───────────────────────────────────────────────────────── */

(function () {
  'use strict';

  // ═══════ SHARED STATE ═══════
  let scrollY = 0;
  let mouseX = 0, mouseY = 0;
  window.addEventListener('scroll', () => { scrollY = window.scrollY; });
  window.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ═══════════════════════════════════════════════════════
  //  1. BACKGROUND STAR FIELD  (fixed canvas)
  // ═══════════════════════════════════════════════════════
  function initStarField() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas || !window.THREE) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x03050d, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 800;

    // ── Stars ──
    const STAR_COUNT = 4000;
    const starGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(STAR_COUNT * 3);
    const starSizes = new Float32Array(STAR_COUNT);
    const starBrightness = new Float32Array(STAR_COUNT);

    for (let i = 0; i < STAR_COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 2000;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1000;
      starSizes[i]          = Math.random() * 2.5 + 0.5;
      starBrightness[i]     = Math.random();
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeo.setAttribute('aSize', new THREE.BufferAttribute(starSizes, 1));
    starGeo.setAttribute('aBrightness', new THREE.BufferAttribute(starBrightness, 1));

    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.5,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.85,
    });

    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // ── Nebula particles ──
    const NEBULA_COUNT = 800;
    const nebGeo = new THREE.BufferGeometry();
    const nebPos = new Float32Array(NEBULA_COUNT * 3);
    const nebCol = new Float32Array(NEBULA_COUNT * 3);

    for (let i = 0; i < NEBULA_COUNT; i++) {
      nebPos[i * 3]     = (Math.random() - 0.5) * 1800;
      nebPos[i * 3 + 1] = (Math.random() - 0.5) * 1800;
      nebPos[i * 3 + 2] = (Math.random() - 0.5) * 600;

      const c = Math.random();
      if (c < 0.33) {
        nebCol[i*3]=0.0; nebCol[i*3+1]=0.46; nebCol[i*3+2]=1.0; // blue
      } else if (c < 0.66) {
        nebCol[i*3]=0.0; nebCol[i*3+1]=0.9; nebCol[i*3+2]=1.0; // cyan
      } else {
        nebCol[i*3]=0.49; nebCol[i*3+1]=0.23; nebCol[i*3+2]=0.93; // purple
      }
    }

    nebGeo.setAttribute('position', new THREE.BufferAttribute(nebPos, 3));
    nebGeo.setAttribute('color', new THREE.BufferAttribute(nebCol, 3));

    const nebMat = new THREE.PointsMaterial({
      vertexColors: true,
      size: 3,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.25,
    });

    const nebula = new THREE.Points(nebGeo, nebMat);
    scene.add(nebula);

    // ── Resize ──
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // ── Animate ──
    let time = 0;
    function animate() {
      requestAnimationFrame(animate);
      time += 0.001;

      const scrollFactor = scrollY * 0.0003;

      // Stars drift with scroll
      stars.rotation.y = mouseX * 0.04 + scrollFactor * 0.5;
      stars.rotation.x = mouseY * 0.02 + scrollFactor * 0.3;
      stars.rotation.z = time * 0.05;

      // Nebula moves more dynamically
      nebula.rotation.y = mouseX * 0.06 + scrollFactor * 0.8;
      nebula.rotation.x = -mouseY * 0.03 + scrollFactor * 0.2;
      nebula.rotation.z = -time * 0.07;

      // Very slow drift upward as user scrolls
      camera.position.y = -scrollY * 0.08;
      camera.lookAt(new THREE.Vector3(0, camera.position.y, 0));

      renderer.render(scene, camera);
    }
    animate();
  }

  // ═══════════════════════════════════════════════════════
  //  2. HERO DRONE GEOMETRY (hero canvas — drone-canvas)
  // ═══════════════════════════════════════════════════════
  function initHeroDrone() {
    const canvas = document.getElementById('drone-canvas');
    if (!canvas || !window.THREE) return;

    const container = canvas.parentElement;
    const W = container.clientWidth;
    const H = container.clientHeight;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 500);
    camera.position.set(0, 2, 12);
    camera.lookAt(0, 0, 0);

    // ── Build drone ──
    const group = new THREE.Group();

    // Central body
    const bodyGeo = new THREE.OctahedronGeometry(1.0, 1);
    const bodyMat = new THREE.MeshPhongMaterial({
      color: 0x0a1a40,
      emissive: 0x001133,
      specular: 0x00e5ff,
      shininess: 80,
      wireframe: false,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    group.add(body);

    // Body wireframe overlay
    const wireGeo = new THREE.OctahedronGeometry(1.02, 1);
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff, wireframe: true, transparent: true, opacity: 0.25 });
    const wire = new THREE.Mesh(wireGeo, wireMat);
    group.add(wire);

    // Drone arms (4) + rotors
    const armMat = new THREE.MeshPhongMaterial({ color: 0x0a1a40, emissive: 0x000a20, specular: 0x0077ff, shininess: 60 });
    const armWire = new THREE.MeshBasicMaterial({ color: 0x0077ff, wireframe: true, transparent: true, opacity: 0.5 });

    const rotors = [];

    const ARM_DIRS = [
      { x: 1.8, z: 1.8 }, { x: -1.8, z: 1.8 },
      { x: -1.8, z: -1.8 }, { x: 1.8, z: -1.8 },
    ];

    ARM_DIRS.forEach((dir, i) => {
      // Arm
      const armLen = Math.sqrt(dir.x * dir.x + dir.z * dir.z);
      const armGeo = new THREE.CylinderGeometry(0.06, 0.04, armLen, 6);
      const armMesh = new THREE.Mesh(armGeo, armMat);
      armMesh.position.set(dir.x / 2, 0, dir.z / 2);
      armMesh.rotation.z = Math.PI / 2;
      armMesh.lookAt(dir.x, 0, dir.z);
      armMesh.rotateX(Math.PI / 2);
      group.add(armMesh);

      const armWireMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.05, armLen, 6), armWire);
      armWireMesh.copy(armMesh);
      armWireMesh.material = armWire;
      group.add(armWireMesh);

      // Motor hub
      const hubGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.15, 8);
      const hubMat = new THREE.MeshPhongMaterial({ color: 0x111133, emissive: 0x0077ff, emissiveIntensity: 0.4 });
      const hub = new THREE.Mesh(hubGeo, hubMat);
      hub.position.set(dir.x, 0, dir.z);
      group.add(hub);

      // Rotor blades
      const rotorGroup = new THREE.Group();
      rotorGroup.position.set(dir.x, 0.1, dir.z);
      for (let b = 0; b < 2; b++) {
        const bladeGeo = new THREE.BoxGeometry(0.8, 0.02, 0.1);
        const bladeMat = new THREE.MeshPhongMaterial({ color: 0x001a44, transparent: true, opacity: 0.7, specular: 0x00e5ff });
        const blade = new THREE.Mesh(bladeGeo, bladeMat);
        blade.rotation.y = b * Math.PI / 2;
        rotorGroup.add(blade);
      }
      rotors.push({ group: rotorGroup, dir: i % 2 === 0 ? 1 : -1 });
      group.add(rotorGroup);

      // Rotor glow ring
      const ringGeo = new THREE.RingGeometry(0.35, 0.4, 24);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.3, side: THREE.DoubleSide });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.position.set(dir.x, 0.12, dir.z);
      group.add(ringMesh);
    });

    // Center indicator LED
    const ledGeo = new THREE.SphereGeometry(0.15, 8, 8);
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
    const led = new THREE.Mesh(ledGeo, ledMat);
    led.position.y = -0.6;
    group.add(led);

    // LiDAR sensor
    const lidarGeo = new THREE.CylinderGeometry(0.12, 0.1, 0.3, 8);
    const lidarMat = new THREE.MeshPhongMaterial({ color: 0x111133, emissive: 0xff2200, emissiveIntensity: 0.5 });
    const lidar = new THREE.Mesh(lidarGeo, lidarMat);
    lidar.position.y = 0.7;
    group.add(lidar);

    scene.add(group);
    group.position.x = 2.5;

    // ── Lights ──
    scene.add(new THREE.AmbientLight(0x0a1a40, 2));
    const pLight1 = new THREE.PointLight(0x00e5ff, 3, 20);
    pLight1.position.set(5, 5, 5);
    scene.add(pLight1);
    const pLight2 = new THREE.PointLight(0x0077ff, 2, 20);
    pLight2.position.set(-5, -3, 2);
    scene.add(pLight2);
    const pLight3 = new THREE.PointLight(0x7c3aed, 1.5, 15);
    pLight3.position.set(0, 5, -5);
    scene.add(pLight3);

    // ── Resize ──
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    // ── Animate ──
    let t = 0;
    function animate() {
      requestAnimationFrame(animate);
      t += 0.008;

      // Float
      group.position.y = Math.sin(t * 0.8) * 0.3;

      // Rotate gently
      group.rotation.y = t * 0.3 + mouseX * 0.4;
      group.rotation.x = Math.sin(t * 0.4) * 0.15 + mouseY * 0.15;

      // Spin rotors
      rotors.forEach(r => {
        r.group.rotation.y += 0.2 * r.dir;
      });

      // LED pulse
      led.material.opacity = 0.5 + 0.5 * Math.sin(t * 3);

      // Parallax shift with scroll
      group.position.z = -scrollY * 0.005;

      renderer.render(scene, camera);
    }
    animate();
  }

  // ═══════════════════════════════════════════════════════
  //  3. HOLOGRAM DRONE (projects section)
  // ═══════════════════════════════════════════════════════
  function initHologramDrone() {
    const canvas = document.getElementById('hologram-canvas');
    if (!canvas || !window.THREE) return;

    const container = document.getElementById('drone-hologram');
    const W = container.clientWidth;
    const H = container.clientHeight;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 200);
    camera.position.set(0, 2, 8);
    camera.lookAt(0, 0, 0);

    const group = new THREE.Group();

    // Icosahedron core
    const coreGeo = new THREE.IcosahedronGeometry(1.2, 1);
    const coreMat = new THREE.MeshPhongMaterial({
      color: 0x001133,
      emissive: 0x002266,
      specular: 0x00e5ff,
      shininess: 100,
      wireframe: false,
      transparent: true,
      opacity: 0.85,
    });
    const coreWire = new THREE.MeshBasicMaterial({ color: 0x00e5ff, wireframe: true, transparent: true, opacity: 0.5 });
    group.add(new THREE.Mesh(coreGeo, coreMat));
    group.add(new THREE.Mesh(new THREE.IcosahedronGeometry(1.22, 1), coreWire));

    // 4 arm pods
    [45, 135, 225, 315].forEach((deg, i) => {
      const rad = (deg * Math.PI) / 180;
      const px = Math.sin(rad) * 2;
      const pz = Math.cos(rad) * 2;

      // Arm tube
      const aGeo = new THREE.CylinderGeometry(0.04, 0.04, 2, 6);
      const aMat = new THREE.MeshPhongMaterial({ color: 0x001122, emissive: 0x001133, specular: 0x0077ff });
      const arm = new THREE.Mesh(aGeo, aMat);
      arm.position.set(px / 2, 0, pz / 2);
      arm.rotation.x = Math.PI / 2;
      arm.lookAt(px, 0, pz);
      arm.rotateX(Math.PI / 2);
      group.add(arm);

      // Pod
      const podGeo = new THREE.SphereGeometry(0.28, 10, 8);
      const podMat = new THREE.MeshPhongMaterial({ color: 0x001a40, emissive: 0x0055aa, emissiveIntensity: 0.6 });
      const pod = new THREE.Mesh(podGeo, podMat);
      pod.position.set(px, 0.1, pz);
      group.add(pod);

      // Spinning ring
      const rGeo = new THREE.TorusGeometry(0.35, 0.025, 6, 24);
      const rMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.6 });
      const ring = new THREE.Mesh(rGeo, rMat);
      ring.position.set(px, 0.12, pz);
      ring.userData.spinDir = i % 2 === 0 ? 1 : -1;
      group.add(ring);
    });

    scene.add(group);

    // Lights
    scene.add(new THREE.AmbientLight(0x0a1540, 2));
    const pl1 = new THREE.PointLight(0x00e5ff, 4, 20);
    pl1.position.set(4, 4, 4);
    scene.add(pl1);
    const pl2 = new THREE.PointLight(0x7c3aed, 2, 15);
    pl2.position.set(-4, -2, 2);
    scene.add(pl2);

    // Resize
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    let t = 0;
    function animate() {
      requestAnimationFrame(animate);
      t += 0.01;

      group.rotation.y = t * 0.4;
      group.position.y = Math.sin(t * 0.7) * 0.2;

      // Spin rings
      group.children.forEach(child => {
        if (child.userData.spinDir !== undefined) {
          child.rotation.y += 0.05 * child.userData.spinDir;
        }
      });

      renderer.render(scene, camera);
    }
    animate();
  }

  // ── Init all on DOM ready ──
  function onReady() {
    try { initStarField(); } catch(e) { console.warn('StarField error:', e); }
    try { initHeroDrone(); } catch(e) { console.warn('HeroDrone error:', e); }
    try { initHologramDrone(); } catch(e) { console.warn('HologramDrone error:', e); }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }

})();
