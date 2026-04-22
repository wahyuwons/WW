/**
 * ═══════════════════════════════════════════════════════
 *  WAHYUWONO PORTFOLIO · main.js
 *  GSAP 3 + ScrollTrigger — bidirectional scrub
 * ═══════════════════════════════════════════════════════
 */
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/* ─── helpers ─── */
const qs  = (s, c = document) => c.querySelector(s);
const qsa = (s, c = document) => [...c.querySelectorAll(s)];
const EO  = 'power3.out';
const EX  = 'expo.out';
const EB  = 'back.out(1.5)';

/* ══════════════════════════════════════════════════════
   1. LOADER
══════════════════════════════════════════════════════ */
function initLoader() {
  document.body.style.overflow = 'hidden';
  const loader  = qs('#loader');
  const numEl   = qs('#ld-count');
  const bar     = qs('#ld-bar');

  // Ornament rotation inside loader
  gsap.to('.ld-ring1', { rotation: 360, duration: 12, ease: 'none', repeat: -1 });
  gsap.to('.ld-ring2', { rotation: -360, duration: 8, ease: 'none', repeat: -1 });

  const obj = { v: 0 };
  gsap.timeline({ onComplete: () => { document.body.style.overflow = ''; introAnimate(); } })
    .to(obj, {
      v: 100, duration: 1.7, ease: 'power2.inOut',
      onUpdate() {
        const v = Math.round(obj.v);
        numEl.textContent = v;
        bar.style.width = v + '%';
      },
    })
    .to(loader, { yPercent: -100, duration: .9, ease: EX, delay: .1 })
    .set(loader, { display: 'none' });
}

/* ══════════════════════════════════════════════════════
   2. HERO INTRO (one-shot, on load)
══════════════════════════════════════════════════════ */
function introAnimate() {
  const words  = qsa('.h-word');
  const badge  = qs('#hero-badge');
  const desc   = qs('#hero-desc');
  const btns   = qs('#hero-btns');
  const right  = qs('#hero-right');
  const scroll = qs('#hero-scroll');

  gsap.set(words,  { y: '110%' });
  gsap.set([badge, desc, btns, scroll], { opacity: 0, y: 24 });
  if (right) gsap.set(right, { opacity: 0, x: 50 });

  const tl = gsap.timeline({ defaults: { ease: EX } });

  tl.to(words,  { y: 0, stagger: .09, duration: 1.05 }, 0)
    .to([badge, desc, btns], { opacity: 1, y: 0, stagger: .12, duration: .8, ease: EO }, .3)
    .to(scroll,  { opacity: 1, y: 0, duration: .7 }, 1.0);

  if (right) {
    tl.to(right, { opacity: 1, x: 0, duration: 1, ease: EX }, .2)
      .from(qsa('.hcard'), { y: 30, opacity: 0, stagger: .1, duration: .7, ease: EO }, .4);

    // Hero card counters
    qsa('.hcard-big[data-count]').forEach(el => {
      const target = +el.dataset.count;
      tl.to({ v: 0 }, {
        v: target, duration: 1.2, ease: 'power2.out',
        onUpdate() { el.textContent = Math.round(this.targets()[0].v); },
      }, .7);
    });
  }
}

/* ══════════════════════════════════════════════════════
   3. CURSOR
══════════════════════════════════════════════════════ */
function initCursor() {
  const dot  = qs('#cursor-dot');
  const ring = qs('#cursor-ring');
  if (!dot) return;

  let cx = -100, cy = -100, rx = -100, ry = -100;

  document.addEventListener('mousemove', e => {
    cx = e.clientX; cy = e.clientY;
    gsap.to(dot, { x: cx, y: cy, duration: .07, ease: 'none' });
  });

  (function follow() {
    rx += (cx - rx) * .13;
    ry += (cy - ry) * .13;
    gsap.set(ring, { x: rx, y: ry });
    requestAnimationFrame(follow);
  })();

  qsa('a,button,.sk,.cert,.hcard,.bc,.clink,.cta-btn').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cur-h'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cur-h'));
  });
  qsa('p,li').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cur-t'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cur-t'));
  });
}

/* ══════════════════════════════════════════════════════
   4. MAGNETIC BUTTONS
══════════════════════════════════════════════════════ */
function initMagnetic() {
  qsa('[data-mag]').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r  = el.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) * .3;
      const dy = (e.clientY - r.top  - r.height / 2) * .3;
      gsap.to(el, { x: dx, y: dy, duration: .4, ease: EO });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: .6, ease: EB });
    });
  });
}

/* ══════════════════════════════════════════════════════
   5. NAV + SMOOTH SCROLL
══════════════════════════════════════════════════════ */
function initNav() {
  const nav = qs('#nav');
  const links = qsa('.nav-link');
  const sections = qsa('section[id]');

  // Scrolled state
  ScrollTrigger.create({
    start: 80,
    onEnter:     () => nav.classList.add('scrolled'),
    onLeaveBack: () => nav.classList.remove('scrolled'),
  });

  // Smooth anchor
  qsa('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = qs(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      gsap.to(window, { scrollTo: { y: target, offsetY: 70 }, duration: 1.1, ease: EX });
      closeMob();
    });
  });

  // Active highlight
  sections.forEach(sec => {
    ScrollTrigger.create({
      trigger: sec, start: 'top 55%', end: 'bottom 55%',
      onEnter:     () => setActive(sec.id),
      onEnterBack: () => setActive(sec.id),
    });
  });

  function setActive(id) {
    links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
  }
}

/* ══════════════════════════════════════════════════════
   6. MOBILE NAV
══════════════════════════════════════════════════════ */
function closeMob() {
  const ham = qs('#ham');
  const mob = qs('#mob-nav');
  if (!ham) return;
  ham.classList.remove('open');
  mob.classList.remove('open');
  document.body.style.overflow = '';
}

function initMobileNav() {
  const ham = qs('#ham');
  const mob = qs('#mob-nav');
  if (!ham) return;

  ham.addEventListener('click', () => {
    const open = ham.classList.toggle('open');
    mob.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      qsa('.mob-link').forEach((l, i) => {
        gsap.from(l, { y: 30, opacity: 0, duration: .55, delay: .3 + i * .07, ease: EX });
      });
    }
  });
  qsa('.mob-link').forEach(l => l.addEventListener('click', closeMob));
}

/* ══════════════════════════════════════════════════════
   7. PROGRESS BAR
══════════════════════════════════════════════════════ */
function initProgress() {
  const bar = qs('#progress-bar');
  if (!bar) return;
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: st => { bar.style.width = (st.progress * 100) + '%'; },
  });
}

/* ══════════════════════════════════════════════════════
   8. MARQUEE — velocity-aware
══════════════════════════════════════════════════════ */
function initMarquee() {
  const inner = qs('#marquee');
  if (!inner) return;
  const row   = inner.querySelector('.m-row');
  const rowW  = row ? row.offsetWidth : 0;
  if (!rowW) return;

  let speed = 1;
  const tw = gsap.to(inner, { x: -rowW, ease: 'none', repeat: -1, duration: 30,
    modifiers: { x: x => (parseFloat(x) % rowW) + 'px' },
  });

  // Speed up / skew on scroll
  ScrollTrigger.create({
    onUpdate(st) {
      const v = st.getVelocity();
      gsap.to(inner, { skewX: gsap.utils.clamp(-5, 5, v / 200), duration: .5, ease: EO, overwrite: true });
      gsap.to(tw, { timeScale: 1 + Math.abs(v) / 1000, duration: .6, overwrite: true });
    },
  });
}

/* ══════════════════════════════════════════════════════
   9. ORNAMENT PARALLAX — bidirectional scrub
══════════════════════════════════════════════════════ */
function initOrnamentParallax() {
  // Hero ornaments — continuous rotation + parallax
  gsap.to('#orn-ring-big',  { rotation: 60,  transformOrigin:'50% 50%', ease:'none', scrollTrigger:{ trigger:'#hero', start:'top top', end:'bottom top', scrub:2 }});
  gsap.to('#orn-hex',       { rotation:-40, y:-80, ease:'none', scrollTrigger:{ trigger:'#hero', start:'top top', end:'bottom top', scrub:1.5 }});
  gsap.to('#orn-cross',     { y:-60, rotation:90,  ease:'none', scrollTrigger:{ trigger:'#hero', start:'top top', end:'bottom top', scrub:1 }});
  gsap.to('#orn-dots',      { y:-50, x:20,          ease:'none', scrollTrigger:{ trigger:'#hero', start:'top top', end:'bottom top', scrub:1.2 }});
  gsap.to('#orn-tri',       { y:-70, rotation:30,   ease:'none', scrollTrigger:{ trigger:'#hero', start:'top top', end:'bottom top', scrub:.8 }});
  gsap.to('#orn-diamond',   { y:-90, rotation:-45,  ease:'none', scrollTrigger:{ trigger:'#hero', start:'top top', end:'bottom top', scrub:1.3 }});
  gsap.to('#orn-lines',     { y:-40, x:-15,          ease:'none', scrollTrigger:{ trigger:'#hero', start:'top top', end:'bottom top', scrub:.7 }});
  gsap.to('.blob1',         { y:-120, scale:.8,      ease:'none', scrollTrigger:{ trigger:'#hero', start:'top top', end:'bottom top', scrub:2 }});
  gsap.to('.blob2',         { y:-80,                 ease:'none', scrollTrigger:{ trigger:'#hero', start:'top top', end:'bottom top', scrub:1.5 }});
  gsap.to('.blob3',         { y:-60, scale:1.2,      ease:'none', scrollTrigger:{ trigger:'#hero', start:'top top', end:'bottom top', scrub:1 }});

  // Section ornaments — each parallax independently scrubbed
  const sornMap = [
    { sel:'.sorn-circle-grid',  y:-70, rotation:25,  sec:'#about' },
    { sel:'.sorn-corner-br',    y:-40, x:20,          sec:'#about' },
    { sel:'.sorn-plus',         y:-80, rotation:180,  sec:'#about' },
    { sel:'.sorn-exp-arc',      y:-60, rotation:-30,  sec:'#experience' },
    { sel:'.sorn-zigzag',       y:-50, x:-20,          sec:'#experience' },
    { sel:'.sorn-square-orn',   y:-70, rotation:45,   sec:'#experience' },
    { sel:'.sorn-spiral',       y:-80, rotation:60,   sec:'#skills' },
    { sel:'.sorn-bracket',      y:-50, x:-15,          sec:'#skills' },
    { sel:'.sorn-mesh',         y:-60, x:10,           sec:'#skills' },
    { sel:'.sorn-morph',        y:-70, rotation:20,   sec:'#education' },
    { sel:'.sorn-rulers',       y:-40, x:-20,          sec:'#education' },
    { sel:'.sorn-star',         y:-80, rotation:40,   sec:'#certifications' },
    { sel:'.sorn-wave',         y:-50, x:15,           sec:'#certifications' },
    { sel:'.sorn-big-ring-ct',  rotation:30, scale:.9, sec:'#contact' },
    { sel:'.sorn-ct-hex',       y:-60, rotation:-25,  sec:'#contact' },
  ];

  sornMap.forEach(({ sel, y = 0, x = 0, rotation = 0, scale = 1, sec }) => {
    const el = qs(sel);
    if (!el) return;
    gsap.to(el, {
      y, x, rotation, scale,
      ease: 'none',
      scrollTrigger: {
        trigger: sec,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
      },
    });
  });
}

/* ══════════════════════════════════════════════════════
   10. SECTION CONTENT — bidirectional scrub (forward + reverse)
══════════════════════════════════════════════════════ */
function initScrubAnimations() {

  /* ── Eyebrow lines ── */
  qsa('.e-line').forEach(el => {
    gsap.fromTo(el, { scaleX: 0, transformOrigin: 'left' }, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 90%', end: 'top 60%', scrub: .6 },
    });
  });

  /* ── Section titles — chars drop in and back ── */
  qsa('.sec-title').forEach(title => {
    const text = title.innerHTML;
    // Wrap chars
    title.innerHTML = text.replace(/([^<>\s&;])/g, '<span class="ch">$1</span>');
    const chars = qsa('.ch', title);
    gsap.fromTo(chars,
      { y: 60, opacity: 0 },
      {
        y: 0, opacity: 1,
        stagger: { each: .018, from: 'start' },
        ease: 'none',
        scrollTrigger: {
          trigger: title,
          start: 'top 88%',
          end: 'top 40%',
          scrub: .8,
        },
      }
    );
  });

  /* ── Paragraphs ── */
  qsa('[data-sc]').forEach((el, i) => {
    const delay = +(el.dataset.d || 0) * .08;
    gsap.fromTo(el,
      { y: 45, opacity: 0 },
      {
        y: 0, opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top 92%',
          end: 'top 55%',
          scrub: .7,
          delay,
        },
      }
    );
  });

  /* ── Left reveals ── */
  qsa('[data-sc-l]').forEach(el => {
    gsap.fromTo(el,
      { x: -60, opacity: 0 },
      {
        x: 0, opacity: 1,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 45%', scrub: .8 },
      }
    );
  });

  /* ── Right reveals ── */
  qsa('[data-sc-r]').forEach(el => {
    gsap.fromTo(el,
      { x: 60, opacity: 0 },
      {
        x: 0, opacity: 1,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 45%', scrub: .8 },
      }
    );
  });

  /* ── Skill items ── */
  qsa('[data-sc-sk]').forEach((sk, i) => {
    gsap.fromTo(sk,
      { x: 30, opacity: 0 },
      {
        x: 0, opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: sk,
          start: 'top 94%',
          end: 'top 65%',
          scrub: .6,
        },
      }
    );
  });

  /* ── Skill bars ── */
  qsa('.sk-f').forEach((bar, i) => {
    const pct = bar.dataset.pct || 0;
    gsap.fromTo(bar,
      { width: '0%' },
      {
        width: pct + '%',
        ease: 'none',
        scrollTrigger: {
          trigger: bar.closest('.sk'),
          start: 'top 90%',
          end: 'top 55%',
          scrub: .9,
        },
      }
    );
  });

  /* ── Bento cards ── */
  qsa('[data-bc]').forEach((bc, i) => {
    gsap.fromTo(bc,
      { y: 60, opacity: 0 },
      {
        y: 0, opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: bc,
          start: 'top 90%',
          end: 'top 55%',
          scrub: .8,
        },
      }
    );
  });

  /* ── Cert cards — wave ── */
  qsa('[data-cert]').forEach((card, i) => {
    gsap.fromTo(card,
      { y: 50, opacity: 0, scale: .95 },
      {
        y: 0, opacity: 1, scale: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          start: 'top 92%',
          end: 'top 60%',
          scrub: .7,
        },
      }
    );
  });

  /* ── Hero content parallax on scroll ── */
  gsap.to('.hero-left', {
    y: 80,
    ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.5 },
  });
  gsap.to('.hero-right', {
    y: 40,
    ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1 },
  });

  /* ── GPA ring ── */
  (() => {
    const arc = qs('.gpa-arc');
    if (!arc) return;
    const pct = +arc.dataset.pct / 100;
    const circ = 2 * Math.PI * 58; // r=58
    gsap.fromTo(arc,
      { strokeDashoffset: circ },
      {
        strokeDashoffset: circ - pct * circ,
        ease: 'none',
        scrollTrigger: {
          trigger: '.edu-card',
          start: 'top 80%',
          end: 'top 30%',
          scrub: 1,
        },
      }
    );
  })();

  /* ── About counters ── */
  qsa('.sn[data-count], .hcard-big[data-count]').forEach(el => {
    const target = +el.dataset.count;
    const obj    = { v: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      onEnter() {
        gsap.to(obj, {
          v: target, duration: 1.4, ease: 'power2.out',
          onUpdate() { el.textContent = Math.round(obj.v); },
        });
      },
      onLeaveBack() {
        gsap.to(obj, {
          v: 0, duration: .8, ease: 'power2.in',
          onUpdate() { el.textContent = Math.round(obj.v); },
        });
      },
    });
  });
}

/* ══════════════════════════════════════════════════════
   11. 3D TILT ON CARDS
══════════════════════════════════════════════════════ */
function initTilt() {
  qsa('.hcard, .bc, .cert, .clink, .edu-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const x  = e.clientX - r.left;
      const y  = e.clientY - r.top;
      const rx = ((y - r.height / 2) / r.height) * -8;
      const ry = ((x - r.width  / 2) / r.width ) *  8;
      gsap.to(card, {
        rotationX: rx, rotationY: ry,
        transformPerspective: 700, transformOrigin: 'center',
        duration: .35, ease: EO, overwrite: true,
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotationX: 0, rotationY: 0, duration: .65, ease: EB, overwrite: true });
    });
  });
}

/* ══════════════════════════════════════════════════════
   12. EXPERIENCE TABS
══════════════════════════════════════════════════════ */
function initTabs() {
  const tabs    = qsa('.exp-tab');
  const panels  = qsa('.exp-panel');
  const tabLine = qs('.tab-line');

  function activate(tab) {
    tabs.forEach(t => t.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');

    const panel = qs('#' + tab.dataset.tab);
    if (panel) {
      panel.classList.add('active');
      const tl = gsap.timeline();
      tl.from(panel,              { opacity: 0, y: 18, duration: .4, ease: EO })
        .from(qsa('.plist li', panel), { x: 12, opacity: 0, stagger: .06, duration: .35, ease: EO }, .15)
        .from(qsa('.ptags span', panel),{ scale: .85, opacity: 0, stagger: .05, duration: .3, ease: EB }, .25);
    }

    // Move indicator
    if (tabLine) {
      const nav    = tab.closest('.exp-nav');
      const offset = tab.getBoundingClientRect().top - nav.getBoundingClientRect().top;
      gsap.to(tabLine, { y: offset, height: tab.offsetHeight, duration: .4, ease: EO });
    }
  }

  tabs.forEach(t => t.addEventListener('click', () => activate(t)));

  // Set initial indicator
  const first = qs('.exp-tab.active');
  if (first && tabLine) gsap.set(tabLine, { y: 0, height: first.offsetHeight });
}

/* ══════════════════════════════════════════════════════
   13. FLOATING ORNAMENT SELF-ANIMATION (idle)
══════════════════════════════════════════════════════ */
function initOrnIdleAnim() {
  // Gentle float + rotation on hero ornaments (independent of scroll)
  gsap.to('#orn-ring-big',  { rotation:'+=360', repeat:-1, duration:40,  ease:'none' });
  gsap.to('#orn-hex',       { rotation:'+=360', repeat:-1, duration:20,  ease:'none' });
  gsap.to('#orn-diamond',   { rotation:'+=360', repeat:-1, duration:12,  ease:'none' });
  gsap.to('#orn-tri',       { rotation:'-=360', repeat:-1, duration:18,  ease:'none' });
  gsap.to('.ld-ring1',      { rotation:'+=360', repeat:-1, duration:16,  ease:'none' });

  // Pulse blobs
  gsap.to('.blob1', { scale: 1.15, duration: 4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  gsap.to('.blob2', { scale: 1.08, duration: 5, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1 });
  gsap.to('.blob3', { scale: 1.2,  duration: 3.5, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: .5 });

  // CTA float
  gsap.to('.cta-btn', {
    y: -6, duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: -1,
    scrollTrigger: { trigger: '#contact', start: 'top 70%', toggleActions: 'play pause resume pause' },
  });

  // Scroll thumb (already CSS animated — also gsap breathe on scroll hint)
  gsap.to('.hero-scroll', {
    opacity: .5, duration: 1.4, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 2,
  });
}

/* ══════════════════════════════════════════════════════
   14. FOOTER
══════════════════════════════════════════════════════ */
function initFooter() {
  gsap.from('.ft-inner > *', {
    y: 20, opacity: 0, stagger: .1, duration: .7, ease: EX,
    scrollTrigger: { trigger: 'footer', start: 'top 95%', once: true },
  });
}

/* ══════════════════════════════════════════════════════
   15. SECTION DIVIDER LINES
══════════════════════════════════════════════════════ */
function initDividers() {
  // Draw a horizontal line across each section separator using scrub
  qsa('.sec').forEach(sec => {
    const line = document.createElement('div');
    line.style.cssText = `position:absolute;top:0;left:5%;right:5%;height:1px;
      background:linear-gradient(90deg,transparent,rgba(233,196,106,.18),transparent);
      transform-origin:left;transform:scaleX(0);pointer-events:none;z-index:1;`;
    sec.style.position = 'relative';
    sec.prepend(line);

    gsap.to(line, {
      scaleX: 1, ease: 'none',
      scrollTrigger: { trigger: sec, start: 'top 95%', end: 'top 70%', scrub: .8 },
    });
  });
}

/* ══════════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════════ */
function init() {
  // Set initial states before loader
  gsap.set('.h-word', { y: '110%' });
  gsap.set(['#hero-badge', '#hero-desc', '#hero-btns', '#hero-scroll'], { opacity: 0, y: 24 });
  if (qs('#hero-right')) gsap.set('#hero-right', { opacity: 0, x: 50 });

  initLoader();
  initCursor();
  initMagnetic();
  initNav();
  initMobileNav();
  initProgress();
  initMarquee();
  initOrnamentParallax();
  initOrnIdleAnim();
  initScrubAnimations();
  initTabs();
  initTilt();
  initFooter();
  initDividers();

  window.addEventListener('load', () => ScrollTrigger.refresh());

  // Resize refresh
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 300);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
