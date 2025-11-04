// Interceptar el click en el enlace de política de privacidad del footer
document.addEventListener('DOMContentLoaded', () => {
  const footerPrivacy = document.getElementById('footer-privacy');
  if (footerPrivacy) {
    footerPrivacy.addEventListener('click', function(e) {
      e.preventDefault();
  // Detectar idioma actual desde la barra de idioma si existe
  let lang = document.documentElement.lang || 'es';
  const activeBtn = document.querySelector('.lang-btn.active-lang');
  if (activeBtn && activeBtn.dataset.lang) lang = activeBtn.dataset.lang;
  let file = 'politica-privacidad.html';
  if (lang === 'ca') file = 'politica-privacidad-ca.html';
  else if (lang === 'en') file = 'politica-privacidad-en.html';
  else if (lang === 'fr') file = 'politica-privacidad-fr.html';
  else if (lang === 'ru') file = 'politica-privacidad-ru.html';
  else if (lang === 'zh') file = 'politica-privacidad-zh.html';
  window.open(file, '_blank', 'noopener');
    });
  }
});
// Insertar el template del modal de contacto al inicio
fetch('presentation/components/contact-modal/contact-modal-template/contact-modal-template.html')
  .then(res => res.text())
  .then(html => {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    document.body.appendChild(temp.firstElementChild);
  });
// Exponer la función globalmente para que house.js la pueda usar
window.initContactModal = initContactModal;
// index.js
// Ejemplo de uso de la clase Casa

import Casa from './presentation/components/house/house.js';

// Detectar idioma (puedes mejorar la lógica según tu app)
const idioma = document.documentElement.lang || 'es';
const mainContainer = document.getElementById('main-content') || document.body;

// Cargar el JSON de galería según idioma
const galeriaMap = {
  es: 'i18n/galeria.es.json',
  ca: 'i18n/galeria.ca.json',
  en: 'i18n/galeria.en.json',
  fr: 'i18n/galeria.fr.json',
  ru: 'i18n/galeria.ru.json',
  zh: 'i18n/galeria.zh.json'
};

const galeriaUrl = galeriaMap[idioma] || galeriaMap['es'];

fetch(galeriaUrl)
  .then(res => res.json())
  .then(data => {
    new Casa({
      idioma,
      data,
      container: mainContainer
    });
  })
  .catch(err => {
    mainContainer.innerHTML = '<div style="color:red;">No se pudo cargar la información de la casa.</div>';
    console.error('Error cargando galería:', err);
  });

import ContactFormView from './application/usecases/ContactFormView.js';
import PrivacyLinkService from './infrastructure/services/privacy-link-service.js';

function initContactModal() {
  if (!window._contactFormViewInstance) {
    // Obtener los labels y textos del JSON actual
    const i18n = window.i18n && typeof window.i18n.getCurrentI18n === 'function' ? window.i18n.getCurrentI18n() : null;
    const labels = i18n && i18n.contacto && i18n.contacto.labels ? i18n.contacto.labels : {};
    const botones = i18n && i18n.contacto && i18n.contacto.botones ? i18n.contacto.botones : {};
    const titulo = i18n && i18n.contacto && i18n.contacto.titulo ? i18n.contacto.titulo : '';
    const privacyLinkService = new PrivacyLinkService();
    window._contactFormViewInstance = new ContactFormView({ labels: { ...labels, botones }, modalId: 'contact-modal', privacyLinkService });
  }
  window._contactFormViewInstance.openModal();
}

document.getElementById('contactenos-btn').addEventListener('click', initContactModal);
