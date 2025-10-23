// modal-ui.js
// Responsabilidad: textos y gestos del modal

document.addEventListener('i18nLoaded', function(e) {
  try {
    var json = e.detail && e.detail.i18n;
    if (json && json.ui && json.ui.modal) {
      var btnAnterior = document.getElementById('anterior');
      var btnSiguiente = document.getElementById('siguiente');
      var btnPlantaAnterior = document.getElementById('planta-anterior');
      var btnPlantaSiguiente = document.getElementById('planta-siguiente');
      if (btnAnterior && json.ui.modal.anterior) btnAnterior.textContent = json.ui.modal.anterior;
      if (btnSiguiente && json.ui.modal.siguiente) btnSiguiente.textContent = json.ui.modal.siguiente;
      if (btnPlantaAnterior && json.ui.modal.plantaAnterior) btnPlantaAnterior.textContent = json.ui.modal.plantaAnterior;
      if (btnPlantaSiguiente && json.ui.modal.plantaSiguiente) btnPlantaSiguiente.textContent = json.ui.modal.plantaSiguiente;
    }
  } catch (err) { /* noop */ }
});

(function() {
  var modal = document.getElementById('modal');
  var btnSiguiente = document.getElementById('siguiente');
  var btnAnterior = document.getElementById('anterior');
  var btnPlantaSiguiente = document.getElementById('planta-siguiente');
  var btnPlantaAnterior = document.getElementById('planta-anterior');

  var startX = null, startY = null;
  var threshold = 50;
  var restraint = 30;

  function isTouchDevice() {
    return ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
  }

  function shouldEnableGestures() {
    return window.innerWidth <= 900 && isTouchDevice();
  }

  if (!modal || !shouldEnableGestures()) return;

  modal.addEventListener('touchstart', function(e) {
    if (e.touches && e.touches.length === 1) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }
  }, { passive: true });

  modal.addEventListener('touchmove', function(e) {}, { passive: true });

  modal.addEventListener('touchend', function(e) {
    if (!startX || !startY) { startX = null; startY = null; return; }
    if (!e.changedTouches || e.changedTouches.length !== 1) { startX = null; startY = null; return; }
    var endX = e.changedTouches[0].clientX;
    var endY = e.changedTouches[0].clientY;
    var deltaX = endX - startX;
    var deltaY = endY - startY;
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) >= threshold) {
        if (deltaX < 0) {
          if (btnSiguiente) btnSiguiente.click();
        } else {
          if (btnAnterior) btnAnterior.click();
        }
      }
    } else {
      if (Math.abs(deltaY) >= threshold) {
        if (deltaY > 0) {
          if (btnPlantaSiguiente) btnPlantaSiguiente.click();
        } else {
          if (btnPlantaAnterior) btnPlantaAnterior.click();
        }
      }
    }
    startX = null;
    startY = null;
  }, { passive: true });
})();
