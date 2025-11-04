// ContactModal.js
// Lógica para mostrar y ocultar el modal de contacto
export default class ContactModal {
  constructor() {
    this.modal = null;
    this._init();
  }

  _init() {
    fetch('presentation/components/contact-modal/contact-modal-template/contact-modal-template.html')
      .then(res => res.text())
      .then(html => {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        this.modal = temp.firstElementChild;
        document.body.appendChild(this.modal);
        this._bindEvents();
      });
  }

  show() {
    if (this.modal) this.modal.style.display = 'flex';
  }

  hide() {
    if (this.modal) this.modal.style.display = 'none';
  }

  _bindEvents() {
    const closeBtn = this.modal.querySelector('#contact-close');
    if (closeBtn) closeBtn.addEventListener('click', () => this.hide());
    const cancelBtn = this.modal.querySelector('#contact-cancel');
    if (cancelBtn) cancelBtn.addEventListener('click', () => this.hide());
    // Puedes añadir más lógica aquí para el submit, validaciones, etc.
  }
}
