// Vista: ContactFormView
import Contact from '../../domain/entities/Contact.js';
import ContactValidator from '../../presentation/components/contact-form/ContactValidator.js';
import SendContactUseCase from './SendContactUseCase.js';

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
  this.validator = ContactValidator;
    this._bindEvents();
    // Ocultar el modal al cargar
    if (this.modal) {
      this.modal.style.display = 'none';
      this.modal.setAttribute('aria-hidden', 'true');
    }
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
    console.log('DEBUG: openModal llamado');
    if (!this.modal) {
      console.warn('DEBUG: this.modal no existe');
      return;
    }
    this.form && this.form.reset();
    this.clearErrors();
    this.note && (this.note.textContent = '');
    this.lastFocused = document.activeElement;
    // Actualizar los labels y placeholders del formulario con el idioma actual
    if (window.i18n && typeof window.i18n.getCurrentI18n === 'function') {
      const json = window.i18n.getCurrentI18n();
      if (json && json.contacto && json.contacto.labels) {
        const labels = json.contacto.labels;
        const botones = json.contacto.botones || {};
        const titulo = json.contacto.titulo || '';
        const placeholders = json.contacto.placeholders || {};
        // Si existe PrivacyLinkService, actualiza el enlace de política en el label
        if (this.privacyLinkService && json.meta && json.meta.politica_privacidad_url) {
          var fileName = json.meta.politica_privacidad_url.split('/').pop();
          var url = this.privacyLinkService.getPrivacyUrl(fileName);
          if (labels.acepto) {
            // Reemplazar el href del enlace de política de privacidad por la URL calculada y forzar target="_blank"
            // Reemplazar el href del enlace de política de privacidad por la URL calculada y forzar target="_blank"
            labels.acepto = labels.acepto.replace(/href="[^"]*"/g, `href="${url}" target="_blank" rel="noopener"`);
            // También aseguramos que el enlace no tenga href="#" y no dependa de click JS
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
        // Actualizar placeholders si existen
        const placeholderMap = {
          'contact-nombre': placeholders.nombre,
          'contact-telefono': placeholders.telefono,
          'contact-estructura': placeholders.estructura_compra,
          'contact-experiencia': placeholders.experiencia
        };
        Object.entries(placeholderMap).forEach(([id, text]) => {
          const el = document.getElementById(id);
          if (el && text) {
            el.setAttribute('placeholder', text);
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
    // Botón X (cerrar modal) - reconectar tras un pequeño delay para asegurar que el DOM está listo
    setTimeout(() => {
      const cerrarBtn = document.getElementById('contact-close');
      cerrarBtn?.addEventListener('click', () => this.closeModal());
    }, 0);
    // Botón aceptar (checkbox)
    const aceptaCheckbox = document.getElementById('contact-acepto');
    aceptaCheckbox?.addEventListener('change', () => {
      // Si quieres lógica adicional al aceptar, agrégala aquí
    });
    this.form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (this.submitBtn && this.submitBtn.disabled) return;
      const contact = this.getContactFromForm();
      try {
        this.validator.validate(contact, this.labels?.errores);
      } catch (validationError) {
        this.showErrors({ form: validationError.message });
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
          let i18nMsg = (window.i18n && window.i18n.ui && window.i18n.ui.errors && window.i18n.ui.errors.form)
            ? window.i18n.ui.errors.form
            : 'No se pudo enviar el formulario por un error de red.';
          debugMsg = i18nMsg;
          alert(debugMsg);
        } else {
          debugMsg = 'No se pudo enviar el formulario. ' + msg;
        }
        if (debugDiv && debugLog) {
          debugDiv.style.display = 'block';
          debugLog.textContent = debugMsg;
        } else if (!msg.toLowerCase().includes('network') && !msg.toLowerCase().includes('failed to fetch')) {
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

export default ContactFormView;
