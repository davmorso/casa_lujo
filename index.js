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
// --- Renderizar la casa al cambiar idioma dinámicamente ---
document.addEventListener('i18nLoaded', (ev) => {
  const { lang, i18n } = ev.detail || {};
  const mainContainer = document.getElementById('main-content') || document.body;
  // Limpiar el contenido principal
  while (mainContainer.firstChild) mainContainer.removeChild(mainContainer.firstChild);
  // Instanciar la casa con el nuevo idioma y JSON
  import('./presentation/components/house/house.js').then(mod => {
    new mod.default({
      idioma: lang,
      data: i18n,
      container: mainContainer
    });
  });
});

// --- Eliminar el bloque de contacto-info y añadir botón inferior fijo ---
document.addEventListener('i18nLoaded', (ev) => {
  // Ocultar el bloque de contacto-info si existe
  const contactoDiv = document.getElementById('contacto-info');
  if (contactoDiv) {
    contactoDiv.style.display = 'none';
  }

    // Eliminar cualquier texto informativo duplicado arriba del bloque contacto-info-block
    const oldInfoBlocks = document.querySelectorAll('.contacto-info-text');
    if (oldInfoBlocks.length > 1) {
      // Mantener solo el último (el de abajo)
      for (let i = 0; i < oldInfoBlocks.length - 1; i++) {
        const el = oldInfoBlocks[i];
        if (el && el.parentNode) el.parentNode.removeChild(el);
      }
    }


  // Añadir texto y botón inferior antes del footer
  let infoBlock = document.getElementById('contacto-info-block');
  if (!infoBlock) {
    infoBlock = document.createElement('div');
    infoBlock.id = 'contacto-info-block';
    infoBlock.style.maxWidth = '900px';
    infoBlock.style.margin = '48px auto 0 auto';
    infoBlock.style.textAlign = 'center';
    // Insertar antes del footer negro
    const footer = document.getElementById('cookie-banner');
    if (footer && footer.parentNode) {
      footer.parentNode.insertBefore(infoBlock, footer);
    } else {
      document.body.appendChild(infoBlock);
    }
  }

    // Texto informativo según idioma (sin link)
    const i18n = ev.detail && ev.detail.i18n;
    let infoText = (i18n && i18n.ui && i18n.ui.contact && i18n.ui.contact.text)
      ? i18n.ui.contact.text.replace(/<button[^>]*>.*?<\/button>/, '').replace(/<a[^>]*>.*?<\/a>/, '')
      : '¿Quieres más información o concertar una visita?';

    // Evitar duplicados: solo añadir el div de texto si no existe
    let infoTextDiv = infoBlock.querySelector('.contacto-info-text');
    if (!infoTextDiv) {
      infoTextDiv = document.createElement('div');
      infoTextDiv.className = 'contacto-info-text';
      infoTextDiv.style.fontSize = '1.22rem';
      infoTextDiv.style.color = '#222';
      infoTextDiv.style.lineHeight = '1.7';
      infoTextDiv.style.marginBottom = '18px';
      infoTextDiv.textContent = "";
      infoBlock.appendChild(infoTextDiv);
    } else {
      infoTextDiv.textContent = "";
    }

    // Añadir botón debajo, solo si no existe
    let btnBottom = document.getElementById('contactenos-bottom-btn');
    if (!btnBottom) {
      btnBottom = document.createElement('button');
      btnBottom.id = 'contactenos-bottom-btn';
      btnBottom.style.display = 'block';
      btnBottom.style.margin = '0 auto 48px auto';
      btnBottom.style.background = '#3366cc';
      btnBottom.style.color = '#fff';
      btnBottom.style.fontWeight = 'bold';
      btnBottom.style.fontSize = '1.2rem';
      btnBottom.style.padding = '12px 32px';
      btnBottom.style.border = 'none';
      btnBottom.style.borderRadius = '8px';
      btnBottom.style.boxShadow = '0 2px 12px rgba(0,0,0,0.12)';
      btnBottom.style.cursor = 'pointer';
      infoBlock.appendChild(btnBottom);
    }
    let textoBtn = (i18n && i18n.ui && i18n.ui.contactBar && i18n.ui.contactBar.text) ? i18n.ui.contactBar.text : 'Contáctenos';
    if (ev.detail && ev.detail.lang === 'es') textoBtn = 'Contáctenos';
    btnBottom.textContent = textoBtn;
    btnBottom.onclick = () => {
      if (typeof window.initContactModal === 'function') {
        window.initContactModal();
      }
    };
});
