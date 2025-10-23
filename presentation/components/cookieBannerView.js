
// cookieBannerView.js
// Muestra el banner de cookies en el idioma seleccionado

function updateCookieBanner(i18n) {
  var banner = document.getElementById('cookie-banner');
  var span = banner && banner.querySelector('span');
  var aceptarBtn = document.getElementById('aceptar-cookies');
  var rechazarBtn = document.getElementById('rechazar-cookies');
  if (!banner || !span || !aceptarBtn || !rechazarBtn || !i18n || !i18n.ui || !i18n.ui.cookieBanner) return;
  span.textContent = i18n.ui.cookieBanner.texto || 'This website uses cookies for analytics. You can accept or reject.';
  aceptarBtn.textContent = i18n.ui.cookieBanner.aceptar || 'Accept';
  rechazarBtn.textContent = i18n.ui.cookieBanner.rechazar || 'Reject';
}

document.addEventListener('i18nLoaded', function(e) {
  var i18n = e.detail && e.detail.i18n;
  updateCookieBanner(i18n);
});

// Inicialización de botones y estado
document.addEventListener('DOMContentLoaded', function() {
  var banner = document.getElementById('cookie-banner');
  var aceptarBtn = document.getElementById('aceptar-cookies');
  var rechazarBtn = document.getElementById('rechazar-cookies');
  if (!banner || !aceptarBtn || !rechazarBtn) return;
  var estado = localStorage.getItem('cookies_aceptadas');
  if (estado === 'true' || estado === 'false') {
    banner.style.display = 'none';
    return;
  }
  aceptarBtn.addEventListener('click', function() {
    localStorage.setItem('cookies_aceptadas', 'true');
    banner.style.display = 'none';
  });
  rechazarBtn.addEventListener('click', function() {
    localStorage.setItem('cookies_aceptadas', 'false');
    banner.style.display = 'none';
  });
});