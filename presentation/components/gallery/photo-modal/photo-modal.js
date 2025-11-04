// GalleryModal.js
// Modal de navegación por la galería
// Este archivo ha sido migrado a presentation/components/gallery/gallery-modal/GalleryModal.js
// Usa la nueva clase GalleryModal desde ese archivo.
export default class GalleryModal {
  constructor() {
    this.modal = document.getElementById('modal');
    this.img = document.getElementById('imagen-ampliada');
    this.caption = document.getElementById('caption');
    this.btnCerrar = document.getElementById('cerrar');
    this.btnAnterior = document.getElementById('anterior');
    this.btnSiguiente = document.getElementById('siguiente');
    this.images = [];
    this.currentIndex = 0;
    this._bindEvents();
  }

  open(images, index) {
    this.images = images;
    this.currentIndex = index;
    this._showImage();
    this.modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.modal.style.display = 'none';
    document.body.style.overflow = '';
  }

  _showImage() {
    const imgObj = this.images[this.currentIndex];
    if (!imgObj) return;
    this.img.src = imgObj.src;
    this.img.alt = imgObj.alt || '';
    this.caption.textContent = imgObj.alt;
    this.btnAnterior.style.display = this.currentIndex === 0 ? 'none' : '';
    this.btnSiguiente.style.display = this.currentIndex === this.images.length - 1 ? 'none' : '';
  }

  _bindEvents() {
    this.btnCerrar.addEventListener('click', () => this.close());
    this.btnAnterior.addEventListener('click', () => {
      if (this.currentIndex > 0) {
        this.currentIndex--;
        this._showImage();
      }
    });
    this.btnSiguiente.addEventListener('click', () => {
      if (this.currentIndex < this.images.length - 1) {
        this.currentIndex++;
        this._showImage();
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.style.display === 'flex') {
        this.close();
      }
    });
  }
}
