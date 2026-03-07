/* ============================================================
   Advanced Interactive Scroll Animation System
   - Hero section elements are NEVER hidden (they're visible on load)
   - Varied animations per element (flip-in, slide, zoom-rotate, bounce)
   - Slower, more elegant timings with proper stagger delays
   - 3D Tilt on cards, Magnetic buttons, Animated counters, Lightbox
   ============================================================ */
(function () {
  'use strict';

  // ——— Don't animate elements in the hero section ———
  function isInHero(el) {
    return el.closest('#home') !== null;
  }

  // ——— Pick animation variant per element ———
  function getVariant(el) {
    const tag = el.tagName;
    if (tag === 'H2') return 'flip-in-x';
    if (tag === 'H3') return 'slide-in-left';
    if (tag === 'FORM') return 'zoom-in';
    if (tag === 'BUTTON') return 'bounce-in';
    if (el.classList.contains('border-l-2') || el.closest('.border-l-2'))
      return 'slide-in-left';
    if (el.closest('.grid')) return 'zoom-rotate-in';
    if (el.closest('#achievements')) return 'flip-in-x';
    if (tag === 'P' || tag === 'UL' || tag === 'LI') return 'fade-up-spring';
    return 'fade-up-spring';
  }

  // ——— Apply initial hidden state ———
  function applyVariant(el, variant) {
    if (el.dataset.saInit) return; // already initialized
    el.dataset.saInit = '1';
    el.dataset.animVariant = variant;

    // Slow, elegant base transition
    el.style.transition = 'none';
    el.style.willChange = 'transform, opacity';

    switch (variant) {
      case 'flip-in-x':
        el.style.transform = 'rotateX(75deg) translateY(30px)';
        el.style.transformOrigin = 'center top';
        el.style.opacity = '0';
        break;
      case 'slide-in-left':
        el.style.transform = 'translateX(-70px)';
        el.style.opacity = '0';
        break;
      case 'slide-in-right':
        el.style.transform = 'translateX(70px)';
        el.style.opacity = '0';
        break;
      case 'zoom-rotate-in':
        el.style.transform = 'scale(0.75) rotate(-6deg)';
        el.style.opacity = '0';
        break;
      case 'bounce-in':
        el.style.transform = 'scale(0.55)';
        el.style.opacity = '0';
        break;
      case 'zoom-in':
        el.style.transform = 'scale(0.88)';
        el.style.opacity = '0';
        break;
      default: // fade-up-spring
        el.style.transform = 'translateY(50px)';
        el.style.opacity = '0';
        break;
    }
  }

  // ——— Reveal with animation on scroll ———
  function revealElement(el) {
    const variant = el.dataset.animVariant || 'fade-up-spring';

    let easing, duration;
    switch (variant) {
      case 'flip-in-x':
        duration = '0.9s'; easing = 'cubic-bezier(0.34, 1.56, 0.64, 1)'; break;
      case 'slide-in-left':
      case 'slide-in-right':
        duration = '0.85s'; easing = 'cubic-bezier(0.22, 1, 0.36, 1)'; break;
      case 'zoom-rotate-in':
        duration = '0.8s'; easing = 'cubic-bezier(0.34, 1.56, 0.64, 1)'; break;
      case 'bounce-in':
        duration = '0.75s'; easing = 'cubic-bezier(0.34, 1.9, 0.64, 1)'; break;
      case 'zoom-in':
        duration = '0.7s'; easing = 'cubic-bezier(0.34, 1.4, 0.64, 1)'; break;
      default:
        duration = '0.8s'; easing = 'cubic-bezier(0.34, 1.4, 0.64, 1)'; break;
    }

    el.style.transition =
      `transform ${duration} ${easing}, opacity 0.6s ease`;
    el.style.transform = 'translateY(0) translateX(0) rotateX(0) scale(1) rotate(0)';
    el.style.opacity = '1';
    el.style.willChange = 'auto';
  }

  // ——— Intersection Observer ———
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        revealElement(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  // ——— Setup scroll animations for a section ———
  function setupSection(section) {
    // Skip the hero section entirely — it's above the fold
    if (section.id === 'home') return;

    const selectors = [
      'h2', 'h3',
      'p:not([ng-show])',               // skip ng-show error paragraphs
      '.grid > div',
      'form',
      '.border-l-2 > div',
      '.max-w-3xl > p',
      '.space-y-4 > div',
      '.achievement-card',
      '.achievement-img-wrap',
      '.stat-counter-wrap'
    ].join(', ');

    const els = section.querySelectorAll(selectors);
    els.forEach((el, i) => {
      if (el.dataset.saInit) return;
      if (isInHero(el)) return;

      const variant = getVariant(el);
      applyVariant(el, variant);

      // Generous stagger — 120ms between each element, capped at 600ms
      const delay = Math.min(i * 0.12, 0.6);
      el.style.transitionDelay = `${delay}s`;

      observer.observe(el);
    });
  }

  // ——— 3D Tilt effect on cards ———
  function initTiltCards() {
    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        card.style.transform = `perspective(700px) rotateX(${dy * -10}deg) rotateY(${dx * 10}deg) scale(1.03)`;
        card.style.transition = 'transform 0.12s ease';
        const shine = card.querySelector('.card-shine');
        if (shine) {
          shine.style.background =
            `radial-gradient(circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, rgba(255,255,255,0.18), transparent 70%)`;
        }
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(700px) rotateX(0) rotateY(0) scale(1)';
        card.style.transition = 'transform 0.5s cubic-bezier(0.34,1.2,0.64,1)';
        const shine = card.querySelector('.card-shine');
        if (shine) shine.style.background = 'none';
      });
    });
  }

  // ——— Magnetic button effect ———
  function initMagneticButtons() {
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.35;
        const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.35;
        btn.style.transform = `translate(${dx}px, ${dy}px) scale(1.05)`;
        btn.style.transition = 'transform 0.18s ease';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0,0) scale(1)';
        btn.style.transition = 'transform 0.55s cubic-bezier(0.34,1.4,0.64,1)';
      });
    });
  }

  // ——— Animated counters ———
  function initCounters() {
    const counters = document.querySelectorAll('.stat-counter');
    const cObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        if (isNaN(target)) return;
        let startTime = null;
        const duration = 1800;
        const step = (ts) => {
          if (!startTime) startTime = ts;
          const progress = Math.min((ts - startTime) / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3); // cubic ease-out
          el.textContent = Math.round(ease * target) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        cObs.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach(c => cObs.observe(c));
  }

  // ——— Lightbox ———
  function initLightbox() {
    document.addEventListener('click', e => {
      const trigger = e.target.closest('[data-lightbox]');
      if (!trigger) return;
      e.preventDefault();
      const src = trigger.dataset.lightbox;
      const lb = document.getElementById('achievement-lightbox');
      if (!lb) return;
      lb.querySelector('img').src = src;
      lb.classList.remove('hidden');
      lb.classList.add('flex');
      document.body.style.overflow = 'hidden';
    });

    const lb = document.getElementById('achievement-lightbox');
    if (lb) {
      lb.addEventListener('click', e => {
        if (e.target === lb || e.target.closest('.lb-close')) {
          lb.classList.add('hidden');
          lb.classList.remove('flex');
          document.body.style.overflow = '';
        }
      });
    }
  }

  // ——— Smart Navbar Hide/Show ———
  function initSmartNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateNavbar();
          ticking = false;
        });
        ticking = true;
      }
    });

    function updateNavbar() {
      const currentScrollY = window.scrollY;

      // Add glassmorphism/shadow class if scrolled
      if (currentScrollY > 50) {
        navbar.classList.add('navbar-scrolled');
      } else {
        navbar.classList.remove('navbar-scrolled');
      }

      // Detect scroll direction for hide/show
      // Only hide if scrolled past hero (e.g. 500px) to prevent flickering at top
      if (currentScrollY > lastScrollY && currentScrollY > 500) {
        navbar.classList.add('nav-hidden');
      } else {
        navbar.classList.remove('nav-hidden');
      }

      lastScrollY = Math.max(0, currentScrollY);
    }
  }

  // ——— Main init ———
  function init() {
    document.querySelectorAll('section').forEach(setupSection);
    initSmartNavbar();

    // Re-run after Angular finishes rendering ng-repeat content
    setTimeout(() => {
      document.querySelectorAll('section').forEach(setupSection);
      initTiltCards();
      initMagneticButtons();
      initCounters();
      initLightbox();
    }, 400);

    // Second pass for late-rendered content
    setTimeout(() => {
      initSmartNavbar(); // ensure navbar listener is solid
      document.querySelectorAll('section').forEach(setupSection);
      initTiltCards();
      initMagneticButtons();
    }, 900);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();