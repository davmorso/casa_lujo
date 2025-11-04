import ContactBootstrap from '../../../application/usecases/ContactFormView.js';

window.addEventListener('DOMContentLoaded', () => {
  window.contactFormView = new ContactBootstrap({
    labels: {
      errores: {
        requerido: 'Este campo es obligatorio',
        aceptar_politica: 'Debes aceptar la política de privacidad'
      },
      nota_envio_success: 'Mensaje enviado correctamente.'
    },
    privacyLinkService: window.PrivacyLinkService ? new window.PrivacyLinkService() : null
  });

  // Vincular el evento de clic a ambos posibles enlaces de contacto
  ['contact-link-bar', 'contact-link'].forEach(function(id) {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', function(ev) {
        ev.preventDefault();
        window.contactFormView?.openModal();
      });
    }
  });

  // Actualizar los labels del formulario cuando se cargue la traducción
  document.addEventListener('i18nLoaded', function(e) {
    var json = e.detail && e.detail.i18n;
    if (!json || !json.contacto || !json.contacto.labels) return;
    const labels = json.contacto.labels;
    const botones = json.contacto.botones || {};
    const titulo = json.contacto.titulo || '';
    const labelMap = {
      'label-nombre': labels.nombre,
      'label-telefono': labels.telefono,
      'label-email': labels.email,
      'label-estructura': labels.estructura_compra,
      'label-experiencia': labels.experiencia,
      'label-acepto': labels.acepto,
      'contact-title': titulo,
      'contact-cancel': botones.cancelar,
      'contact-submit': botones.enviar
    };
    Object.entries(labelMap).forEach(([id, text]) => {
      const el = document.getElementById(id);
      if (el && text) {
        if (id === 'label-acepto') {
          el.innerHTML = text;
        } else {
          el.textContent = text;
        }
      }
    });
  });
});