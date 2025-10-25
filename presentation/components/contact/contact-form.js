// Dominio: Entidad Contacto
class Contact {
  constructor({ nombre, telefono, email, estructura, experiencia, acepta }) {
    this.nombre = nombre;
    this.telefono = telefono;
    this.email = email;
    this.estructura = estructura;
    this.experiencia = experiencia;
    this.acepta = acepta;
  }
}

// Dominio: Validador de Contacto
class ContactValidator {
  static validate(contact, labels) {
    const errors = {};
    if (!contact.nombre) errors.nombre = labels?.requerido || 'Campo obligatorio';
    if (!contact.telefono) errors.telefono = labels?.requerido || 'Campo obligatorio';
    else if (!/^\+\d{7,15}$/.test(contact.telefono) && !/^\d{9}$/.test(contact.telefono)) {
      errors.telefono = 'Teléfono inválido. Debe ser 9 dígitos (España) o formato internacional (+XX...).';
    }
    if (!contact.estructura) errors.estructura_compra = labels?.requerido || 'Campo obligatorio';
    if (!contact.experiencia) errors.experiencia = labels?.requerido || 'Campo obligatorio';
    if (!contact.acepta) errors.acepto = labels?.aceptar_politica || 'Debes aceptar la política de privacidad';
    if (contact.email && !/^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(contact.email)) {
      errors.email = 'Email inválido.';
    }
    return errors;
  }
}

// Caso de uso: Enviar contacto
class SendContactUseCase {
  constructor({ backendUrl }) {
    this.backendUrl = backendUrl;
  }
  async execute(contact) {
    const url = `${this.backendUrl}/api/contact`;
    const payload = { ...contact };
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    let data = null;
    const ct = r.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      try { data = await r.json(); } catch {}
    }
    if (!r.ok) {
      const msg = (data && (data.message || data.error)) || `Error ${r.status}`;
      throw new Error(msg);
    }
    return data;
  }
}

// Vista: ContactFormView
class ContactFormView {
  constructor({ modalId = 'contact-modal', formId = 'contact-form', openBtnId = 'open-contact-btn', closeBtnId = 'contact-close', cancelBtnId = 'contact-cancel', noteId = 'contact-note', submitBtnId = 'contact-submit', labels = {}, privacyLinkService }) {
    this.modal = document.getElementById(modalId);
    this.form = document.getElementById(formId);
    this.openBtn = document.getElementById(openBtnId);
    this.closeBtn = document.getElementById(closeBtnId);
    this.cancelBtn = document.getElementById(cancelBtnId);
    this.note = document.getElementById(noteId);
    this.submitBtn = document.getElementById(submitBtnId);
    this.labels = labels;
    this.privacyLinkService = privacyLinkService;
    this.lastFocused = null;
    this._bindEvents();
  }

  getContactFromForm() {
    return new Contact({
      nombre: this._getValue('contact-nombre'),
      telefono: this._getValue('contact-telefono'),
      email: this._getValue('contact-email'),
      estructura: this._getValue('contact-estructura'),
      experiencia: this._getValue('contact-experiencia'),
      acepta: document.getElementById('contact-acepto')?.checked || false
    });
  }

  _getValue(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  showErrors(errors) {
    document.querySelectorAll('.field-error').forEach(e => (e.textContent = ''));
    Object.entries(errors).forEach(([field, msg]) => {
      const el = document.querySelector(`.field-error[data-for="${field}"]`);
      if (el) el.textContent = msg;
    });
  }

  clearErrors() {
    document.querySelectorAll('.field-error').forEach(e => (e.textContent = ''));
  }

  openModal() {
    if (!this.modal) return;
    this.form && this.form.reset();
    this.clearErrors();
    this.note && (this.note.textContent = '');
    this.lastFocused = document.activeElement;
    // Actualizar los labels del formulario con el idioma actual
    if (window.i18n && typeof window.i18n.getCurrentI18n === 'function') {
      const json = window.i18n.getCurrentI18n();
      if (json && json.contacto && json.contacto.labels) {
        const labels = json.contacto.labels;
        const botones = json.contacto.botones || {};
        const titulo = json.contacto.titulo || '';
        // Si existe PrivacyLinkService, actualiza el enlace de política en el label
        if (this.privacyLinkService && json.meta && json.meta.politica_privacidad_url) {
          var fileName = json.meta.politica_privacidad_url.split('/').pop();
          var url = this.privacyLinkService.getPrivacyUrl(fileName);
          if (labels.acepto) {
            labels.acepto = this.privacyLinkService.getSanitizedPrivacyLabel(labels.acepto, url);
          }
        }
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
              el.innerHTML = this.privacyLinkService ? this.privacyLinkService.getSanitizedPrivacyLabel(text) : text;
            } else {
              el.textContent = text;
            }
          }
        });
      }
    }
    this.modal.style.display = 'flex';
    this.modal.setAttribute('aria-hidden', 'false');
    setTimeout(() => document.getElementById('contact-nombre')?.focus(), 50);
  }

  closeModal() {
    if (!this.modal) return;
    this.modal.style.display = 'none';
    this.modal.setAttribute('aria-hidden', 'true');
    if (this.lastFocused && typeof this.lastFocused.focus === 'function') {
      this.lastFocused.focus();
    }
  }

  _bindEvents() {
    this.openBtn?.addEventListener('click', () => this.openModal());
    this.closeBtn?.addEventListener('click', () => this.closeModal());
    this.cancelBtn?.addEventListener('click', (e) => { e.preventDefault(); this.closeModal(); });
    this.form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (this.submitBtn && this.submitBtn.disabled) return;
      const contact = this.getContactFromForm();
      const errors = ContactValidator.validate(contact, this.labels?.errores);
      if (Object.keys(errors).length) {
        this.showErrors(errors);
        return;
      }
      this.submitBtn.disabled = true;
      this.submitBtn.classList.add('sending');
      try {
        const useCase = new SendContactUseCase({ backendUrl: window.BACKEND_URL || 'http://localhost:8000' });
        const result = await useCase.execute(contact);
        if (result && result.ok) {
          this.note && (this.note.textContent = this.labels.nota_envio_success || 'Mensaje enviado correctamente.');
          this.closeModal();
        } else {
          throw new Error((result && (result.message || result.error)) || 'No se pudo procesar la solicitud.');
        }
      } catch (err) {
        const msg = String(err?.message || '');
        const debugDiv = document.getElementById('debug-info');
        const debugLog = document.getElementById('debug-log');
        let debugMsg = '';
        if (msg.toLowerCase().includes('mail_not_configured')) {
          debugMsg = 'No se pudo enviar el formulario: el servidor no está configurado para enviar correos.';
        } else if (msg.toLowerCase().includes('network') || msg.toLowerCase().includes('failed to fetch')) {
          debugMsg = 'No se pudo enviar el formulario por un error de red.';
        } else {
          debugMsg = 'No se pudo enviar el formulario. ' + msg;
        }
        if (debugDiv && debugLog) {
          debugDiv.style.display = 'block';
          debugLog.textContent = debugMsg;
        } else {
          alert(debugMsg);
        }
      } finally {
        this.submitBtn.disabled = false;
        this.submitBtn.classList.remove('sending');
      }
    });
    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape' && this.modal && this.modal.style.display === 'flex') this.closeModal();
    });
  }
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
  window.contactFormView = new ContactFormView({
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
    console.log('[i18nLoaded] idioma:', e.detail && e.detail.lang);
    console.log('[i18nLoaded] labels:', labels);
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