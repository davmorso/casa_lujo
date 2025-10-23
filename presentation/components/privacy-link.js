// privacy-link.js
// Responsabilidad: gestionar el enlace de política de privacidad

document.addEventListener('i18nLoaded', function(e) {
  var json = e.detail && e.detail.i18n;
  var privacyLink = document.getElementById('footer-privacy');
  if (privacyLink && json && json.politica_privacidad_url) {
    privacyLink.setAttribute('href', json.politica_privacidad_url);
    privacyLink.setAttribute('target', '_blank');
    privacyLink.setAttribute('rel', 'noopener');
  }
});