// Clase para gestionar el swipe táctil en la galería
class GalleryTouch {
  constructor(modalInstance) {
    this.modal = modalInstance.modal;
    this.img = modalInstance.img;
    this.galleryModal = modalInstance;
    this._bindTouchEvents();
  }

  _bindTouchEvents() {
    let startX = 0;
    let endX = 0;
    let startY = 0;
    let endY = 0;
    this.img.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      }
    });
    this.img.addEventListener('touchend', (e) => {
      if (e.changedTouches.length === 1) {
        endX = e.changedTouches[0].clientX;
        endY = e.changedTouches[0].clientY;
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        if (Math.abs(deltaX) > 50 && Math.abs(deltaY) < 40) {
          if (deltaX < 0) {
            // Swipe izquierda: siguiente foto
            this.galleryModal.btnSiguiente.click();
          } else {
            // Swipe derecha: foto anterior
            this.galleryModal.btnAnterior.click();
          }
        }
        // Opcional: swipe arriba/abajo para cerrar o cambiar planta
        // if (Math.abs(deltaY) > 50 && Math.abs(deltaX) < 40) {
        //   if (deltaY < 0) {
        //     // Swipe arriba
        //     this.galleryModal.btnArriba?.click();
        //   } else {
        //     // Swipe abajo
        //     this.galleryModal.btnAbajo?.click();
        //   }
        // }
      }
    });
  }
}
// gallery.js
// Carga el photo template por cada foto de la planta

export default class Gallery {
  constructor(containerId, photos) {
    this.container = document.getElementById(containerId);
    this.photos = photos;
    this._templateHtml = null;
    this.render();
  }

  async render() {
    if (!this.container) return;
    this.container.innerHTML = '';
  this.container.style.display = 'flex';
  this.container.style.flexWrap = 'wrap';
  this.container.style.gap = '12px';
  this.container.style.justifyContent = 'flex-start';
    if (!this._templateHtml) {
      this._templateHtml = await fetch('presentation/components/gallery/photo-template.html').then(r => r.text());
    }
    this.photos.forEach((photo, i) => {
      const tempDiv = document.createElement('div');
      tempDiv.className = 'gallery-thumbnail';
      tempDiv.innerHTML = this._templateHtml;
      const photoNode = tempDiv.firstElementChild;
      const img = photoNode.querySelector('img');
      const caption = photoNode.querySelector('.photo-caption');
      img.src = photo.src;
      img.alt = photo.alt || '';
      caption.textContent = photo.alt || '';
      tempDiv.appendChild(photoNode);
      this.container.appendChild(tempDiv);

      // Efecto de click para abrir el modal de gallery-modal
      tempDiv.style.cursor = 'pointer';
      tempDiv.addEventListener('click', () => {
        // Lazy load GalleryModal si no existe
        const activateTouch = () => {
          // Esperar a que el modal y la imagen estén disponibles
          const tryInitTouch = setInterval(() => {
            if (window._galleryModalInstance && window._galleryModalInstance.img) {
              clearInterval(tryInitTouch);
              window._galleryTouchInstance = new GalleryTouch(window._galleryModalInstance);
            }
          }, 30);
        };
        if (!window._galleryModalInstance) {
          import('../gallery/gallery-modal/GalleryModal.js').then(mod => {
            window._galleryModalInstance = new mod.default();
            window._galleryModalInstance.open(this.photos, i);
            activateTouch();
          });
        } else {
          window._galleryModalInstance.open(this.photos, i);
          activateTouch();
        }
      });
    });
  }

  // getPhotoTemplate eliminado, ahora se usa el template externo
}
