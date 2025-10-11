// Gestos táctiles y ratón para la imagen del modal
(function () {
  'use strict';

  const modal = document.getElementById('modal');
  const img = document.getElementById('imagen-ampliada');

  if (!modal || !img) return;

  let scale = 1;
  const MIN_SCALE = 1;
  const MAX_SCALE = 4;

  let originX = 0; // translate X
  let originY = 0; // translate Y

  const pointers = new Map();
  let startDist = 0;
  let startScale = 1;
  let startMid = null;
  let lastTap = 0;

  function setTransform() {
    img.style.transform = `translate(${originX}px, ${originY}px) scale(${scale})`;
    if (scale > 1) img.classList.add('zoomed'); else img.classList.remove('zoomed');
  }

  function distance(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.hypot(dx, dy);
  }

  function midpoint(a, b) {
    return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  }

  // Convert client point to image local coords (taking current transform into account)
  function clientToImageLocal(pt) {
    // invert current transform: local = (client - translate) / scale
    return {
      x: (pt.x - originX),
      y: (pt.y - originY)
    };
  }

  function onPointerDown(e) {
    e.preventDefault();
    e.stopPropagation();
    img.setPointerCapture?.(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.size === 2) {
      const [a, b] = Array.from(pointers.values());
      startDist = distance(a, b);
      startScale = scale;
      startMid = midpoint(a, b);
      // store midpoint in image-local coords
      startMid.local = clientToImageLocal(startMid);
    } else if (pointers.size === 1) {
      // single pointer start: store position for pan
      const p = pointers.get(e.pointerId);
      p.last = { x: p.x, y: p.y };
    }

    // double-tap / double-click toggle
    const now = Date.now();
    if (now - lastTap < 300) {
      // toggle zoom
      if (scale > 1) {
        scale = 1;
        originX = 0; originY = 0;
      } else {
        // zoom into tapped point
        const pt = { x: e.clientX, y: e.clientY };
        const local = clientToImageLocal(pt);
        scale = 2;
        // compute translate so local point remains under pointer
        originX = e.clientX - local.x * scale;
        originY = e.clientY - local.y * scale;
        clampTransform();
      }
      setTransform();
    }
    lastTap = now;
  }

  function onPointerMove(e) {
    if (!pointers.has(e.pointerId)) return;
    e.preventDefault();
    e.stopPropagation();
    const prev = pointers.get(e.pointerId);
    const cur = { x: e.clientX, y: e.clientY };
    pointers.set(e.pointerId, cur);

    if (pointers.size === 2) {
      // pinch to zoom with two pointers
      const [pA, pB] = Array.from(pointers.values());
      const curDist = distance(pA, pB);
      let newScale = startScale * (curDist / startDist);
      newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));

      // compute midpoint and adjust origin so the image zooms around the midpoint
      const mid = midpoint(pA, pB);
      const localMid = clientToImageLocal(mid);

      // new originX such that localMid remains under mid: origin = mid - localMid * newScale
      originX = mid.x - localMid.x * newScale;
      originY = mid.y - localMid.y * newScale;

      scale = newScale;
      clampTransform();
      setTransform();
    } else if (pointers.size === 1) {
      // pan when zoomed
      if (scale <= 1) return;
      const p = pointers.get(e.pointerId);
      const dx = cur.x - prev.x;
      const dy = cur.y - prev.y;
      originX += dx;
      originY += dy;
      clampTransform();
      setTransform();
    }
  }

  function onPointerUp(e) {
    if (pointers.has(e.pointerId)) {
      pointers.delete(e.pointerId);
    }
    // reset two-pointer start values if less than 2 remain
    if (pointers.size < 2) {
      startDist = 0;
      startMid = null;
      startScale = scale;
    }
  }

  function clampTransform() {
    // Prevent moving image too far. Compute image displayed size
    const rect = img.getBoundingClientRect();
    // displayed size considering scale
    const dispW = rect.width;
    const dispH = rect.height;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    // clamp so image always covers viewport minimally (allow some leeway)
    const minX = Math.min(0, vw - dispW);
    const maxX = Math.max(0, vw - dispW); // usually 0
    const minY = Math.min(0, vh - dispH);
    const maxY = Math.max(0, vh - dispH);

    // For simplicity clamp origin roughly to viewport bounds
    if (dispW <= vw) {
      // center horizontally
      originX = (vw - dispW) / 2;
    } else {
      originX = Math.min(0, Math.max(originX, vw - dispW));
    }
    if (dispH <= vh) {
      originY = (vh - dispH) / 2;
    } else {
      originY = Math.min(0, Math.max(originY, vh - dispH));
    }
  }

  // wheel zoom (desktop)
  function onWheel(e) {
    if (!modal || modal.style.display === 'none') return;
    e.preventDefault();
    const delta = -e.deltaY * 0.001;
    const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale * (1 + delta)));
    const rect = img.getBoundingClientRect();
    const cx = e.clientX;
    const cy = e.clientY;
    const local = clientToImageLocal({ x: cx, y: cy });
    // update origin so zoom centers on cursor
    originX = cx - local.x * newScale;
    originY = cy - local.y * newScale;
    scale = newScale;
    clampTransform();
    setTransform();
  }

  // reset when modal closed
  function resetZoom() {
    scale = 1;
    originX = 0;
    originY = 0;
    setTransform();
  }

  // attach events
  img.addEventListener('pointerdown', onPointerDown);
  img.addEventListener('pointermove', onPointerMove);
  img.addEventListener('pointerup', onPointerUp);
  img.addEventListener('pointercancel', onPointerUp);
  img.addEventListener('wheel', onWheel, { passive: false });

  // reset on modal close (observa que en tu código cerrarModal oculta el modal)
  const observer = new MutationObserver(() => {
    if (modal.style.display === 'none' || modal.getBoundingClientRect().width === 0) {
      resetZoom();
    }
  });
  observer.observe(modal, { attributes: true, attributeFilter: ['style'] });

  // also reset on click outside image
  modal.addEventListener('click', (e) => {
    if (e.target === modal) resetZoom();
  });

})();