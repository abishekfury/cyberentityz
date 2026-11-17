/**
 * CYBERENTITYZ™ — Enterprise Nord & Briskinfosec Architecture
 * Mega-Menus, Domain Switcher, 3D Mesh & Interactive Practices
 */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initHeroMesh();
  initHeroSpotlight();
  initPracticesAccordion();
  initCertFilters();
  initReviewSlider();
  initMobileNav();
  initStickyHeader();
  initScrollReveal();
  initParallax();
  initDotmarkFooter();
  initAlloyAccordion();
  initCountUpAnimations();
  initCyberGlobe();
  initServicesCascade();
});

/* ==========================================================================
   1. AWWWARDS ADRIEN QUÉCHON STYLE PRELOADER
   ========================================================================== */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const loaderCount = document.getElementById('loaderCount');
  const loaderFill = document.getElementById('loaderFill');
  const leftTelem = document.getElementById('leftTelemetry');
  const rightTelem = document.getElementById('rightTelemetry');
  const topTelem = document.getElementById('topTelemetry');
  if (!preloader || !loaderCount || !loaderFill) return;

  const duration = 1800;
  const startTime = Date.now();

  const telemInterval = setInterval(() => {
    if (leftTelem) {
      const b2 = Math.random().toString(2).substr(2, 6);
      const b3 = Math.random().toString(2).substr(2, 6);
      leftTelem.innerHTML = `_ 01 ${b2}<br>${b3}`;
    }
    if (rightTelem) {
      const r1 = Math.floor(Math.random() * 9000 + 1000);
      const r2 = Math.random().toString(2).substr(2, 6);
      rightTelem.innerHTML = `${r1} ${r2}<br>1 000 00 000 0<br>011`;
    }
    if (topTelem) {
      const t1 = Math.floor(Math.random() * 80000 + 10000);
      topTelem.textContent = `${t1} 18`;
    }
  }, 90);

  function update() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(100, Math.floor((elapsed / duration) * 100));

    loaderCount.textContent = `${progress}%`;
    loaderFill.style.width = `${progress}%`;

    if (progress < 100) {
      requestAnimationFrame(update);
    } else {
      clearInterval(telemInterval);
      setTimeout(() => {
        preloader.classList.add('loaded');
      }, 240);
    }
  }

  requestAnimationFrame(update);

  // Failsafe so the loader can never block the page (e.g. throttled rAF on mobile/background tabs)
  setTimeout(() => {
    clearInterval(telemInterval);
    preloader.classList.add('loaded');
  }, duration + 1200);
}

/* ==========================================================================
   2. INTERACTIVE 3D HERO CYBER CANVAS & MOUSE SPOTLIGHT (FRAMER STYLE)
   ========================================================================== */
function initHeroSpotlight() {
  const hero = document.getElementById('hero');
  const spotlight = document.getElementById('heroSpotlight');
  if (!hero || !spotlight) return;

  let mouseX = hero.offsetWidth * 0.65;
  let mouseY = hero.offsetHeight * 0.45;
  let currentX = mouseX;
  let currentY = mouseY;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  function renderSpotlight() {
    currentX += (mouseX - currentX) * 0.08;
    currentY += (mouseY - currentY) * 0.08;
    spotlight.style.left = `${currentX}px`;
    spotlight.style.top = `${currentY}px`;
    requestAnimationFrame(renderSpotlight);
  }
  requestAnimationFrame(renderSpotlight);
}

function initHeroMesh() {
  const canvas = document.getElementById('heroCyberCanvas') || document.getElementById('heroMeshCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;

  function resize() {
    width = canvas.width = canvas.parentElement ? canvas.parentElement.offsetWidth : window.innerWidth;
    height = canvas.height = canvas.parentElement ? canvas.parentElement.offsetHeight : 650;
  }
  resize();
  window.addEventListener('resize', resize);

  let rotationX = 0;
  let rotationY = 0;
  let targetRotX = 0;
  let targetRotY = 0;

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    targetRotY = (e.clientX - centerX) * 0.0012;
    targetRotX = (e.clientY - centerY) * 0.0012;
  });

  const points = [];
  const rings = 16;
  const segments = 24;
  const radius = Math.min(220, window.innerWidth * 0.22);

  for (let i = 0; i <= rings; i++) {
    const theta = (i * Math.PI) / rings;
    for (let j = 0; j < segments; j++) {
      const phi = (j * 2 * Math.PI) / segments;
      const x = radius * Math.sin(theta) * Math.cos(phi);
      const y = radius * Math.cos(theta);
      const z = radius * Math.sin(theta) * Math.sin(phi);
      points.push({ x, y, z });
    }
  }

  let time = 0;

  function render() {
    time += 0.012;
    rotationX += (targetRotX - rotationX) * 0.06;
    rotationY += (targetRotY - rotationY) * 0.06;

    ctx.clearRect(0, 0, width, height);
    const cx = width / 2;
    const cy = height / 2;

    const projected = [];

    const cosY = Math.cos(rotationY + time * 0.5);
    const sinY = Math.sin(rotationY + time * 0.5);
    const cosX = Math.cos(rotationX);
    const sinX = Math.sin(rotationX);

    for (let i = 0; i < points.length; i++) {
      const p = points[i];

      let x1 = p.x * cosY - p.z * sinY;
      let z1 = p.z * cosY + p.x * sinY;

      let y2 = p.y * cosX - z1 * sinX;
      let z2 = z1 * cosX + p.y * sinX;

      const fov = 420;
      const scale = fov / (fov + z2 + 120);
      const x2D = x1 * scale + cx;
      const y2D = y2 * scale + cy;

      projected.push({ x: x2D, y: y2D, z: z2, scale });
    }

    ctx.lineWidth = 0.8;
    ctx.strokeStyle = 'rgba(235, 78, 0, 0.25)';

    for (let i = 0; i < rings; i++) {
      for (let j = 0; j < segments; j++) {
        const idx = i * segments + j;
        const nextJ = i * segments + ((j + 1) % segments);
        const nextI = (i + 1) * segments + j;

        if (projected[idx] && projected[nextJ]) {
          ctx.beginPath();
          ctx.moveTo(projected[idx].x, projected[idx].y);
          ctx.lineTo(projected[nextJ].x, projected[nextJ].y);
          ctx.stroke();
        }

        if (i < rings - 1 && projected[idx] && projected[nextI]) {
          ctx.beginPath();
          ctx.moveTo(projected[idx].x, projected[idx].y);
          ctx.lineTo(projected[nextI].x, projected[nextI].y);
          ctx.stroke();
        }
      }
    }

    for (let i = 0; i < projected.length; i += 3) {
      const p = projected[i];
      if (p.z > 0) {
        ctx.fillStyle = '#ff5500';
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(1, 2.2 * p.scale), 0, Math.PI * 2);
        ctx.fill();
      }
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

/* ==========================================================================
   3. ON-PAGE ASSURANCE / GOVERNANCE / MSSP MATRIX SWITCHER
   ========================================================================== */
window.switchMatrixDomain = function(domainName) {
  // Update Tabs
  const pills = document.querySelectorAll('.matrix-tab-pills .matrix-pill');
  pills.forEach(pill => pill.classList.remove('active'));
  
  const targetIndex = domainName === 'assurance' ? 0 : domainName === 'governance' ? 1 : 2;
  if (pills[targetIndex]) pills[targetIndex].classList.add('active');

  // Update Panels
  const panels = document.querySelectorAll('.matrix-domain-panel');
  panels.forEach(p => p.classList.remove('active'));

  const activePanel = document.getElementById(`panel-${domainName}`);
  if (activePanel) {
    activePanel.classList.add('active');
  }
};

/* ==========================================================================
   4. FOUR PRACTICES ACCORDION & VISUALS (NORD SCREENSHOT 4)
   ========================================================================== */
const practiceVisuals = [
  {
    badge: '■ 01 — OFFENSIVE SECURITY & VAPT',
    img: 'images/digital-defense-soc.jpg',
    alt: 'CYBERENTITYZ Offensive Security & VAPT Operations'
  },
  {
    badge: '■ 02 — CORPORATE GOVERNANCE & COMPLIANCE',
    img: 'images/server-datacenter.jpg',
    alt: 'Corporate Infrastructure & Cloud Security Compliance'
  },
  {
    badge: '■ 03 — MANAGED CYBER DEFENSE (MSSP)',
    img: 'images/cyber-operations-lab.jpg',
    alt: '24/7 Managed Security Operations Center'
  },
  {
    badge: '■ 04 — GLOBAL CERTIFICATIONS & ACADEMIC LABS',
    img: 'images/academic-lab-mou.jpg',
    alt: 'Collegiate Cyber Defense Incubator & Certifications'
  }
];

function initPracticesAccordion() {
  updatePracticeVisual(0);
}

window.togglePractice = function(index) {
  const items = document.querySelectorAll('.practice-item');
  items.forEach((item, idx) => {
    const btn = item.querySelector('.practice-toggle-btn') || item.querySelector('.practice-toggle-icon');
    if (idx === index) {
      item.classList.add('active');
      if (btn) btn.textContent = '✕';
      updatePracticeVisual(index);
    } else {
      item.classList.remove('active');
      if (btn) btn.textContent = '+';
    }
  });
};

function updatePracticeVisual(index) {
  const practiceImg = document.getElementById('practiceImg');
  const practiceBadge = document.getElementById('practiceBadge');
  const data = practiceVisuals[index];
  if (!data) return;

  if (practiceImg) {
    practiceImg.style.opacity = '0.3';
    setTimeout(() => {
      practiceImg.src = data.img;
      practiceImg.alt = data.alt;
      practiceImg.style.opacity = '1';
    }, 120);
  }
  if (practiceBadge) {
    practiceBadge.textContent = data.badge;
  }
}

/* ==========================================================================
   5. GLOBAL CERTIFICATIONS FILTER & SEARCH
   ========================================================================== */
function initCertFilters() {
  const pills = document.querySelectorAll('.cert-pill');
  const cards = document.querySelectorAll('.cert-box-card');
  const searchInput = document.getElementById('certSearch');

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      filterCerts(pill.getAttribute('data-body'), searchInput ? searchInput.value : '');
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const activePill = document.querySelector('.cert-pill.active');
      const body = activePill ? activePill.getAttribute('data-body') : 'all';
      filterCerts(body, e.target.value.toLowerCase().trim());
    });
  }

  function filterCerts(body, query) {
    cards.forEach(card => {
      const cardBody = card.getAttribute('data-body');
      const text = card.textContent.toLowerCase();

      const bodyMatch = (body === 'all' || cardBody === body);
      const queryMatch = (!query || text.includes(query));

      card.style.display = (bodyMatch && queryMatch) ? 'flex' : 'none';
    });
  }
}

window.filterCertBody = function(bodyName) {
  const targetPill = document.querySelector(`.cert-pill[data-body="${bodyName}"]`);
  if (targetPill) {
    targetPill.click();
    targetPill.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
};

/* ==========================================================================
   6. REVIEWS SLIDER
   ========================================================================== */
function initReviewSlider() {
  const track = document.getElementById('testimonialTrack');
  const prevBtn = document.getElementById('prevReview');
  const nextBtn = document.getElementById('nextReview');
  if (!track || !prevBtn || !nextBtn) return;

  const cards = track.querySelectorAll('.review-item-card');
  let currentIndex = 0;

  function update() {
    const cardWidth = cards[0].offsetWidth;
    const gap = 32;
    const max = cards.length - (window.innerWidth > 1024 ? 2 : 1);
    if (currentIndex < 0) currentIndex = 0;
    if (currentIndex > max) currentIndex = max;

    track.style.transform = `translateX(-${currentIndex * (cardWidth + gap)}px)`;
  }

  prevBtn.addEventListener('click', () => { currentIndex--; update(); });
  nextBtn.addEventListener('click', () => {
    const max = cards.length - (window.innerWidth > 1024 ? 2 : 1);
    currentIndex = (currentIndex >= max) ? 0 : currentIndex + 1;
    update();
  });

  window.addEventListener('resize', update);
}

/* ==========================================================================
   7. STICKY HEADER SCROLL SHADOW
   ========================================================================== */
function initStickyHeader() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.4)';
    } else {
      header.style.boxShadow = 'none';
    }
  });
}

/* ==========================================================================
   8. MOBILE NAVIGATION
   ========================================================================== */
function initMobileNav() {
  const btn = document.getElementById('mobileHamburger');
  const links = document.getElementById('megaNavList');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    links.classList.toggle('mobile-open');
  });

  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('mobile-open'));
  });
}

/* ==========================================================================
   9. FORM SUBMISSION & SERVICE SELECTOR
   ========================================================================== */
window.handleFormSubmit = function(e) {
  e.preventDefault();
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');
  const submitBtn = document.getElementById('submitBtn');
  if (!form || !feedback) return;

  const name = document.getElementById('fullName').value.trim();
  const email = document.getElementById('contactEmail').value.trim();
  const phone = document.getElementById('contactPhone').value.trim();
  const service = document.getElementById('serviceInterest').value;

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span>Transmitting Request...</span>';

  setTimeout(() => {
    feedback.className = 'form-alert-feedback success';
    feedback.innerHTML = `
      <strong>[✓] CONSULTATION SCHEDULED:</strong> Thank you, <strong>${name}</strong>. Your request for <em>${service}</em> has been securely logged. Our senior advisor will connect via phone (<strong>${phone}</strong>) and email (<strong>${email}</strong>) within 24 hours.
    `;
    feedback.classList.remove('hidden');

    submitBtn.disabled = false;
    submitBtn.innerHTML = '<span>Request Dispatched Successfully ↗</span>';
  }, 750);
};

window.selectServiceInContact = function(serviceVal) {
  const select = document.getElementById('serviceInterest');
  if (select) {
    let matched = false;
    for (let i = 0; i < select.options.length; i++) {
      if (select.options[i].text.toLowerCase().includes(serviceVal.toLowerCase()) || 
          serviceVal.toLowerCase().includes(select.options[i].value.toLowerCase())) {
        select.selectedIndex = i;
        matched = true;
        break;
      }
    }
    if (!matched) {
      // Add custom option if not already in list
      const newOpt = new Option(serviceVal, serviceVal, true, true);
      select.add(newOpt);
    }
  }

  // Smooth scroll to form
  const contactSec = document.getElementById('contact');
  if (contactSec) {
    contactSec.scrollIntoView({ behavior: 'smooth' });
  }
};

/* ==========================================================================
   SCROLL REVEAL & PROCESS STEPPER ANIMATIONS (NORD & ADRIEN QUÉCHON)
   ========================================================================== */
window.activateProcessStep = function(index) {
  const stepItems = document.querySelectorAll(".process-step-item");
  stepItems.forEach((item, idx) => {
    if (idx === index) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
};

function initScrollReveal() {
  const targets = document.querySelectorAll(".reveal-on-scroll, .reveal-blur-text, .section-main-heading, .featured-case-card, .service-item-card, .faq-item, .contact-card-box, .cert-box-card, .review-item-card");
  
  if (!("IntersectionObserver" in window)) {
    targets.forEach(el => el.classList.add("is-revealed"));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-revealed");
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0,
    rootMargin: "0px 0px -20px 0px"
  });

  targets.forEach(el => {
    el.classList.add("reveal-blur-text");
    observer.observe(el);
  });
}

/* ==========================================================================
   PARALLAX SCROLLING EFFECT
   ========================================================================== */
function initParallax() {
  const parallaxItems = document.querySelectorAll('.parallax-layer, [data-parallax]');
  if (!parallaxItems.length) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        parallaxItems.forEach(item => {
          const speed = parseFloat(item.getAttribute('data-parallax-speed') || '0.08');
          const offset = -(scrolled * speed);
          item.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

window.toggleFaq = function(index) {
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item, idx) => {
    const btn = item.querySelector(".faq-toggle-btn");
    if (idx === index) {
      const isAlreadyActive = item.classList.contains("active");
      if (isAlreadyActive) {
        item.classList.remove("active");
        if (btn) btn.textContent = "+";
      } else {
        item.classList.add("active");
        if (btn) btn.textContent = "✕";
      }
    } else {
      item.classList.remove("active");
      if (btn) btn.textContent = "+";
    }
  });
};

/* ==========================================================================
   10. NAV MEGA-MENU & SERVICES TABS (ASSURANCE, GOVERNANCE, MSSP, TABS)
   ========================================================================== */
window.toggleNavDropdown = function(btn, event) {
  if (event) {
    event.stopPropagation();
  }
  const parent = btn.closest('.has-megamenu');
  if (!parent) return;

  const isOpen = parent.classList.contains('open');

  // Close all other dropdowns
  document.querySelectorAll('.has-megamenu').forEach(item => {
    if (item !== parent) {
      item.classList.remove('open');
      const trigger = item.querySelector('.nav-trigger-btn');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    }
  });

  if (isOpen) {
    parent.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  } else {
    parent.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
  }
};

document.addEventListener('click', (e) => {
  if (!e.target.closest('.has-megamenu')) {
    document.querySelectorAll('.has-megamenu').forEach(item => {
      item.classList.remove('open');
      const trigger = item.querySelector('.nav-trigger-btn');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });
  }
});

window.switchServiceCategory = function(cat) {
  const tabs = document.querySelectorAll('.srv-tab');
  tabs.forEach(tab => {
    if (tab.getAttribute('data-tab') === cat) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  const cards = document.querySelectorAll('.service-item-card[data-service-group]');
  cards.forEach(card => {
    const group = card.getAttribute('data-service-group');
    if (group === cat) {
      card.style.display = 'flex';
      card.style.opacity = '0';
      card.style.transform = 'translateY(10px)';
      requestAnimationFrame(() => {
        card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      });
    } else {
      card.style.display = 'none';
    }
  });
};

/* ==========================================================================
   11. ALLOY HORIZONTAL EXPANDING ACCORDION (SCREENSHOT 4)
   ========================================================================== */
function initAlloyAccordion() {
  const panels = document.querySelectorAll('.alloy-panel');
  panels.forEach((panel, idx) => {
    panel.addEventListener('click', () => {
      toggleAlloyPanel(idx);
    });
  });
}

window.toggleAlloyPanel = function(index) {
  const panels = document.querySelectorAll('.alloy-panel');
  panels.forEach((p, i) => {
    const icon = p.querySelector('.alloy-toggle-icon');
    if (i === index) {
      p.classList.add('active');
      if (icon) icon.textContent = '✕';
    } else {
      p.classList.remove('active');
      if (icon) icon.textContent = '+';
    }
  });
};

/* ==========================================================================
   12. KATOM CONTACT FORM SUBMISSION HANDLER
   ========================================================================== */
window.handleKatomSubmit = function(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  const fb = form.querySelector('[id$="Feedback"]');
  if (btn) {
    btn.disabled = true;
    const oldText = btn.innerHTML;
    btn.innerHTML = '<span>Transmitting...</span>';
    setTimeout(() => {
      btn.innerHTML = '<span>Transmitted Successfully ✓</span>';
      btn.style.background = '#22c55e';
      btn.style.color = '#ffffff';
      if (fb) {
        fb.style.display = 'block';
        fb.style.background = 'rgba(34, 197, 94, 0.15)';
        fb.style.border = '1px solid rgba(34, 197, 94, 0.4)';
        fb.style.color = '#4ade80';
        fb.textContent = 'Transmission acknowledged. A CYBERENTITYZ specialist will respond within 24 hours.';
      }
      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = oldText;
        btn.style.background = '';
        btn.style.color = '';
      }, 5000);
    }, 700);
  }
};

/* ==========================================================================
   13. DOTMARK INTERACTIVE HALFTONE CANVAS (DOTMARK.FRAMER.WEBSITE SPECIFICATION)
   Fluid pointer swirl physics, spring-back restoration, and organic kinetic drift
   ========================================================================== */
function initDotmarkFooter() {
  const canvas = document.getElementById('dotmarkFooterCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let dpr = window.devicePixelRatio || 1;

  // Interaction coordinates
  let mouse = { x: -9999, y: -9999, active: false, radius: 140 };

  function sampleWordmark() {
    const parent = canvas.parentElement;
    width = parent ? parent.offsetWidth : window.innerWidth;
    // Keep generous proportion for monumental display
    height = Math.max(220, Math.min(380, width * 0.22));

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Offscreen canvas to rasterize "CYBERENTITYZ"
    const offCanvas = document.createElement('canvas');
    offCanvas.width = width;
    offCanvas.height = height;
    const offCtx = offCanvas.getContext('2d');

    offCtx.fillStyle = '#000000';
    offCtx.fillRect(0, 0, width, height);

    // Calculate font size to fit width tightly
    const text = 'CYBERENTITYZ';
    let fontSize = Math.floor(width / 7.2);
    if (fontSize > 180) fontSize = 180;
    if (fontSize < 48) fontSize = 48;

    offCtx.font = `900 ${fontSize}px "Instrument Sans", -apple-system, BlinkMacSystemFont, sans-serif`;
    offCtx.fillStyle = '#ffffff';
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';
    offCtx.letterSpacing = '-0.03em';
    offCtx.fillText(text, width / 2, height / 2);

    // Sample pixel grid
    const imgData = offCtx.getImageData(0, 0, width, height).data;
    particles = [];

    // Adaptive step based on viewport width
    const step = width < 768 ? 5 : 7;
    const baseRadius = width < 768 ? 2.0 : 2.8;

    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const index = (y * width + x) * 4;
        const brightness = imgData[index]; // White text = 255

        if (brightness > 120) {
          const norm = brightness / 255;
          particles.push({
            x: x,
            y: y,
            ox: x,
            oy: y,
            vx: 0,
            vy: 0,
            radius: baseRadius * norm,
            color: '#ECE8DF',
            waveOffset: Math.random() * Math.PI * 2
          });
        }
      }
    }
  }

  sampleWordmark();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(sampleWordmark, 200);
  });

  // Track cursor position relative to canvas
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
    mouse.active = false;
  });

  // Touch support for mobile interaction
  canvas.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.touches[0].clientX - rect.left;
      mouse.y = e.touches[0].clientY - rect.top;
      mouse.active = true;
    }
  }, { passive: true });

  canvas.addEventListener('touchend', () => {
    mouse.active = false;
    mouse.x = -9999;
    mouse.y = -9999;
  });

  let time = 0;

  function animate() {
    time += 0.02;

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = '#ECE8DF';

    const pLen = particles.length;
    for (let i = 0; i < pLen; i++) {
      const p = particles[i];

      // Distance to pointer
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.hypot(dx, dy);

      if (dist < mouse.radius && mouse.active) {
        // Fluid vortex swirl force (Dotmark trademark behavior)
        const angle = Math.atan2(dy, dx);
        const swirlAngle = angle + Math.PI * 0.45; // Tangential vortex
        const force = (1 - dist / mouse.radius);

        p.vx -= Math.cos(swirlAngle) * force * 4.2;
        p.vy -= Math.sin(swirlAngle) * force * 4.2;

        // Subtle radial repulsion
        p.vx -= Math.cos(angle) * force * 2.5;
        p.vy -= Math.sin(angle) * force * 2.5;
      }

      // Idle subtle kinetic breath when mouse is far
      if (!mouse.active) {
        const drift = Math.sin(time + p.waveOffset) * 0.15;
        p.vx += drift * 0.02;
      }

      // Spring-back restoration to original anchor
      const springX = (p.ox - p.x) * 0.085;
      const springY = (p.oy - p.y) * 0.085;
      p.vx += springX;
      p.vy += springY;

      // Friction / damping
      p.vx *= 0.82;
      p.vy *= 0.82;

      p.x += p.vx;
      p.y += p.vy;

      // Render dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

/* ==========================================================================
   14. NUMBER COUNT-UP ANIMATION (0 TO TARGET ANIMATION FOR ALL METRICS)
   ========================================================================== */
function initCountUpAnimations() {
  const statElements = document.querySelectorAll(
    ".framer-stat-num, .bento-stat-num, .trustwall-card-stat-num, .metric-val, .progress-big-num, [data-count]"
  );
  if (!statElements.length) return;

  statElements.forEach(el => {
    if (!el.dataset.targetVal) {
      el.dataset.targetVal = el.textContent.trim();
    }
  });

  function startCountUpObserver() {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
          entry.target.dataset.counted = "true";
          animateValue(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    statElements.forEach(el => observer.observe(el));

    // Also immediately trigger hero stats when preloader ends
    document.querySelectorAll(".framer-stat-num").forEach(el => {
      if (!el.dataset.counted) {
        el.dataset.counted = "true";
        animateValue(el);
      }
    });
  }

  // Ensure count up begins AFTER preloader is dismissed so user clearly sees 0 -> target
  const preloader = document.getElementById("preloader");
  if (preloader) {
    const timer = setInterval(() => {
      if (preloader.classList.contains("loaded") || preloader.style.display === "none" || preloader.style.opacity === "0") {
        clearInterval(timer);
        setTimeout(startCountUpObserver, 400);
      }
    }, 80);
    setTimeout(startCountUpObserver, 2200);
  } else {
    setTimeout(startCountUpObserver, 200);
  }

  function animateValue(el) {
    const rawText = el.dataset.targetVal || el.textContent.trim();
    const match = rawText.match(/^([^\d.]*)(\d+(?:\.\d+)?)(.*)$/);
    if (!match) return;

    const prefix = match[1] || "";
    const target = parseFloat(match[2]);
    const suffix = match[3] || "";
    const isDecimal = match[2].includes(".");
    const duration = 2000;
    const startTime = performance.now();

    el.textContent = prefix + "0" + suffix;

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.max(0, Math.min(1, elapsed / duration));
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = (target * ease);

      el.textContent = prefix + (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = rawText;
      }
    }

    requestAnimationFrame(update);
  }
}

/* ==========================================================================
   15. 3D HALFTONE CYBER GLOBE & INTERACTIVE LOCATION MAP (SCREENSHOT 5)
   Source: indigo-customer-954293.framer.app
   ========================================================================== */
function initCyberGlobe() {
  const canvas = document.getElementById('cyberGlobeCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  const dpr = window.devicePixelRatio || 1;

  function resize() {
    const container = canvas.parentElement;
    width = container ? Math.min(container.offsetWidth, 680) : 580;
    height = width;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  }
  resize();
  window.addEventListener('resize', resize);

  // Generate sphere points (Fibonacci Dotted Sphere)
  const numPoints = 650;
  const sphereRadius = 190;
  const points = [];
  const goldenRatio = (1 + Math.sqrt(5)) / 2;

  for (let i = 0; i < numPoints; i++) {
    const theta = 2 * Math.PI * i / goldenRatio;
    const phi = Math.acos(1 - 2 * (i + 0.5) / numPoints);
    points.push({
      x: sphereRadius * Math.sin(phi) * Math.cos(theta),
      y: sphereRadius * Math.sin(phi) * Math.sin(theta),
      z: sphereRadius * Math.cos(phi)
    });
  }

  // Chennai Coordinates (13.0483° N, 80.2497° E) on sphere
  const chennaiLat = 13.0483 * (Math.PI / 180);
  const chennaiLon = 80.2497 * (Math.PI / 180);
  const chennaiTarget = {
    x: sphereRadius * Math.cos(chennaiLat) * Math.sin(chennaiLon),
    y: -sphereRadius * Math.sin(chennaiLat),
    z: sphereRadius * Math.cos(chennaiLat) * Math.cos(chennaiLon)
  };

  let rotX = 0.25;
  let rotY = 0;
  let isDragging = false;
  let prevMouseX = 0;
  let prevMouseY = 0;

  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    prevMouseX = e.clientX;
    prevMouseY = e.clientY;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - prevMouseX;
    const deltaY = e.clientY - prevMouseY;
    rotY += deltaX * 0.006;
    rotX += deltaY * 0.006;
    prevMouseX = e.clientX;
    prevMouseY = e.clientY;
  });

  window.addEventListener('mouseup', () => { isDragging = false; });

  // Touch handlers
  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      isDragging = true;
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging || !e.touches.length) return;
    const deltaX = e.touches[0].clientX - prevMouseX;
    const deltaY = e.touches[0].clientY - prevMouseY;
    rotY += deltaX * 0.006;
    rotX += deltaY * 0.006;
    prevMouseX = e.touches[0].clientX;
    prevMouseY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchend', () => { isDragging = false; });

  const chennaiPin = document.getElementById('chennaiPinCard');
  const chennaiPulse = document.getElementById('chennaiPulseOrigin');

  function render() {
    if (!isDragging) {
      rotY += 0.004; // Auto rotate
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;
    const scale = width / 520;

    // 3D rotation matrix calculation
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);

    // Render wireframe ring
    ctx.beginPath();
    ctx.arc(cx, cy, sphereRadius * scale, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Rotate and project points
    for (let i = 0; i < points.length; i++) {
      const p = points[i];

      // Rotate Y
      const x1 = p.x * cosY + p.z * sinY;
      const z1 = -p.x * sinY + p.z * cosY;

      // Rotate X
      const y2 = p.y * cosX - z1 * sinX;
      const z2 = p.y * sinX + z1 * cosX;

      const px = cx + x1 * scale;
      const py = cy + y2 * scale;

      // Depth shading: points facing front are brighter and larger
      const depth = (z2 + sphereRadius) / (sphereRadius * 2);
      if (depth > 0) {
        ctx.beginPath();
        const ptRadius = Math.max(0.8, depth * 2.6);
        ctx.arc(px, py, ptRadius, 0, Math.PI * 2);
        ctx.fillStyle = depth > 0.5 
          ? `rgba(236, 232, 223, ${depth * 0.9})` 
          : `rgba(255, 255, 255, ${depth * 0.35})`;
        ctx.fill();
      }
    }

    // Project Chennai location marker
    const cX1 = chennaiTarget.x * cosY + chennaiTarget.z * sinY;
    const cZ1 = -chennaiTarget.x * sinY + chennaiTarget.z * cosY;
    const cY2 = chennaiTarget.y * cosX - cZ1 * sinX;
    const cZ2 = chennaiTarget.y * sinX + cZ1 * cosX;

    const chennaiPx = cx + cX1 * scale;
    const chennaiPy = cy + cY2 * scale;

    if (chennaiPin && chennaiPulse) {
      if (cZ2 > -40) {
        chennaiPin.style.opacity = '1';
        chennaiPin.style.pointerEvents = 'auto';
        chennaiPulse.style.opacity = '1';

        // Position pin card near Chennai on canvas
        chennaiPin.style.left = `${Math.min(width - 240, Math.max(20, chennaiPx + 20))}px`;
        chennaiPin.style.top = `${Math.min(height - 80, Math.max(30, chennaiPy - 40))}px`;

        chennaiPulse.style.left = `${chennaiPx}px`;
        chennaiPulse.style.top = `${chennaiPy}px`;
      } else {
        // Obscured on far side of globe
        chennaiPin.style.opacity = '0.25';
        chennaiPulse.style.opacity = '0.25';
      }
    }

    ctx.restore();
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

/* Toggle Between 3D Cyber Globe & Embedded Map */
window.switchGlobeView = function(view) {
  const globeWrapper = document.getElementById('globeStageWrapper');
  const mapPanel = document.getElementById('revealedLocationMap');
  const btn3D = document.getElementById('btnToggle3DGlobe');
  const btnMap = document.getElementById('btnToggleFlatMap');

  if (view === 'map') {
    if (globeWrapper) globeWrapper.style.display = 'none';
    if (mapPanel) mapPanel.style.display = 'block';
    if (btn3D) btn3D.classList.remove('active');
    if (btnMap) btnMap.classList.add('active');
  } else {
    if (globeWrapper) globeWrapper.style.display = 'flex';
    if (mapPanel) mapPanel.style.display = 'none';
    if (btn3D) btn3D.classList.add('active');
    if (btnMap) btnMap.classList.remove('active');
  }
};

window.openEmbeddedLocationMap = function() {
  window.switchGlobeView('map');
  const mapPanel = document.getElementById('revealedLocationMap');
  if (mapPanel) {
    mapPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};




/* ==========================================================================
   CASCADE SERVICES SLIDER (MATCHING TESTIMONIALFLOWPRO.FRAMER.WEBSITE)
   ========================================================================== */
function initServicesCascade() {
  const cards = document.querySelectorAll('.service-cascade-card');
  const dashes = document.querySelectorAll('.progress-dash');
  if (!cards.length) return;

  let activeIndex = 0;
  const total = cards.length;

  const serviceData = [
    {
      index: '01 / 06',
      group: 'Academic & Student Cohorts',
      title: 'Cybersecurity Workshops',
      desc: 'Engaging hands-on workshops covering ethical hacking, network security, web vulnerabilities, and real-time cyber threat demonstrations for students.',
      audience: 'Engineering & College Students',
      format: 'Live Offensive & Defensive Labs'
    },
    {
      index: '02 / 06',
      group: 'Academic Institutions & Colleges',
      title: 'Industrial Visits (IV)',
      desc: 'Immersive IV programs where students experience live cybersecurity environments, SOC operations, and enterprise security infrastructure.',
      audience: 'Colleges & Universities',
      format: 'Live Enterprise SOC & SIEM Ops'
    },
    {
      index: '03 / 06',
      group: 'Career Development & Experience',
      title: 'Internship Programs',
      desc: 'Structured internship opportunities in ethical hacking, digital forensics, and security operations — building real industry experience.',
      audience: 'Final-Year Batches & Aspirants',
      format: 'Project-Driven Live Vulnerability Hunting'
    },
    {
      index: '04 / 06',
      group: 'Global Placement Support',
      title: 'Career Guidance & Mocks',
      desc: 'Resume preparation with ATS optimization, career path planning, global job placement guidance, and mock technical interviews.',
      audience: 'Global Aspirants (200+ Guided)',
      format: 'OffSec / CompTIA Technical Mocks & Resume Tuning'
    },
    {
      index: '05 / 06',
      group: 'Institutional Partnerships',
      title: 'College Lab Setup Support',
      desc: 'Complete support for establishing cybersecurity labs — hardware, software, network architecture design, and ongoing technical consultation.',
      audience: 'Colleges with MOUs & Academic Hubs',
      format: 'Air-Gapped Ranges & Sandbox Deployment'
    },
    {
      index: '06 / 06',
      group: 'Faculty Development',
      title: 'Faculty Awareness Programs',
      desc: 'Cybersecurity awareness and upskilling programs tailored for faculty members to stay current with evolving threats and technologies.',
      audience: 'Professors & Academic Deans',
      format: 'Threat Landscape & Curriculum Modernization'
    }
  ];

  function updateCascade(newIndex) {
    activeIndex = (newIndex + total) % total;

    cards.forEach((card, idx) => {
      const offset = (idx - activeIndex + total) % total;
      if (offset === 0) {
        card.style.transform = 'translateX(0px) scale(1)';
        card.style.zIndex = '10';
        card.style.opacity = '1';
        card.style.pointerEvents = 'auto';
        card.style.boxShadow = '0 25px 50px -10px rgba(0,0,0,0.5), 0 0 30px rgba(224, 90, 0, 0.15)';
        card.style.borderColor = 'rgba(224, 90, 0, 0.45)';
        card.classList.add('active');
      } else if (offset === 1) {
        card.style.transform = 'translateX(55px) scale(0.92)';
        card.style.zIndex = '9';
        card.style.opacity = '0.72';
        card.style.pointerEvents = 'auto';
        card.style.cursor = 'pointer';
        card.style.boxShadow = '0 15px 35px rgba(0,0,0,0.35)';
        card.style.borderColor = 'rgba(255, 255, 255, 0.08)';
        card.classList.remove('active');
      } else if (offset === 2) {
        card.style.transform = 'translateX(110px) scale(0.84)';
        card.style.zIndex = '8';
        card.style.opacity = '0.4';
        card.style.pointerEvents = 'auto';
        card.style.cursor = 'pointer';
        card.style.boxShadow = '0 10px 25px rgba(0,0,0,0.25)';
        card.style.borderColor = 'rgba(255, 255, 255, 0.05)';
        card.classList.remove('active');
      } else {
        card.style.transform = 'translateX(150px) scale(0.76)';
        card.style.zIndex = '5';
        card.style.opacity = '0';
        card.style.pointerEvents = 'none';
        card.classList.remove('active');
      }
    });

    // Update dashes
    dashes.forEach((dash, idx) => {
      dash.classList.toggle('active', idx === activeIndex);
    });

    // Update Left Column Meta Details
    const data = serviceData[activeIndex];
    const elIdx = document.getElementById('activeMetaIndex');
    const elGrp = document.getElementById('activeMetaGroup');
    const elTtl = document.getElementById('activeMetaTitle');
    const elDsc = document.getElementById('activeMetaDesc');
    const elAud = document.getElementById('activeMetaAudience');
    const elFmt = document.getElementById('activeMetaFormat');

    if (elIdx) elIdx.textContent = data.index;
    if (elGrp) elGrp.textContent = data.group;
    if (elTtl) elTtl.textContent = data.title;
    if (elDsc) elDsc.textContent = data.desc;
    if (elAud) elAud.textContent = data.audience;
    if (elFmt) elFmt.textContent = data.format;
  }

  window.goToServiceCard = function(idx) {
    updateCascade(idx);
  };
  window.nextServiceCard = function() {
    updateCascade(activeIndex + 1);
  };
  window.prevServiceCard = function() {
    updateCascade(activeIndex - 1);
  };

  updateCascade(0);
}
