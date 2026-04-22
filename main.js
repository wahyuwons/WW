/**
 * ═══════════════════════════════════════════════════════════════
 *  WAHYUWONO PORTFOLIO — main.js
 *  GSAP 3 + ScrollTrigger + ScrollToPlugin
 * ═══════════════════════════════════════════════════════════════
 */

/* ─────────────────────────────────────────────────────────────
   REGISTER GSAP PLUGINS
───────────────────────────────────────────────────────────── */
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/* ─────────────────────────────────────────────────────────────
   UTILITY
───────────────────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* Ease library shortcuts */
const EASE_OUT  = 'power3.out';
const EASE_EXPO = 'expo.out';
const EASE_BACK = 'back.out(1.5)';

/* ─────────────────────────────────────────────────────────────
   CANVAS PARTICLE BACKGROUND
───────────────────────────────────────────────────────────── */
function initCanvas() {
  const canvas = $('#hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], animId;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x  = Math.random() * W;
      this.y  = init ? Math.random() * H : H + 20;
      this.vx = (Math.random() - .5) * .18;
      this.vy = -(Math.random() * .4 + .1);
      this.r  = Math.random() * 1.2 + .3;
      this.alpha = Math.random() * .35 + .05;
      this.life = 1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life -= .0012;
      if (this.life <= 0 || this.y < -20) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(233,196,106,${this.alpha * this.life})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 80; i++) particles.push(new Particle());

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    animId = requestAnimationFrame(loop);
  }
  loop();
}

/* ─────────────────────────────────────────────────────────────
   LOADER
───────────────────────────────────────────────────────────── */
function initLoader() {
  const loader  = $('#loader');
  const numEl   = $('#loader-num');
  const bar     = $('#loader-bar');
  const content = $('body');

  // Prevent scroll during load
  document.body.style.overflow = 'hidden';

  const obj = { val: 0 };
  const tl = gsap.timeline({
    onComplete: () => {
      document.body.style.overflow = '';
      heroEntrance();
    }
  });

  // Count up to 100
  tl.to(obj, {
    val: 100,
    duration: 1.6,
    ease: 'power2.inOut',
    onUpdate() {
      const v = Math.round(obj.val);
      numEl.textContent = v;
      bar.style.width = v + '%';
    }
  });

  // Slide loader up & fade out
  tl.to(loader, {
    yPercent: -100,
    duration: .9,
    ease: EASE_EXPO,
    delay: .1
  });

  tl.set(loader, { display: 'none' });
}

/* ─────────────────────────────────────────────────────────────
   HERO ENTRANCE
───────────────────────────────────────────────────────────── */
function heroEntrance() {
  const words  = $$('[data-hero-line] .hero-word');
  const els    = $$('[data-hero-el]');
  const cards  = $('[data-hero-cards]');

  const tl = gsap.timeline({ defaults: { ease: EASE_EXPO } });

  // Staggered word reveal (slide up from clip)
  tl.to(words, {
    y: 0,
    duration: 1.1,
    stagger: .08,
  }, 0);

  // Badge, desc, actions
  tl.to(els, {
    opacity: 1,
    y: 0,
    duration: .8,
    stagger: .12,
    ease: EASE_OUT,
  }, .3);

  // Cards slide in from right
  if (cards) {
    tl.from(cards, {
      x: 60,
      opacity: 0,
      duration: 1,
      ease: EASE_EXPO,
    }, .15);
    tl.to(cards, { opacity: 1, duration: .01 }, .15);
    // Stagger individual cards
    tl.from($$('.hcard'), {
      y: 30,
      opacity: 0,
      duration: .7,
      stagger: .1,
      ease: EASE_OUT,
    }, .3);
  }

  // Scroll hint
  tl.to('[data-hero-el]:last-child', { opacity: 1, duration: .5 }, 1.2);

  // Counter in hero cards
  tl.add(() => {
    $$('.hcard-num[data-count]').forEach(el => {
      const target = parseInt(el.dataset.count);
      gsap.to({ v: 0 }, {
        v: target,
        duration: 1.2,
        ease: 'power2.out',
        onUpdate() { el.textContent = Math.round(this.targets()[0].v); }
      });
    });
  }, .8);
}

/* ─────────────────────────────────────────────────────────────
   CUSTOM CURSOR
───────────────────────────────────────────────────────────── */
function initCursor() {
  const dot  = $('#cursor-dot');
  const ring = $('#cursor-ring');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;
  let raf;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    gsap.to(dot, { x: mx, y: my, duration: .08, ease: 'none' });
  });

  function followRing() {
    rx += (mx - rx) * .14;
    ry += (my - ry) * .14;
    gsap.set(ring, { x: rx, y: ry });
    raf = requestAnimationFrame(followRing);
  }
  followRing();

  // Hover states
  const hoverEls = $$('a, button, .skill-item, .cert-card, .hcard, .bento-card, .exp-tab, .clink, .cta-btn, .nav-hire, [data-magnetic]');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // Text hover
  $$('p, li').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-text'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-text'));
  });
}

/* ─────────────────────────────────────────────────────────────
   MAGNETIC BUTTONS
───────────────────────────────────────────────────────────── */
function initMagnetic() {
  $$('[data-magnetic]').forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) * .28;
      const dy = (e.clientY - cy) * .28;
      gsap.to(el, { x: dx, y: dy, duration: .4, ease: EASE_OUT });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: .5, ease: EASE_BACK });
    });
  });
}

/* ─────────────────────────────────────────────────────────────
   NAV — scroll class + smooth anchor
───────────────────────────────────────────────────────────── */
function initNav() {
  const nav = $('#nav');

  ScrollTrigger.create({
    start: 80,
    onEnter:       () => nav.classList.add('scrolled'),
    onLeaveBack:   () => nav.classList.remove('scrolled'),
  });

  // Smooth scroll for all anchors
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = $(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      gsap.to(window, {
        scrollTo: { y: target, offsetY: 70 },
        duration: 1.1,
        ease: EASE_EXPO,
      });
      // Close mobile nav if open
      closeMobileNav();
    });
  });
}

/* ─────────────────────────────────────────────────────────────
   MOBILE NAV
───────────────────────────────────────────────────────────── */
function closeMobileNav() {
  const ham = $('#hamburger');
  const mob = $('#mob-overlay');
  if (!ham || !mob) return;
  ham.classList.remove('open');
  mob.classList.remove('open');
  document.body.style.overflow = '';
}

function initMobileNav() {
  const ham = $('#hamburger');
  const mob = $('#mob-overlay');
  if (!ham || !mob) return;

  const links = $$('.mob-link', mob);

  ham.addEventListener('click', () => {
    const isOpen = ham.classList.toggle('open');
    mob.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';

    if (isOpen) {
      gsap.from(links, {
        y: 40,
        opacity: 0,
        duration: .6,
        stagger: .08,
        ease: EASE_EXPO,
        delay: .35,
      });
    }
  });

  links.forEach(l => l.addEventListener('click', closeMobileNav));
}

/* ─────────────────────────────────────────────────────────────
   MARQUEE — GSAP driven (no CSS animation)
───────────────────────────────────────────────────────────── */
function initMarquee() {
  const track = $('#marquee-track');
  if (!track) return;

  const inner = track.querySelector('.marquee-inner');
  if (!inner) return;
  const totalW = inner.offsetWidth;

  gsap.to(track, {
    x: -totalW,
    duration: 28,
    ease: 'none',
    repeat: -1,
    modifiers: {
      x: x => (parseFloat(x) % totalW) + 'px',
    },
  });
}

/* ─────────────────────────────────────────────────────────────
   SECTION TITLE — character split animation
───────────────────────────────────────────────────────────── */
function initSplitTitles() {
  $$('[data-split-title]').forEach(el => {
    // Split each text node into char spans
    const html = el.innerHTML;
    const wrapped = html.replace(/(?<!<[^>]*)([^\s<>])/g, match => {
      // Only wrap actual characters, not HTML tags
      return `<span class="char">${match}</span>`;
    });
    el.innerHTML = wrapped;

    const chars = $$('.char', el);
    gsap.set(chars, { y: '110%', opacity: 0 });

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(chars, {
          y: 0,
          opacity: 1,
          duration: .75,
          stagger: .022,
          ease: EASE_EXPO,
        });
      },
    });
  });
}

/* ─────────────────────────────────────────────────────────────
   SCROLL REVEALS — standard elements
───────────────────────────────────────────────────────────── */
function initReveals() {
  // Generic reveals
  $$('[data-reveal]').forEach((el, i) => {
    const delay = parseFloat(el.dataset.delay || 0) * .1;
    gsap.from(el, {
      y: 40,
      opacity: 0,
      duration: .85,
      ease: EASE_EXPO,
      delay,
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        once: true,
      },
    });
  });

  // Left reveals
  $$('[data-reveal-left]').forEach(el => {
    gsap.from(el, {
      x: -50,
      opacity: 0,
      duration: .9,
      ease: EASE_EXPO,
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
    });
  });

  // Right reveals
  $$('[data-reveal-right]').forEach(el => {
    gsap.from(el, {
      x: 50,
      opacity: 0,
      duration: .9,
      ease: EASE_EXPO,
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
    });
  });
}

/* ─────────────────────────────────────────────────────────────
   ABOUT STAT COUNTERS
───────────────────────────────────────────────────────────── */
function initCounters() {
  $$('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    let triggered = false;

    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter() {
        if (triggered) return;
        triggered = true;
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 1.4,
          ease: 'power2.out',
          onUpdate() { el.textContent = Math.round(obj.v); },
        });
      },
    });
  });
}

/* ─────────────────────────────────────────────────────────────
   SKILL BARS
───────────────────────────────────────────────────────────── */
function initSkillBars() {
  const container = $('.skill-list') || $('.about-right');
  if (!container) return;

  ScrollTrigger.create({
    trigger: container,
    start: 'top 80%',
    once: true,
    onEnter() {
      $$('.skill-fill').forEach((bar, i) => {
        const pct = bar.dataset.pct || '0';
        gsap.to(bar, {
          width: pct + '%',
          duration: 1.1,
          ease: EASE_EXPO,
          delay: i * .07,
        });
      });
    },
  });
}

/* ─────────────────────────────────────────────────────────────
   SKILL ITEMS STAGGER
───────────────────────────────────────────────────────────── */
function initSkillItemsReveal() {
  gsap.from($$('.skill-item'), {
    x: 30,
    opacity: 0,
    duration: .65,
    stagger: .06,
    ease: EASE_OUT,
    scrollTrigger: {
      trigger: '.skill-list',
      start: 'top 82%',
      once: true,
    },
  });
}

/* ─────────────────────────────────────────────────────────────
   EXPERIENCE TABS
───────────────────────────────────────────────────────────── */
function initTabs() {
  const tabs      = $$('.exp-tab');
  const panels    = $$('.exp-panel');
  const indicator = $('.tab-indicator');

  function activateTab(tab) {
    const panelId = tab.dataset.tab;
    const panel   = $(`#${panelId}`);

    // Update tabs
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    // Move indicator
    if (indicator) {
      const tabRect    = tab.getBoundingClientRect();
      const navRect    = tab.closest('.exp-nav').getBoundingClientRect();
      const offsetTop  = tabRect.top - navRect.top;
      gsap.to(indicator, {
        top: offsetTop,
        duration: .4,
        ease: EASE_OUT,
      });
    }

    // Swap panels
    panels.forEach(p => p.classList.remove('active'));
    if (panel) {
      panel.classList.add('active');

      // Animate new panel in
      const tl = gsap.timeline();
      tl.from(panel, {
        opacity: 0,
        y: 20,
        duration: .45,
        ease: EASE_OUT,
      });
      tl.from($$('.panel-list li', panel), {
        x: 12,
        opacity: 0,
        duration: .35,
        stagger: .06,
        ease: EASE_OUT,
      }, .15);
      tl.from($$('.ptag', panel), {
        scale: .85,
        opacity: 0,
        duration: .3,
        stagger: .04,
        ease: EASE_BACK,
      }, .25);
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => activateTab(tab));
  });

  // Trigger initial indicator position
  const activeTab = $('.exp-tab.active');
  if (activeTab && indicator) {
    const navEl  = activeTab.closest('.exp-nav');
    if (navEl) {
      const tabRect = activeTab.getBoundingClientRect();
      const navRect = navEl.getBoundingClientRect();
      gsap.set(indicator, { top: tabRect.top - navRect.top });
    }
  }
}

/* ─────────────────────────────────────────────────────────────
   BENTO GRID — staggered
───────────────────────────────────────────────────────────── */
function initBento() {
  const cards = $$('[data-bento]');
  if (!cards.length) return;

  gsap.from(cards, {
    y: 50,
    opacity: 0,
    duration: .75,
    stagger: {
      each: .1,
      from: 'start',
    },
    ease: EASE_EXPO,
    scrollTrigger: {
      trigger: '.bento-grid',
      start: 'top 82%',
      once: true,
    },
  });
}

/* ─────────────────────────────────────────────────────────────
   CERT CARDS — wave stagger
───────────────────────────────────────────────────────────── */
function initCertCards() {
  const cards = $$('[data-cert]');
  if (!cards.length) return;

  gsap.from(cards, {
    y: 40,
    opacity: 0,
    scale: .96,
    duration: .65,
    stagger: .07,
    ease: EASE_EXPO,
    scrollTrigger: {
      trigger: '.cert-grid',
      start: 'top 84%',
      once: true,
    },
  });
}

/* ─────────────────────────────────────────────────────────────
   GPA RING
───────────────────────────────────────────────────────────── */
function initGPARing() {
  const progress = $('.gpa-progress');
  if (!progress) return;

  const pct = parseFloat(progress.dataset.pct || 0);
  const circumference = 2 * Math.PI * 50; // r=50

  gsap.set(progress, { strokeDasharray: circumference, strokeDashoffset: circumference });

  ScrollTrigger.create({
    trigger: '.edu-card',
    start: 'top 80%',
    once: true,
    onEnter() {
      const offset = circumference - (pct / 100) * circumference;
      gsap.to(progress, {
        strokeDashoffset: offset,
        duration: 1.5,
        ease: EASE_EXPO,
      });
    },
  });
}

/* ─────────────────────────────────────────────────────────────
   PARALLAX HERO ORBS / DEPTH
───────────────────────────────────────────────────────────── */
function initParallax() {
  // Parallax on hero section
  ScrollTrigger.create({
    trigger: '#hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1,
    onUpdate(self) {
      const p = self.progress;
      gsap.set('.hero-content', { y: p * 80 });
      if ($('.hero-cards')) {
        gsap.set('.hero-cards', { y: p * 40 });
      }
    },
  });
}

/* ─────────────────────────────────────────────────────────────
   HORIZONTAL SCROLL HINT — marquee speed on scroll
───────────────────────────────────────────────────────────── */
function initMarqueeScroll() {
  let velocity = 0;
  let lastY = window.scrollY;

  ScrollTrigger.create({
    onUpdate(self) {
      velocity = self.getVelocity() / 200;
      gsap.to('.marquee-track', {
        skewX: Math.min(Math.max(velocity * .3, -4), 4),
        duration: .5,
        ease: EASE_OUT,
        overwrite: true,
      });
    },
  });
}

/* ─────────────────────────────────────────────────────────────
   SECTION ENTRANCE LINES
───────────────────────────────────────────────────────────── */
function initEyebrows() {
  $$('.section-eyebrow').forEach(el => {
    const line = $('.eyebrow-line', el);
    if (!line) return;
    gsap.from(line, {
      scaleX: 0,
      transformOrigin: 'left',
      duration: .7,
      ease: EASE_EXPO,
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        once: true,
      },
    });
  });
}

/* ─────────────────────────────────────────────────────────────
   FOOTER REVEAL
───────────────────────────────────────────────────────────── */
function initFooter() {
  gsap.from('.footer-inner > *', {
    y: 20,
    opacity: 0,
    duration: .65,
    stagger: .1,
    ease: EASE_EXPO,
    scrollTrigger: {
      trigger: '#footer',
      start: 'top 95%',
      once: true,
    },
  });
}

/* ─────────────────────────────────────────────────────────────
   CONTACT CTA — pulsing ring animation
───────────────────────────────────────────────────────────── */
function initContactCTA() {
  const cta = $('.cta-btn');
  if (!cta) return;

  // Floating animation
  gsap.to(cta, {
    y: -5,
    duration: 2,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
    scrollTrigger: {
      trigger: '#contact',
      start: 'top 60%',
      toggleActions: 'play pause resume pause',
    },
  });
}

/* ─────────────────────────────────────────────────────────────
   HERO WORD INIT (ensure y is set before loader)
───────────────────────────────────────────────────────────── */
function initHeroWordState() {
  gsap.set('[data-hero-line] .hero-word', { y: '110%' });
  gsap.set('[data-hero-el]',  { opacity: 0, y: 20 });
  gsap.set('[data-hero-cards]', { opacity: 0 });
  gsap.set('.hero-scroll',    { opacity: 0 });
}

/* ─────────────────────────────────────────────────────────────
   BENTO CARD TILT — 3D mouse effect
───────────────────────────────────────────────────────────── */
function initCardTilt() {
  $$('.bento-card, .hcard, .cert-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const cx = r.width  / 2;
      const cy = r.height / 2;
      const rotX = ((y - cy) / cy) * -6;
      const rotY = ((x - cx) / cx) *  6;
      gsap.to(card, {
        rotationX: rotX,
        rotationY: rotY,
        transformPerspective: 600,
        transformOrigin: 'center center',
        duration: .3,
        ease: EASE_OUT,
        overwrite: true,
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotationX: 0,
        rotationY: 0,
        duration: .6,
        ease: EASE_BACK,
        overwrite: true,
      });
    });
  });
}

/* ─────────────────────────────────────────────────────────────
   SCROLL PROGRESS INDICATOR (thin line at top)
───────────────────────────────────────────────────────────── */
function initScrollProgress() {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position: fixed; top: 0; left: 0; height: 2px;
    background: var(--gold); z-index: 9999;
    width: 0%; pointer-events: none;
    box-shadow: 0 0 8px rgba(233,196,106,.5);
  `;
  document.body.appendChild(bar);

  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate(self) {
      bar.style.width = (self.progress * 100) + '%';
    },
  });
}

/* ─────────────────────────────────────────────────────────────
   ACTIVE NAV HIGHLIGHT
───────────────────────────────────────────────────────────── */
function initActiveNav() {
  const sections = $$('section[id]');
  const navLinks = $$('.nav-link');

  sections.forEach(sec => {
    ScrollTrigger.create({
      trigger: sec,
      start: 'top 55%',
      end: 'bottom 55%',
      onEnter:     () => highlightNav(sec.id),
      onEnterBack: () => highlightNav(sec.id),
    });
  });

  function highlightNav(id) {
    navLinks.forEach(a => {
      const active = a.getAttribute('href') === `#${id}`;
      a.style.color = active ? 'var(--gold)' : '';
    });
  }
}

/* ─────────────────────────────────────────────────────────────
   INIT ALL
───────────────────────────────────────────────────────────── */
function init() {
  initHeroWordState();
  initCanvas();
  initCursor();
  initMagnetic();
  initLoader();           // calls heroEntrance() when done
  initNav();
  initMobileNav();
  initMarquee();
  initSplitTitles();
  initReveals();
  initCounters();
  initSkillBars();
  initSkillItemsReveal();
  initTabs();
  initBento();
  initCertCards();
  initGPARing();
  initParallax();
  initMarqueeScroll();
  initEyebrows();
  initFooter();
  initContactCTA();
  initCardTilt();
  initScrollProgress();
  initActiveNav();

  // Refresh ScrollTrigger after all elements settle
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });
}

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
