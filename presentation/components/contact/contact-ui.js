// This file has been moved to c:\_DATA\repos\casa_lujo\presentation\components\contact\
// contact-ui.js
// Responsabilidad: gestionar el bloque de contacto y la barra de idioma


class ContactBarView {
  constructor({ contactBtnId = 'contact-button-before-cookie', contactBarLinkId = 'contact-link-bar', modalId = 'contact-modal' } = {}) {
    this.contactDiv = document.getElementById(contactBtnId);
    this.contactBarLink = document.getElementById(contactBarLinkId);
    this.modal = document.getElementById(modalId);
    this._bindI18n();
  }

  _bindI18n() {
    document.addEventListener('i18nLoaded', (e) => {
      const json = e.detail && e.detail.i18n;
      this._updateContactBtn(json);
      this._updateContactBarLink(json);
    });
  }

  _updateContactBtn(json) {
    if (!this.contactDiv || !json || !json.ui || !json.ui.contact) return;
    const contactText = json.ui.contact.text || '';
    const linkWord = json.ui.contact.linkWord || '';
    const html = contactText.replace(linkWord, `<a id="contact-link" class="contact-link" href="#contact-modal" style="text-decoration:underline; text-transform:uppercase;">${linkWord}</a>`);
    this.contactDiv.innerHTML = html;
    // Vincular el evento de clic al enlace generado dinámicamente
    setTimeout(() => {
      const contactLink = document.getElementById('contact-link');
      if (contactLink) {
        contactLink.onclick = (ev) => {
          ev.preventDefault();
          // Abrir el modal del formulario de contacto si existe la instancia
          if (window.contactFormView && typeof window.contactFormView.openModal === 'function') {
            window.contactFormView.openModal();
          } else {
            this._openModal();
          }
        };
      }
    }, 0);
  }

  _updateContactBarLink(json) {
    if (!this.contactBarLink || !json || !json.ui || !json.ui.contactBar || !json.ui.contactBar.text) return;
    this.contactBarLink.textContent = json.ui.contactBar.text;
    this.contactBarLink.onclick = (ev) => {
      ev.preventDefault();
      this._openModal();
    };
  }

  _openModal() {
    if (this.modal) {
      this.modal.style.display = 'flex';
      this.modal.setAttribute('aria-hidden', 'false');
    }
  }
}

window.contactBarView = new ContactBarView();