export class PrivacyLinkManager {
  constructor(i18n) {
    this.i18n = i18n;
  }

  updatePrivacyLink() {
    const link = document.getElementById('privacy-link-footer');
    if (link && this.i18n?.meta?.politica_privacidad_url) {
      link.href = this.i18n.meta.politica_privacidad_url;
      link.textContent = this.i18n.ui.links.politica_privacidad;
    }
  }
}
