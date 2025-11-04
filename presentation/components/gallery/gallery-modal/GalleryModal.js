// GalleryModal.js
// Modal de navegación por la galería
export default class GalleryModal {
  // Devuelve el path correcto según entorno (local o producción)
  _fixImagePath(src) {
    if (!src) return src;
    const isProd = window.location.pathname.includes('/casa_lujo/');
    if (isProd && !src.startsWith('/casa_lujo/') && !src.startsWith('http')) {
      return '/casa_lujo/' + src.replace(/^\/?/, '');
    }
    return src;
  }
  constructor() {
    this.modal = null;
    this.img = null;
    this.caption = null;
    this.btnCerrar = null;
    this.btnAnterior = null;
    this.btnSiguiente = null;
    this.images = [];
    this.currentIndex = 0;
    this.floors = [];
    this.currentFloorIdx = 0;
    this._galleryRepository = null;
    this._init();
  }

      _init() {
        fetch('presentation/components/gallery/gallery-modal/gallery-modal-template/gallery-modal-template.html')
          .then(res => res.text())
          .then(html => {
            const temp = document.createElement('div');
            temp.innerHTML = html;
            this.modal = temp.firstElementChild;
            document.body.appendChild(this.modal);
            this.img = this.modal.querySelector('#gallery-imagen-ampliada');
            this.caption = this.modal.querySelector('#gallery-caption');
            this.btnCerrar = this.modal.querySelector('#gallery-cerrar');
            this.btnAnterior = this.modal.querySelector('#gallery-anterior');
            this.btnSiguiente = this.modal.querySelector('#gallery-siguiente');
            this.btnArriba = this.modal.querySelector('#gallery-arriba');
            this.btnAbajo = this.modal.querySelector('#gallery-abajo');
            this._bindEvents();
          });
      }

      open(images, index) {
      // Espera recibir el array de plantas (floors) y el índice de la planta a mostrar
  // images es el array completo de plantas (floors)
  const plantNames = images.map((f, idx) => {
    // Si tienes la clave real, úsala aquí. Si no, usa el índice como fallback
    return f.titulo || f.nombre || `planta-${idx+1}`;
  });
  const imgs = images[index] && Array.isArray(images[index].imagenes) ? images[index].imagenes : [];
  this._initFloors(plantNames, imgs);
      }

      _initFloors(plantNames, images) {
        if (!this._galleryRepository) {
          import('../../_gallery/galleryRepository.js').then(module => {
            // Pasa window._casaData como i18n para asegurar acceso correcto
            this._galleryRepository = module.default ? new module.default(window._casaData) : new module.GalleryRepository(window._casaData);
            this._setFloors(plantNames, images);
          }).catch(() => {
            // Fallback: crea un objeto planta completo aunque solo tengas imágenes
            this.floors = Array.isArray(images) ? [{ titulo: '', imagenes: images, puntos: [] }] : [];
            this.currentFloorIdx = 0;
            this._showModal();
          });
        } else {
          this._setFloors(plantNames, images);
        }
      }

      _setFloors(plantNames, images) {
        // Suponemos que window._casaData.textos contiene los datos por idioma
        const textos = (window._casaData && window._casaData.textos) ? window._casaData.textos : {};
        this.floors = plantNames.map((name, idx) => {
          try {
            const plantaData = textos[name] || {};
            const imgs = this._galleryRepository.getImages(name);
            console.log('[GalleryModal] _setFloors', { name, imgs, plantaData });
            return {
              titulo: plantaData.titulo || name,
              imagenes: Array.isArray(imgs) ? imgs : [],
              puntos: Array.isArray(plantaData.puntos) ? plantaData.puntos : [],
              idx
            };
          } catch (e) {
            console.error('[GalleryModal] Error construyendo planta', { name, error: e });
            return null;
          }
        }).filter(Boolean);
        // Buscar el índice de la planta actual comparando el src de la primera imagen
        const firstSrc = images[0] && images[0].src;
        this.currentFloorIdx = this.floors.findIndex(planta => planta.imagenes[0] && planta.imagenes[0].src === firstSrc);
        if (this.currentFloorIdx === -1) this.currentFloorIdx = 0;
        this.images = this.floors[this.currentFloorIdx].imagenes || [];
        console.log('[GalleryModal] _setFloors resultado', { floors: this.floors, currentFloorIdx: this.currentFloorIdx, images: this.images });
        this._showModal();
      }

      _showModal() {
        if (!this.modal || !this.img) {
          const checkReady = setInterval(() => {
            if (this.modal && this.img) {
              clearInterval(checkReady);
              this._showImage();
              this.modal.style.display = 'flex';
              document.body.style.overflow = 'hidden';
            }
          }, 30);
        } else {
          this._showImage();
          this.modal.style.display = 'flex';
          document.body.style.overflow = 'hidden';
        }
      }
  close() {
    this.modal.style.display = 'none';
    document.body.style.overflow = '';
  }

  _showImage() {
    console.log('[GalleryModal] _showImage', {
      currentIndex: this.currentIndex,
      images: this.images,
      floors: this.floors,
      currentFloorIdx: this.currentFloorIdx
    });
    let imgObj = Array.isArray(this.images) ? this.images[this.currentIndex] : undefined;
    // Si no hay imágenes, intenta cargar desde la planta actual
    if (!imgObj && this.floors && this.floors[this.currentFloorIdx] && Array.isArray(this.floors[this.currentFloorIdx].imagenes)) {
      this.images = this.floors[this.currentFloorIdx].imagenes;
      imgObj = this.images[this.currentIndex];
    }
    if (!imgObj) {
      this.img.src = '';
      this.img.alt = '';
      this.caption.textContent = 'No hay imágenes disponibles para esta planta.';
      console.warn('[GalleryModal] No hay imágenes para mostrar', {
        currentFloorIdx: this.currentFloorIdx,
        floors: this.floors
      });
      return;
    }
  this.img.src = this._fixImagePath(imgObj.src || '');
  this.img.alt = imgObj.alt || '';
  this.caption.textContent = imgObj.alt || '';
    // Visibilidad botón anterior
    this.btnAnterior.style.display = (this.currentIndex === 0 && this.currentFloorIdx === 0) ? 'none' : '';
    // Visibilidad botón siguiente
    const isLastImage = this.currentIndex === this.images.length - 1;
    const isLastFloor = this.currentFloorIdx === 3 || this.currentFloorIdx === 4;


    if (isLastImage && !isLastFloor) {
      this.btnSiguiente.style.display = '';
    } else if (isLastImage && isLastFloor) {
      this.btnSiguiente.style.display = 'none';
    } else {
      this.btnSiguiente.style.display = '';
    }

      // Visibilidad botón subir planta (arriba)
      if (this.btnArriba) {
        const isLastFloor = this.currentFloorIdx === this.floors.length - 1;
        const nextFloorHasImages =
          !isLastFloor &&
          Array.isArray(this.floors[this.currentFloorIdx + 1].imagenes) &&
          this.floors[this.currentFloorIdx + 1].imagenes.length > 0;
        // Solo muestra el botón si existe una planta superior y tiene imágenes
        this.btnArriba.style.display = nextFloorHasImages ? '' : 'none';
      }
    // Visibilidad botón bajar planta (abajo)
    if (this.btnAbajo) {
      this.btnAbajo.style.display = (this.currentFloorIdx === 0) ? 'none' : '';
    }
  }

  _bindEvents() {
    // Cerrar modal
    this.btnCerrar.addEventListener('click', () => {
      this.images = [];
      this.currentIndex = 0;
      this.currentFloorIdx = 0;
      this.close();
    });

    // Navegar imagen anterior
    this.btnAnterior.addEventListener('click', () => {
      if (this.currentIndex > 0) {
        this.currentIndex--;
        this._showImage();
      } else if (this.currentFloorIdx > 0) {
        this.currentFloorIdx--;
        this.images = Array.isArray(this.floors[this.currentFloorIdx].imagenes) ? this.floors[this.currentFloorIdx].imagenes : [];
        this.currentIndex = this.images.length - 1;
        this._showImage();
      }
    });

    // Navegar imagen siguiente
    this.btnSiguiente.addEventListener('click', () => {
      if (this.currentIndex < this.images.length - 1) {
        this.currentIndex++;
        this._showImage();
      } else if (this.currentFloorIdx < this.floors.length - 1) {
        this.currentFloorIdx++;
        this.images = Array.isArray(this.floors[this.currentFloorIdx].imagenes) ? this.floors[this.currentFloorIdx].imagenes : [];
        this.currentIndex = 0;
        this._showImage();
      }
    });

    // Subir planta (arriba)
    if (this.btnArriba) {      
      this.btnArriba.addEventListener('click', () => {
        console.log('[GalleryModal] btnArriba click', {
          currentFloorIdx: this.currentFloorIdx,
          floorsLength: this.floors.length
        });

        if (this.currentFloorIdx < this.floors.length - 1) {
          this.currentFloorIdx++;
          this.images = Array.isArray(this.floors[this.currentFloorIdx].imagenes) ? this.floors[this.currentFloorIdx].imagenes : [];
          this.currentIndex = 0;
          this._showImage();
        }
      });
    }

    // Bajar planta (abajo)
    if (this.btnAbajo) {
      this.btnAbajo.addEventListener('click', () => {
        if (this.currentFloorIdx > 0) {
          this.currentFloorIdx--;
          this.images = Array.isArray(this.floors[this.currentFloorIdx].imagenes) ? this.floors[this.currentFloorIdx].imagenes : [];
          this.currentIndex = this.images.length - 1;
          this._showImage();
        }
      });
    }

    // Cerrar modal con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.style.display === 'flex') {
        this.close();
      }
    });
  }
}
