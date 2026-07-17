/**
 * Draggable Floating Widgets
 * ─────────────────────────
 * Makes theme toggle, WhatsApp button and back-to-top draggable.
 * Positions are saved to localStorage and restored on reload.
 * Widgets snap to left or right viewport edge when released.
 */

(function () {
  'use strict';

  // ─── Widget registry ────────────────────────────────────────────────────
  // Each entry: { id, storageKey }
  const WIDGETS = [
    { id: 'themeToggle', storageKey: 'widget_pos_theme' },
    { id: 'whatsapp-btn', storageKey: 'widget_pos_whatsapp' },
    { id: 'back-to-top', storageKey: 'widget_pos_backtop' },
  ];

  const SNAP_MARGIN = 16; // px from viewport edge after snap

  // ─── Helpers ────────────────────────────────────────────────────────────
  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  function savePos(key, x, y) {
    try { localStorage.setItem(key, JSON.stringify({ x, y })); } catch (_) { }
  }

  function loadPos(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (_) { return null; }
  }

  // ─── Apply stored / default position ────────────────────────────────────
  function applyPosition(el, x, y) {
    const rect = el.getBoundingClientRect();
    const maxX = window.innerWidth - rect.width - 4;
    const maxY = window.innerHeight - rect.height - 4;
    el.style.left = clamp(x, 4, maxX) + 'px';
    el.style.top = clamp(y, 4, maxY) + 'px';
    el.style.right = 'auto';
    el.style.bottom = 'auto';
  }

  // ─── Snap to nearest vertical edge ──────────────────────────────────────
  function snapToEdge(el) {
    const rect = el.getBoundingClientRect();
    const midX = rect.left + rect.width / 2;
    const snapX = midX < window.innerWidth / 2
      ? SNAP_MARGIN
      : window.innerWidth - rect.width - SNAP_MARGIN;

    applyPosition(el, snapX, rect.top);
    return { x: snapX, y: rect.top };
  }

  // ─── Make one element draggable ──────────────────────────────────────────
  function makeDraggable(el, storageKey) {
    let startX, startY, startLeft, startTop;
    let dragging = false;
    let moved = false;

    // Restore saved position
    const saved = loadPos(storageKey);
    if (saved) {
      // Wait for layout so getBoundingClientRect works
      requestAnimationFrame(() => applyPosition(el, saved.x, saved.y));
    }

    // Drag handle cursor
    el.style.cursor = 'grab';

    // ── Pointer down ──────────────────────────────────────────────────────
    function onPointerDown(e) {
      // Only primary button
      if (e.type === 'mousedown' && e.button !== 0) return;
      dragging = true;
      moved = false;

      const rect = el.getBoundingClientRect();
      startLeft = rect.left;
      startTop = rect.top;

      if (e.type === 'touchstart') {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      } else {
        startX = e.clientX;
        startY = e.clientY;
      }

      // Convert to absolute positioning relative to viewport
      el.style.left = startLeft + 'px';
      el.style.top = startTop + 'px';
      el.style.right = 'auto';
      el.style.bottom = 'auto';

      el.style.cursor = 'grabbing';
      el.style.transition = 'none';
      el.style.userSelect = 'none';
      el.style.zIndex = '9999';

      document.addEventListener('mousemove', onPointerMove, { passive: false });
      document.addEventListener('mouseup', onPointerUp);
      document.addEventListener('touchmove', onPointerMove, { passive: false });
      document.addEventListener('touchend', onPointerUp);
    }

    // ── Pointer move ──────────────────────────────────────────────────────
    function onPointerMove(e) {
      if (!dragging) return;
      e.preventDefault();

      const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
      const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

      const dx = clientX - startX;
      const dy = clientY - startY;

      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true;

      applyPosition(el, startLeft + dx, startTop + dy);
    }

    // ── Pointer up ────────────────────────────────────────────────────────
    function onPointerUp(e) {
      if (!dragging) return;
      dragging = false;

      document.removeEventListener('mousemove', onPointerMove);
      document.removeEventListener('mouseup', onPointerUp);
      document.removeEventListener('touchmove', onPointerMove);
      document.removeEventListener('touchend', onPointerUp);

      el.style.cursor = 'grab';
      el.style.userSelect = '';
      el.style.transition = '';

      if (moved) {
        // Snap & save
        const pos = snapToEdge(el);
        savePos(storageKey, pos.x, pos.y);
        // Prevent the click from firing after drag
        el.addEventListener('click', preventClick, { once: true, capture: true });
      }
    }

    function preventClick(e) {
      e.stopImmediatePropagation();
      e.preventDefault();
    }

    // ── Attach listeners ──────────────────────────────────────────────────
    el.addEventListener('mousedown', onPointerDown);
    el.addEventListener('touchstart', onPointerDown, { passive: true });

    // Show drag hint on hover
    el.title = (el.title ? el.title + ' ' : '') + '(drag to reposition)';
  }

  // ─── Init on DOMContentLoaded ───────────────────────────────────────────
  function init() {
    WIDGETS.forEach(({ id, storageKey }) => {
      const el = document.getElementById(id);
      if (el) makeDraggable(el, storageKey);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
