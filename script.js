// ============================================
// SHIELD DATA — Cyber Command Center
// script.js
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // ═══ CUSTOM CURSOR ═══
  const dot = document.getElementById('c-dot');
  const ring = document.getElementById('c-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;

  if (dot && ring && window.innerWidth > 768) {
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.cssText = `left:${mx - 2.5}px;top:${my - 2.5}px`;
    });

    (function animRing() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.cssText = `left:${rx - 16}px;top:${ry - 16}px`;
      requestAnimationFrame(animRing);
    })();

    document.addEventListener('mousedown', () => ring.classList.add('click'));
    document.addEventListener('mouseup', () => ring.classList.remove('click'));

    document.querySelectorAll('a, button, input, select, textarea, .hex-card, .case-card, .channel').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hov'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hov'));
    });
  }


  // ═══ NAV SCROLL + ACTIVE LINKS ═══
  const nav = document.getElementById('mainNav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 80);

    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    document.querySelectorAll('.nav-links a').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  });


  // ═══ BURGER MENU ═══
  const burger = document.getElementById('burger');
  if (burger) {
    burger.addEventListener('click', () => {
      document.getElementById('navLinks').classList.toggle('open');
    });
  }


  // ═══ TYPING LABEL ═══
  const labels = [
    'CYBER COMMAND CENTER',
    'ENTERPRISE SECURITY',
    'DIGITAL DEFENCE SYSTEM',
    'THREAT INTELLIGENCE HQ'
  ];
  let li = 0, ci = 0, deleting = false;

  function type() {
    const label = labels[li];
    const el = document.getElementById('typingLabel');
    if (!el) return;
    el.textContent = label.slice(0, ci);

    if (!deleting) {
      ci++;
      if (ci > label.length) { deleting = true; setTimeout(type, 1400); return; }
    } else {
      ci--;
      if (ci < 0) { deleting = false; li = (li + 1) % labels.length; setTimeout(type, 400); return; }
    }
    setTimeout(type, deleting ? 40 : 80);
  }
  type();


  // ═══ COUNTER ANIMATION ═══
  function countTo(el, target, suffix = '', duration = 1800) {
    if (!el) return;
    let start = null;
    const step = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(ease * target) + (p >= 1 ? suffix : '');
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // Fire hero counters when in view
  const metricsObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        countTo(document.getElementById('m1'), 200, '+');
        countTo(document.getElementById('m2'), 98, '%');
        countTo(document.getElementById('m4'), 14, '+');
        metricsObs.disconnect();
      }
    });
  }, { threshold: 0.3 });
  const heroMetrics = document.querySelector('.hero-metrics');
  if (heroMetrics) metricsObs.observe(heroMetrics);

  // Fire threat counters when in view
  const threatObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        countTo(document.getElementById('threatCount'), 1842, '', 1600);
        countTo(document.getElementById('criticalCount'), 47, '', 1200);
        setTimeout(() => {
          const b1 = document.getElementById('tsBar1');
          const b2 = document.getElementById('tsBar2');
          if (b1) b1.style.width = '76%';
          if (b2) b2.style.width = '42%';
        }, 200);
        threatObs.disconnect();
      }
    });
  }, { threshold: 0.3 });
  const threatSec = document.getElementById('threats');
  if (threatSec) threatObs.observe(threatSec);


  // ═══ PARTICLE NETWORK ═══
  const pCanvas = document.getElementById('particleCanvas');
  if (pCanvas) {
    const pCtx = pCanvas.getContext('2d');
    let pw, ph, particles = [];

    function resizeP() {
      pw = pCanvas.width = window.innerWidth;
      ph = pCanvas.height = window.innerHeight;
    }
    resizeP();
    window.addEventListener('resize', resizeP);

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * pw;
        this.y = Math.random() * ph;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.r = Math.random() * 1.2 + 0.4;
        this.o = Math.random() * 0.35 + 0.08;
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > pw) this.vx *= -1;
        if (this.y < 0 || this.y > ph) this.vy *= -1;
      }
      draw() {
        pCtx.beginPath();
        pCtx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        pCtx.fillStyle = `rgba(0,245,255,${this.o})`;
        pCtx.fill();
      }
    }

    const PC = Math.min(70, Math.floor(window.innerWidth * window.innerHeight / 18000));
    for (let i = 0; i < PC; i++) particles.push(new Particle());

    function animParticles() {
      pCtx.clearRect(0, 0, pw, ph);
      particles.forEach(p => { p.update(); p.draw(); });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 140) {
            pCtx.beginPath();
            pCtx.moveTo(particles[i].x, particles[i].y);
            pCtx.lineTo(particles[j].x, particles[j].y);
            pCtx.strokeStyle = `rgba(0,245,255,${(1 - d / 140) * 0.12})`;
            pCtx.lineWidth = 0.5;
            pCtx.stroke();
          }
        }
      }
      requestAnimationFrame(animParticles);
    }
    animParticles();
  }


  // ═══ RADAR CANVAS ═══
  const rCanvas = document.getElementById('radarCanvas');
  if (rCanvas) {
    const rCtx = rCanvas.getContext('2d');
    let ra = 0, radarBlips = [];

    function setRadarSize() {
      const w = rCanvas.offsetWidth;
      rCanvas.width = w; rCanvas.height = w;
    }
    setRadarSize();
    window.addEventListener('resize', setRadarSize);

    function genBlip() {
      return {
        angle: Math.random() * Math.PI * 2,
        dist: Math.random() * 0.82 + 0.08,
        life: 0,
        maxLife: 180 + Math.random() * 120,
        crit: Math.random() < 0.15
      };
    }
    for (let i = 0; i < 6; i++) radarBlips.push(genBlip());

    function drawRadar() {
      const W = rCanvas.width, H = rCanvas.height;
      const cx = W / 2, cy = H / 2, R = Math.min(cx, cy) * 0.9;
      rCtx.clearRect(0, 0, W, H);

      // Rings
      for (let i = 1; i <= 4; i++) {
        rCtx.beginPath();
        rCtx.arc(cx, cy, R * i * 0.25, 0, Math.PI * 2);
        rCtx.strokeStyle = 'rgba(0,245,255,0.1)';
        rCtx.lineWidth = 0.5;
        rCtx.stroke();
      }

      // Crosshairs
      rCtx.strokeStyle = 'rgba(0,245,255,0.08)';
      rCtx.lineWidth = 0.5;
      rCtx.beginPath();
      rCtx.moveTo(cx - R, cy); rCtx.lineTo(cx + R, cy);
      rCtx.moveTo(cx, cy - R); rCtx.lineTo(cx, cy + R);
      rCtx.stroke();

      // Sweep trail
      const sweepA = ra % (Math.PI * 2);
      for (let s = 0; s < 80; s++) {
        const a = sweepA - s * 0.04;
        rCtx.beginPath();
        rCtx.moveTo(cx, cy);
        rCtx.arc(cx, cy, R, a - 0.04, a);
        rCtx.closePath();
        rCtx.fillStyle = `rgba(0,245,255,${(1 - s / 80) * 0.08})`;
        rCtx.fill();
      }

      // Sweep line
      rCtx.beginPath();
      rCtx.moveTo(cx, cy);
      rCtx.lineTo(cx + Math.cos(sweepA) * R, cy + Math.sin(sweepA) * R);
      rCtx.strokeStyle = 'rgba(0,245,255,0.7)';
      rCtx.lineWidth = 1.5;
      rCtx.stroke();

      // Blips
      radarBlips.forEach((b, i) => {
        b.life++;
        if (b.life > b.maxLife) { radarBlips[i] = genBlip(); return; }
        const bx = cx + Math.cos(b.angle) * b.dist * R;
        const by = cy + Math.sin(b.angle) * b.dist * R;
        const age = b.life / b.maxLife;
        const fade = age < 0.2 ? age / 0.2 : age > 0.8 ? (1 - age) / 0.2 : 1;
        const col = b.crit ? `rgba(255,31,110,${fade * 0.9})` : `rgba(0,245,255,${fade * 0.7})`;

        rCtx.beginPath();
        rCtx.arc(bx, by, b.crit ? 4 : 2.5, 0, Math.PI * 2);
        rCtx.fillStyle = col;
        rCtx.fill();

        rCtx.beginPath();
        rCtx.arc(bx, by, b.crit ? 10 : 6, 0, Math.PI * 2);
        rCtx.fillStyle = b.crit ? `rgba(255,31,110,${fade * 0.15})` : `rgba(0,245,255,${fade * 0.1})`;
        rCtx.fill();
      });

      // Center dot
      rCtx.beginPath();
      rCtx.arc(cx, cy, 3, 0, Math.PI * 2);
      rCtx.fillStyle = '#00f5ff';
      rCtx.fill();

      ra += 0.018;
      requestAnimationFrame(drawRadar);
    }
    drawRadar();
  }


  // ═══ THREAT MAP CANVAS ═══
  const tmCanvas = document.getElementById('threatMapCanvas');
  if (tmCanvas) {
    const tmCtx = tmCanvas.getContext('2d');
    let tmBlips = [];

    function resizeTM() {
      tmCanvas.width = tmCanvas.offsetWidth;
      tmCanvas.height = tmCanvas.offsetHeight || Math.round(tmCanvas.offsetWidth * 0.625);
    }
    resizeTM();
    window.addEventListener('resize', resizeTM);

    function genTMBlip() {
      return {
        x: 0.05 + Math.random() * 0.9,
        y: 0.1 + Math.random() * 0.8,
        life: 0,
        maxLife: 120 + Math.random() * 180,
        sev: Math.random() > 0.7 ? 'hi' : Math.random() > 0.5 ? 'med' : 'lo'
      };
    }
    for (let i = 0; i < 20; i++) tmBlips.push(genTMBlip());

    const londonX = 0.47, londonY = 0.3;

    function drawTM() {
      const W = tmCanvas.width, H = tmCanvas.height;
      tmCtx.clearRect(0, 0, W, H);

      // Grid
      tmCtx.strokeStyle = 'rgba(0,245,255,0.05)';
      tmCtx.lineWidth = 0.5;
      for (let x = 0; x <= W; x += W / 12) {
        tmCtx.beginPath(); tmCtx.moveTo(x, 0); tmCtx.lineTo(x, H); tmCtx.stroke();
      }
      for (let y = 0; y <= H; y += H / 8) {
        tmCtx.beginPath(); tmCtx.moveTo(0, y); tmCtx.lineTo(W, y); tmCtx.stroke();
      }

      // London HQ
      tmCtx.beginPath();
      tmCtx.arc(londonX * W, londonY * H, 5, 0, Math.PI * 2);
      tmCtx.fillStyle = 'rgba(0,245,255,0.9)';
      tmCtx.fill();

      tmCtx.beginPath();
      tmCtx.arc(londonX * W, londonY * H, 14, 0, Math.PI * 2);
      tmCtx.strokeStyle = 'rgba(0,245,255,0.3)';
      tmCtx.lineWidth = 1;
      tmCtx.stroke();

      // Pulse ring
      const pt = (Date.now() % 2000) / 2000;
      tmCtx.beginPath();
      tmCtx.arc(londonX * W, londonY * H, 14 + pt * 20, 0, Math.PI * 2);
      tmCtx.strokeStyle = `rgba(0,245,255,${0.3 * (1 - pt)})`;
      tmCtx.stroke();

      // Blips
      tmBlips.forEach((b, i) => {
        b.life++;
        if (b.life > b.maxLife) { tmBlips[i] = genTMBlip(); return; }
        const bx = b.x * W, by = b.y * H;
        const age = b.life / b.maxLife;
        const fade = age < 0.15 ? age / 0.15 : age > 0.75 ? (1 - age) / 0.25 : 1;
        const col = b.sev === 'hi' ? '255,31,110' : b.sev === 'med' ? '245,200,66' : '0,255,136';

        tmCtx.beginPath();
        tmCtx.moveTo(bx, by);
        tmCtx.lineTo(londonX * W, londonY * H);
        tmCtx.strokeStyle = `rgba(${col},${fade * 0.15})`;
        tmCtx.lineWidth = 0.5;
        tmCtx.stroke();

        tmCtx.beginPath();
        tmCtx.arc(bx, by, b.sev === 'hi' ? 3.5 : 2, 0, Math.PI * 2);
        tmCtx.fillStyle = `rgba(${col},${fade})`;
        tmCtx.fill();

        tmCtx.beginPath();
        tmCtx.arc(bx, by, 6 + age * 8, 0, Math.PI * 2);
        tmCtx.strokeStyle = `rgba(${col},${fade * 0.2})`;
        tmCtx.stroke();
      });

      requestAnimationFrame(drawTM);
    }
    drawTM();
  }


  // ═══ ORBIT NODES ═══
  function placeOrbitNodes(ringId, labels, radiusFraction, animDur) {
    const ring = document.getElementById(ringId);
    if (!ring) return;
    labels.forEach((label, i) => {
      const angle = (i / labels.length) * 2 * Math.PI - Math.PI / 2;
      const node = document.createElement('div');
      node.className = 'o-node';
      node.style.top = `calc(50% + ${Math.sin(angle) * 50}%)`;
      node.style.left = `calc(50% + ${Math.cos(angle) * 50}%)`;
      node.style.animation = `nodeCounter ${animDur}s linear infinite`;
      node.textContent = label;
      ring.appendChild(node);
    });
  }

  placeOrbitNodes('ring1', ['React', 'Vue', 'Node', 'Python', 'Go', 'Rust'], 0.21, 18);
  placeOrbitNodes('ring2', ['AWS', 'Docker', 'K8s', 'Azure', 'GCP', 'Terraform'], 0.35, 28);
  placeOrbitNodes('ring3', ['Postgres', 'MongoDB', 'Redis', 'GraphQL', 'TypeScript', 'Next.js'], 0.49, 40);


  // ═══ TERMINAL TYPEWRITER ═══
  const termLines = [
    { text: '$ cat about.json', cls: 't-prompt t-cmd', delay: 600 },
    { text: '{', cls: 't-out', delay: 900 },
    { text: '  "team": "25+ engineers & designers",', cls: 't-out', delay: 1100 },
    { text: '  "founded": 2011,', cls: 't-out', delay: 1200 },
    { text: '  "locations": ["London","Berlin","Sofia"],', cls: 't-out', delay: 1300 },
    { text: '  "certifications": ["ISO 27001","SOC 2"]', cls: 't-out', delay: 1400 },
    { text: '}', cls: 't-out', delay: 1500 },
    { text: '$ shield --run diagnostics', cls: 't-prompt t-cmd', delay: 2000 },
    { text: '[OK] Firewall rules loaded', cls: 't-ok', delay: 2300 },
    { text: '[OK] SIEM endpoints reachable', cls: 't-ok', delay: 2500 },
    { text: '[OK] Threat feeds synced', cls: 't-ok', delay: 2700 },
    { text: '[OK] Backup integrity verified', cls: 't-ok', delay: 2900 },
    { text: '[WARN] 47 new CVEs in queue', cls: 't-err', delay: 3100 },
    { text: '[OK] Patches staged for deployment', cls: 't-ok', delay: 3300 },
    { text: '$ All systems nominal. Standing by._', cls: 't-prompt t-cur', delay: 3700 },
  ];

  const termObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const tb = document.getElementById('termBody');
        if (!tb) return;
        termLines.forEach(l => {
          setTimeout(() => {
            const sp = document.createElement('span');
            sp.className = 't-line ' + l.cls;
            sp.textContent = l.text;
            tb.appendChild(sp);
            tb.scrollTop = tb.scrollHeight;
          }, l.delay);
        });
        termObs.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const termEl = document.getElementById('termBody');
  if (termEl) termObs.observe(termEl);


  // ═══ SCROLL REVEAL ═══
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));


  // ═══ MATRIX RAIN ═══
  const mCanvas = document.getElementById('matrixCanvas');
  if (mCanvas) {
    const mCtx = mCanvas.getContext('2d');
    let mW, mH, drops = [];
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ';

    function resizeM() {
      mW = mCanvas.width = window.innerWidth;
      mH = mCanvas.height = window.innerHeight;
      drops = Array(Math.floor(mW / 14)).fill(1);
    }
    resizeM();
    window.addEventListener('resize', resizeM);

    let matrixActive = false;

    function drawMatrix() {
      mCtx.fillStyle = 'rgba(4,6,14,0.05)';
      mCtx.fillRect(0, 0, mW, mH);
      mCtx.fillStyle = 'rgba(0,245,255,0.35)';
      mCtx.font = '12px monospace';
      drops.forEach((y, i) => {
        mCtx.fillText(chars[Math.floor(Math.random() * chars.length)], i * 14, y * 14);
        if (y * 14 > mH && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
      if (matrixActive) requestAnimationFrame(drawMatrix);
    }

    const hero = document.querySelector('.hero');
    if (hero) {
      hero.addEventListener('mouseenter', () => {
        if (!matrixActive) {
          matrixActive = true;
          mCanvas.classList.add('visible');
          drawMatrix();
        }
      });
      hero.addEventListener('mouseleave', () => {
        matrixActive = false;
        mCanvas.classList.remove('visible');
      });
    }
  }


  // ═══ HEX CARD 3D TILT ═══
  document.querySelectorAll('.hex-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(600px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateZ(4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });


  // ═══ CONTACT FORM ═══
  window.submitForm = function () {
    const inner = document.getElementById('formInner');
    const success = document.getElementById('formSuccess');
    if (inner) inner.style.display = 'none';
    if (success) success.classList.add('show');
  };

});
