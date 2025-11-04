export class ContactLinkManager {
  constructor(i18n) {
    this.i18n = i18n;
  }

  updateContactLink() {
    const link = document.getElementById('contact-link-bar');
    if (link && this.i18n?.ui?.links?.contacto_boton) {
      link.textContent = this.i18n.ui.links.contacto_boton;
      link.onclick = () => {
        const modal = document.getElementById('contact-modal');
        if (modal) {
          modal.style.display = 'block';
        }
      };
    }
  }
}
