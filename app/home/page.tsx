'use client';

import { useEffect, useRef } from 'react';

const STYLES = `
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  --bg:        #04030c;
  --bg2:       #070613;
  --surface:   #0d0b1e;
  --card:      #100e22;
  --border:    rgba(255,255,255,0.07);
  --border-h:  rgba(255,255,255,0.16);
  --text:      #ede9ff;
  --muted:     rgba(237,233,255,0.44);
  --muted2:    rgba(237,233,255,0.22);
  --accent:    #c8f247;
  --violet:    #7b6cff;
  --cyan:      #22d3ee;
  --rose:      #f472b6;
  --white:     #ffffff;
  --r:         12px;
}

html { scroll-behavior: smooth; font-size: 16px; }
body {
  background: var(--bg);
  color: var(--text);
  font-family: 'Epilogue', sans-serif;
  font-weight: 300;
  overflow-x: hidden;
}

/* ── NOISE ── */
body::after {
  content: '';
  position: fixed; inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E");
  background-size: 200px;
  pointer-events: none; z-index: 9000; opacity: .5;
}

/* ── NAV ── */
nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 800;
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.4rem 3.5rem;
  background: rgba(4,3,12,0.7);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
}
.nav-brand {
  display: flex; align-items: center; gap: 0.6rem;
  font-family: 'Familjen Grotesk', sans-serif;
  font-weight: 700; font-size: 1.05rem; color: var(--white);
  text-decoration: none;
}
.nav-brand-icon {
  width: 28px; height: 28px; border-radius: 7px;
  background: linear-gradient(135deg, var(--violet), var(--accent));
  display: flex; align-items: center; justify-content: center;
  font-size: 0.8rem; font-weight: 700; color: #fff;
}
.nav-links { display: flex; gap: 2rem; list-style: none; }
.nav-links a {
  font-size: 0.82rem; color: var(--muted); text-decoration: none;
  transition: color .2s; letter-spacing: .02em;
}
.nav-links a:hover { color: var(--text); }
.nav-right { display: flex; gap: .75rem; align-items: center; }
.btn-ghost {
  font-family: 'Familjen Grotesk', sans-serif; font-size: .8rem;
  font-weight: 600; letter-spacing: .04em; padding: .55rem 1.2rem;
  border: 1px solid var(--border); border-radius: 100px;
  background: transparent; color: var(--muted); cursor: pointer;
  transition: all .2s;
}
.btn-ghost:hover { border-color: var(--border-h); color: var(--text); }
.btn-primary {
  font-family: 'Familjen Grotesk', sans-serif; font-size: .8rem;
  font-weight: 700; letter-spacing: .04em; padding: .55rem 1.3rem;
  border-radius: 100px; border: none; cursor: pointer;
  background: var(--accent); color: var(--bg);
  transition: all .22s;
}
.btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(200,242,71,.25); }

/* ── HERO ── */
#hero {
  min-height: 100vh;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 8rem 2rem 5rem;
  position: relative; overflow: hidden;
  text-align: center;
}

#hero-canvas {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  pointer-events: none; z-index: 0;
}

#hero::before {
  content: '';
  position: absolute; inset: 0; z-index: 1;
  background: radial-gradient(ellipse 80% 60% at 50% 50%, transparent 30%, rgba(4,3,12,.8) 70%, var(--bg) 100%);
  pointer-events: none;
}

.hero-content { position: relative; z-index: 2; max-width: 780px; }

.hero-badge {
  display: inline-flex; align-items: center; gap: .5rem;
  font-family: 'JetBrains Mono', monospace; font-size: .68rem;
  letter-spacing: .14em; text-transform: uppercase; color: var(--cyan);
  border: 1px solid rgba(34,211,238,.2); background: rgba(34,211,238,.06);
  padding: .4rem 1rem; border-radius: 100px; margin-bottom: 2rem;
}
.hero-badge-dot {
  width: 6px; height: 6px; border-radius: 50%; background: var(--cyan);
  animation: blink 2s ease-in-out infinite;
}
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }

.hero-h1 {
  font-family: 'Familjen Grotesk', sans-serif;
  font-weight: 700;
  font-size: clamp(3rem, 7vw, 6.5rem);
  line-height: .95; letter-spacing: -.03em;
  margin-bottom: 1.5rem;
}
.hero-h1 .outline {
  -webkit-text-stroke: 1.5px rgba(237,233,255,.3);
  color: transparent;
}
.hero-h1 .hl { color: var(--accent); }

.hero-sub {
  font-size: clamp(.95rem, 2vw, 1.15rem);
  color: var(--muted); line-height: 1.75; max-width: 540px;
  margin: 0 auto 2.5rem;
}

.url-input-wrap {
  display: flex; gap: 0; max-width: 620px; margin: 0 auto 1.25rem;
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--border-h);
  border-radius: 100px;
  padding: .35rem .35rem .35rem 1.4rem;
  transition: border-color .25s, box-shadow .25s;
}
.url-input-wrap:focus-within {
  border-color: rgba(200,242,71,.5);
  box-shadow: 0 0 0 3px rgba(200,242,71,.08), 0 8px 32px rgba(0,0,0,.4);
}
.url-input-wrap input {
  flex: 1; background: transparent; border: none; outline: none;
  font-family: 'JetBrains Mono', monospace; font-size: .82rem;
  color: var(--text); letter-spacing: .02em;
  padding: .5rem 0;
}
.url-input-wrap input::placeholder { color: var(--muted2); }
.url-input-wrap button {
  flex-shrink: 0;
  font-family: 'Familjen Grotesk', sans-serif; font-size: .8rem;
  font-weight: 700; letter-spacing: .04em;
  background: var(--accent); color: var(--bg);
  border: none; border-radius: 100px;
  padding: .65rem 1.4rem; cursor: pointer;
  transition: all .2s; white-space: nowrap;
  display: flex; align-items: center; gap: .5rem;
}
.url-input-wrap button:hover { background: #d4ff55; }

.cta-url-wrap {
  display: flex; gap: 0; max-width: 620px; margin: 0 auto 1.25rem;
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--border-h);
  border-radius: 100px;
  padding: .35rem .35rem .35rem 1.4rem;
  transition: border-color .25s, box-shadow .25s;
}
.cta-url-wrap:focus-within {
  border-color: rgba(200,242,71,.5);
  box-shadow: 0 0 0 3px rgba(200,242,71,.08), 0 8px 32px rgba(0,0,0,.4);
}
.cta-url-wrap input {
  flex: 1; background: transparent; border: none; outline: none;
  font-family: 'JetBrains Mono', monospace; font-size: .82rem;
  color: var(--text); letter-spacing: .02em;
  padding: .5rem 0;
}
.cta-url-wrap input::placeholder { color: var(--muted2); }
.cta-url-wrap button {
  flex-shrink: 0;
  font-family: 'Familjen Grotesk', sans-serif; font-size: .8rem;
  font-weight: 700; letter-spacing: .04em;
  background: var(--accent); color: var(--bg);
  border: none; border-radius: 100px;
  padding: .65rem 1.4rem; cursor: pointer;
  transition: all .2s; white-space: nowrap;
  display: flex; align-items: center; gap: .5rem;
}
.cta-url-wrap button:hover { background: #d4ff55; }

.hero-trust {
  font-family: 'JetBrains Mono', monospace; font-size: .65rem;
  letter-spacing: .08em; color: var(--muted2);
  display: flex; align-items: center; justify-content: center; gap: 1.2rem;
  flex-wrap: wrap;
}
.hero-trust span { display: flex; align-items: center; gap: .35rem; }
.hero-trust-dot { color: var(--accent); }

.hero-scroll {
  position: absolute; bottom: 2rem; left: 50%;
  transform: translateX(-50%);
  z-index: 2; display: flex; flex-direction: column; align-items: center; gap: .5rem;
  opacity: .3; animation: pulse 2.5s ease-in-out infinite;
}
@keyframes pulse { 0%,100%{opacity:.3} 50%{opacity:.6} }
.hero-scroll-line {
  width: 1px; height: 50px;
  background: linear-gradient(to bottom, transparent, var(--muted));
  animation: lineGrow 2s ease-in-out infinite;
}
@keyframes lineGrow {
  0%{transform:scaleY(0);transform-origin:top} 50%{transform:scaleY(1);transform-origin:top}
  51%{transform:scaleY(1);transform-origin:bottom} 100%{transform:scaleY(0);transform-origin:bottom}
}

.marquee-strip {
  overflow: hidden;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  background: var(--bg2);
  padding: 1rem 0;
}
.marquee-track {
  display: flex; width: max-content;
  animation: marquee 28s linear infinite;
}
.marquee-track:hover { animation-play-state: paused; }
@keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
.m-item {
  display: flex; align-items: center; gap: 1.2rem;
  padding: 0 2.5rem; white-space: nowrap;
  font-family: 'JetBrains Mono', monospace;
  font-size: .7rem; letter-spacing: .12em; text-transform: uppercase;
  color: var(--muted2);
}
.m-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--accent); flex-shrink: 0; }

.section { padding: 7rem 3.5rem; max-width: 1320px; margin: 0 auto; }
.section-full { padding: 7rem 3.5rem; }
.s-label {
  font-family: 'JetBrains Mono', monospace; font-size: .68rem;
  letter-spacing: .18em; text-transform: uppercase; color: var(--violet);
  margin-bottom: .75rem; display: flex; align-items: center; gap: .75rem;
}
.s-label::after { content:''; width: 32px; height: 1px; background: var(--border); }
.s-h {
  font-family: 'Familjen Grotesk', sans-serif; font-weight: 700;
  font-size: clamp(2rem, 4vw, 3.8rem);
  line-height: 1.05; letter-spacing: -.025em; margin-bottom: 1rem;
}
.s-h .dim { color: var(--muted); }
.s-sub {
  font-size: 1rem; color: var(--muted); line-height: 1.75; max-width: 480px;
}
.h-rule { height: 1px; background: var(--border); margin: 0 3.5rem; }

.stats-strip {
  display: grid; grid-template-columns: repeat(4, 1fr);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  background: var(--bg2);
}
.stat-cell {
  padding: 3rem 2.5rem; border-right: 1px solid var(--border);
  position: relative; overflow: hidden; transition: background .3s;
}
.stat-cell:last-child { border-right: none; }
.stat-cell:hover { background: rgba(255,255,255,.02); }
.stat-cell::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, var(--violet), var(--cyan));
  transform: scaleX(0); transform-origin: left; transition: transform .4s;
}
.stat-cell:hover::before { transform: scaleX(1); }
.stat-num {
  font-family: 'Familjen Grotesk', sans-serif; font-weight: 700;
  font-size: clamp(2.2rem, 3.5vw, 3.5rem); line-height: 1;
  color: var(--white); letter-spacing: -.02em; margin-bottom: .4rem;
}
.stat-num em { color: var(--accent); font-style: normal; font-size: .6em; }
.stat-label { font-size: .82rem; color: var(--muted); line-height: 1.5; }

.features-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px;
  background: var(--border); border-radius: 16px; overflow: hidden;
  border: 1px solid var(--border);
}
.feat-card {
  background: var(--card); padding: 2.5rem 2rem;
  position: relative; overflow: hidden; transition: background .3s;
}
.feat-card:hover { background: #13112a; }
.feat-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, var(--violet), transparent);
  opacity: 0; transition: opacity .3s;
}
.feat-card:hover::before { opacity: 1; }
.feat-icon {
  width: 46px; height: 46px; border-radius: 12px; margin-bottom: 1.4rem;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.2rem; border: 1px solid var(--border);
}
.feat-title {
  font-family: 'Familjen Grotesk', sans-serif; font-weight: 600;
  font-size: 1.1rem; margin-bottom: .5rem; transition: color .2s;
}
.feat-card:hover .feat-title { color: var(--accent); }
.feat-desc { font-size: .85rem; color: var(--muted); line-height: 1.7; }
.feat-tag {
  display: inline-block; margin-top: 1rem;
  font-family: 'JetBrains Mono', monospace; font-size: .62rem;
  letter-spacing: .08em; text-transform: uppercase;
  color: var(--violet); background: rgba(123,108,255,.08);
  border: 1px solid rgba(123,108,255,.18); border-radius: 4px;
  padding: .25rem .6rem;
}

.reveal { opacity: 0; transform: translateY(30px); transition: all .8s cubic-bezier(.16,.84,.44,1); }
.reveal.in { opacity: 1; transform: translateY(0); }

.faq-item { padding: 1.5rem 0; border-bottom: 1px solid var(--border); }
.faq-q { cursor: pointer; display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
.faq-item.open .faq-a { display: block; }
.faq-a { display: none; margin-top: 1rem; color: var(--muted); line-height: 1.7; }

footer {
  display: grid; grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 3rem; padding: 5rem 3.5rem; max-width: 1320px; margin: 0 auto;
  border-top: 1px solid var(--border);
}
.footer-brand { max-width: 240px; }
.footer-logo { display: flex; align-items: center; gap: .5rem; font-weight: 700; margin-bottom: 1rem; }
.footer-logo-icon {
  width: 20px; height: 20px; border-radius: 5px;
  background: linear-gradient(135deg, var(--violet), var(--accent));
}
.footer-tagline { font-size: .85rem; color: var(--muted); }
.footer-col-title { font-weight: 600; margin-bottom: 1rem; }
.footer-links { list-style: none; display: flex; flex-direction: column; gap: .75rem; }
.footer-links a { color: var(--muted); text-decoration: none; font-size: .85rem; transition: color .2s; }
.footer-links a:hover { color: var(--text); }
.footer-bottom {
  display: flex; justify-content: space-between; align-items: center;
  padding: 2rem 3.5rem; border-top: 1px solid var(--border);
  background: var(--bg2); text-align: center;
}
.footer-copy { font-size: .8rem; color: var(--muted2); }
.footer-copy em { font-style: normal; color: var(--accent); }

@media (max-width: 768px) {
  nav { padding: 1rem 1.5rem; }
  .section { padding: 4rem 1.5rem; }
  .section-full { padding: 4rem 1.5rem; }
  .stats-strip { grid-template-columns: 1fr 1fr; }
  .features-grid { grid-template-columns: 1fr; }
  footer { grid-template-columns: 1fr; }
  .footer-bottom { flex-direction: column; gap: 1rem; }
}
`;

export default function HomePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // 3D neural net canvas animation
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = canvas.width;
    let H = canvas.height;
    let nodes: any[] = [];
    let animId: number;

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };

    resize();

    class Node {
      x3: number = 0;
      y3: number = 0;
      z3: number = 0;
      vx: number = 0;
      vy: number = 0;
      vz: number = 0;
      size: number = 0;
      pulse: number = 0;

      constructor() {
        this.reset();
      }

      reset() {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = 180 + Math.random() * 200;
        this.x3 = r * Math.sin(phi) * Math.cos(theta);
        this.y3 = r * Math.sin(phi) * Math.sin(theta);
        this.z3 = r * Math.cos(phi);
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.vz = (Math.random() - 0.5) * 0.3;
        this.size = Math.random() * 2.5 + 0.5;
        this.pulse = Math.random() * Math.PI * 2;
      }

      update() {
        this.x3 += this.vx;
        this.y3 += this.vy;
        this.z3 += this.vz;
        this.pulse += 0.025;

        const cos = Math.cos(0.0008);
        const sin = Math.sin(0.0008);
        const nx = this.x3 * cos + this.z3 * sin;
        const nz = -this.x3 * sin + this.z3 * cos;
        this.x3 = nx;
        this.z3 = nz;

        const dist = Math.sqrt(this.x3 ** 2 + this.y3 ** 2 + this.z3 ** 2);
        if (dist > 400) {
          this.vx *= -1;
          this.vy *= -1;
          this.vz *= -1;
        }
      }

      project() {
        const fov = 600;
        const scale = fov / (fov + this.z3 + 400);
        return {
          x: W / 2 + this.x3 * scale,
          y: H / 2 + this.y3 * scale,
          scale,
          depth: (this.z3 + 400) / 800,
        };
      }
    }

    const initNodes = () => {
      const count = Math.min(Math.floor((W * H) / 14000), 80);
      nodes = Array.from({ length: count }, () => new Node());
    };

    initNodes();

    let mx = W / 2;
    let my = H / 2;
    const handleMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', () => {
      resize();
      initNodes();
    });

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      nodes.forEach((n) => n.update());

      const projected = nodes.map((n) => ({ node: n, ...n.project() }));
      projected.sort((a, b) => a.depth - b.depth);

      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const a = projected[i];
          const b = projected[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist2d = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 140;
          if (dist2d < maxDist) {
            const alpha = (1 - dist2d / maxDist) * 0.35 * Math.min(a.depth, b.depth);
            const r = 123,
              g = 108,
              bl = 255;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${r},${g},${bl},${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      projected.forEach((p) => {
        const pulse = 0.6 + 0.4 * Math.sin(p.node.pulse);
        const alpha = p.depth * 0.9 * pulse;
        const r = p.node.size * p.scale * 2.5;

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 4);
        grad.addColorStop(0, `rgba(108,143,0,${alpha * 0.28})`);
        grad.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 4, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, r), 0, Math.PI * 2);
        const isHighlight = p.depth > 0.65;
        ctx.fillStyle = isHighlight ? `rgba(108,143,0,${alpha})` : `rgba(103,86,216,${alpha * 1.2})`;
        ctx.fill();
      });

      const mg = ctx.createRadialGradient(mx, my, 0, mx, my, 280);
      mg.addColorStop(0, 'rgba(103,86,216,0.08)');
      mg.addColorStop(1, 'transparent');
      ctx.fillStyle = mg;
      ctx.fillRect(0, 0, W, H);

      animId = requestAnimationFrame(draw);
    };

    requestAnimationFrame(draw);

    // Scroll reveal
    const revEls = document.querySelectorAll('.reveal');
    const revObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('in');
        });
      },
      { threshold: 0.08 }
    );
    revEls.forEach((el) => revObs.observe(el));

    // FAQ accordion
    document.querySelectorAll('.faq-item').forEach((item) => {
      item.querySelector('.faq-q')?.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach((i) => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    });

    // URL input demo
    document.querySelectorAll('.url-input-wrap button, .cta-url-wrap button').forEach((btn) => {
      btn.addEventListener('click', function (this: HTMLButtonElement) {
        const wrap = this.closest('.url-input-wrap, .cta-url-wrap') as HTMLElement;
        const input = wrap?.querySelector('input') as HTMLInputElement;
        const val = input?.value?.trim();
        if (!val) {
          wrap.style.borderColor = 'rgba(244,114,182,.5)';
          input?.focus();
          setTimeout(() => {
            wrap.style.borderColor = '';
          }, 1500);
          return;
        }
        const orig = this.textContent;
        this.textContent = 'Scanning...';
        (this as any).style.background = '#555';
        setTimeout(() => {
          this.textContent = '✦ Score: 74/100';
          (this as any).style.background = 'var(--violet)';
          (this as any).style.color = '#fff';
        }, 1800);
        setTimeout(() => {
          this.textContent = orig;
          (this as any).style.background = '';
          (this as any).style.color = '';
        }, 4000);
      });
    });

    // Trust bar counter
    const trustNums = document.querySelectorAll('.trust-num[data-target]');
    const trustObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        trustObs.unobserve(e.target);
        const el = e.target as HTMLElement;
        const target = parseFloat(el.dataset.target || '0');
        const suffix = el.dataset.suffix || '';
        const decimal = parseInt(el.dataset.decimal || '0');
        const dur = 1600;
        let start: number | null = null;
        function tick(ts: number) {
          if (!start) start = ts;
          const p = Math.min((ts - start) / dur, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          const val = target * ease;
          el.textContent = (decimal ? val.toFixed(decimal) : Math.round(val)) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    });
    trustNums.forEach((el) => trustObs.observe(el));

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      revObs.disconnect();
      trustObs.disconnect();
    };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <nav>
        <a href="/" className="nav-brand">
          <div className="nav-brand-icon">⚡</div>
          AEOvision
        </a>
        <ul className="nav-links">
          <li><a href="#how">How it works</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#faq">FAQ</a></li>
        </ul>
        <div className="nav-right">
          <button className="btn-ghost">Sign in</button>
          <button className="btn-primary">Get Started</button>
        </div>
      </nav>

      <section id="hero">
        <canvas id="hero-canvas" ref={canvasRef}></canvas>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot"></span>
            AI Visibility Intelligence
          </div>
          <h1 className="hero-h1">
            See how AI <span className="hl">sees</span> your <span className="outline">website</span>
          </h1>
          <p className="hero-sub">
            AEOvision analyzes your website's presence across Google AI Overviews, Perplexity, ChatGPT, and emerging AI search platforms.
          </p>
          <div className="url-input-wrap">
            <input type="url" placeholder="https://yourdomain.com" autoComplete="off" spellCheck={false} />
            <button type="button">Analyse free</button>
          </div>
          <div className="hero-trust">
            <span><span className="hero-trust-dot">●</span> Used by 500+ companies</span>
            <span><span className="hero-trust-dot">●</span> 99.9% Uptime</span>
            <span><span className="hero-trust-dot">●</span> Enterprise Support</span>
          </div>
        </div>
        <div className="hero-scroll">
          <div className="hero-scroll-line"></div>
          <span>Scroll to explore</span>
        </div>
      </section>

      <div className="marquee-strip">
        <div className="marquee-track">
          <div className="m-item">★ Aeo insights <span className="m-dot"></span></div>
          <div className="m-item">★ AI Citation tracking <span className="m-dot"></span></div>
          <div className="m-item">★ Real-time monitoring <span className="m-dot"></span></div>
          <div className="m-item">★ API access <span className="m-dot"></span></div>
          <div className="m-item">★ Custom alerts <span className="m-dot"></span></div>
          <div className="m-item">★ Aeo insights <span className="m-dot"></span></div>
          <div className="m-item">★ AI Citation tracking <span className="m-dot"></span></div>
          <div className="m-item">★ Real-time monitoring <span className="m-dot"></span></div>
          <div className="m-item">★ API access <span className="m-dot"></span></div>
          <div className="m-item">★ Custom alerts <span className="m-dot"></span></div>
        </div>
      </div>

      <div className="stats-strip">
        <div className="stat-cell">
          <div className="stat-num"><span className="trust-num" data-target="50000" data-suffix="+" data-decimal="0">0</span></div>
          <div className="stat-label">AI-indexed pages analyzed</div>
        </div>
        <div className="stat-cell">
          <div className="stat-num"><span className="trust-num" data-target="1200" data-suffix="%" data-decimal="0">0</span></div>
          <div className="stat-label">Average citation increase</div>
        </div>
        <div className="stat-cell">
          <div className="stat-num"><span className="trust-num" data-target="24" data-suffix="/7">0</span></div>
          <div className="stat-label">Hour monitoring cycle</div>
        </div>
        <div className="stat-cell">
          <div className="stat-num"><span className="trust-num" data-target="15" data-suffix="M+" data-decimal="0">0</span></div>
          <div className="stat-label">Domains tracked globally</div>
        </div>
      </div>

      <section className="section reveal">
        <div className="s-label">How it works</div>
        <h2 className="s-h">Understand your <span className="dim">AI visibility</span></h2>
        <p className="s-sub">
          Our platform continuously monitors how AI systems cite your content, providing actionable intelligence.
        </p>
      </section>

      <section className="section reveal">
        <div className="features-grid">
          <div className="feat-card">
            <div className="feat-icon">📊</div>
            <h3 className="feat-title">Real-time Monitoring</h3>
            <p className="feat-desc">Track your citations across AI platforms as they happen</p>
            <span className="feat-tag">Dashboard</span>
          </div>
          <div className="feat-card">
            <div className="feat-icon">🔍</div>
            <h3 className="feat-title">Deep Analytics</h3>
            <p className="feat-desc">Understand citation context and AI model impact</p>
            <span className="feat-tag">Analytics</span>
          </div>
          <div className="feat-card">
            <div className="feat-icon">⚡</div>
            <h3 className="feat-title">Quick Insights</h3>
            <p className="feat-desc">Get actionable recommendations to improve visibility</p>
            <span className="feat-tag">AI-powered</span>
          </div>
        </div>
      </section>

      <section id="faq" className="section reveal">
        <div className="s-label">FAQ</div>
        <h2 className="s-h">Frequently asked questions</h2>
        <div className="faq-item">
          <div className="faq-q">
            <span>What is AEO and how does it differ from SEO?</span>
            <span>+</span>
          </div>
          <div className="faq-a">
            AEO (AI Engine Optimization) focuses on optimizing your content for AI systems like ChatGPT and Google AI Overviews, while SEO focuses on traditional search engines.
          </div>
        </div>
        <div className="faq-item">
          <div className="faq-q">
            <span>How often is the data updated?</span>
            <span>+</span>
          </div>
          <div className="faq-a">
            Our monitoring runs 24/7, with real-time updates for new citations and changes to your AI visibility metrics.
          </div>
        </div>
        <div className="faq-item">
          <div className="faq-q">
            <span>Can I integrate this with my existing tools?</span>
            <span>+</span>
          </div>
          <div className="faq-a">
            Yes! Our API supports integration with your existing analytics and SEO tools. Enterprise customers get dedicated support.
          </div>
        </div>
      </section>

      <section className="section reveal">
        <div className="s-label">Ready to get started?</div>
        <h2 className="s-h">Begin your <span className="dim">AI visibility journey</span></h2>
        <p className="s-sub">
          Join thousands of companies already using AEOvision to understand and optimize their AI presence.
        </p>
        <div className="cta-url-wrap" style={{ marginTop: '2rem' }}>
          <input type="url" placeholder="https://yourdomain.com" autoComplete="off" spellCheck={false} />
          <button type="button">Analyse free</button>
        </div>
      </section>

      <footer>
        <div className="footer-brand">
          <div className="footer-logo">
            <div className="footer-logo-icon"></div>
            AEOvision
          </div>
          <div className="footer-tagline">AI visibility intelligence for the next era of search.</div>
        </div>
        <div>
          <div className="footer-col-title">Product</div>
          <ul className="footer-links">
            <li><a href="#">How it works</a></li>
            <li><a href="#">Features</a></li>
            <li><a href="#">Pricing</a></li>
          </ul>
        </div>
        <div>
          <div className="footer-col-title">Resources</div>
          <ul className="footer-links">
            <li><a href="#">AEO Guide</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Changelog</a></li>
          </ul>
        </div>
        <div>
          <div className="footer-col-title">Company</div>
          <ul className="footer-links">
            <li><a href="#">About</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
      </footer>

      <div className="footer-bottom">
        <div className="footer-copy">© 2026 <em>AEOvision</em> — AI Visibility Intelligence Platform</div>
        <div className="footer-copy">Built for the next era of search.</div>
      </div>
    </>
  );
}
