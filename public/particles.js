/* ============================================================
   Full-Page Particle Background
   - Covers entire page, not just hero section
   - Canvas fixed behind all content
   - Mouse interactivity, geometric shapes
   - Dark/light mode color switching
   ============================================================ */
(function () {
    'use strict';

    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W, H;
    let mouse = { x: -9999, y: -9999 };

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    // Re-size when page content changes height (viewport change)
    window.addEventListener('resize', () => { resize(); initPools(); });

    resize();

    // ——— Colors ———
    function isDark() { return document.documentElement.classList.contains('dark'); }
    function pColor(a) { return isDark() ? `rgba(139, 92, 246, ${a})` : `rgba(99, 102, 241, ${a})`; }
    function lColor(a) { return isDark() ? `rgba(139, 92, 246, ${a})` : `rgba(99, 102, 241, ${a})`; }
    function sColor(a) { return isDark() ? `rgba(167, 139, 250, ${a})` : `rgba(79, 70, 229, ${a})`; }

    // ——— Particle ———
    class Particle {
        constructor() { this.init(); }
        init(fromBottom) {
            this.x = Math.random() * W;
            this.y = fromBottom ? H + 10 : Math.random() * H;
            this.r = Math.random() * 2.5 + 1;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = -(Math.random() * 0.3 + 0.1); // drift upward slowly
            this.alpha = Math.random() * 0.6 + 0.3;
            this.pulse = Math.random() * Math.PI * 2;
        }
        update() {
            // Mouse repel (fixed coordinates)
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 150) {
                const f = (150 - dist) / 150;
                this.vx += (dx / dist) * f * 0.8;
                this.vy += (dy / dist) * f * 0.8;
            }
            this.vx *= 0.96;
            this.vy = Math.min(this.vy * 0.96, -0.06); // keep upward drift

            this.x += this.vx;
            this.y += this.vy;
            this.pulse += 0.03;

            if (this.x < -10) this.x = W + 10;
            if (this.x > W + 10) this.x = -10;
            if (this.y < -10) this.init(true); // reset from bottom when off top
        }
        draw() {
            const a = this.alpha + Math.sin(this.pulse) * 0.15;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = pColor(Math.max(0.1, Math.min(1, a)));
            ctx.fill();

            // Glow
            const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * 4);
            g.addColorStop(0, pColor(0.3));
            g.addColorStop(1, pColor(0));
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r * 4, 0, Math.PI * 2);
            ctx.fillStyle = g;
            ctx.fill();
        }
    }

    // ——— Geometric shape ———
    class Shape {
        constructor() { this.init(); }
        init(fromBottom) {
            const types = ['triangle', 'hexagon', 'diamond', 'circle'];
            this.type = types[Math.floor(Math.random() * types.length)];
            this.x = Math.random() * W;
            this.y = fromBottom ? H + 80 : Math.random() * H;
            this.size = Math.random() * 35 + 15;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = -(Math.random() * 0.2 + 0.05); // drift upward
            this.rot = Math.random() * Math.PI * 2;
            this.rotV = (Math.random() - 0.5) * 0.01;
            this.alpha = Math.random() * 0.15 + 0.05;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.rot += this.rotV;
            if (this.x < -100) this.x = W + 100;
            if (this.x > W + 100) this.x = -100;
            if (this.y < -100) this.init(true);
        }
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rot);
            ctx.strokeStyle = sColor(this.alpha);
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            const s = this.size;
            if (this.type === 'triangle') {
                ctx.moveTo(0, -s); ctx.lineTo(s * .866, s * .5); ctx.lineTo(-s * .866, s * .5); ctx.closePath();
            } else if (this.type === 'hexagon') {
                for (let i = 0; i < 6; i++) {
                    const a = (Math.PI / 3) * i - Math.PI / 6;
                    i === 0 ? ctx.moveTo(s * Math.cos(a), s * Math.sin(a))
                        : ctx.lineTo(s * Math.cos(a), s * Math.sin(a));
                }
                ctx.closePath();
            } else if (this.type === 'diamond') {
                ctx.moveTo(0, -s); ctx.lineTo(s * .6, 0); ctx.lineTo(0, s); ctx.lineTo(-s * .6, 0); ctx.closePath();
            } else {
                ctx.arc(0, 0, s, 0, Math.PI * 2);
            }
            ctx.stroke();
            ctx.restore();
        }
    }

    let particles = [], shapes = [];

    function initPools() {
        // Density logic: approx 1 particle per 15000 pixels of viewport
        const n = Math.min(120, Math.floor((W * H) / 12000));
        particles = Array.from({ length: n }, () => new Particle());
        shapes = Array.from({ length: 24 }, () => new Shape());
    }
    initPools();

    function connect() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const d = Math.hypot(dx, dy);
                if (d < 160) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = lColor((1 - d / 160) * 0.3);
                    ctx.lineWidth = 1.0;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, W, H);
        shapes.forEach(s => { s.update(); s.draw(); });
        connect();
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animate);
    }
    animate();

    // Track mouse position (viewport relative)
    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });
})();
