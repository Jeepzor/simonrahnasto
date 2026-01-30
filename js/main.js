// ═══════════════════════════════════════════════════════════════════════════════
// NEXT LEVEL CYBERPUNK EFFECTS
// ═══════════════════════════════════════════════════════════════════════════════

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ═══════════════════════════════════════════════════════════════════════════════
// MATRIX RAIN
// ═══════════════════════════════════════════════════════════════════════════════

function initMatrixRain() {
  if (prefersReducedMotion) return;

  const canvas = document.createElement("canvas");
  canvas.id = "matrix-rain";
  canvas.setAttribute("aria-hidden", "true");
  document.body.insertBefore(canvas, document.body.firstChild);

  const ctx = canvas.getContext("2d");

  let width, height, columns, drops;

  const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>{}[]|/\\";
  const charArray = chars.split("");
  const fontSize = 14;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    columns = Math.floor(width / fontSize);
    drops = Array(columns).fill(1);
  }

  function draw() {
    ctx.fillStyle = "rgba(5, 11, 7, 0.05)";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#24ff85";
    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
      const char = charArray[Math.floor(Math.random() * charArray.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      // Varying opacity for depth
      const opacity = Math.random() * 0.5 + 0.1;
      ctx.fillStyle = `rgba(36, 255, 133, ${opacity})`;
      ctx.fillText(char, x, y);

      // Brighter leading character
      if (Math.random() > 0.975) {
        ctx.fillStyle = "#5bffb0";
        ctx.fillText(char, x, y);
      }

      if (y > height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  resize();
  window.addEventListener("resize", resize);

  function animate() {
    draw();
    requestAnimationFrame(animate);
  }
  animate();
}

// ═══════════════════════════════════════════════════════════════════════════════
// FLOATING PARTICLES
// ═══════════════════════════════════════════════════════════════════════════════

function initParticles() {
  if (prefersReducedMotion) return;

  const canvas = document.createElement("canvas");
  canvas.id = "particles";
  canvas.setAttribute("aria-hidden", "true");
  document.body.insertBefore(canvas, document.body.firstChild);

  const ctx = canvas.getContext("2d");
  let width, height;
  const particles = [];
  const particleCount = 60;

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 3 + 1;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.2;
      this.pulse = Math.random() * Math.PI * 2;
      this.pulseSpeed = Math.random() * 0.02 + 0.01;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.pulse += this.pulseSpeed;

      if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
        this.reset();
        this.x = Math.random() > 0.5 ? 0 : width;
      }
    }

    draw() {
      const pulseOpacity = this.opacity * (0.5 + Math.sin(this.pulse) * 0.5);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(36, 255, 133, ${pulseOpacity})`;
      ctx.fill();

      // Glow effect
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(36, 255, 133, ${pulseOpacity * 0.3})`;
      ctx.fill();
    }
  }

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function init() {
    resize();
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          const opacity = (1 - distance / 150) * 0.2;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(36, 255, 133, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    drawConnections();
    requestAnimationFrame(animate);
  }

  init();
  window.addEventListener("resize", resize);
  animate();
}

// ═══════════════════════════════════════════════════════════════════════════════
// MOUSE-FOLLOWING GLOW
// ═══════════════════════════════════════════════════════════════════════════════

function initMouseGlow() {
  if (prefersReducedMotion) return;

  const glow = document.createElement("div");
  glow.id = "mouse-glow";
  glow.setAttribute("aria-hidden", "true");
  document.body.appendChild(glow);

  let mouseX = 0,
    mouseY = 0;
  let glowX = 0,
    glowY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animate() {
    // Smooth follow
    glowX += (mouseX - glowX) * 0.1;
    glowY += (mouseY - glowY) * 0.1;

    glow.style.left = `${glowX}px`;
    glow.style.top = `${glowY}px`;

    requestAnimationFrame(animate);
  }
  animate();
}

// ═══════════════════════════════════════════════════════════════════════════════
// CUSTOM CURSOR
// ═══════════════════════════════════════════════════════════════════════════════

function initCustomCursor() {
  if (prefersReducedMotion || "ontouchstart" in window) return;

  const cursor = document.createElement("div");
  cursor.id = "custom-cursor";
  cursor.innerHTML = `
    <div class="cursor-dot"></div>
    <div class="cursor-ring"></div>
  `;
  document.body.appendChild(cursor);

  const dot = cursor.querySelector(".cursor-dot");
  const ring = cursor.querySelector(".cursor-ring");

  let mouseX = 0,
    mouseY = 0;
  let ringX = 0,
    ringY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  // Interactive element detection
  const interactiveElements = "a, button, .card, .btn, .social, .billboard";

  document.querySelectorAll(interactiveElements).forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("is-hover"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("is-hover"));
  });

  document.addEventListener("mousedown", () => cursor.classList.add("is-clicking"));
  document.addEventListener("mouseup", () => cursor.classList.remove("is-clicking"));

  function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;

    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;

    requestAnimationFrame(animateRing);
  }
  animateRing();
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3D TILT EFFECT ON CARDS
// ═══════════════════════════════════════════════════════════════════════════════

function initTiltEffect() {
  if (prefersReducedMotion) return;

  const billboard = document.querySelector(".billboard");
  if (!billboard) return;

  billboard.addEventListener("mousemove", (e) => {
    const rect = billboard.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    billboard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  billboard.addEventListener("mouseleave", () => {
    billboard.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// TYPING ANIMATION FOR TERMINAL
// ═══════════════════════════════════════════════════════════════════════════════

function initTypingTerminal() {
  const terminalCard = document.querySelector(".terminal-card");
  if (!terminalCard) return;

  const commands = [
    { cmd: "$ whoami", response: "Software engineer · Game developer · Educator" },
    { cmd: "$ focus", response: "Clean architecture, gameplay systems, explainable tech." },
    { cmd: "$ skills --list", response: "C/C++, Java, C#, JavaScript, Lua, Dart, Unity, LÖVE" },
    { cmd: "$ status", response: "Ready to build something awesome." },
    { cmd: "$ contact --social", response: "YouTube: DevJeeper | GitHub: @devjeeper" },
  ];

  let currentCommandIndex = 0;

  // Create new terminal structure
  terminalCard.innerHTML = `
    <div class="terminal-output"></div>
    <div class="terminal-input">
      <span class="terminal-prompt">$</span>
      <span class="terminal-text"></span>
      <span class="terminal-cursor">▋</span>
    </div>
  `;

  const output = terminalCard.querySelector(".terminal-output");
  const inputText = terminalCard.querySelector(".terminal-text");

  function typeText(text, element, speed = 50) {
    return new Promise((resolve) => {
      let i = 0;
      element.textContent = "";
      const interval = setInterval(() => {
        if (i < text.length) {
          element.textContent += text[i];
          i++;
        } else {
          clearInterval(interval);
          resolve();
        }
      }, speed);
    });
  }

  function addOutput(cmd, response) {
    const line = document.createElement("div");
    line.className = "terminal-line";
    line.innerHTML = `
      <p class="terminal-cmd">${cmd}</p>
      <p class="terminal-response">${response}</p>
    `;
    output.appendChild(line);

    // Keep only last 3 commands
    while (output.children.length > 3) {
      output.removeChild(output.firstChild);
    }
  }

  async function runCommand() {
    const { cmd, response } = commands[currentCommandIndex];

    // Type the command
    await typeText(cmd.substring(2), inputText, 80);

    // Wait a moment
    await new Promise((r) => setTimeout(r, 500));

    // Add to output
    addOutput(cmd, response);
    inputText.textContent = "";

    // Move to next command
    currentCommandIndex = (currentCommandIndex + 1) % commands.length;

    // Wait before next command
    await new Promise((r) => setTimeout(r, 3000));
    runCommand();
  }

  // Start the loop
  setTimeout(runCommand, 2000);
}

// ═══════════════════════════════════════════════════════════════════════════════
// PARALLAX SCROLLING
// ═══════════════════════════════════════════════════════════════════════════════

function initParallax() {
  if (prefersReducedMotion) return;

  const parallaxElements = document.querySelectorAll(".hero-portrait");

  function updateParallax() {
    const scrollY = window.scrollY;

    parallaxElements.forEach((el, index) => {
      const speed = 0.05 + index * 0.02;
      const rect = el.getBoundingClientRect();
      const visible = rect.top < window.innerHeight && rect.bottom > 0;

      if (visible) {
        const yOffset = (scrollY - el.offsetTop) * speed;
        el.style.transform = `translateY(${yOffset}px)`;
      }
    });
  }

  window.addEventListener("scroll", updateParallax, { passive: true });
}

// ═══════════════════════════════════════════════════════════════════════════════
// MOBILE HAMBURGER MENU
// ═══════════════════════════════════════════════════════════════════════════════

function initMobileMenu() {
  const nav = document.querySelector(".nav");
  const navLinks = document.querySelector(".nav-links");
  if (!nav || !navLinks) return;

  // Create hamburger button
  const hamburger = document.createElement("button");
  hamburger.className = "hamburger";
  hamburger.setAttribute("aria-label", "Toggle menu");
  hamburger.setAttribute("aria-expanded", "false");
  hamburger.innerHTML = `
    <span class="hamburger-line"></span>
    <span class="hamburger-line"></span>
    <span class="hamburger-line"></span>
  `;

  nav.appendChild(hamburger);

  hamburger.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    hamburger.classList.toggle("is-active");
    hamburger.setAttribute("aria-expanded", isOpen);
  });

  // Close menu when clicking a link
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
      hamburger.classList.remove("is-active");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCROLL PROGRESS INDICATOR
// ═══════════════════════════════════════════════════════════════════════════════

function initScrollProgress() {
  const progress = document.createElement("div");
  progress.id = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.appendChild(progress);

  function updateProgress() {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / scrollHeight) * 100;
    progress.style.width = `${scrolled}%`;
  }

  window.addEventListener("scroll", updateProgress, { passive: true });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SMOOTH SCROLL
// ═══════════════════════════════════════════════════════════════════════════════

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start",
        });
      }
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCROLL REVEAL (Enhanced)
// ═══════════════════════════════════════════════════════════════════════════════

function initScrollReveal() {
  const revealItems = document.querySelectorAll("[data-reveal]");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Stagger the animations
          setTimeout(() => {
            entry.target.classList.add("is-visible");
          }, index * 100);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

// ═══════════════════════════════════════════════════════════════════════════════
// BILLBOARD GLITCH (Original, enhanced)
// ═══════════════════════════════════════════════════════════════════════════════

function initBillboardGlitch() {
  const billboard = document.querySelector(".billboard");

  if (billboard && !prefersReducedMotion) {
    const triggerGlitch = () => {
      billboard.classList.add("is-glitching");
      const duration = 650;

      window.setTimeout(() => {
        billboard.classList.remove("is-glitching");
      }, duration);

      const nextDelay = 3200 + Math.random() * 4200;
      window.setTimeout(triggerGlitch, nextDelay);
    };

    const initialDelay = 1800 + Math.random() * 2000;
    window.setTimeout(triggerGlitch, initialDelay);

    const triggerRealGlitch = () => {
      billboard.classList.add("is-real-glitch");
      const duration = 450;

      window.setTimeout(() => {
        billboard.classList.remove("is-real-glitch");
      }, duration);

      const nextDelay = 2400 + Math.random() * 3600;
      window.setTimeout(triggerRealGlitch, nextDelay);
    };

    const realDelay = 1200 + Math.random() * 1600;
    window.setTimeout(triggerRealGlitch, realDelay);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// GLITCH TEXT EFFECT ON HOVER
// ═══════════════════════════════════════════════════════════════════════════════

function initGlitchText() {
  if (prefersReducedMotion) return;

  const glitchTargets = document.querySelectorAll("h1, h2");

  glitchTargets.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      el.classList.add("glitch-text");
      setTimeout(() => el.classList.remove("glitch-text"), 300);
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// INITIALIZE EVERYTHING
// ═══════════════════════════════════════════════════════════════════════════════

document.addEventListener("DOMContentLoaded", () => {
  initMatrixRain();
  initParticles();
  initMouseGlow();
  initCustomCursor();
  initTiltEffect();
  initTypingTerminal();
  initParallax();
  initMobileMenu();
  initScrollProgress();
  initSmoothScroll();
  initScrollReveal();
  initBillboardGlitch();
  initGlitchText();
});
